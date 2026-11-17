# Lote técnico 2 — 16 noviembre 2026
Se incorporan: importador de fichas heredadas sin destrucción, informe de brechas por ingrediente y pruebas de conservación/idempotencia. La importación conserva texto original, ruta y hash SHA-256; crea únicamente borradores. No acredita afirmaciones científicas ni disponibilidad argentina.

Ejecutar en checkout local:
```bash
python -m unittest discover -s tests -p 'test_*.py'
python tools/audit_library.py --root . --output inventory.json
python tools/migrate_legacy_drafts.py --root . --output migration/master_fiches
python tools/library_gap_report.py --root . --output gaps.json
python tools/validate_master_fiches.py --root . --output validation.json
```
Los archivos nuevos requieren revisión antes de publicación. Pendiente: ejecución sobre repositorio completo, conteo de 100 ingredientes, investigación y revisión científica/regulatoria por ingrediente y traducciones.
