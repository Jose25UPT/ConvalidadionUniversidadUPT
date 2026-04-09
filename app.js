const CONVALIDABLE_CYCLES = new Set(["I", "II", "III", "IV", "V", "VI"]);

const state = {
  curriculum: null,
  meta: {
    totalCredits: 0,
    requiredCredits: 0,
    career: "",
    versionPlan: "",
  },
  cycles: [],
  courses: [],
  selectedCourse: null,
  selectedCourses: loadSelectedCourses(),
};

const elements = {
  stats: document.getElementById("stats"),
  cycleFilter: document.getElementById("cycleFilter"),
  onlyConvalidable: document.getElementById("onlyConvalidable"),
  policyCycles: document.getElementById("policyCycles"),
  strictGeneralOnly: document.getElementById("strictGeneralOnly"),
  maxCreditsInstitute: document.getElementById("maxCreditsInstitute"),
  unlimitedCreditsUniversity: document.getElementById("unlimitedCreditsUniversity"),
  quickMode: document.getElementById("quickMode"),
  courseSearch: document.getElementById("courseSearch"),
  courseList: document.getElementById("courseList"),
  selectedCourse: document.getElementById("selectedCourse"),
  selectedCoursesList: document.getElementById("selectedCoursesList"),
  clearSelectedBtn: document.getElementById("clearSelectedBtn"),
  printPdfBtn: document.getElementById("printPdfBtn"),
  progressFill: document.getElementById("progressFill"),
  progressPercent: document.getElementById("progressPercent"),
  progressText: document.getElementById("progressText"),
  resultBadge: document.getElementById("resultBadge"),
  courseDetailModal: document.getElementById("courseDetailModal"),
  closeCourseDetailModal: document.getElementById("closeCourseDetailModal"),
  courseDetailBody: document.getElementById("courseDetailBody"),
  toast: document.getElementById("toast"),
};

init();

async function init() {
  const response = await fetch("./data/curriculum.json");
  state.curriculum = await response.json();

  const parsed = parseCurriculumData(state.curriculum);
  state.meta = parsed.meta;
  state.cycles = parsed.cycles;
  state.courses = parsed.courses;

  renderStats();
  renderCycleFilter();
  renderCourseList();
  renderSelectedCourses();
  updateProgress();

  elements.cycleFilter.addEventListener("change", renderCourseList);
  elements.onlyConvalidable.addEventListener("change", renderCourseList);
  elements.policyCycles.addEventListener("change", renderCourseList);
  elements.strictGeneralOnly.addEventListener("change", renderCourseList);
  elements.maxCreditsInstitute.addEventListener("change", renderCourseList);
  elements.unlimitedCreditsUniversity.addEventListener("change", renderCourseList);
  elements.quickMode.addEventListener("change", applyQuickMode);
  elements.courseSearch.addEventListener("input", renderCourseList);
  elements.clearSelectedBtn.addEventListener("click", clearSelectedCourses);
  elements.printPdfBtn.addEventListener("click", printSelectedCoursesPdf);
  elements.closeCourseDetailModal.addEventListener("click", closeCourseDetails);

  elements.courseDetailModal.addEventListener("click", (event) => {
    if (event.target === elements.courseDetailModal) {
      closeCourseDetails();
    }
  });

  applyQuickMode();
}

