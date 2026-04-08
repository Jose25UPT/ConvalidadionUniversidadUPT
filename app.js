const CONVALIDABLE_CYCLES = new Set(["I", "II", "III", "IV", "V", "VI"]);

const state = {
  curriculum: null,
  selectedCourse: null,
};

const elements = {
  stats: document.getElementById("stats"),
  cycleFilter: document.getElementById("cycleFilter"),
  onlyConvalidable: document.getElementById("onlyConvalidable"),
  policyCycles: document.getElementById("policyCycles"),
  strictGeneralOnly: document.getElementById("strictGeneralOnly"),
  quickMode: document.getElementById("quickMode"),
  courseSearch: document.getElementById("courseSearch"),
  courseList: document.getElementById("courseList"),
  selectedCourse: document.getElementById("selectedCourse"),
  courseDetailModal: document.getElementById("courseDetailModal"),
  closeCourseDetailModal: document.getElementById("closeCourseDetailModal"),
  courseDetailBody: document.getElementById("courseDetailBody"),
};

init();

async function init() {
  const response = await fetch("./data/curriculum.json");
  state.curriculum = await response.json();

  renderStats();
  renderCycleFilter();
  renderCourseList();

  elements.cycleFilter.addEventListener("change", renderCourseList);
  elements.onlyConvalidable.addEventListener("change", renderCourseList);
  elements.policyCycles.addEventListener("change", renderCourseList);
  elements.strictGeneralOnly.addEventListener("change", renderCourseList);
  elements.quickMode.addEventListener("change", applyQuickMode);
  elements.courseSearch.addEventListener("input", renderCourseList);
  elements.closeCourseDetailModal.addEventListener("click", closeCourseDetails);

  elements.courseDetailModal.addEventListener("click", (event) => {
    if (event.target === elements.courseDetailModal) {
      closeCourseDetails();
    }
  });

  applyQuickMode();
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
    `Creditos del plan: ${state.curriculum.totals.overall}`,
  ];

  elements.stats.innerHTML = chips.map((chip) => `<span class="stat-chip">${chip}</span>`).join("");
}

function renderCycleFilter() {
  const options = ["Todos", ...state.curriculum.cycles.map((cycle) => cycle.name), "Electivos"];
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
      const credits = course.credits ? `${course.credits} creditos` : "Sin creditos";
      const convalidableTag = isCourseEligible(course)
        ? `<span class="tag">Convalidable</span>`
        : `<span class="tag warn">No convalidable</span>`;

      return `
        <li class="course-item ${isActive ? "active" : ""}" data-code="${course.code}">
          <div class="course-code">${course.code} · Ciclo ${course.cycle} ${convalidableTag}</div>
          <div class="course-name">${course.name}</div>
          <div class="course-meta">${credits} · Prerrequisito: ${course.prerequisite || "Ninguno"}</div>
          <div class="course-actions-row">
            <button class="mini-btn detail-btn" type="button" data-action="details" data-code="${course.code}">Ver detalles</button>
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
    Ciclo: ${course.cycle} · Creditos: ${course.credits || "N/A"} · Prerrequisito: ${course.prerequisite || "Ninguno"}<br />
    <em>${policy}</em>
  `;
}

function openCourseDetails(course) {
  const detail = buildCourseDetails(course);
  elements.courseDetailBody.innerHTML = `
    <p><strong>${course.code} - ${course.name}</strong></p>
    <p><strong>Ciclo:</strong> ${course.cycle} · <strong>Creditos:</strong> ${course.credits || "N/A"}</p>
    <p><strong>Horas:</strong> Teoria ${course.ht || 0} · Practica ${course.hp || 0} · Total ${course.th || 0}</p>
    <p><strong>Prerrequisito:</strong> ${course.prerequisite || "Ninguno"}</p>
    <p><strong>Que se dicta:</strong> ${detail.whatIsTaught}</p>
    <p><strong>Que se espera que sepas:</strong> ${detail.whatYouLearn}</p>
  `;

  elements.courseDetailModal.classList.remove("hidden");
}

function closeCourseDetails() {
  elements.courseDetailModal.classList.add("hidden");
}

function buildCourseDetails(course) {
  const name = normalize(course.name);

  const topicMap = [
    { token: "programacion", taught: "fundamentos de programacion, estructuras de control y resolucion de problemas", learn: "desarrollar algoritmos y codificar soluciones funcionales" },
    { token: "base de datos", taught: "modelado de datos, consultas y administracion de informacion", learn: "disenar esquemas y construir consultas eficientes" },
    { token: "matematica", taught: "conceptos matematicos aplicados a ingenieria y computacion", learn: "analizar, abstraer y resolver problemas cuantitativos" },
    { token: "sistemas operativos", taught: "procesos, memoria, archivos y servicios del sistema", learn: "comprender la administracion de recursos del sistema" },
    { token: "redes", taught: "comunicacion de datos, protocolos y arquitectura de redes", learn: "configurar y evaluar soluciones basicas de conectividad" },
    { token: "software", taught: "analisis, diseno y construccion de soluciones de software", learn: "aplicar buenas practicas de desarrollo y calidad" },
    { token: "estadistica", taught: "metodos estadisticos y lectura de datos", learn: "interpretar informacion y sustentar decisiones con evidencia" },
    { token: "tesis", taught: "metodologia de investigacion y desarrollo del proyecto", learn: "formular problemas, objetivos y resultados academicos" },
  ];

  const matched = topicMap.find((topic) => name.includes(topic.token));

  if (matched) {
    return {
      whatIsTaught: `Este curso aborda ${matched.taught}.`,
      whatYouLearn: `Al finalizar, podras ${matched.learn}.`,
    };
  }

  return {
    whatIsTaught:
      "Este curso desarrolla contenidos teoricos y practicos alineados al plan de estudios de Ingenieria de Sistemas.",
    whatYouLearn:
      "Al finalizar, se espera dominio conceptual del tema y capacidad de aplicarlo en ejercicios o proyectos academicos.",
  };
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
