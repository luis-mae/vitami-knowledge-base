# VITAMI — Plan maestro de finalización
**Inicio:** 2026-11-13  
**Repositorio:** luis-mae/vitami-knowledge-base  
**Rama de trabajo:** design/adaptive-questionnaire-v2  
**Regla de avance:** marcar [x] únicamente con implementación y verificación demostrables. Especificación/documentación por sí sola NO completa una tarea.
**Estado global:** En desarrollo. No hay evidencia verificada de lanzamiento público ni integración completa en Emergent.
**Fuente de verdad:** este archivo + commits, tests, issues y evidencias de despliegue. Actualizar tras cada sesión.

## P0 — Inventario y arquitectura
- [ ] P0.1 Inspeccionar proyecto real de Emergent: rutas, frontend, backend, bases de datos, autenticación, resultados, carrito, pagos, noticias y seguimiento.
- [ ] P0.2 Registrar matriz «existe en app / existe en repo / solo especificado / falta» y dependencias.
- [ ] P0.3 Definir integración y estrategia de entornos (desarrollo, prueba, producción), secretos y reversión.
- [ ] P0.4 Confirmar arquitectura de datos, persistencia y contratos API; no duplicar sistemas existentes.

## P1 — Motor científico BASIC (sin IA)
- [ ] P1.1 Auditar reglas determinísticas, condiciones, puntuaciones, prioridades, exclusiones y conflictos.
- [ ] P1.2 Validar prioridad irreversible de bloqueos X y manejo de respuestas faltantes/ambiguas.
- [ ] P1.3 Implementar en motor campos obligatorios de cada recomendación: «Cómo tomarlo», «Cantidad diaria orientativa» y enlace directo a ficha.
- [ ] P1.4 Verificar que dosis, unidades, referencias RDA/AI/UL, horarios, comidas y equivalencias no se inventen ni se presenten como prescripción.
- [ ] P1.5 Alinear IDs de preguntas, objetivos, reglas, suplementos, biblioteca y productos; detectar referencias rotas.
- [ ] P1.6 Ejecutar y ampliar pruebas automatizadas de seguridad, regresión y escenarios prioritarios; guardar resultados.
- [ ] P1.7 Versionar reglas, fuentes y revisiones científicas con trazabilidad.

## P2 — Biblioteca de compuestos
- [ ] P2.1 Auditar las 100 fichas ES/EN/IT: contenido, consistencia, evidencia y fuentes.
- [ ] P2.2 Revisar específicamente las 8 entradas que el índice declara pendientes de revisión profunda (cifra por validar contra archivos reales).
- [ ] P2.3 Verificar campos de indicaciones, cómo tomarlo, dosis de referencia, precauciones, interacciones, contraindicaciones y efectos adversos.
- [ ] P2.4 Implementar/validar navegación, búsqueda, filtros y enlaces profundos desde BASIC, PRO y Consejos.
- [ ] P2.5 Mantener separación entre información científica, recomendación y catálogo comercial.

## P3 — Cuestionario y UX
- [ ] P3.1 Implementar primera pantalla «¿Qué te gustaría lograr o mejorar?» con objetivos múltiples.
- [ ] P3.2 Implementar pantalla compacta de perfil: edad y otros datos pertinentes; peso/altura cuando correspondan.
- [ ] P3.3 Implementar rutas adaptativas por objetivo, subpreguntas condicionales, agrupación y deduplicación.
- [ ] P3.4 Mantener preguntas de seguridad esenciales gratuitas; no recomendar antes de resolver faltantes críticos.
- [ ] P3.5 Validar navegación anterior/siguiente, edición, progreso, respuestas desconocidas y reanudación.
- [ ] P3.6 Probar recorridos cortos BASIC y profundización PRO sin preguntas innecesarias.

## P4 — Resultados BASIC
- [ ] P4.1 Implementar tarjetas reales desde el motor, sin reinterpretar puntajes en frontend.
- [ ] P4.2 Mostrar fundamento, evidencia, cómo tomarlo, cantidad orientativa, advertencias y ficha científica.
- [ ] P4.3 Mostrar después del resultado DOS acciones paralelas e independientes: «Solicitar análisis PRO» y «Carrito».
- [ ] P4.4 Verificar estados sin recomendación, faltantes, bloqueos X y revisión profesional.
- [ ] P4.5 Validar traducciones y diseño responsive.

