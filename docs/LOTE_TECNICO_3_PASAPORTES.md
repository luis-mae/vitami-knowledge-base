# Lote técnico 3 — Pasaportes científicos y cobertura real

## Hallazgo de inspección directa
El repositorio contiene además de `data/supplements/`, una carpeta `data/scientific_passports/`. Los pasaportes representan **contextos de reglas** y no ingredientes únicos. Ejemplo comprobado: `electrolytes_kidney_heart.json` figura como borrador, sin pasaje de fuente verificado, sin evaluación de certeza, sin aprobación profesional y con texto público vacío. Por tanto no puede contabilizarse como ficha completa.

## Trabajo incorporado
- `tools/audit_scientific_passports.py`: inventario de pasaportes, duplicación de IDs, faltantes de evidencia, revisión, seguridad y presentación.
- `tests/test_passport_audit.py`: pruebas para borradores y duplicados.
- Política de conteos: archivos de suplementos, pasaportes de reglas y fichas maestras son universos distintos. El denominador 100 corresponde únicamente a ingredientes distintos del catálogo acordado.

## Secuencia de ejecución (sin servicios externos)
```bash
python -m unittest discover -s tests -p 'test_*.py'
python tools/audit_library.py --root . --output inventory.json
python tools/audit_scientific_passports.py --root . --output passport_audit.json
python tools/migrate_legacy_drafts.py --root . --output migration/master_fiches
python tools/library_gap_report.py --root . --output gaps.json
python tools/validate_master_fiches.py --root . --output validation.json
```

Los scripts y tests se guardaron, pero no se ejecutaron contra un checkout completo en esta intervención. Próximo hito verificable: ejecutar y publicar recuentos por tipo de registro, y después completar investigación científica por lotes. Ningún borrador se promueve automáticamente.
