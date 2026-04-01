const CONVALIDABLE_CYCLES = new Set(["I", "II", "III", "IV", "V", "VI"]);

const state = {
  curriculum: null,
  selectedCourse: null,
  selectedExternalId: null,
  externalCourses: loadExternalCourses(),
  history: loadHistory(),
};

const elements = {
  stats: document.getElementById("stats"),
  cycleFilter: document.getElementById("cycleFilter"),
  onlyConvalidable: document.getElementById("onlyConvalidable"),
  policyCycles: document.getElementById("policyCycles"),
  strictGeneralOnly: document.getElementById("strictGeneralOnly"),
  requireSunedu: document.getElementById("requireSunedu"),
  courseSearch: document.getElementById("courseSearch"),
  courseList: document.getElementById("courseList"),
  selectedCourse: document.getElementById("selectedCourse"),
  suneduLicensed: document.getElementById("suneduLicensed"),
  suneduProgramValid: document.getElementById("suneduProgramValid"),
  suneduStatus: document.getElementById("suneduStatus"),
  externalCourseForm: document.getElementById("externalCourseForm"),
  evaluationForm: document.getElementById("evaluationForm"),
  externalCourseList: document.getElementById("externalCourseList"),
  resultCard: document.getElementById("resultCard"),
  suggestionCard: document.getElementById("suggestionCard"),
  historyList: document.getElementById("historyList"),
  printReportBtn: document.getElementById("printReportBtn"),
  clearHistoryBtn: document.getElementById("clearHistoryBtn"),
};

init();

async function init() {
  const response = await fetch("./data/curriculum.json");
  state.curriculum = await response.json();

  renderStats();
  renderCycleFilter();
  renderCourseList();
  renderExternalCourseList();
  renderHistory();
  updateSuneduStatus();

  elements.cycleFilter.addEventListener("change", renderCourseList);
  elements.onlyConvalidable.addEventListener("change", renderCourseList);
  elements.policyCycles.addEventListener("change", onPolicyChange);
  elements.strictGeneralOnly.addEventListener("change", onPolicyChange);
  elements.requireSunedu.addEventListener("change", updateSuneduStatus);
  elements.courseSearch.addEventListener("input", renderCourseList);
  elements.suneduLicensed.addEventListener("change", updateSuneduStatus);
  elements.suneduProgramValid.addEventListener("change", updateSuneduStatus);
  elements.externalCourseForm.addEventListener("submit", onAddExternalCourse);
  elements.evaluationForm.addEventListener("submit", onEvaluate);
  elements.printReportBtn.addEventListener("click", printReport);
  elements.clearHistoryBtn.addEventListener("click", clearHistory);
}

