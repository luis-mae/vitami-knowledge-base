# Biblioteca VITAMI — lote técnico 1 (16-11-2026)

## Entregables
- Herramienta de inventario local, solo lectura: `python tools/audit_library.py --root . --output inventory.json`.
- Plantilla conservadora de revisión por ingrediente, con disponibilidad AR por formulación y dosis, equivalencia por indicación, fuentes y traducciones.
- Nunca confundir existencia de una ficha con verificación científica o aprobación clínica.

## Reglas de cierre
Cada uno de los 100 ingredientes requiere identidad, indicaciones por objetivo y calidad de evidencia, dosis respaldadas, administración, interacciones, contraindicaciones, efectos adversos, fuentes específicas, clasificación argentina comprobada por producto/presentación, alternativas por uso y textos ES/EN/IT revisados. Si faltan fuentes o revisión, el estado permanece `draft`.

## Próxima ejecución
Correr inventario sobre checkout completo; mapear IDs y rutas heredadas; migrar sin borrar; completar y revisar en lotes de 20–25; generar informe de brechas; integrar únicamente fichas autorizadas. Sin despliegues ni gasto de créditos.
