# Vitami deterministic engine

Motor de referencia para la orientación BASIC sin IA.

## Qué hace

1. Recibe respuestas canónicas.
2. Deriva clases de actividad.
3. Ejecuta reglas de seguridad y relevancia.
4. Aplica puntuación, techos y overrides.
5. Detecta preguntas pendientes.
6. Separa recomendaciones, no-recomendaciones educativas y revisión profesional.
7. Devuelve el contrato estructurado que Emergent debe mostrar.

## Qué NO hace

- No diagnostica deficiencias.
- No inventa dosis.
- No activa automáticamente esquemas matemáticamente equivalentes.
- No usa IA.
- No modifica reglas científicas.

## Ejecución de pruebas

Desde `phase2/engine/tests`:

`node runTests.js`

Las reglas siguen en estado DRAFT. Pasar los tests significa coherencia técnica con las expectativas definidas, no validación clínica.