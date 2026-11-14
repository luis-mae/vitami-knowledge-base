# Etapa 2 — Pasaporte Científico (implementación incremental)

Estado: **contrato y validación implementados; pasaportes de reglas reales pendientes de generación y revisión**.

## Entregado
- `schema/scientific_passport_v1.schema.json`: contrato de datos versionado.
- `scripts/validate_scientific_passports.py`: validador sin dependencias, con bloqueo de aprobación incompleta.
- `tests/test_scientific_passports.py`: pruebas de regresión para estados, trazabilidad y seguridad.
- `.github/workflows/scientific-passports.yml`: ejecución automatizada de pruebas; validación de registros cuando existan.

## Próximo bloque ejecutable
1. Extraer IDs reales de las 87 reglas y sus relaciones de evidencia, sin inventar ni modificar referencias.
2. Crear pasaportes **draft** a partir de las relaciones existentes, preservando los IDs y la procedencia; dejar `source_passage_verified=false`, `certainty_assessed=false` y `professional_approval=false` hasta verificación efectiva.
3. Validar cada pasaporte y reconciliar recuentos contra las 87 reglas y los 31 controles de seguridad.
4. Revisar pasajes exactos de las fuentes, fechas y certeza; documentar profesional revisor y fecha. La correspondencia automática no equivale a aprobación.
5. Incorporar visualización de citas en BASIC/PRO sin habilitar reglas no aprobadas ni generar dosis automáticamente.

## Restricciones
- La existencia de un pasaporte **no** activa recomendaciones ni acredita revisión clínica.
- El workflow informa explícitamente cuando no hay registros; no debe interpretarse como 87 pasaportes validados.
- No reemplazar la biblioteca de la aplicación con datos de borrador, ni publicar.
- Conservar las revisiones y el historial de GitHub como fuente de verdad.

Últimos commits de esta implementación: `5b4e158`, `339b9de`, `fb7a6a4`, `4352edd`, `9af4250`, `4aae749`.
