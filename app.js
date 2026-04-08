const CONVALIDABLE_CYCLES = new Set(["I", "II", "III", "IV", "V", "VI"]);

const state = {
  curriculum: null,
  selectedCourse: null,
  selectedCourses: loadSelectedCourses(),
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
  selectedCoursesList: document.getElementById("selectedCoursesList"),
  clearSelectedBtn: document.getElementById("clearSelectedBtn"),
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
  renderSelectedCourses();

  elements.cycleFilter.addEventListener("change", renderCourseList);
  elements.onlyConvalidable.addEventListener("change", renderCourseList);
  elements.policyCycles.addEventListener("change", renderCourseList);
  elements.strictGeneralOnly.addEventListener("change", renderCourseList);
  elements.quickMode.addEventListener("change", applyQuickMode);
  elements.courseSearch.addEventListener("input", renderCourseList);
  elements.clearSelectedBtn.addEventListener("click", clearSelectedCourses);
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
      const inSelection = state.selectedCourses.some((item) => item.code === course.code);
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
            <button class="mini-btn add-btn ${inSelection ? "active" : ""}" type="button" data-action="toggle-select" data-code="${course.code}">
              ${inSelection ? "Quitar de mi lista" : "Agregar a mi lista"}
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
      if (!selected) {
        return;
      }
      toggleCourseSelection(selected);
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
    <p><strong>Que se hace en este curso:</strong> ${detail.whatIsTaught}</p>
    <p><strong>Que deberias saber al terminar:</strong> ${detail.whatYouLearn}</p>
    <p><strong>Nota para el estudiante:</strong> ${detail.studentTip}</p>
  `;

  elements.courseDetailModal.classList.remove("hidden");
}

function closeCourseDetails() {
  elements.courseDetailModal.classList.add("hidden");
}

function buildCourseDetails(course) {
  const name = normalize(course.name);

  const topicMap = [
    {
      token: "programacion",
      taught: "aprenderas a resolver problemas con codigo, usando variables, condicionales, ciclos y funciones",
      learn: "podras crear programas basicos y entender como mejorar su estructura",
      tip: "Si ya llevaste un curso parecido, compara proyectos o practicas que realizaste."
    },
    {
      token: "base de datos",
      taught: "veras como organizar informacion en tablas, relacionarla y hacer consultas",
      learn: "podras disenar una base de datos simple y obtener informacion con consultas SQL",
      tip: "Busca en tu silabo temas como modelo entidad-relacion, normalizacion y SQL."
    },
    {
      token: "matematica",
      taught: "reforzaras razonamiento numerico y metodos para resolver ejercicios de ingenieria",
      learn: "podras plantear y resolver problemas matematicos aplicados a tecnologia",
      tip: "Compara unidades tematicas y nivel de ejercicios entre ambos cursos."
    },
    {
      token: "sistemas operativos",
      taught: "conoceras como funciona el sistema operativo y como administra recursos",
      learn: "podras explicar procesos, memoria y archivos en un entorno real",
      tip: "Revisa si en tu curso previo trabajaste procesos, hilos y administracion de memoria."
    },
    {
      token: "redes",
      taught: "estudiaras comunicacion de datos, protocolos y configuraciones de red",
      learn: "podras identificar componentes de red y entender su funcionamiento basico",
      tip: "Compara si viste modelo OSI/TCP-IP, direccionamiento y practicas de conectividad."
    },
    {
      token: "software",
      taught: "trabajaras analisis, diseno y construccion de soluciones de software",
      learn: "podras documentar requisitos y aplicar buenas practicas en desarrollo",
      tip: "Sirve como equivalencia cuando tu curso tuvo analisis, diseno y desarrollo de sistemas."
    },
    {
      token: "estadistica",
      taught: "aprenderas a interpretar datos, calcular medidas y analizar resultados",
      learn: "podras sustentar decisiones con evidencia numerica",
      tip: "Revisa si hubo uso de tablas, distribuciones y analisis de resultados."
    },
    {
      token: "tesis",
      taught: "desarrollaras metodologia de investigacion y estructura de proyecto academico",
      learn: "podras plantear problema, objetivos y avances de investigacion",
      tip: "Compara entregables como planteamiento, marco teorico y avance de proyecto."
    },
  ];

  const matched = topicMap.find((topic) => name.includes(topic.token));

  if (matched) {
    return {
      whatIsTaught: `En este curso ${matched.taught}.`,
      whatYouLearn: `Al terminar, ${matched.learn}.`,
      studentTip: matched.tip,
    };
  }

  return {
    whatIsTaught: "En este curso se trabajan contenidos teoricos y practicos del plan de Ingenieria de Sistemas.",
    whatYouLearn: "Al terminar, deberias entender los conceptos clave y aplicarlos en ejercicios o proyectos.",
    studentTip: "Si no coincide el nombre, compara temas, practicas y resultados de aprendizaje.",
  };
}

function toggleCourseSelection(course) {
  const exists = state.selectedCourses.some((item) => item.code === course.code);

  if (exists) {
    state.selectedCourses = state.selectedCourses.filter((item) => item.code !== course.code);
  } else {
    state.selectedCourses.push({
      code: course.code,
      name: course.name,
      cycle: course.cycle,
      credits: course.credits || "N/A",
    });
  }

  saveSelectedCourses(state.selectedCourses);
  renderSelectedCourses();
  renderCourseList();
}

function renderSelectedCourses() {
  if (state.selectedCourses.length === 0) {
    elements.selectedCoursesList.innerHTML = "<p class=\"selected-empty\">Aun no agregaste cursos. Usa \"Agregar a mi lista\" para empezar.</p>";
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
    });
  });
}

function clearSelectedCourses() {
  state.selectedCourses = [];
  saveSelectedCourses(state.selectedCourses);
  renderSelectedCourses();
  renderCourseList();
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
