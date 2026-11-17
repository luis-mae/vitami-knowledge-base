# Inventario comprobado de investigación — 17/11/2026

## Archivos inspeccionados directamente
- `data/research/batch_01_ten_ingredient_research_drafts.json`: 10 registros.
- `data/research/batch_02_ten_ingredient_research_drafts.json`: 10 registros.

## Ingredientes identificados (20 IDs distintos)
Lote 01: vitamin_d, vitamin_b12, iron, magnesium, calcium, zinc, folate, potassium, vitamin_b6, iodine.

Lote 02: selenium, vitamin_c, vitamin_a, vitamin_e, vitamin_k, thiamin, riboflavin, niacin, copper, chromium.

## Estado comprobado de estos 20 borradores
- Los 20 tienen `status: draft`.
- Los 20 tienen `source_ids: []`.
- Los 20 tienen `dose: pending_source_review`.
- Los 20 tienen `argentina_availability: unverified_by_form_and_strength`.
- Los 20 tienen `alternatives: not_assessed`.
- Los 20 tienen idiomas inglés e italiano pendientes.
- Los 20 tienen `public_recommendation_allowed: false`.

**Importante:** 20 borradores de investigación identificados NO equivalen a 20 fichas completas ni permiten inferir cuántas fichas maestras existen. No contar como completas.

## Hallazgo de duplicación técnica
Ya existían `tools/audit_library.py`, `tools/library_gap_report.py`, `tools/validate_master_fiches.py`, `tools/audit_scientific_passports.py` y pruebas asociadas, documentados en `docs/LOTE_TECNICO_3_PASAPORTES.md`. El nuevo `scripts/audit_library.py` creado el 17/11 se superpone funcionalmente. **No desarrollar una tercera herramienta**: antes de usarla, comparar contratos de salida y elegir el flujo existente `tools/` como fuente principal. El script nuevo no se ha ejecutado ni debe utilizarse para afirmar cobertura.

## Próximo bloque de trabajo
1. Auditar el catálogo maestro y la carpeta de fichas, separando los 20 borradores de investigación.
2. Completar fuentes verificables para estos 20 ingredientes por indicación, seguridad y dosis; sin activar recomendaciones.
3. Completar estatus comercial argentino por forma y concentración y documentar fuente y fecha.
4. Revisar alternativas por objetivo y traducir advertencias a ES/EN/IT.
5. Correr los validadores existentes y registrar los recuentos comprobados.

No hubo ejecución de pruebas ni auditoría científica de estos 20 registros en este paso.