## P5 — PRO pago
- [ ] P5.1 Definir alcance y formato del análisis PRO, preguntas adicionales y precio/moneda.
- [ ] P5.2 Implementar cobro y confirmación verificable antes del servicio PRO; manejo de errores/reembolsos según política.
- [ ] P5.3 Integrar IA solo en PRO, con motor de seguridad no sobreescribible, fuentes y límites explícitos.
- [ ] P5.4 Probar interacciones suplemento-suplemento y suplemento-medicación; derivaciones profesionales.
- [ ] P5.5 Entregar informe PRO, conservar historial y verificar privacidad.

## P6 — Carrito y comercio
- [ ] P6.1 Inspeccionar y recuperar carrito, productos, precios y checkout existentes sin perder código.
- [ ] P6.2 Vincular ingredientes científicos con SKU/productos reales, formulaciones y disponibilidad verificados.
- [ ] P6.3 Permitir selección explícita; nunca agregar productos automáticamente.
- [ ] P6.4 Probar compra, pago, errores, estados de pedido y condiciones comerciales aplicables.
- [ ] P6.5 Mantener el carrito opcional y separado de la recomendación clínica.

## P7 — Actualidad y Consejos VITAMI
- [ ] P7.1 Auditar módulos de noticias/contenidos ya existentes en Emergent.
- [ ] P7.2 Definir fuentes, revisión editorial, fechas y flujo de actualización para Actualidad VITAMI.
- [ ] P7.3 Publicar Consejos VITAMI desde reglas/evidencia revisadas, sin confundir consejo general con recomendación individual.
- [ ] P7.4 Implementar navegación, categorías, idiomas, enlaces a biblioteca y control de contenido desactualizado.

## P8 — Mi seguimiento
- [ ] P8.1 Inspeccionar el seguimiento existente y preservar datos/funciones.
- [ ] P8.2 Implementar línea de base y check-ins breves según objetivos.
- [ ] P8.3 Registrar consumo confirmado, adherencia opcional y cambios de objetivos sin asumir que comprar implica tomar.
- [ ] P8.4 Registrar efectos adversos/cambios de medicación con alertas y revisión de seguridad.
- [ ] P8.5 Implementar historial, gráficos útiles, recordatorios opt-in y control de privacidad.

## P9 — Integración, seguridad y lanzamiento
- [ ] P9.1 Integrar frontend/backend, auth, base de datos, perfiles, sesiones y migraciones.
- [ ] P9.2 Probar ES/EN/IT, móviles, escritorio, accesibilidad y rendimiento.
- [ ] P9.3 Revisar seguridad, permisos, credenciales, almacenamiento de datos sensibles, consentimiento y borrado/exportación.
- [ ] P9.4 Revisar aspectos regulatorios y textos de salud, comercio, privacidad y pago en mercados objetivo.
- [ ] P9.5 Pruebas de extremo a extremo: objetivos -> cuestionario -> BASIC -> PRO o carrito -> seguimiento.
- [ ] P9.6 Beta con usuarios, corrección de errores, métricas y monitoreo.
- [ ] P9.7 Publicación estable, dominio/hosting, backups, soporte y plan de mantenimiento.

## Hitos y definición de terminado
- **H1 Base técnica auditada:** P0 completado y estado real documentado.
- **H2 BASIC científicamente verificable:** P1-P4 completos, tests verdes y fichas enlazadas.
- **H3 Módulos complementarios:** P5-P8 integrados y probados.
- **H4 Lanzamiento:** P9 completo y versión publicada verificada.

