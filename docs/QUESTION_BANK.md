# Banco maestro de preguntas — Fase 1C

Este archivo define qué información Vitami debe ser capaz de solicitar al usuario antes de construir reglas clínicas definitivas.

## Principios

1. La inclusión de una pregunta NO implica que una respuesta active un suplemento.
2. Las preguntas BASIC deben ser pocas, simples y mayormente estructuradas.
3. Las preguntas de seguridad se evalúan antes que las reglas positivas.
4. Síntomas como fatiga, uñas/cabello o molestias digestivas son inespecíficos y solo podrán actuar como factores secundarios.
5. Si una futura regla requiere un dato que el banco no recoge, se agrega una pregunta o se limita la regla.
6. Si una pregunta no termina siendo necesaria para ninguna regla, personalización o seguridad, debe eliminarse.
7. PRO puede ampliar el cuestionario en forma adaptativa y, en una etapa posterior, puede usar IA para decidir qué preguntas adicionales hacer.
8. Una recomendación de cantidad/dosis es independiente de la relevancia del suplemento y necesita evidencia específica.

## Fluidez

La aplicación no debería mostrar todas las preguntas del banco de una vez. Debe usar:
- preguntas universales;
- preguntas condicionales;
- preguntas específicas de reglas;
- preguntas PRO solo cuando aportan información adicional.

El objetivo es que el cuestionario BASIC se sienta breve aunque la base científica sea extensa.
