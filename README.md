# Convalidaciones UPT - MVP

Aplicación web inicial para evaluar convalidaciones de cursos hacia la Universidad Privada de Tacna (UPT), enfocada en Ingeniería de Sistemas (FAING).

## Qué incluye esta versión

- Flujo rápido en una sola pantalla.
- Lista de cursos UPT con filtros por ciclo y política activa.
- Botón `Ver detalles` por curso con explicación sencilla:
  - Qué se hace en el curso.
  - Qué deberías saber al terminar.
  - Consejo breve para comparar equivalencia.
- Botón `Agregar a mi lista` para registrar 2 o más cursos a convalidar.
- Lista local de cursos seleccionados para la solicitud.

## Reglas funcionales implementadas

- No se convalida por subtemas en esta versión; se evalúa curso completo como referencia.
- Los cursos fuera de ciclos I-VI se muestran como no convalidables en la política actual.
- La lista de cursos seleccionados se guarda en el navegador del usuario.

## Opciones configurables (nueva iteración)

- `Aplicar política referencial de ciclos I al VI`:
  - Activo: prioriza y valida cursos de ciclos I-VI.
  - Inactivo: permite considerar también cursos de ciclos superiores.
- `Modo estricto: solo cursos generales (EG-)`:
  - Activo: solo cursos generales.
  - Inactivo: generales + especialidad según la política activa.
- `Modo rápido (menos texto y flujo corto)`:
  - Activo: oculta textos secundarios para navegar más rápido.

## Importante

Esta herramienta es una simulación de apoyo para el estudiante.
La validación final de convalidación siempre está sujeta a evaluación oficial de la universidad y la escuela profesional correspondiente.

## Estructura del proyecto

- `index.html`: interfaz principal.
- `styles.css`: estilos y diseño responsive.
- `app.js`: lógica de carga, filtrado, detalle y selección de cursos.
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

- Agregar resumen académico real por curso directamente en `data/curriculum.json`.
- Permitir exportar la lista de cursos seleccionados a PDF.
- Añadir formulario final de envío para secretaría académica.