## Evidencias iniciales (solo documentos/contratos, NO implementación confirmada)
- phase2/engine/vitamiEngine.js — motor existente, requiere validación.
- phase2/tests/basicSafetyRegression.test.js — pruebas definidas, ejecución no confirmada.
- phase2/questionnaire_final/GOAL_FIRST_ADAPTIVE_FLOW.json — contrato de navegación.
- phase2/library/LIBRARY_INDEX.json — índice declara 100 entradas, 8 requieren revisión más profunda.
- phase2/basic_results/BASIC_RECOMMENDATION_CARD_SCHEMA.json — contrato de campos obligatorios.
- phase2/followup/FOLLOWUP_MODULE_CONTRACT.json — contrato de seguimiento.
- phase2/emergent_handoff_final/06_ACCEPTANCE_CHECKLIST.json — escenarios de aceptación.

## Registro de avances
- **2026-11-13:** Plan maestro creado. Ninguna tarea marcada terminada sin pruebas verificadas. Próxima acción: P0.1/P0.2, inspección real de Emergent; en paralelo P1.5/P1.6 en GitHub.

- **2026-11-13 (sesión 1):** Implementado `phase2/engine/adaptiveQuestionnaire.js` (selección de objetivos, agrupación de perfil, seguridad, rutas por objetivo, subpreguntas y deduplicación) y creado `phase2/tests/adaptiveQuestionnaire.test.js`. Commits `e4f86898fa73b3cdf78d91b1e588558d008917e9` y `63d4e53b63c4e11aab01b96bef807d54e46a325b`. **Estado: código escrito, tests aún NO ejecutados, integración Emergent pendiente; 0/53 tareas certificadas (0%).** Siguiente: ejecutar tests y corregir problemas; inspeccionar app real.

- **2026-11-13 (sesión 2):** Auditoría estática de motores y pruebas; incidencia GitHub #1 con cinco hallazgos. Corregido cuestionario para bloquear finalización si hay referencias a preguntas desconocidas (commits `a29cc5f`, `33cefb0`), añadidas tres aserciones de regresión. Creado workflow GitHub Actions `.github/workflows/vitami-engine-tests.yml` (commit `2792360`) para ejecutar dos suites en push/PR. **La ejecución CI todavía debe comprobarse; 0/53 certificadas (0%).** Próxima prioridad: revisar ejecución CI, resolver dosis y campos obligatorios de BASIC, inspeccionar integración Emergent.

- **2026-11-13 (sesión 3):** Reforzado `buildBasicResponse` para no exponer recomendaciones positivas accionables cuando no hay ficha científica ni regla de dosis con estado `reviewed`; agregadas pruebas de regresión (commits `63c8835`, `3f9a41a`). El índice de dosis `DOSE_RULE_INDEX.json` está explícitamente en estado `DRAFT`; por ello este bloqueo conservador puede retener resultados BASIC hasta la revisión científica y **no debe levantarse sin validación**. Inspeccionado contrato de tarjetas BASIC: los campos obligatorios aún no están integrados. GitHub Actions configurado, pero no se obtuvo confirmación de ejecución; la consulta de runs asociados a commit no devolvió resultados (ese endpoint limita eventos). **0/53 tareas certificadas**, aunque hay avances de implementación y auditoría. Objetivo siguiente: 14/53 (26,4%) con pruebas reales e integración comprobada.

- **2026-11-13 (sesión 4):** Inspeccionado árbol completo del repositorio y recuperado el plan maestro original (53 tareas). Confirmado GitHub Actions run `43437293606` exitoso para commit `51d02844`; run `43437452340` exitoso para commit `56c9208`. Corregido fail-closed anticipado del cuestionario (`56c9208`) y añadidas cuatro aserciones de regresión (`59d33ea`); ejecución CI de este último commit pendiente de confirmar. El código y los tests del cuestionario existen, pero no hay prueba de integración con Emergent. **No se certifica 25% global**: 14 tareas completas todavía no verificadas. Prioridades: integración real, completar tarjetas BASIC y seguridad científica, auditar matriz de referencias.

- **2026-11-13 (sesión 5):** Confirmados CI exitosos `43437506408` y `43437479962` (regresiones de cuestionario). Añadido adaptador fail-closed `phase2/engine/basicPresentationAdapter.js` (commit `c6dedec`) y suite de 11 aserciones `phase2/tests/basicPresentationAdapter.test.js` (`131315c`); incluido en CI (`d6964f4`). El último run CI estaba en curso al registrar este estado. El adaptador aún no está conectado al backend ni al frontend de Emergent. **No marcar P1.3/P4.1/P4.2 como completos** hasta integración y validación con fichas científicas reales. Estado global sigue sin 14 tareas certificadas.

