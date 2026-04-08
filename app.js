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
  "EG-781": {
    taught: "se analizan desafios nacionales en un contexto global",
    learn: "podras argumentar sobre problemas del pais con mirada critica",
    tip: "Compara si se abordaron analisis social, economico y geopolitico.",
  },
  "SI-782": {
    taught: "se profundiza administracion avanzada del sistema operativo",
    learn: "podras analizar rendimiento y servicios del sistema",
    tip: "Compara gestion de procesos avanzados, memoria y seguridad.",
  },
  "SI-783": {
    taught: "se trabaja base de datos avanzada con diseno e implementacion",
    learn: "podras optimizar consultas y estructuras de datos persistentes",
    tip: "Valida temas de rendimiento, transacciones y modelado avanzado.",
  },
  "SI-784": {
    taught: "se aplican pruebas de software y aseguramiento de calidad",
    learn: "podras planificar pruebas y detectar fallos con metodo",
    tip: "Compara pruebas unitarias, integracion y gestion de calidad.",
  },
  "SI-785": {
    taught: "se gestiona proyectos TI en tiempo, costo y alcance",
    learn: "podras planificar y controlar proyectos tecnologicos",
    tip: "Compara si hubo cronogramas, riesgos y seguimiento de proyecto.",
  },
  "SI-786": {
    taught: "se desarrolla programacion web con enfoque full stack inicial",
    learn: "podras crear aplicaciones web con interfaz y logica",
    tip: "Compara stack tecnologico y nivel de proyecto web.",
  },
  "SI-881": {
    taught: "se introducen tecnicas de inteligencia artificial",
    learn: "podras resolver casos basicos con metodos de IA",
    tip: "Compara algoritmos y practicas aplicadas con datos.",
  },
  "SI-882": {
    taught: "se estudian redes de datos, protocolos y topologias",
    learn: "podras comprender diseno y operacion de redes",
    tip: "Compara capas de red, direccionamiento y practicas de conectividad.",
  },
  "SI-883": {
    taught: "se crean soluciones moviles para casos reales",
    learn: "podras desarrollar aplicaciones moviles funcionales",
    tip: "Compara framework movil, interfaz y consumo de servicios.",
  },
  "SI-884": {
    taught: "se aplican metodos inferenciales para analisis de datos",
    learn: "podras concluir con soporte estadistico y analitico",
    tip: "Compara inferencia, pruebas de hipotesis y lectura de resultados.",
  },
  "SI-885": {
    taught: "se trabaja inteligencia de negocios para decisiones empresariales",
    learn: "podras transformar datos en informacion para gestion",
    tip: "Compara dashboards, modelado BI y analisis de indicadores.",
  },
  "SI-886": {
    taught: "se alinea estrategia TI con objetivos de negocio",
    learn: "podras proponer planes estrategicos de tecnologia",
    tip: "Compara planificacion estrategica, gobierno TI y priorizacion.",
  },
  "SI-981": {
    taught: "se formula proyecto de tesis y estructura de investigacion",
    learn: "podras definir problema, objetivos y metodologia",
    tip: "Compara entregables academicos exigidos en el curso.",
  },
  "SI-982": {
    taught: "se profundiza desarrollo web con componentes avanzados",
    learn: "podras implementar aplicaciones web mas completas",
    tip: "Compara arquitectura web, seguridad y despliegue.",
  },
  "SI-983": {
    taught: "se construyen soluciones de software con enfoque de ingenieria",
    learn: "podras aplicar buenas practicas de construccion y calidad",
    tip: "Compara niveles de arquitectura, pruebas e integracion.",
  },
  "SI-984": {
    taught: "se profundizan tecnologias de redes y comunicacion",
    learn: "podras configurar y evaluar redes de mayor complejidad",
    tip: "Compara routing, switching y practicas de laboratorio.",
  },
  "SI-985": {
    taught: "se gestiona configuracion y control de versiones en software",
    learn: "podras mantener trazabilidad y control de cambios",
    tip: "Compara uso de repositorios, ramas y procesos de liberacion.",
  },
  "SI-986": {
    taught: "se fortalece ingles tecnico para tecnologia e ingenieria",
    learn: "podras leer y comunicarte en contexto tecnico en ingles",
    tip: "Compara vocabulario tecnico, lecturas y ejercicios practicos.",
  },
  "SI-082": {
    taught: "se revisa seguridad de informacion, riesgos y controles",
    learn: "podras identificar vulnerabilidades y proponer mejoras",
    tip: "Compara temas de seguridad, normas y gestion de incidentes.",
  },
  "SI-083": {
    taught: "se desarrolla construccion avanzada de software",
    learn: "podras entregar soluciones robustas con calidad tecnica",
    tip: "Compara complejidad de proyecto, integracion y calidad de codigo.",
  },
  "SI-084": {
    taught: "se auditan sistemas para evaluar cumplimiento y control",
    learn: "podras analizar procesos TI con enfoque de auditoria",
    tip: "Compara marcos de control, evidencias y recomendaciones.",
  },
  "SI-085": {
    taught: "se trabajan emprendimiento, liderazgo y propuesta de valor",
    learn: "podras plantear iniciativas con enfoque de negocio",
    tip: "Compara plan de negocio, liderazgo y validacion de idea.",
  },
  "SI-086": {
    taught: "se estudia gestion y direccion estrategica de TI",
    learn: "podras tomar decisiones gerenciales sobre tecnologia",
    tip: "Compara gobierno TI, presupuesto y alineamiento estrategico.",
  },
  "SI-080": {
    taught: "se culmina el trabajo de investigacion con resultados finales",
    learn: "podras sustentar formalmente tu investigacion",
    tip: "Compara entregables finales, informe y sustentacion.",
  },
  "SI-8810": {
    taught: "se revisan sistemas ERP y su aplicacion empresarial",
    learn: "podras entender integracion de procesos en plataformas ERP",
    tip: "Compara modulos ERP, procesos y casos de implementacion.",
  },
  "SI-8811": {
    taught: "se estudian tecnicas avanzadas de base de datos",
    learn: "podras optimizar y administrar estructuras complejas de datos",
    tip: "Compara tuning, administracion avanzada y consultas complejas.",
  },
  "SI-887": {
    taught: "se desarrolla internet de las cosas con dispositivos y sensores",
    learn: "podras integrar componentes IoT para resolver problemas",
    tip: "Compara protocolos IoT, hardware y servicios de datos.",
  },
  "SI-888": {
    taught: "se disenan videojuegos con enfoque tecnico y creativo",
    learn: "podras construir prototipos jugables",
    tip: "Compara motor de juego, logica y diseno de niveles.",
  },
  "SI-889": {
    taught: "se aplican patrones de software para mejorar diseno de soluciones",
    learn: "podras estructurar codigo reutilizable y mantenible",
    tip: "Compara patrones creacionales, estructurales y de comportamiento.",
  },
  "SI-987": {
    taught: "se estudia computacion en la nube y arquitectura cloud",
    learn: "podras desplegar servicios en entornos cloud",
    tip: "Compara servicios IaaS/PaaS/SaaS y practicas de despliegue.",
  },
  "SI-988": {
    taught: "se profundiza el desarrollo movil en escenarios avanzados",
    learn: "podras integrar funcionalidades moviles de mayor complejidad",
    tip: "Compara integraciones, rendimiento y arquitectura movil.",
  },
  "SI-989": {
    taught: "se aplican algoritmos de aprendizaje automatico",
    learn: "podras entrenar y evaluar modelos de machine learning",
    tip: "Compara pipeline de datos, entrenamiento y metricas.",
  },
  "SI-087": {
    taught: "se estudia infraestructura TI para soporte de servicios",
    learn: "podras planificar recursos de infraestructura tecnologica",
    tip: "Compara servidores, virtualizacion y capacidad operativa.",
  },
  "SI-088": {
    taught: "se construyen modelos de negocio digitales",
    learn: "podras plantear propuestas digitales con viabilidad",
    tip: "Compara canvas, propuesta de valor y validacion de mercado.",
  },
  "SI-089": {
    taught: "se profundizan topicos avanzados de bases de datos",
    learn: "podras resolver problemas complejos de almacenamiento y consulta",
    tip: "Compara arquitectura avanzada y administracion especializada.",
  },
};