function parseCurriculumData(raw) {
  if (Array.isArray(raw.ciclos)) {
    const cycles = raw.ciclos.map((item) => item.ciclo);
    const courses = [];

    raw.ciclos.forEach((cycle) => {
      cycle.cursos.forEach((course) => {
        courses.push({
          code: course.codigo,
          name: course.nombre,
          credits: course.creditos,
          ht: course.ht || 0,
          hp: course.hp || 0,
          th: course.th || 0,
          prerequisite: course.prerrequisito || "Ninguno",
          cycle: cycle.ciclo,
          objective: course.que_aprenderas || "",
          activities: Array.isArray(course.actividades_practicas) ? course.actividades_practicas : [],
          evidences: Array.isArray(course.entregables_evidencia) ? course.entregables_evidencia : [],
          checklist: Array.isArray(course.checklist_convalidacion) ? course.checklist_convalidacion : [],
        });
      });
    });

    const electives = Array.isArray(raw.electives)
      ? raw.electives
      : Array.isArray(raw.electivos)
        ? raw.electivos
        : [];

    electives.forEach((course) => {
      courses.push({
        code: course.codigo || course.code,
        name: course.nombre || course.name,
        credits: course.creditos || course.credits,
        ht: course.ht || 0,
        hp: course.hp || 0,
        th: course.th || 0,
        prerequisite: course.prerrequisito || course.prerequisite || "Ninguno",
        cycle: "Electivo",
        objective: course.que_aprenderas || course.objetivo_aprendizaje || "",
        activities: Array.isArray(course.actividades_practicas) ? course.actividades_practicas : [],
        evidences: Array.isArray(course.entregables_evidencia) ? course.entregables_evidencia : [],
        checklist: Array.isArray(course.checklist_convalidacion) ? course.checklist_convalidacion : [],
      });
    });

    return {
      meta: {
        career: raw.metadata?.carrera || "",
        versionPlan: raw.metadata?.version_plan || "",
        totalCredits: Number(raw.metadata?.creditos_totales || 0),
        requiredCredits: Number(raw.metadata?.creditos_totales || 0),
      },
      cycles: [...cycles, "Electivos"],
      courses,
    };
  }

  const cycles = Array.isArray(raw.cycles) ? raw.cycles.map((item) => item.name) : [];
  const courses = [];

  (raw.cycles || []).forEach((cycle) => {
    (cycle.courses || []).forEach((course) => {
      courses.push({
        code: course.code,
        name: course.name,
        credits: course.credits,
        ht: course.ht || 0,
        hp: course.hp || 0,
        th: course.th || 0,
        prerequisite: course.prerequisite || "Ninguno",
        cycle: cycle.name,
        objective: course.que_aprenderas || course.objetivo_aprendizaje || "",
        activities: Array.isArray(course.actividades_practicas) ? course.actividades_practicas : [],
        evidences: Array.isArray(course.entregables_evidencia) ? course.entregables_evidencia : [],
        checklist: Array.isArray(course.checklist_convalidacion) ? course.checklist_convalidacion : [],
      });
    });
  });

  const electives = Array.isArray(raw.electives)
    ? raw.electives
    : Array.isArray(raw.electivos)
      ? raw.electivos
      : [];

  electives.forEach((course) => {
    courses.push({
      code: course.code,
      name: course.name,
      credits: course.credits,
      ht: 0,
      hp: 0,
      th: 0,
      prerequisite: course.prerequisite || "Ninguno",
      cycle: "Electivo",
      objective: course.que_aprenderas || course.objetivo_aprendizaje || "",
      activities: Array.isArray(course.actividades_practicas) ? course.actividades_practicas : [],
      evidences: Array.isArray(course.entregables_evidencia) ? course.entregables_evidencia : [],
      checklist: Array.isArray(course.checklist_convalidacion) ? course.checklist_convalidacion : [],
    });
  });

  return {
    meta: {
      career: raw.metadata?.carrera || "",
      versionPlan: raw.metadata?.version_plan || "",
      totalCredits: Number(raw.metadata?.creditos_totales || raw.totals?.overall || 0),
      requiredCredits: Number(raw.metadata?.creditos_totales || raw.totals?.obligatory || raw.totals?.overall || 0),
    },
    cycles: [...cycles, "Electivos"],
    courses,
  };
}

function renderStats() {
  const baseCourses = state.courses.filter((course) => course.cycle !== "Electivo").length;
  const convalidables = state.courses.filter((course) => CONVALIDABLE_CYCLES.has(course.cycle)).length;

  const chips = [
    state.meta.career ? `Carrera: ${state.meta.career}` : `Ciclos: ${state.cycles.filter((cycle) => cycle !== "Electivos").length}`,
    state.meta.versionPlan ? `Plan: ${state.meta.versionPlan}` : `Cursos obligatorios: ${baseCourses}`,
    `Convalidables I-VI: ${convalidables}`,
    `Creditos totales: ${state.meta.totalCredits || 0}`,
  ];

  elements.stats.innerHTML = chips.map((chip) => `<span class="stat-chip">${chip}</span>`).join("");
}

