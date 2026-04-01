const state = {
  curriculum: null,
  selectedCourse: null,
  history: loadHistory(),
};

const elements = {
  stats: document.getElementById("stats"),
  cycleFilter: document.getElementById("cycleFilter"),
  courseSearch: document.getElementById("courseSearch"),
  courseList: document.getElementById("courseList"),
  selectedCourse: document.getElementById("selectedCourse"),
  evaluationForm: document.getElementById("evaluationForm"),
  resultCard: document.getElementById("resultCard"),
  historyList: document.getElementById("historyList"),
  clearHistoryBtn: document.getElementById("clearHistoryBtn"),
};

init();

async function init() {
  const response = await fetch("./data/curriculum.json");
  state.curriculum = await response.json();

  renderStats();
  renderCycleFilter();
  renderCourseList();
  renderHistory();

  elements.cycleFilter.addEventListener("change", renderCourseList);
  elements.courseSearch.addEventListener("input", renderCourseList);
  elements.evaluationForm.addEventListener("submit", onEvaluate);
  elements.clearHistoryBtn.addEventListener("click", clearHistory);
}

function renderStats() {
  const coursesCount = state.curriculum.cycles.reduce((acc, cycle) => acc + cycle.courses.length, 0);
  const chips = [
    `Ciclos: ${state.curriculum.cycles.length}`,
    `Cursos obligatorios: ${coursesCount}`,
    `Electivos disponibles: ${state.curriculum.electives.length}`,
    `Créditos del plan: ${state.curriculum.totals.overall}`,
  ];

  elements.stats.innerHTML = chips.map((chip) => `<span class="stat-chip">${chip}</span>`).join("");
}

function renderCycleFilter() {
  const options = ["Todos", ...state.curriculum.cycles.map((cycle) => cycle.name), "Electivos"];
  elements.cycleFilter.innerHTML = options
    .map((option) => `<option value="${option}">${option}</option>`)
    .join("");
}

function renderCourseList() {
  const selectedCycle = elements.cycleFilter.value || "Todos";
  const query = normalize(elements.courseSearch.value);
  const courseEntries = getFilteredCourses(selectedCycle, query);

  if (courseEntries.length === 0) {
    elements.courseList.innerHTML = `<li class="course-item">No se encontraron cursos.</li>`;
    return;
  }

  elements.courseList.innerHTML = courseEntries
    .map((entry) => {
      const isActive = state.selectedCourse && state.selectedCourse.code === entry.code;
      const credits = entry.credits ? `${entry.credits} créditos` : "Sin créditos";
      return `
        <li class="course-item ${isActive ? "active" : ""}" data-code="${entry.code}">
          <div class="course-code">${entry.code} · Ciclo ${entry.cycle}</div>
          <div class="course-name">${entry.name}</div>
          <div class="course-meta">${credits} · Prerrequisito: ${entry.prerequisite || "Ninguno"}</div>
        </li>
      `;
    })
    .join("");

  document.querySelectorAll(".course-item[data-code]").forEach((item) => {
    item.addEventListener("click", () => {
      const code = item.getAttribute("data-code");
      const selected = courseEntries.find((course) => course.code === code);
      selectCourse(selected);
      renderCourseList();
    });
  });
}

function getFilteredCourses(selectedCycle, query) {
  const allCourses = [];

  state.curriculum.cycles.forEach((cycle) => {
    cycle.courses.forEach((course) => {
      allCourses.push({ ...course, cycle: cycle.name });
    });
  });

  state.curriculum.electives.forEach((course) => {
    allCourses.push({ ...course, cycle: "Electivo" });
  });

  return allCourses.filter((course) => {
    const byCycle =
      selectedCycle === "Todos" ||
      (selectedCycle === "Electivos" && course.cycle === "Electivo") ||
      course.cycle === selectedCycle;

    if (!byCycle) {
      return false;
    }

    if (!query) {
      return true;
    }

    return normalize(`${course.code} ${course.name}`).includes(query);
  });
}

function selectCourse(course) {
  state.selectedCourse = course;
  elements.selectedCourse.classList.remove("empty");
  elements.selectedCourse.innerHTML = `
    <strong>${course.code} - ${course.name}</strong><br />
    Ciclo: ${course.cycle} · Créditos: ${course.credits || "N/A"} · Prerrequisito: ${course.prerequisite || "Ninguno"}
  `;
}

