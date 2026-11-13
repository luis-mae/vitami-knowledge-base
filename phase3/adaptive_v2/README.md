# VITAMI 2.0 — diseño del cuestionario adaptativo

**Estado:** borrador de diseño, no desplegado ni validado clínicamente.

## Alcance

- Primera pantalla: elegir de 1 a 5 objetivos, ordenados por prioridad (se pueden reordenar).
- Los pesos 5–1 sirven **solo** para ordenar la navegación y presentación, nunca para inventar eficacia ni modificar dosis.
- Perfil común mínimo, seguido por preguntas condicionales deduplicadas.
- Las preguntas específicas de seguridad tienen prioridad absoluta y se mantienen gratuitas.
- Las matrices de dosificación por ingrediente se construirán con evidencia explícita, distinguiendo protocolo estudiado de recomendación aplicable.
- No se modifican el motor actual, los siete escenarios BASIC ni la aplicación Emergent.

## Archivos

- `questionnaire_master.json`: catálogo inicial de objetivos y preguntas comunes.
- `branching_rules_draft.json`: rutas adaptativas propuestas, pendientes de vinculación con IDs canónicos y pruebas.

## Siguiente etapa

Reconciliar preguntas con el banco existente; diseñar matrices de los 15 ingredientes prioritarios; añadir fixtures de navegación y seguridad; revisión científica antes de integración.