- **2026-11-13 (sesión 6):** Confirmadas tres suites de GitHub Actions exitosas (`43437702544`, `43437670060`). Implementado `libraryLinks.js` con validación de URLs y fuentes (commit `502a046`) + siete aserciones (`b41331e`), añadido a CI (`d0a7f13`). Implementado orquestador `basicJourney.js` (commit `8d55f7f`) que conecta navegación adaptativa, motor BASIC y adaptador de presentación; cinco aserciones (`22ff7a4`), CI actualizado (`6fd7355`). **Cinco suites configuradas**, última ejecución en curso. No equivale a integración en Emergent ni a revisión clínica de fichas; 25% global aún sin evidencia suficiente para certificación.

- **2026-11-13 (sesión 7):** Confirmado run CI `43438146414` exitoso con cinco suites. Añadida sexta suite `phase2/tests/realRepositorySmoke.test.js` (`41773033`) para cargar archivos reales de reglas/biblioteca/dosis, detectar IDs duplicados y mantener bloqueo de recomendaciones sin revisión. Run `43438293912` exitoso con cinco suites; run del workflow actualizado a seis suites `43438310407` estaba en curso. Árbol inspeccionado: 104 archivos JSON en `phase2/library/` (incluye índices y auxiliares), 89 JSON en `phase2/draft_rules/` (incluye índices), 7 JSON en `phase2/dose_frequency_rules/` (incluye índice). No equiparar número de archivos con número de fichas aprobadas. **Se mantiene plan sin cambios de alcance y 25% no certificado** hasta pruebas de integración de la aplicación.

- **2026-11-13 (sesión 8):** La sexta suite detectó `101 !== 102` al comprobar IDs únicos. Logs precisaron que eran **dos JSON auxiliares sin campo `id`**, no dos suplementos con el mismo identificador (`duplicate library IDs: [[null,2]]`). Corregido `loadVitamiRepository` para excluir documentos sin `id` y `title` (`f6045b8`), manteniendo las comprobaciones de unicidad de fichas verdaderas. CI de corrección `43438590733` en curso al registrar. El plan y los criterios de certificación siguen sin cambios.

- **2026-11-13 (sesión 9):** CI `43438632836` exitoso con seis suites, incluida auditoría de activos reales. Endurecido `buildBasicResponse` para exigir fuentes tanto de regla como de ficha (`9e590bb`), suite `scientificEvidenceGate.test.js` con seis aserciones (`051bb7c`), integrada a CI (`a2e86dd`). El test previo falló porque fixture revisado carecía de fuentes; fixture corregido (`16ca479`) sin relajar protección. **CI `43438913944` exitoso con siete suites.** Integración de app real y aprobación científica de dosis aún pendientes; no certificar 25% global sin evidencia.

- **2026-11-13 (sesión 10):** Implementada normalización de respuestas UI `normalizeAnswers.js` (`7fafa6e`) con detección de conflictos y respeto de valores desconocidos, conectada a `basicJourney.js` (`96076b6`); siete aserciones (`4063883`), octava suite CI (`682f886`). Run `43439175626` **exitoso con ocho suites**. Ajustada propagación de `configuration_error` (`27a04db`) y añadidas tres aserciones de integración (`3d8e8ed`), CI posterior en curso. Plan y metas intactos; falta conectar backend/frontend real de Emergent.

- **2026-11-13 (sesión 11):** Endurecido `basicPresentationAdapter.js` (`da3e60d`) para impedir que una tarjeta positiva presente fuentes distintas a las que respaldan la decisión del motor, o identidad de suplemento discordante. Ampliada suite de presentación de 11 a 14 aserciones (`841f6f3`); **GitHub Actions `43439621773` exitoso, ocho suites aprobadas**. El fallo transitorio anterior fue un fixture antiguo que no incluía fuentes del motor. Sin cambios de alcance, sin despliegue público y sin certificación prematura del 25%.