function renderCycleFilter() {
  const options = ["Todos", ...state.cycles];
  elements.cycleFilter.innerHTML = options.map((option) => `<option value="${option}">${option}</option>`).join("");
}

function renderCourseList() {
  const selectedCycle = elements.cycleFilter.value || "Todos";
  const query = normalize(elements.courseSearch.value);
  const onlyConvalidable = elements.onlyConvalidable.checked;
  const courses = getFilteredCourses(selectedCycle, query, onlyConvalidable);

  if (courses.length === 0) {
    elements.courseList.innerHTML = `<li class="course-item">No se encontraron cursos.</li>`;
    return;
  }

  elements.courseList.innerHTML = courses
    .map((course) => {
      const isActive = state.selectedCourse && state.selectedCourse.code === course.code;
      const inSelection = state.selectedCourses.some((item) => item.code === course.code);
      const convalidableTag = isCourseEligible(course)
        ? `<span class="tag">Convalidable</span>`
        : `<span class="tag warn">No convalidable</span>`;
      const credits = course.credits ? `${course.credits} creditos` : "Sin creditos";

      return `
        <li class="course-item ${isActive ? "active" : ""}" data-code="${course.code}">
          <div class="course-code">${course.code} · Ciclo ${course.cycle} ${convalidableTag}</div>
          <div class="course-name">${course.name}</div>
          <div class="course-meta">${credits} · Prerrequisito: ${course.prerequisite || "Ninguno"}</div>
          <div class="course-actions-row">
            <button class="mini-btn detail-btn" type="button" data-action="details" data-code="${course.code}">Detalles</button>
            <button class="mini-btn add-btn ${inSelection ? "active" : ""}" type="button" data-action="toggle-select" data-code="${course.code}">
              ${inSelection ? "Quitar" : "Agregar"}
            </button>
          </div>
        </li>
      `;
    })
    .join("");

  document.querySelectorAll(".course-item[data-code]").forEach((item) => {
    item.addEventListener("click", () => {
      const code = item.getAttribute("data-code");
      const selected = courses.find((course) => course.code === code);
      if (selected) {
        selectCourse(selected);
        renderCourseList();
      }
    });
  });

  document.querySelectorAll("button[data-action='details']").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const code = button.getAttribute("data-code");
      const selected = courses.find((course) => course.code === code);
      if (selected) {
        openCourseDetails(selected);
      }
    });
  });

  document.querySelectorAll("button[data-action='toggle-select']").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const code = button.getAttribute("data-code");
      const selected = courses.find((course) => course.code === code);
      if (selected) {
        toggleCourseSelection(selected);
      }
    });
  });
}