const state = {
  curriculum: null,
  meta: null,
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

  elements.cycleFilter.addEventListener("change", renderCourseList);
  elements.onlyConvalidable.addEventListener("change", renderCourseList);
  elements.policyCycles.addEventListener("change", renderCourseList);
  elements.strictGeneralOnly.addEventListener("change", renderCourseList);
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
  const usesNewFormat = Array.isArray(raw.ciclos);

  if (usesNewFormat) {
    const cycles = raw.ciclos.map((item) => item.ciclo);
    const courses = [];

    raw.ciclos.forEach((cycle) => {
      cycle.cursos.forEach((course) => {
        courses.push({
          code: course.codigo,
          name: course.nombre,
          credits: course.creditos,
          ht: course.ht,
          hp: course.hp,
          th: course.th,
          prerequisite: course.prerrequisito,
          cycle: cycle.ciclo,
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
        totalCredits: raw.metadata?.creditos_totales || raw.metadata?.total_creditos || 0,
        requiredCredits: raw.metadata?.creditos_obligatorios || raw.metadata?.creditos_totales || raw.metadata?.total_creditos || 0,
      },
      cycles: [...cycles, "Electivos"],
      courses,
    };
  }

  const cycles = raw.cycles.map((item) => item.name);
  const courses = [];

  raw.cycles.forEach((cycle) => {
    cycle.courses.forEach((course) => {
      courses.push({
        ...course,
        code: course.code,
        name: course.name,
        credits: course.credits,
        ht: course.ht,
        hp: course.hp,
        th: course.th,
        prerequisite: course.prerequisite,
        cycle: cycle.name,
        objective: "",
        activities: [],
        evidences: [],
        checklist: [],
      });
    });
  });

  (raw.electives || []).forEach((course) => {
    courses.push({
      ...course,
      code: course.code,
      name: course.name,
      credits: course.credits,
      ht: 0,
      hp: 0,
      th: 0,
      prerequisite: course.prerequisite,
      cycle: "Electivo",
      objective: "",
      activities: [],
      evidences: [],
      checklist: [],
    });
  });

  return {
    meta: {
      totalCredits: raw.totals?.overall || 0,
      requiredCredits: raw.totals?.obligatory || 0,
    },
    cycles: [...cycles, "Electivos"],
    courses,
  };
}

function renderStats() {
  const coursesCount = state.courses.filter((course) => course.cycle !== "Electivo").length;
  const convalidables = state.courses.filter((course) => CONVALIDABLE_CYCLES.has(course.cycle)).length;

  const chips = [
    `Ciclos: ${state.cycles.filter((cycle) => cycle !== "Electivos").length}`,
    `Cursos obligatorios: ${coursesCount}`,
    `Convalidables I-VI: ${convalidables}`,
    `Creditos del plan: ${state.meta.totalCredits || 0}`,
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
  const detail = buildCourseDetails(course);
  const activities = renderBulletList(course.activities);
  const evidences = renderBulletList(course.evidences);
  const checklist = renderBulletList(course.checklist);
  const objective = escapeHtml(course.objective || detail.whatIsTaught);

  elements.courseDetailBody.innerHTML = `
    <p><strong>${course.code} - ${course.name}</strong></p>
    <p><strong>Ciclo:</strong> ${course.cycle} · <strong>Creditos:</strong> ${course.credits || "N/A"}</p>
    <p><strong>Horas:</strong> Teoria ${course.ht || 0} · Practica ${course.hp || 0} · Total ${course.th || 0}</p>
    <p><strong>Prerrequisito:</strong> ${course.prerequisite || "Ninguno"}</p>
    <p><strong>Que aprenderas:</strong> ${objective}</p>
    <p><strong>Que se hace en este curso:</strong> ${detail.whatIsTaught}</p>
    <p><strong>Que deberias saber al terminar:</strong> ${detail.whatYouLearn}</p>
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

function buildCourseDetails(course) {
  const name = normalize(course.name);
  const code = String(course.code || "");

  if (course.objective || (course.activities && course.activities.length > 0) || (course.checklist && course.checklist.length > 0)) {
    return {
      whatIsTaught: (course.objective || "se desarrollan contenidos teorico-practicos del curso.").trim(),
      whatYouLearn:
        course.checklist?.[0] ||
        course.evidences?.[0] ||
        "se espera dominio de los temas centrales y aplicacion en actividades evaluadas.",
    };
  }

  const exact = COURSE_PROFILES[code];
  if (exact) {
    return {
      whatIsTaught: `En este curso ${exact.taught}.`,
      whatYouLearn: `Al terminar, ${exact.learn}.`,
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
    };
  }

  if (code.startsWith("EG-")) {
    return {
      whatIsTaught: "se desarrollan competencias generales para tu formacion universitaria.",
      whatYouLearn: "tendras una base academica transversal para los siguientes ciclos.",
    };
  }

  if (code.startsWith("SI-") || code.startsWith("INE-")) {
    return {
      whatIsTaught: `se abordan contenidos tecnicos asociados a ${course.name.toLowerCase()}.`,
      whatYouLearn: "podras aplicar estos conceptos en practicas, laboratorios o proyectos.",
    };
  }

  return {
    whatIsTaught: `en ${course.name.toLowerCase()} se trabajan contenidos teoricos y practicos del plan de estudios.`,
    whatYouLearn: "al terminar, deberias entender los conceptos clave y aplicarlos en ejercicios.",
  };
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
      credits: course.credits || "N/A",
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
  const totalRequired = Number(state.meta?.requiredCredits || state.meta?.totalCredits || 0);
  const selectedCredits = state.selectedCourses.reduce((acc, item) => acc + Number(item.credits || 0), 0);
  const rawPercent = totalRequired > 0 ? (selectedCredits / totalRequired) * 100 : 0;
  const percent = Math.max(0, Math.min(100, Math.round(rawPercent)));

  elements.progressFill.style.width = `${percent}%`;
  elements.progressPercent.textContent = `${percent}%`;
  elements.progressText.textContent = `Creditos seleccionados: ${selectedCredits} de ${totalRequired || "N/A"}`;

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

  // Trigger a subtle pulse animation when value changes.
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

  // Force reflow to restart the fade animation when repeated quickly.
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

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