function onEvaluate(event) {
  event.preventDefault();

  if (!state.selectedCourse) {
    alert("Primero selecciona un curso UPT.");
    return;
  }

  const formData = new FormData(elements.evaluationForm);
  const university = formData.get("originUniversity") || document.getElementById("originUniversity").value;
  const externalCode = formData.get("externalCode") || document.getElementById("externalCode").value;
  const externalName = formData.get("externalName") || document.getElementById("externalName").value;
  const externalCredits = Number(
    formData.get("externalCredits") || document.getElementById("externalCredits").value
  );
  const coverage = Number(
    formData.get("syllabusCoverage") || document.getElementById("syllabusCoverage").value
  );
  const notes = formData.get("notes") || document.getElementById("notes").value;

  const evaluation = evaluateEquivalence({
    uptCourse: state.selectedCourse,
    externalName,
    externalCredits,
    coverage,
  });

  renderResult({
    university,
    externalCode,
    externalName,
    externalCredits,
    coverage,
    notes,
    evaluation,
  });

  const record = {
    date: new Date().toISOString(),
    uptCourse: state.selectedCourse,
    university,
    externalCode,
    externalName,
    externalCredits,
    coverage,
    notes,
    evaluation,
  };

  state.history.unshift(record);
  state.history = state.history.slice(0, 50);
  saveHistory(state.history);
  renderHistory();
}

function evaluateEquivalence({ uptCourse, externalName, externalCredits, coverage }) {
  let score = 0;
  const reasons = [];

  const nameSimilarity = similarity(normalize(uptCourse.name), normalize(externalName));
  if (nameSimilarity >= 0.7) {
    score += 45;
    reasons.push("Nombre del curso muy similar");
  } else if (nameSimilarity >= 0.45) {
    score += 30;
    reasons.push("Nombre del curso parcialmente similar");
  } else {
    score += 10;
    reasons.push("Nombre con baja similitud");
  }

  const creditDiff = Math.abs((uptCourse.credits || 0) - externalCredits);
  if (creditDiff <= 1) {
    score += 30;
    reasons.push("Créditos en rango aceptable");
  } else if (creditDiff === 2) {
    score += 18;
    reasons.push("Créditos con diferencia moderada");
  } else {
    score += 6;
    reasons.push("Diferencia alta de créditos");
  }

  if (coverage >= 80) {
    score += 25;
    reasons.push("Alta cobertura de sílabo");
  } else if (coverage >= 60) {
    score += 16;
    reasons.push("Cobertura media de sílabo");
  } else {
    score += 7;
    reasons.push("Cobertura baja de sílabo");
  }

  let status = "No equivalente";
  if (score >= 78) {
    status = "Aprobable";
  } else if (score >= 58) {
    status = "Revisar";
  }

  return {
    score,
    status,
    reasons,
  };
}

function renderResult(payload) {
  const { evaluation, university, externalCode, externalName, externalCredits, coverage, notes } = payload;

  elements.resultCard.classList.remove("hidden", "status-aprobable", "status-revisar", "status-no-equivalente");

  if (evaluation.status === "Aprobable") {
    elements.resultCard.classList.add("status-aprobable");
  } else if (evaluation.status === "Revisar") {
    elements.resultCard.classList.add("status-revisar");
  } else {
    elements.resultCard.classList.add("status-no-equivalente");
  }

  elements.resultCard.innerHTML = `
    <strong>Resultado sugerido: ${evaluation.status}</strong>
    <p>Puntaje: <strong>${evaluation.score}</strong> / 100</p>
    <p>
      Curso externo evaluado: <strong>${externalCode} - ${externalName}</strong><br />
      Universidad de origen: <strong>${university}</strong><br />
      Créditos: <strong>${externalCredits}</strong> · Cobertura de sílabo: <strong>${coverage}%</strong>
    </p>
    <p>Razones: ${evaluation.reasons.join(" · ")}</p>
    ${notes ? `<p>Observaciones: ${escapeHtml(notes)}</p>` : ""}
    <p><em>Validación final: Coordinación Académica / Escuela.</em></p>
  `;
}

function renderHistory() {
  if (state.history.length === 0) {
    elements.historyList.innerHTML = "<p>No hay evaluaciones registradas aún.</p>";
    return;
  }

  elements.historyList.innerHTML = state.history
    .map((record) => {
      const date = new Date(record.date).toLocaleString("es-PE");
      return `
        <article class="history-item">
          <strong>${record.evaluation.status}</strong> · Puntaje ${record.evaluation.score}<br />
          UPT: ${record.uptCourse.code} - ${record.uptCourse.name}<br />
          Externo: ${record.externalCode} - ${record.externalName} (${record.university})<br />
          ${date}
        </article>
      `;
    })
    .join("");
}

function clearHistory() {
  const confirmClear = confirm("¿Seguro que deseas eliminar el historial local?");
  if (!confirmClear) {
    return;
  }

  state.history = [];
  saveHistory(state.history);
  renderHistory();
}

function loadHistory() {
  try {
    const raw = localStorage.getItem("upt-convalidaciones-history");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveHistory(history) {
  localStorage.setItem("upt-convalidaciones-history", JSON.stringify(history));
}

function normalize(text = "") {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function similarity(a, b) {
  if (!a || !b) {
    return 0;
  }

  const aTokens = new Set(a.split(" "));
  const bTokens = new Set(b.split(" "));
  const intersection = [...aTokens].filter((token) => bTokens.has(token)).length;
  const union = new Set([...aTokens, ...bTokens]).size;

  return union === 0 ? 0 : intersection / union;
}

function escapeHtml(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