function getFilteredCourses(selectedCycle, query, onlyConvalidable) {
  return state.courses.filter((course) => {
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
    Ciclo: ${course.cycle} · Creditos: ${course.credits || "N/A"} · Prerrequisito: ${course.prerequisite || "Ninguno"}
    <em>${policy}</em>
  `;
}

function openCourseDetails(course) {
  const objective = course.objective || "Este curso desarrolla contenidos teorico-practicos del plan de estudios.";
  const activities = renderBulletList(course.activities);
  const evidences = renderBulletList(course.evidences);
  const checklist = renderBulletList(course.checklist);

  elements.courseDetailBody.innerHTML = `
    <p><strong>${course.code} - ${course.name}</strong></p>
    <p><strong>Ciclo:</strong> ${course.cycle} · <strong>Creditos:</strong> ${course.credits || "N/A"}</p>
    <p><strong>Horas:</strong> Teoria ${course.ht || 0} · Practica ${course.hp || 0} · Total ${course.th || 0}</p>
    <p><strong>Prerrequisito:</strong> ${course.prerequisite || "Ninguno"}</p>
    <p><strong>Que aprenderas:</strong> ${escapeHtml(objective)}</p>
    ${activities ? `<div class="detail-block"><h4>Actividades practicas</h4>${activities}</div>` : ""}
    ${evidences ? `<div class="detail-block"><h4>Entregables de evidencia</h4>${evidences}</div>` : ""}
    ${checklist ? `<div class="detail-block"><h4>Checklist de convalidacion</h4>${checklist}</div>` : ""}
  `;

  elements.courseDetailModal.classList.remove("hidden");
}

function renderBulletList(items) {
  if (!items || items.length === 0) {
    return "";
  }

  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
}

function closeCourseDetails() {
  elements.courseDetailModal.classList.add("hidden");
}

function toggleCourseSelection(course) {
  const exists = state.selectedCourses.some((item) => item.code === course.code);

  if (exists) {
    state.selectedCourses = state.selectedCourses.filter((item) => item.code !== course.code);
    showToast(`Se quito ${course.code} de tu lista.`);
  } else {
    state.selectedCourses.push({
      code: course.code,
      name: course.name,
      cycle: course.cycle,
      credits: course.credits || 0,
    });
    showToast(`Se agrego ${course.code} a tu lista.`);
  }

  saveSelectedCourses(state.selectedCourses);
  renderSelectedCourses();
  renderCourseList();
}

function renderSelectedCourses() {
  if (state.selectedCourses.length === 0) {
    elements.selectedCoursesList.innerHTML = "<p class=\"selected-empty\">Aun no agregaste cursos. Usa \"Agregar\" para empezar.</p>";
    updateProgress();
    return;
  }

  elements.selectedCoursesList.innerHTML = state.selectedCourses
    .map(
      (course) => `
        <article class="selected-item">
          <strong>${course.code} - ${course.name}</strong><br />
          Ciclo ${course.cycle} · ${course.credits} creditos
          <div class="selected-actions">
            <button class="mini-btn" type="button" data-action="remove-selected" data-code="${course.code}">Quitar</button>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelectorAll("button[data-action='remove-selected']").forEach((button) => {
    button.addEventListener("click", () => {
      const code = button.getAttribute("data-code");
      if (!code) {
        return;
      }

      state.selectedCourses = state.selectedCourses.filter((item) => item.code !== code);
      saveSelectedCourses(state.selectedCourses);
      renderSelectedCourses();
      renderCourseList();
      showToast(`Se quito ${code} de tu lista.`);
    });
  });

  updateProgress();
}

function clearSelectedCourses() {
  state.selectedCourses = [];
  saveSelectedCourses(state.selectedCourses);
  renderSelectedCourses();
  renderCourseList();
  showToast("Lista de cursos limpiada.");
}

function updateProgress() {
  const selectedCredits = state.selectedCourses.reduce((acc, item) => acc + Number(item.credits || 0), 0);

  let totalLimit = Number(state.meta.requiredCredits || state.meta.totalCredits || 0);
  let limitLabel = totalLimit ? `de ${totalLimit}` : "N/A";
  let limitPolicy = "";

  if (elements.maxCreditsInstitute.checked && !elements.unlimitedCreditsUniversity.checked) {
    totalLimit = 50;
    limitLabel = "de 50";
    limitPolicy = " (máximo institutos)";
  } else if (elements.unlimitedCreditsUniversity.checked && !elements.maxCreditsInstitute.checked) {
    limitPolicy = " (universidades, sin límite)";
  }

  const percent = totalLimit > 0 ? Math.max(0, Math.min(100, Math.round((selectedCredits / totalLimit) * 100))) : 0;

  elements.progressFill.style.width = `${percent}%`;
  elements.progressPercent.textContent = `${percent}%`;
  elements.progressText.textContent = `Creditos seleccionados: ${selectedCredits} ${limitLabel}${limitPolicy}`;

  let statusClass = "status-low";
  let statusText = "Inicio de solicitud";

  if (percent >= 70) {
    statusClass = "status-high";
    statusText = "Avance alto";
  } else if (percent >= 35) {
    statusClass = "status-medium";
    statusText = "Avance medio";
  }

  elements.resultBadge.className = `result-badge ${statusClass}`;
  elements.resultBadge.textContent = `${statusText} · ${percent}% referencial`;
  elements.resultBadge.classList.remove("pulse");
  void elements.resultBadge.offsetWidth;
  elements.resultBadge.classList.add("pulse");
}

function printSelectedCoursesPdf() {
  if (state.selectedCourses.length === 0) {
    showToast("Primero agrega al menos un curso para imprimir.");
    return;
  }

  const date = new Date().toLocaleString("es-PE");
  const rows = state.selectedCourses
    .map(
      (course) => `
        <tr>
          <td>${escapeHtml(course.code)}</td>
          <td>${escapeHtml(course.name)}</td>
          <td>${escapeHtml(String(course.cycle))}</td>
          <td>${escapeHtml(String(course.credits))}</td>
        </tr>
      `
    )
    .join("");

  const popup = window.open("", "_blank");
  if (!popup) {
    showToast("No se pudo abrir la ventana de impresion.");
    return;
  }

  popup.document.write(`
    <html>
      <head>
        <title>Solicitud de Convalidacion</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #1b2f40; }
          h1 { margin: 0 0 8px; }
          p { margin: 4px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 14px; }
          th, td { border: 1px solid #7f9ab3; padding: 8px; text-align: left; font-size: 12px; }
          th { background: #eaf4ff; }
          .note { margin-top: 16px; font-size: 12px; color: #35506a; }
        </style>
      </head>
      <body>
        <h1>Solicitud referencial de convalidacion</h1>
        <p>Carrera: ${escapeHtml(state.meta.career || "Ingeniería de Sistemas")}</p>
        <p>Plan: ${escapeHtml(state.meta.versionPlan || "Adecuación 2024-II")}</p>
        <p>Fecha: ${date}</p>
        <table>
          <thead>
            <tr>
              <th>Codigo</th>
              <th>Curso</th>
              <th>Ciclo</th>
              <th>Creditos</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <p class="note">Importante: este reporte es una simulacion de apoyo. La validacion final esta sujeta a evaluacion oficial de la universidad y de la escuela de Ingenieria de Sistemas.</p>
      </body>
    </html>
  `);

  popup.document.close();
  popup.focus();
  popup.print();
}

function showToast(message) {
  if (!elements.toast) {
    return;
  }

  elements.toast.textContent = message;
  elements.toast.classList.remove("hidden", "show");
  void elements.toast.offsetWidth;
  elements.toast.classList.add("show");

  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    elements.toast.classList.remove("show");
    elements.toast.classList.add("hidden");
  }, 2300);
}

