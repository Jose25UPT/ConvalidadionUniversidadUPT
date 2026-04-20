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
  quickCareerSelect: document.getElementById("quickCareerSelect"),
  quickSelectedCount: document.getElementById("quickSelectedCount"),
  quickPreviewBtn: document.getElementById("quickPreviewBtn"),
  quickGoRequestBtn: document.getElementById("quickGoRequestBtn"),
  quickDownloadBtn: document.getElementById("quickDownloadBtn"),
  cycleFilter: document.getElementById("cycleFilter"),
  courseSearch: document.getElementById("courseSearch"),
  typeFilter: document.getElementById("typeFilter"),
  courseList: document.getElementById("courseList"),
  selectedCoursesList: document.getElementById("selectedCoursesList"),
  startRequestBtn: document.getElementById("startRequestBtn"),
  clearSelectedBtn: document.getElementById("clearSelectedBtn"),
  printPdfBtn: document.getElementById("printPdfBtn"),
  originPolicy: document.getElementsByName("originPolicy"),
  courseDetailModal: document.getElementById("courseDetailModal"),
  closeCourseDetailModal: document.getElementById("closeCourseDetailModal"),
  courseDetailBody: document.getElementById("courseDetailBody"),
  previewModal: document.getElementById("previewModal"),
  closePreviewModal: document.getElementById("closePreviewModal"),
  previewBody: document.getElementById("previewBody"),
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
  renderCareerSelect();
  renderCycleFilter();
  renderCourseList();
  renderSelectedCourses();
  updateProgress();

  elements.cycleFilter.addEventListener("change", renderCourseList);
  if (elements.typeFilter) {
    elements.typeFilter.addEventListener("change", renderCourseList);
  }
  elements.courseSearch.addEventListener("input", renderCourseList);

  const sidebarToggle = document.getElementById("mobileSidebarToggle");
  const sidebar = document.querySelector(".sidebar-panel");
  
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      sidebar.classList.toggle("open");
    });
  }

  if (elements.originPolicy) {
    elements.originPolicy.forEach(radio => {
      radio.addEventListener("change", () => {
        renderCourseList();
        updateProgress();
      });
    });
  }

  if (elements.startRequestBtn) {
    elements.startRequestBtn.addEventListener("click", () => {
      if (state.selectedCourses.length === 0) {
        showToast("Selecciona al menos un curso para iniciar la solicitud.");
        return;
      }
      showToast("Iniciando solicitud de convalidación...");
    });
  }

  if (elements.clearSelectedBtn) {
    elements.clearSelectedBtn.addEventListener("click", clearSelectedCourses);
  }

  if (elements.printPdfBtn) {
    elements.printPdfBtn.addEventListener("click", printSelectedCoursesPdf);
  }

  if (elements.quickPreviewBtn) {
    elements.quickPreviewBtn.addEventListener("click", openPreviewModal);
  }

  if (elements.quickDownloadBtn) {
    elements.quickDownloadBtn.addEventListener("click", printSelectedCoursesPdf);
  }

  if (elements.quickGoRequestBtn) {
    elements.quickGoRequestBtn.addEventListener("click", scrollToRequestSection);
  }

  if (elements.closePreviewModal) {
    elements.closePreviewModal.addEventListener("click", closePreviewModal);
  }

  elements.courseDetailModal.addEventListener("click", (event) => {
    if (event.target === elements.courseDetailModal) {
      closeCourseDetails();
    }
  });

  if (elements.previewModal) {
    elements.previewModal.addEventListener("click", (event) => {
      if (event.target === elements.previewModal) {
        closePreviewModal();
      }
    });
  }
}

