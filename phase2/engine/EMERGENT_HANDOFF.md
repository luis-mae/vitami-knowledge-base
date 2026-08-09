# Motor Vitami BASIC — punto de integración

Esta versión incorpora un motor determinístico de referencia en JavaScript.

## Entrada
Respuestas canónicas del cuestionario.

## Proceso
1. Normalización/compatibilidad de respuestas.
2. Derivación de perfil (por ejemplo clases de actividad).
3. Evaluación de reglas.
4. Overrides de seguridad.
5. Puntuación y límites de recomendación.
6. Detección de información faltante.
7. Asociación con Biblioteca y reglas de dosis disponibles.
8. Salida estructurada BASIC.

## Salida
Compatible conceptualmente con `EMERGENT_VITAMI_API_CONTRACT.json`.

## Integración futura
Cuando sea posible inspeccionar el código real de Emergent, este motor debe adaptarse a la función real existente en el backend en lugar de reconstruir la interfaz.

## Importante
El motor no usa IA y las reglas permanecen DRAFT hasta revisión/validación científica.
