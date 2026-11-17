# Biblioteca VITAMI — cierre de 100 fichas (2026-11-17)

## Estado verificable
- Fase 1: arquitectura declarada cerrada en README.md.
- Fases 2–5: NO verificadas mediante inventario exhaustivo.
- Fichas completas verificadas: DESCONOCIDO, no asumir cero ni cien.
- No confundir ficha existente, ficha traducida, ficha auditada y ficha activa.

## Criterio de cierre por ingrediente
Cada ficha debe contener:
1. Identificador estable, denominaciones ES/EN/IT, formas y unidades.
2. Usos diferenciados por objetivo, calidad y límites de evidencia; claims enlazados a fuentes identificables y fecha de revisión.
3. Ingesta de referencia si corresponde, dosis estudiadas por indicación, límite superior cuando exista; no extrapolar dosis personales.
4. Contraindicaciones, embarazo/lactancia, edad, comorbilidades, interacciones farmacológicas y efectos adversos.
5. Estado comercial para Argentina: dietética/farmacia, venta libre/con receta, restricciones por forma, dosis, presentación y autoridad aplicable; fecha y fuente regulatoria. No asumir que el ingrediente determina por sí solo la condición de venta.
6. Alternativas por objetivo: justificación científica comparativa, no equivalencia automática; priorizar sin receta solo si son apropiadas y seguras.
7. Instrucciones de administración solo cuando estén respaldadas; distinguir orientación general de prescripción.
8. Contenido ES/EN/IT con concordancia semántica y advertencias equivalentes.
9. Referencias verificables, fecha de revisión, revisor y estado draft/reviewed/active.
10. Vínculos con preguntas, reglas y bloqueos de seguridad, sin activación automática por estar en catálogo.

## Plan de ejecución por lotes
A. Obtener listado real de archivos del repositorio y de cualquier trabajo local previo; deduplicar por ID.
B. Generar matriz de cobertura con 100 filas: archivo, campos, idiomas, evidencia, seguridad, Argentina, alternativas, estado.
C. Completar primero faltantes de seguridad y evidencia de los ingredientes de mayor uso; procesar en lotes grandes.
D. Verificar legislación argentina por producto, dosis y presentación, sin generalizaciones.
E. Traducir y cotejar ES/EN/IT; validar esquemas y referencias.
F. Activar únicamente fichas con revisión documentada; integrar con motor y cuestionario en una etapa separada.

## Indicadores
- Total esperado: 100.
- Inventariadas: pendiente de recuento.
- Completas estructuralmente: pendiente.
- Evidencia auditada: pendiente.
- Regulación Argentina auditada: pendiente.
- Tres idiomas revisados: pendiente.
- Activas: pendiente.
- Regla de avance: reportar numeradores comprobados /100; nunca porcentajes estimados.

## Restricciones
No desplegar ni consumir servicios de compilación/prueba; no modificar recomendaciones activas sin revisión de seguridad. Conservar archivos previos y trabajar sobre el estado real, no generar duplicados.