function renderCareerSelect() {
  if (!elements.quickCareerSelect) {
    return;
  }

  const career = state.meta.career || "Ingeniería de Sistemas";
  const options = [career, "Otras carreras (próximamente)"];

  elements.quickCareerSelect.innerHTML = options
    .map((option, index) => `<option value="${index === 0 ? "default" : "coming-soon"}">${option}</option>`)
    .join("");

  elements.quickCareerSelect.addEventListener("change", () => {
    if (elements.quickCareerSelect.value === "coming-soon") {
      showToast("Pronto habilitaremos más carreras en esta vista.");
      elements.quickCareerSelect.value = "default";
    }
  });
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
  if (!elements.stats) {
    return;
  }

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

function getFilteredCourses(selectedCycle, query) {
  return state.courses.filter((course) => {
    const byCycle =
      selectedCycle === "Todos" ||
      (selectedCycle === "Electivos" && course.cycle === "Electivo") ||
      course.cycle === selectedCycle;

    if (!byCycle) return false;
    if (!query) return true;

    return normalize(`${course.code} ${course.name}`).includes(query);
  });
}

function renderCourseList() {
  const selectedCycle = elements.cycleFilter.value || "Todos";
  const selectedType = elements.typeFilter ? elements.typeFilter.value : "Todos";
  const query = normalize(elements.courseSearch.value);
  
  let courses = getFilteredCourses(selectedCycle, query);
  
  if (selectedType !== "Todos") {
    courses = courses.filter(course => {
      if (selectedType === "Electivo") return course.cycle === "Electivo";
      if (selectedType === "Obligatorio") return course.cycle !== "Electivo";
      return true;
    });
  }

  if (courses.length === 0) {
    elements.courseList.innerHTML = `<div class="empty-state">No se encontraron cursos que coincidan con la búsqueda.</div>`;
    return;
  }

  elements.courseList.innerHTML = courses
    .map((course) => {
      const inSelection = state.selectedCourses.some((item) => item.code === course.code);
      const isSelectable = inSelection || isCourseSelectable(course);
      const credits = course.credits || 0;
      
      // Get truncated objective or a default
      const description = course.objective || "Diseño y evaluación de arquitecturas de sistemas, patrones arquitectónicos y atributos...";

      // Requirements pills
      let requirementsHtml = "";
      if (course.prerequisite && course.prerequisite !== "Ninguno") {
        requirementsHtml = `
          <div class="requisitos-section">
            <span class="section-label">REQUISITOS</span>
            <div class="requisitos-pills">
              <div class="pill">
                <span class="pill-name">${course.prerequisite}</span>
              </div>
            </div>
          </div>
        `;
      } else {
        requirementsHtml = `<div class="requisitos-section"></div>`;
      }

      return `
        <article class="course-card ${!isSelectable ? "disabled" : ""}" data-code="${course.code}">
          <div class="card-top">
            <span class="course-code-badge">${course.code}</span>
            <span class="course-credits-badge">${credits} CRÉDITOS</span>
          </div>
          <h3>${course.name}</h3>
          <p class="course-desc">${description}</p>
          ${requirementsHtml}
          <div class="card-actions">
            <button class="ghost-btn" type="button" data-action="details" data-code="${course.code}">Detalles</button>
            <button class="add-btn ${inSelection ? "added" : ""}" type="button" data-action="toggle-select" data-code="${course.code}" ${!isSelectable ? "disabled" : ""}>
              ${inSelection ? "Agregado ✓" : "Agregar +"}
            </button>
          </div>
        </article>
      `;
    })
    .join("");

  // Event listeners
  document.querySelectorAll("button[data-action='details']").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const code = button.getAttribute("data-code");
      const selected = courses.find((course) => course.code === code);
      if (selected) openCourseDetails(selected);
    });
  });

  document.querySelectorAll("button[data-action='toggle-select']").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();
      const code = button.getAttribute("data-code");
      const selected = courses.find((course) => course.code === code);
      if (selected) toggleCourseSelection(selected);
    });
  });
}

