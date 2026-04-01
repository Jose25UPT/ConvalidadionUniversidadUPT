# Convalidaciones UPT - MVP

Aplicación web inicial para evaluar convalidaciones de cursos hacia la Universidad Privada de Tacna (UPT), enfocada en Ingeniería de Sistemas (FAING).

## Qué incluye esta versión

- Convalidación por curso completo (no por subtemas).
- Validación SUNEDU obligatoria antes de registrar/evaluar cursos.
- Visualización de malla UPT por ciclo con filtro por cursos convalidables.
- Política activa por defecto: convalidación de ciclos I al VI.
- Registro de múltiples cursos externos ya aprobados por el estudiante.
- Sugerencia automática de equivalencias UPT para cada curso externo.
- Evaluación final con estado:
  - Aprobable
  - Revisar
  - No equivalente
- Historial local de evaluaciones (guardado en navegador).

## Criterios automáticos usados

La sugerencia se calcula con puntaje sobre 100 considerando:

- Similitud de nombre del curso.
- Diferencia de créditos.
- Cobertura referencial del sílabo (como apoyo, no por subtema detallado).

## Reglas funcionales implementadas

- Si la universidad/programa no está validado por SUNEDU, no permite convalidar.
- No se convalida por subtemas en esta versión; se evalúa curso completo.
- Los cursos fuera de ciclos I-VI se muestran como no convalidables en la política actual.

## Opciones configurables (nueva iteración)

- `Aplicar política referencial de ciclos I al VI`:
  - Activo: prioriza y valida cursos de ciclos I-VI.
  - Inactivo: permite considerar también cursos de ciclos superiores.
- `Modo estricto: solo cursos generales (EG-)`:
  - Activo: solo cursos generales.
  - Inactivo: generales + especialidad según la política activa.
- `Exigir validación SUNEDU obligatoria`:
  - Activo: SUNEDU bloquea o habilita registro/evaluación.
  - Inactivo: uso referencial (simulación).

## Gestión administrativa

- Reporte imprimible desde historial para secretaría.
- Panel de decisión final por coordinador en cada evaluación:
  - Aprobar
  - Observar
  - Rechazar
  - Pendiente

La decisión final siempre debe ser validada por la coordinación académica.

## Estructura del proyecto

- `index.html`: interfaz principal.
- `styles.css`: estilos y diseño responsive.
- `app.js`: lógica de carga, filtrado y evaluación.
- `data/curriculum.json`: malla curricular editable.

## Ejecutar localmente

Desde la raíz del proyecto:

```bash
python3 -m http.server 5500
```

Luego abrir en el navegador:

```text
http://localhost:5500
```

## Próximos pasos recomendados

- Agregar autenticación para evaluadores.
- Exportar historial a PDF o Excel.
- Adjuntar sílabos como evidencia por solicitud.
- Integrar reglas académicas específicas por curso.