function loadSelectedCourses() {
  try {
    const raw = localStorage.getItem("upt-selected-courses");
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveSelectedCourses(courses) {
  localStorage.setItem("upt-selected-courses", JSON.stringify(courses));
}

function applyQuickMode() {
  const quick = elements.quickMode.checked;
  document.body.classList.toggle("quick-mode", quick);
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

  const selectedCredits = state.selectedCourses.reduce((acc, item) => acc + Number(item.credits || 0), 0);
  const courseCredits = Number(course.credits || 0);
  const totalWithCourse = selectedCredits + courseCredits;

  if (elements.maxCreditsInstitute.checked && !elements.unlimitedCreditsUniversity.checked) {
    if (totalWithCourse > 50) {
      return false;
    }
  }

  return true;
}

function getEligibilityMessage(course) {
  if (isCourseEligible(course)) {
    return "Curso habilitado por la politica activa.";
  }

  const reasons = [];
  if (course.cycle === "Electivo") {
    reasons.push("es electivo");
  }
  if (elements.policyCycles.checked && !CONVALIDABLE_CYCLES.has(course.cycle)) {
    reasons.push("esta fuera de ciclos I-VI");
  }
  if (elements.strictGeneralOnly.checked && !isGeneralCourse(course)) {
    reasons.push("no es curso general (EG-)");
  }

  const selectedCredits = state.selectedCourses.reduce((acc, item) => acc + Number(item.credits || 0), 0);
  const courseCredits = Number(course.credits || 0);
  const totalWithCourse = selectedCredits + courseCredits;

  if (elements.maxCreditsInstitute.checked && !elements.unlimitedCreditsUniversity.checked) {
    if (totalWithCourse > 50) {
      reasons.push(`excederia el limite de 50 creditos de institutos (tienes ${selectedCredits}, curso tiene ${courseCredits})`);
    }
  }

  return `Curso fuera de politica activa porque ${reasons.join(" y ")}.`;
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

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