function openCourseDetails(course) {
  const objective = course.objective || "Este curso desarrolla contenidos teóricos-prácticos del plan de estudios.";
  elements.courseDetailBody.innerHTML = `
    <p><strong>${course.code} - ${course.name}</strong></p>
    <p><strong>Ciclo:</strong> ${course.cycle} · <strong>Créditos:</strong> ${course.credits || "N/A"}</p>
    <p><strong>Qué aprenderás:</strong> ${escapeHtml(objective)}</p>
  `;
  elements.courseDetailModal.classList.remove("hidden");
}

function closeCourseDetails() {
  elements.courseDetailModal.classList.add("hidden");
}

function toggleCourseSelection(course) {
  const exists = state.selectedCourses.some((item) => item.code === course.code);

  if (exists) {
    state.selectedCourses = state.selectedCourses.filter((item) => item.code !== course.code);
    showToast(`Se quitó ${course.code} de tu lista.`);
  } else {
    state.selectedCourses.push({
      code: course.code,
      name: course.name,
      cycle: course.cycle,
      credits: course.credits || 0,
    });
    showToast(`Se agregó ${course.code} a tu lista.`);
  }

  saveSelectedCourses(state.selectedCourses);
  renderSelectedCourses();
  renderCourseList();
}

function renderSelectedCourses() {
  if (state.selectedCourses.length === 0) {
    elements.selectedCoursesList.innerHTML = `
      <div class="empty-state">
        Selecciona un curso de la lista para ver su información principal.
      </div>
    `;
    updateProgress();
    return;
  }

  elements.selectedCoursesList.innerHTML = state.selectedCourses
    .map(
      (course) => `
        <div class="selected-item-card">
          <div class="item-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
          </div>
          <div class="item-info">
            <span class="item-name">${course.name}</span>
            <span class="item-meta">${course.code} · ${course.credits} CR</span>
          </div>
          <button class="mini-btn remove-btn" style="margin-left: auto; background: transparent; border: none; cursor: pointer; color: #b5b5c3;" data-action="remove-selected" data-code="${course.code}">✕</button>
        </div>
      `
    )
    .join("");

  document.querySelectorAll("button[data-action='remove-selected']").forEach((button) => {
    button.addEventListener("click", () => {
      const code = button.getAttribute("data-code");
      state.selectedCourses = state.selectedCourses.filter((item) => item.code !== code);
      saveSelectedCourses(state.selectedCourses);
      renderSelectedCourses();
      renderCourseList();
      showToast(`Se quitó ${code} de tu lista.`);
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

function updateQuickSummary() {
  const count = state.selectedCourses.length;

  if (elements.quickSelectedCount) {
    elements.quickSelectedCount.textContent = `${count} ${count === 1 ? "curso" : "cursos"} en lista`;
  }

  if (elements.floatingPreviewBtn) {
    elements.floatingPreviewBtn.textContent = `Ver lista (${count})`;
  }
}

function scrollToRequestSection() {
  const target = document.getElementById("panel-lista");
  if (!target) {
    return;
  }

  target.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openPreviewModal() {
  if (!elements.previewModal || !elements.previewBody) {
    return;
  }

  elements.previewBody.innerHTML = renderPreviewHtml();
  elements.previewModal.classList.remove("hidden");

  const goButton = elements.previewBody.querySelector("#previewGoRequest");
  const downloadButton = elements.previewBody.querySelector("#previewDownload");

  if (goButton) {
    goButton.addEventListener("click", () => {
      closePreviewModal();
      scrollToRequestSection();
    });
  }

  if (downloadButton) {
    downloadButton.addEventListener("click", printSelectedCoursesPdf);
  }
}

function closePreviewModal() {
  if (!elements.previewModal) {
    return;
  }

  elements.previewModal.classList.add("hidden");
}

function renderPreviewHtml() {
  if (state.selectedCourses.length === 0) {
    return `
      <p class="preview-empty">Aún no tienes cursos en tu lista de convalidación.</p>
      <div class="preview-actions">
        <button id="previewGoRequest" class="quick-btn ghost" type="button">Ir a sección de solicitud</button>
      </div>
    `;
  }

  const totalCredits = state.selectedCourses.reduce((sum, item) => sum + Number(item.credits || 0), 0);
  const items = state.selectedCourses
    .map(
      (course) => `
        <article class="preview-item">
          <strong>${escapeHtml(course.code)} - ${escapeHtml(course.name)}</strong><br />
          Ciclo ${escapeHtml(String(course.cycle))} · ${escapeHtml(String(course.credits))} créditos
        </article>
      `
    )
    .join("");

  return `
    <p class="preview-summary">${state.selectedCourses.length} cursos seleccionados · ${totalCredits} créditos acumulados.</p>
    <div class="preview-list">${items}</div>
    <div class="preview-actions">
      <button id="previewGoRequest" class="quick-btn ghost" type="button">Ir a sección de solicitud</button>
      <button id="previewDownload" class="quick-btn" type="button">Descargar PDF</button>
    </div>
  `;
}

function updateProgress() {
  const selectedCredits = state.selectedCourses.reduce((acc, item) => acc + Number(item.credits || 0), 0);
  const policy = Array.from(elements.originPolicy).find(r => r.checked)?.value || "institute";
  const limit = policy === "institute" ? 50 : 0;
  
  if (elements.quickSelectedCount) {
    elements.quickSelectedCount.textContent = `${state.selectedCourses.length} cursos en lista`;
  }

  const quickCount = document.getElementById("quickCount");
  if (quickCount) {
    quickCount.textContent = state.selectedCourses.length;
  }

  // Update progress UI in sidebar
  const progressHtml = `
    <div class="progress-stats">
      <div class="progress-label">
        <span>Créditos seleccionados</span>
        <span>${selectedCredits}${limit ? ` / ${limit}` : ""}</span>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar-fill" style="width: ${limit ? Math.min(100, (selectedCredits / limit) * 100) : 100}%"></div>
      </div>
      <p class="progress-warning ${limit && selectedCredits > limit ? "visible" : ""}">
        ⚠️ Has excedido el límite de 50 créditos para institutos.
      </p>
    </div>
  `;

  const container = document.getElementById("progressStatsContainer");
  if (container) {
    container.innerHTML = progressHtml;
  }
}

function isCourseSelectable(course) {
  const policy = Array.from(elements.originPolicy).find(r => r.checked)?.value || "institute";
  const selectedCredits = state.selectedCourses.reduce((acc, item) => acc + Number(item.credits || 0), 0);
  
  if (policy === "institute") {
    return (selectedCredits + (course.credits || 0)) <= 50;
  }
  return true;
}

function getEligibilityMessage(course) {
  return "Curso habilitado.";
}

function showToast(message) {
  if (!elements.toast) return;
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

function printSelectedCoursesPdf() {
  if (state.selectedCourses.length === 0) {
    showToast("Primero agrega al menos un curso para imprimir.");
    return;
  }
  const date = new Date().toLocaleString("es-PE");
  const rows = state.selectedCourses
    .map(course => `
        <tr>
          <td>${escapeHtml(course.code)}</td>
          <td>${escapeHtml(course.name)}</td>
          <td>${escapeHtml(String(course.cycle))}</td>
          <td>${escapeHtml(String(course.credits))}</td>
        </tr>
      `).join("");

  const popup = window.open("", "_blank");
  if (!popup) return;
  popup.document.write(`
    <html>
      <head>
        <title>Solicitud de Convalidacion</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; color: #1b2f40; }
          h1 { margin: 0 0 8px; }
          table { width: 100%; border-collapse: collapse; margin-top: 14px; }
          th, td { border: 1px solid #7f9ab3; padding: 8px; text-align: left; font-size: 12px; }
          th { background: #eaf4ff; }
        </style>
      </head>
      <body>
        <h1>Solicitud referencial</h1>
        <p>Fecha: ${date}</p>
        <table>
          <thead><tr><th>Codigo</th><th>Curso</th><th>Ciclo</th><th>Creditos</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </body>
    </html>
  `);
  popup.document.close();
  popup.print();
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