function renderStats() {
  const coursesCount = state.curriculum.cycles.reduce((acc, cycle) => acc + cycle.courses.length, 0);
  const convalidables = state.curriculum.cycles
    .filter((cycle) => CONVALIDABLE_CYCLES.has(cycle.name))
    .reduce((acc, cycle) => acc + cycle.courses.length, 0);

  const chips = [
    `Ciclos: ${state.curriculum.cycles.length}`,
    `Cursos obligatorios: ${coursesCount}`,
    `Convalidables I-VI: ${convalidables}`,
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
  const onlyConvalidable = elements.onlyConvalidable.checked;
  const courseEntries = getFilteredCourses(selectedCycle, query, onlyConvalidable);

  if (courseEntries.length === 0) {
    elements.courseList.innerHTML = `<li class="course-item">No se encontraron cursos.</li>`;
    return;
  }

  elements.courseList.innerHTML = courseEntries
    .map((entry) => {
      const isActive = state.selectedCourse && state.selectedCourse.code === entry.code;
      const credits = entry.credits ? `${entry.credits} créditos` : "Sin créditos";
      const convalidableTag = entry.isConvalidable
        ? `<span class="tag">Convalidable</span>`
        : `<span class="tag warn">No convalidable</span>`;

      return `
        <li class="course-item ${isActive ? "active" : ""}" data-code="${entry.code}">
          <div class="course-code">${entry.code} · Ciclo ${entry.cycle} ${convalidableTag}</div>
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

function getFilteredCourses(selectedCycle, query, onlyConvalidable) {
  const allCourses = [];

  state.curriculum.cycles.forEach((cycle) => {
    cycle.courses.forEach((course) => {
      allCourses.push({
        ...course,
        cycle: cycle.name,
        isGeneral: isGeneralCourse(course),
      });
    });
  });

  state.curriculum.electives.forEach((course) => {
    allCourses.push({ ...course, cycle: "Electivo", isGeneral: false });
  });

  return allCourses.filter((course) => {
    const byCycle =
      selectedCycle === "Todos" ||
      (selectedCycle === "Electivos" && course.cycle === "Electivo") ||
      course.cycle === selectedCycle;

    if (!byCycle) {
      return false;
    }

    if (onlyConvalidable && !isCourseEligible(course)) {
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

  const policy = getEligibilityMessage(course);

  elements.selectedCourse.innerHTML = `
    <strong>${course.code} - ${course.name}</strong><br />
    Ciclo: ${course.cycle} · Créditos: ${course.credits || "N/A"} · Prerrequisito: ${course.prerequisite || "Ninguno"}<br />
    <em>${policy}</em>
  `;

  renderSuggestionForSelectedExternal();
}

function updateSuneduStatus() {
  if (!elements.requireSunedu.checked) {
    elements.suneduStatus.classList.add("ok");
    elements.suneduStatus.textContent =
      "SUNEDU no obligatorio en esta simulación. Puedes registrar y evaluar de forma referencial.";
    return;
  }

  const valid = isSuneduValid();
  elements.suneduStatus.classList.toggle("ok", valid);
  elements.suneduStatus.textContent = valid
    ? "SUNEDU verificado: ya puedes registrar y evaluar cursos."
    : "Debes marcar ambas validaciones para continuar.";
}

function onPolicyChange() {
  renderCourseList();
  if (state.selectedCourse) {
    selectCourse(state.selectedCourse);
  }
  renderSuggestionForSelectedExternal();
}

function onAddExternalCourse(event) {
  event.preventDefault();

  if (elements.requireSunedu.checked && !isSuneduValid()) {
    alert("No se puede registrar: la universidad/programa no está validado por SUNEDU.");
    return;
  }

  const university = document.getElementById("originUniversity").value.trim();
  const externalCode = document.getElementById("externalCode").value.trim();
  const externalName = document.getElementById("externalName").value.trim();
  const externalCredits = Number(document.getElementById("externalCredits").value);
  const coverage = Number(document.getElementById("syllabusCoverage").value);
  const notes = document.getElementById("notes").value.trim();

  const item = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
    university,
    externalCode,
    externalName,
    externalCredits,
    coverage,
    notes,
  };

  state.externalCourses.unshift(item);
  saveExternalCourses(state.externalCourses);
  state.selectedExternalId = item.id;

  elements.externalCourseForm.reset();
  document.getElementById("syllabusCoverage").value = 70;

  renderExternalCourseList();
  renderSuggestionForSelectedExternal();
}

function renderExternalCourseList() {
  if (state.externalCourses.length === 0) {
    elements.externalCourseList.innerHTML = "<p>No has registrado cursos externos todavía.</p>";
    return;
  }

  elements.externalCourseList.innerHTML = state.externalCourses
    .map((course) => {
      const activeClass = state.selectedExternalId === course.id ? "active" : "";
      return `
        <article class="history-item">
          <strong>${course.externalCode} - ${course.externalName}</strong><br />
          ${course.university} · ${course.externalCredits} créditos · Cobertura ${course.coverage}%
          <div class="external-actions">
            <button class="mini-btn ${activeClass}" data-action="select-external" data-id="${course.id}">Usar para evaluar</button>
            <button class="mini-btn" data-action="suggest" data-id="${course.id}">Sugerir equivalencias UPT</button>
            <button class="mini-btn" data-action="remove" data-id="${course.id}">Quitar</button>
          </div>
        </article>
      `;
    })
    .join("");

  document.querySelectorAll("button[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.getAttribute("data-action");
      const id = button.getAttribute("data-id");
      if (!id) {
        return;
      }

      if (action === "select-external") {
        state.selectedExternalId = id;
        renderExternalCourseList();
        renderSuggestionForSelectedExternal();
      }

      if (action === "suggest") {
        state.selectedExternalId = id;
        renderExternalCourseList();
        renderSuggestionForSelectedExternal();
      }

      if (action === "remove") {
        removeExternalCourse(id);
      }
    });
  });
}

function removeExternalCourse(id) {
  state.externalCourses = state.externalCourses.filter((course) => course.id !== id);
  if (state.selectedExternalId === id) {
    state.selectedExternalId = null;
  }
  saveExternalCourses(state.externalCourses);
  renderExternalCourseList();
  renderSuggestionForSelectedExternal();
}

function onEvaluate(event) {
  event.preventDefault();

  if (elements.requireSunedu.checked && !isSuneduValid()) {
    alert("No se puede convalidar: universidad o programa no habilitado por SUNEDU.");
    return;
  }

  if (!state.selectedCourse) {
    alert("Primero selecciona un curso UPT.");
    return;
  }

  if (!isCourseEligible(state.selectedCourse)) {
    alert("Este curso UPT está fuera de la política activa. Ajusta opciones o selecciona otro curso.");
    return;
  }

  const external = getSelectedExternalCourse();
  if (!external) {
    alert("Primero selecciona un curso externo registrado.");
    return;
  }

  const evaluation = evaluateEquivalence({
    uptCourse: state.selectedCourse,
    externalName: external.externalName,
    externalCredits: external.externalCredits,
    coverage: external.coverage,
  });

  renderResult({
    university: external.university,
    externalCode: external.externalCode,
    externalName: external.externalName,
    externalCredits: external.externalCredits,
    coverage: external.coverage,
    notes: external.notes,
    evaluation,
  });

  const record = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    date: new Date().toISOString(),
    uptCourse: state.selectedCourse,
    university: external.university,
    externalCode: external.externalCode,
    externalName: external.externalName,
    externalCredits: external.externalCredits,
    coverage: external.coverage,
    notes: external.notes,
    evaluation,
    suneduValidated: !elements.requireSunedu.checked || isSuneduValid(),
    coordinatorDecision: "Pendiente",
    coordinatorNote: "",
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

function renderSuggestionForSelectedExternal() {
  const external = getSelectedExternalCourse();

  if (!external) {
    elements.suggestionCard.classList.add("hidden");
    return;
  }

  const matches = getTopMatches(external, 5);
  elements.suggestionCard.classList.remove("hidden", "status-aprobable", "status-revisar", "status-no-equivalente");
  elements.suggestionCard.classList.add("status-revisar");
  elements.suggestionCard.innerHTML = `
    <strong>Sugerencias para ${external.externalCode} - ${external.externalName}</strong>
    <p>Se muestran cursos UPT con mayor similitud dentro de ciclos I-VI (sin subtemas).</p>
    ${matches
      .map(
        (item) =>
          `<p><strong>${item.upt.code} - ${item.upt.name}</strong> · Ciclo ${item.upt.cycle} · Puntaje ${item.evaluation.score} (${item.evaluation.status})</p>`
      )
      .join("")}
  `;
}

function getTopMatches(external, limit) {
  const eligibleCourses = [];

  state.curriculum.cycles
    .forEach((cycle) => {
      cycle.courses.forEach((course) => {
        const withMeta = { ...course, cycle: cycle.name, isGeneral: isGeneralCourse(course) };
        if (isCourseEligible(withMeta)) {
          eligibleCourses.push(withMeta);
        }
      });
    });

  return eligibleCourses
    .map((upt) => ({
      upt,
      evaluation: evaluateEquivalence({
        uptCourse: upt,
        externalName: external.externalName,
        externalCredits: external.externalCredits,
        coverage: external.coverage,
      }),
    }))
    .sort((a, b) => b.evaluation.score - a.evaluation.score)
    .slice(0, limit);
}

function renderHistory() {
  if (state.history.length === 0) {
    elements.historyList.innerHTML = "<p>No hay evaluaciones registradas aún.</p>";
    return;
  }

  elements.historyList.innerHTML = state.history
    .map((record, index) => {
      const date = new Date(record.date).toLocaleString("es-PE");
      const safeId = record.id || `legacy-${index}`;
      return `
        <article class="history-item">
          <strong>${record.evaluation.status}</strong> · Puntaje ${record.evaluation.score}<br />
          UPT: ${record.uptCourse.code} - ${record.uptCourse.name}<br />
          Externo: ${record.externalCode} - ${record.externalName} (${record.university})<br />
          SUNEDU: ${record.suneduValidated ? "Validado" : "No"}<br />
          Fecha: ${date}<br />
          <label>
            Decisión de coordinador
            <select data-role="decision" data-id="${safeId}">
              <option value="Pendiente" ${record.coordinatorDecision === "Pendiente" ? "selected" : ""}>Pendiente</option>
              <option value="Aprobar" ${record.coordinatorDecision === "Aprobar" ? "selected" : ""}>Aprobar</option>
              <option value="Observar" ${record.coordinatorDecision === "Observar" ? "selected" : ""}>Observar</option>
              <option value="Rechazar" ${record.coordinatorDecision === "Rechazar" ? "selected" : ""}>Rechazar</option>
            </select>
          </label>
          <label>
            Nota del coordinador
            <input type="text" data-role="coord-note" data-id="${safeId}" value="${escapeHtml(
              record.coordinatorNote || ""
            )}" placeholder="Comentario breve" />
          </label>
          <button class="mini-btn" data-role="save-decision" data-id="${safeId}">Guardar decisión</button>
        </article>
      `;
    })
    .join("");

  document.querySelectorAll("button[data-role='save-decision']").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");
      if (!id) {
        return;
      }
      saveCoordinatorDecision(id);
    });
  });
}

function saveCoordinatorDecision(id) {
  const decisionInput = document.querySelector(`select[data-role='decision'][data-id='${id}']`);
  const noteInput = document.querySelector(`input[data-role='coord-note'][data-id='${id}']`);
  if (!decisionInput || !noteInput) {
    return;
  }

  const record = state.history.find((item, index) => (item.id || `legacy-${index}`) === id);
  if (!record) {
    return;
  }

  record.coordinatorDecision = decisionInput.value;
  record.coordinatorNote = noteInput.value.trim();
  saveHistory(state.history);
  alert("Decisión del coordinador guardada.");
}

function printReport() {
  if (state.history.length === 0) {
    alert("No hay evaluaciones para imprimir.");
    return;
  }

  const htmlRows = state.history
    .map((record) => {
      const date = new Date(record.date).toLocaleString("es-PE");
      return `
        <tr>
          <td>${escapeHtml(record.uptCourse.code)} - ${escapeHtml(record.uptCourse.name)}</td>
          <td>${escapeHtml(record.externalCode)} - ${escapeHtml(record.externalName)}</td>
          <td>${escapeHtml(record.university)}</td>
          <td>${record.evaluation.score} (${escapeHtml(record.evaluation.status)})</td>
          <td>${record.coordinatorDecision || "Pendiente"}</td>
          <td>${escapeHtml(record.coordinatorNote || "")}</td>
          <td>${date}</td>
        </tr>
      `;
    })
    .join("");

  const reportWindow = window.open("", "_blank");
  if (!reportWindow) {
    alert("No se pudo abrir la ventana de impresión.");
    return;
  }

  reportWindow.document.write(`
    <html>
      <head>
        <title>Reporte de Convalidaciones UPT</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; }
          h1 { margin-top: 0; }
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid #999; padding: 8px; font-size: 12px; text-align: left; }
          th { background: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>Reporte de Convalidaciones - UPT</h1>
        <p>Generado: ${new Date().toLocaleString("es-PE")}</p>
        <table>
          <thead>
            <tr>
              <th>Curso UPT</th>
              <th>Curso externo</th>
              <th>Universidad</th>
              <th>Resultado</th>
              <th>Decisión coordinador</th>
              <th>Nota</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>${htmlRows}</tbody>
        </table>
      </body>
    </html>
  `);
  reportWindow.document.close();
  reportWindow.focus();
  reportWindow.print();
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

function loadExternalCourses() {
  try {
    const raw = localStorage.getItem("upt-convalidaciones-external-courses");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveExternalCourses(courses) {
  localStorage.setItem("upt-convalidaciones-external-courses", JSON.stringify(courses));
}

function getSelectedExternalCourse() {
  return state.externalCourses.find((course) => course.id === state.selectedExternalId) || null;
}

function isGeneralCourse(course) {
  return String(course.code || "").startsWith("EG-");
}

function isCourseEligible(course) {
  if (course.cycle === "Electivo") {
    return false;
  }

  if (elements.policyCycles.checked && !CONVALIDABLE_CYCLES.has(course.cycle)) {
    return false;
  }

  if (elements.strictGeneralOnly.checked && !isGeneralCourse(course)) {
    return false;
  }

  return true;
}

function getEligibilityMessage(course) {
  if (isCourseEligible(course)) {
    return "Curso habilitado por la política activa.";
  }

  const reasons = [];
  if (course.cycle === "Electivo") {
    reasons.push("es electivo");
  }
  if (elements.policyCycles.checked && !CONVALIDABLE_CYCLES.has(course.cycle)) {
    reasons.push("está fuera de ciclos I-VI");
  }
  if (elements.strictGeneralOnly.checked && !isGeneralCourse(course)) {
    reasons.push("no es curso general (EG-)");
  }

  return `Curso fuera de política activa porque ${reasons.join(" y ")}.`;
}

function isSuneduValid() {
  return elements.suneduLicensed.checked && elements.suneduProgramValid.checked;
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
