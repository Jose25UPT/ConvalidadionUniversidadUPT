const CONVALIDABLE_CYCLES = new Set(["I", "II", "III", "IV", "V", "VI"]);

const COURSE_PROFILES = {
  "EG-181": {
    taught: "se practica comunicacion escrita y oral para el entorno universitario",
    learn: "podras redactar textos academicos y exponer ideas con claridad",
    tip: "Compara si tu curso tuvo redaccion, argumentacion y exposicion.",
  },
  "EG-182": {
    taught: "se refuerzan fundamentos matematicos para carreras de ingenieria",
    learn: "podras resolver ejercicios base de algebra y funciones",
    tip: "Revisa temas y nivel de practica semanal.",
  },
  "EG-183": {
    taught: "se desarrollan estrategias de estudio y organizacion del aprendizaje",
    learn: "podras estudiar de forma autonoma y planificada",
    tip: "Busca evidencias de tecnicas de estudio y gestion del tiempo.",
  },
  "EG-184": {
    taught: "se trabajan liderazgo, desarrollo personal y habilidades sociales",
    learn: "podras participar mejor en equipos y asumir roles de liderazgo",
    tip: "Compara actividades grupales y dinamicas de liderazgo.",
  },
  "EG-185": {
    taught: "se usan herramientas digitales para productividad academica",
    learn: "podras aplicar recursos digitales en tareas y presentaciones",
    tip: "Valida si hubo trabajo practico con herramientas ofimaticas.",
  },
  "INE-186": {
    taught: "se estudian temas de matematica aplicada al analisis ingenieril",
    learn: "podras resolver problemas matematicos con mayor rigor",
    tip: "Compara contenidos y dificultad de evaluaciones.",
  },
  "EG-281": {
    taught: "se profundiza la comunicacion academica y profesional",
    learn: "podras elaborar textos mas tecnicos y sustentar argumentos",
    tip: "Compara si hubo ensayo, informe tecnico y exposicion.",
  },
  "EG-282": {
    taught: "se analizan temas de territorio, defensa y seguridad nacional",
    learn: "podras comprender el contexto nacional desde una mirada civica",
    tip: "Compara unidades de historia, geografia politica y ciudadania.",
  },
  "EG-283": {
    taught: "se revisan corrientes filosoficas y pensamiento critico",
    learn: "podras analizar ideas y argumentar con mayor fundamento",
    tip: "Compara autores, corrientes y actividades de analisis.",
  },
  "INE-284": {
    taught: "se introducen algoritmos, estructuras de control y logica de programacion",
    learn: "podras crear programas basicos para resolver problemas",
    tip: "Compara practicas de laboratorio y lenguaje usado.",
  },
  "INE-285": {
    taught: "se aplican principios fisicos en ejercicios y problemas basicos",
    learn: "podras interpretar fenomenos fisicos en contextos de ingenieria",
    tip: "Valida si hubo laboratorio o sesiones practicas.",
  },
  "INE-286": {
    taught: "se profundizan contenidos matematicos de nivel intermedio",
    learn: "podras resolver ejercicios avanzados para cursos posteriores",
    tip: "Compara temas centrales y horas de practica.",
  },
  "INE-381": {
    taught: "se estudian fundamentos economicos aplicados a la toma de decisiones",
    learn: "podras analizar costos, mercado y decisiones basicas",
    tip: "Compara si se trabajaron casos de analisis economico.",
  },
  "EG-382": {
    taught: "se discuten principios eticos en la vida profesional",
    learn: "podras evaluar decisiones considerando responsabilidad y valores",
    tip: "Busca temas de etica profesional y analisis de casos.",
  },
  "INE-383": {
    taught: "se trabajan estadistica descriptiva y probabilidad",
    learn: "podras interpretar datos y calcular indicadores estadisticos",
    tip: "Compara distribuciones, tablas y ejercicios de probabilidad.",
  },
  "SI-384": {
    taught: "se estudian estructuras de datos para organizar informacion eficientemente",
    learn: "podras elegir e implementar estructuras segun el problema",
    tip: "Verifica si se incluyeron listas, pilas, colas y arboles.",
  },
  "SI-385": {
    taught: "se analiza el rol de los sistemas de informacion en organizaciones",
    learn: "podras identificar procesos y necesidades de informacion",
    tip: "Compara modelado de procesos y analisis organizacional.",
  },
  "SI-386": {
    taught: "se revisan logica matematica, relaciones y estructuras discretas",
    learn: "podras modelar problemas de computacion con base formal",
    tip: "Compara logica, conjuntos, relaciones y grafos.",
  },
  "SI-481": {
    taught: "se modelan procesos para mejorar operaciones y flujos de trabajo",
    learn: "podras mapear y optimizar procesos en contextos reales",
    tip: "Compara BPM, diagramacion y propuestas de mejora.",
  },
  "SI-482": {
    taught: "se evalua la rentabilidad de proyectos con criterios economicos",
    learn: "podras sustentar decisiones con indicadores financieros",
    tip: "Verifica temas como VAN, TIR y flujo de caja.",
  },
  "SI-483": {
    taught: "se disenan interfaces centradas en el usuario",
    learn: "podras crear prototipos y evaluar usabilidad basica",
    tip: "Compara si hubo wireframes, prototipos y pruebas de usuario.",
  },
  "INE-484": {
    taught: "se desarrollan proyectos de diseno en el contexto de ingenieria",
    learn: "podras aplicar metodologia de diseno a problemas tecnicos",
    tip: "Compara fases de diseno, entregables y nivel de proyecto.",
  },
  "SI-485": {
    taught: "se estudia logica digital y funcionamiento de sistemas electronicos",
    learn: "podras interpretar circuitos digitales basicos",
    tip: "Compara si se vieron compuertas logicas y diseno digital.",
  },
  "SI-486": {
    taught: "se profundiza programacion con enfoque practico",
    learn: "podras construir programas mejor estructurados",
    tip: "Compara proyectos, lenguaje y nivel de complejidad.",
  },
  "SI-581": {
    taught: "se estudia organizacion interna de computadoras y arquitectura",
    learn: "podras entender como interactuan hardware y software",
    tip: "Compara temas de CPU, memoria y buses.",
  },
  "SI-582": {
    taught: "se disenan bases de datos relacionales desde el modelado",
    learn: "podras construir esquemas y consultas SQL",
    tip: "Compara modelo ER, normalizacion y consultas.",
  },
  "SI-583": {
    taught: "se desarrolla modelamiento virtual para representar soluciones",
    learn: "podras crear modelos visuales de sistemas o productos",
    tip: "Compara herramientas de modelado y entregables practicos.",
  },
  "SI-584": {
    taught: "se levantan y documentan requerimientos de sistemas",
    learn: "podras definir requisitos funcionales y no funcionales",
    tip: "Compara casos de uso, historias de usuario o especificaciones.",
  },
  "SI-585": {
    taught: "se cubre el proceso de desarrollo de software con buenas practicas",
    learn: "podras planificar y construir software de forma ordenada",
    tip: "Compara ciclo de vida, metodologias y documentacion.",
  },
  "SI-586": {
    taught: "se avanza en programacion orientada a aplicaciones de mayor complejidad",
    learn: "podras implementar soluciones mas robustas",
    tip: "Compara proyectos finales y criterios de evaluacion.",
  },
  "EG-681": {
    taught: "se analizan temas de ecologia y sostenibilidad",
    learn: "podras relacionar desarrollo profesional con responsabilidad ambiental",
    tip: "Compara contenidos de sostenibilidad y analisis de impacto.",
  },
  "SI-682": {
    taught: "se estudia administracion de procesos, memoria y recursos del sistema operativo",
    learn: "podras comprender el funcionamiento interno de un sistema operativo",
    tip: "Compara procesos, hilos, memoria y planificacion.",
  },
  "SI-683": {
    taught: "se implementan bases de datos y consultas de nivel intermedio",
    learn: "podras manipular datos y optimizar consultas basicas",
    tip: "Compara SQL intermedio, vistas y procedimientos segun el silabo.",
  },
  "SI-684": {
    taught: "se aplican modelos matematicos para optimizar decisiones",
    learn: "podras resolver problemas de optimizacion en escenarios reales",
    tip: "Verifica si se incluyeron programacion lineal y modelos de decision.",
  },
  "SI-685": {
    taught: "se disena software desde la arquitectura y componentes",
    learn: "podras estructurar soluciones escalables y mantenibles",
    tip: "Compara patrones, arquitectura por capas y decisiones tecnicas.",
  },
  "SI-686": {
    taught: "se desarrolla programacion avanzada con enfoque practico",
    learn: "podras crear aplicaciones completas con mejor calidad de codigo",
    tip: "Compara nivel de proyecto, pruebas y complejidad tecnica.",
  },
};

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
    Ciclo: ${course.cycle} · Creditos: ${course.credits || "N/A"} · Prerrequisito: ${course.prerequisite || "Ninguno"}
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
  const code = String(course.code || "");

  const exact = COURSE_PROFILES[code];
  if (exact) {
    return {
      whatIsTaught: `En este curso ${exact.taught}.`,
      whatYouLearn: `Al terminar, ${exact.learn}.`,
      studentTip: exact.tip,
    };
  }

  const has = (...tokens) => tokens.some((token) => name.includes(token));

  const rules = [
    {
      match: () => has("comunicacion"),
      taught: "se practican lectura, redaccion y exposicion de ideas",
      learn: "podras comunicarte mejor en informes y presentaciones",
      tip: "Compara si tu curso tuvo redaccion academica y exposicion oral.",
    },
    {
      match: () => has("aprendizaje", "autonomo"),
      taught: "se trabajan tecnicas de estudio, organizacion y gestion del tiempo",
      learn: "podras estudiar con mas orden y autonomia",
      tip: "Revisa si en tu silabo hubo estrategias de aprendizaje y autoevaluacion.",
    },
    {
      match: () => has("liderazgo", "desarrollo personal", "emprendimiento"),
      taught: "se fortalecen habilidades blandas, liderazgo y trabajo en equipo",
      learn: "podras participar y liderar mejor en proyectos grupales",
      tip: "Busca evidencias de dinamicas grupales, liderazgo y presentaciones.",
    },
    {
      match: () => has("competencias digitales"),
      taught: "se usan herramientas digitales para productividad y colaboracion",
      learn: "podras aplicar herramientas informaticas en tareas academicas",
      tip: "Compara si trabajaron ofimatica, colaboracion en linea y presentaciones.",
    },
    {
      match: () => has("matematica discreta"),
      taught: "se estudian logica, conjuntos, relaciones y grafos",
      learn: "podras modelar problemas de computacion con razonamiento logico",
      tip: "Verifica temas de logica proposicional y grafos.",
    },
    {
      match: () => has("matematica"),
      taught: "se refuerzan bases matematicas para resolver problemas de ingenieria",
      learn: "podras resolver ejercicios numericos con mayor precision",
      tip: "Compara unidades tematicas y nivel de practicas.",
    },
    {
      match: () => has("fisica"),
      taught: "se revisan principios fisicos y su aplicacion en ejercicios",
      learn: "podras interpretar y resolver problemas fisicos basicos",
      tip: "Mira si hubo laboratorio o practicas aplicadas.",
    },
    {
      match: () => has("tecnicas de programacion"),
      taught: "se introducen algoritmos, variables, condicionales y ciclos",
      learn: "podras construir programas basicos para resolver problemas",
      tip: "Compara si hubo practicas de laboratorio y ejercicios de algoritmo.",
    },
    {
      match: () => has("programacion web"),
      taught: "se crean aplicaciones web con interfaz, logica y manejo de datos",
      learn: "podras desarrollar modulos web funcionales",
      tip: "Verifica si se trabajo HTML, CSS, JavaScript y servicios.",
    },
    {
      match: () => has("programacion"),
      taught: "se profundiza en codigo, estructuras y buenas practicas",
      learn: "podras desarrollar software con mejor estructura",
      tip: "Compara lenguaje usado, proyectos y nivel de complejidad.",
    },
    {
      match: () => has("estructura de datos"),
      taught: "se trabajan listas, pilas, colas, arboles y busqueda",
      learn: "podras elegir la estructura adecuada para cada problema",
      tip: "Valida si se implementaron estructuras lineales y no lineales.",
    },
    {
      match: () => has("base de datos"),
      taught: "se estudia modelado de datos, normalizacion y SQL",
      learn: "podras disenar bases de datos y hacer consultas",
      tip: "Revisa temas de modelo ER, SQL y consultas avanzadas.",
    },
    {
      match: () => has("requerimientos"),
      taught: "se identifican necesidades del usuario y se documentan requisitos",
      learn: "podras redactar requisitos claros para un sistema",
      tip: "Compara si trabajaron casos de uso o historias de usuario.",
    },
    {
      match: () => has("ingenieria de software", "arquitectura de software", "construccion de software", "calidad"),
      taught: "se cubren analisis, diseno, desarrollo y calidad de software",
      learn: "podras construir soluciones con enfoque profesional",
      tip: "Busca coincidencias en ciclo de vida, pruebas y documentacion.",
    },
    {
      match: () => has("sistemas operativos"),
      taught: "se analiza como el sistema operativo gestiona procesos y memoria",
      learn: "podras explicar funcionamiento interno de un sistema operativo",
      tip: "Verifica si se incluyeron procesos, hilos y memoria.",
    },
    {
      match: () => has("redes", "comunicacion de datos"),
      taught: "se estudian protocolos, direccionamiento y configuracion de redes",
      learn: "podras entender conectividad y comunicacion entre equipos",
      tip: "Compara si se trabajo OSI/TCP-IP, subredes y practicas de red.",
    },
    {
      match: () => has("estadistica", "probabilidades", "analisis de datos"),
      taught: "se aplican metodos estadisticos para analizar informacion",
      learn: "podras sustentar decisiones con datos",
      tip: "Revisa si hubo inferencia, distribuciones y analisis de resultados.",
    },
    {
      match: () => has("economia", "financiera"),
      taught: "se revisan costos, inversion y evaluacion economica",
      learn: "podras analizar viabilidad economica de proyectos",
      tip: "Busca temas como flujo de caja, VAN o TIR.",
    },
    {
      match: () => has("sistemas de informacion", "modelamiento de procesos"),
      taught: "se analiza como la informacion apoya procesos de una organizacion",
      learn: "podras modelar procesos y proponer mejoras",
      tip: "Compara si el curso incluyo modelado de procesos y analisis organizacional.",
    },
    {
      match: () => has("inteligencia artificial", "machine learning"),
      taught: "se introducen metodos de IA y modelos predictivos",
      learn: "podras aplicar tecnicas basicas de inteligencia artificial",
      tip: "Revisa algoritmos vistos y practicas con datos.",
    },
    {
      match: () => has("tesis", "investigacion"),
      taught: "se desarrolla metodologia de investigacion y avance academico",
      learn: "podras plantear problema, objetivos y resultados esperados",
      tip: "Compara entregables: propuesta, marco teorico y avance.",
    },
  ];

  const matched = rules.find((item) => item.match());

  if (matched) {
    return {
      whatIsTaught: `En este curso ${matched.taught}.`,
      whatYouLearn: `Al terminar, ${matched.learn}.`,
      studentTip: matched.tip,
    };
  }

  if (code.startsWith("EG-")) {
    return {
      whatIsTaught: "se desarrollan competencias generales para tu formacion universitaria.",
      whatYouLearn: "tendras una base academica transversal para los siguientes ciclos.",
      studentTip: "Compara resultados de aprendizaje y competencias generales.",
    };
  }

  if (code.startsWith("SI-") || code.startsWith("INE-")) {
    return {
      whatIsTaught: `se abordan contenidos tecnicos asociados a ${course.name.toLowerCase()}.`,
      whatYouLearn: "podras aplicar estos conceptos en practicas, laboratorios o proyectos.",
      studentTip: "Compara temas, horas practicas y nivel de trabajo aplicado.",
    };
  }

  return {
    whatIsTaught: `en ${course.name.toLowerCase()} se trabajan contenidos teoricos y practicos del plan de estudios.`,
    whatYouLearn: "al terminar, deberias entender los conceptos clave y aplicarlos en ejercicios.",
    studentTip: "si no coincide el nombre, compara temas, practicas y logros del curso.",
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
    elements.selectedCoursesList.innerHTML = "<p class=\"selected-empty\">Aun no agregaste cursos. Usa \"Agregar\" para empezar.</p>";
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
