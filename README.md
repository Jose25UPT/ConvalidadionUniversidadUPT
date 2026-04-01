# Convalidaciones UPT - MVP

Aplicación web inicial para evaluar convalidaciones de cursos hacia la Universidad Privada de Tacna (UPT), enfocada en Ingeniería de Sistemas (FAING).

## Qué incluye esta versión

- Visualización de cursos por ciclo (I al X) y electivos.
- Búsqueda por código o nombre del curso.
- Formulario para registrar curso de universidad de origen.
- Sugerencia automática de convalidación:
	- Aprobable
	- Revisar
	- No equivalente
- Historial local de evaluaciones (guardado en el navegador).

## Criterios automáticos usados

La sugerencia se calcula con puntaje sobre 100 considerando:

- Similitud de nombre del curso.
- Diferencia de créditos.
- Porcentaje de cobertura de sílabo declarado.

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