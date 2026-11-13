# VITAMI EXPRESS — Plan maestro de ejecución
**Fecha:** 2026-11-13  
**Objetivo:** entregar una primera versión integral y segura de VITAMI usando la app existente, sin rehacerla ni depender de Emergent para operar.  
**App principal:** `luis-mae/vitami` (`main` actual; implementar en rama nueva).  
**Motor y datos científicos:** `luis-mae/vitami-knowledge-base`, rama `design/adaptive-questionnaire-v2`.  
**Plan anterior:** `archive/PROJECT_MASTER_PLAN_53_TASKS_2026-11-13.md` (preservado; no es la secuencia obligatoria).

## Principios no negociables
1. **Primero integración real, luego ampliaciones.** Cada bloque termina con un recorrido comprobable en la app.
2. **No romper lo existente:** Francisco, ES/EN/IT, interfaz, cuenta, carrito, historial y seguimiento. Trabajar en rama; integrar solo tras prueba.
3. **BASIC sin IA:** reglas determinísticas, bloqueos X prevalecen, información insuficiente no genera dosis individualizadas.
4. **Cada recomendación BASIC y PRO:** fundamento, evidencia, «Cómo tomarlo», «Cantidad diaria orientativa» (unidades correctas, equivalencia cotidiana solo si fiable), precauciones y **enlace directo verificable** a ficha de biblioteca.
5. **PRO y Carrito:** dos acciones paralelas, opcionales e independientes. Sin compras automáticas, precios o SKU DEMO como si fueran reales.
6. **Verificar solo lo indispensable por cambio:** pruebas automáticas focalizadas + recorrido completo; no repetir auditorías o producir informes largos.
7. **Progreso honesto:** una tarea se marca [x] solo con código integrado, prueba ejecutada y evidencia (commit, log o captura). Separar «implementado», «integrado» y «publicado».

## Bloque A — Primera versión funcional (prioridad absoluta)
- [ ] **A1. Entorno seguro de trabajo.** Crear rama `feature/vitami-express` en app, verificar scripts, arranque y conservar una vía de reversión. **Aceptación:** arranque base comprobado, rama y commit documentados.
- [ ] **A2. Cuestionario real goal-first.** Conectar «¿Qué te gustaría lograr o mejorar?» → perfil compacto → seguridad → preguntas adaptativas, sin duplicados; preservar respuestas y navegación. **Aceptación:** recorridos reales de al menos 3 objetivos, con y sin riesgos.
- [ ] **A3. Motor científico BASIC conectado.** Sustituir las decisiones demostrativas por motor determinístico; adaptar respuestas de forma conservadora, bloquear X, faltantes y contradicciones. **Aceptación:** casos normales y de riesgo ejecutados; ninguna recomendación automática en escenarios bloqueados.
- [ ] **A4. Resultados BASIC utilizables.** Tarjetas con fundamento, evidencia, cómo tomarlo, cantidad orientativa fiable, advertencias y enlace a ficha correcta; estados sin recomendación. **Aceptación:** desde el cuestionario se llega a resultados coherentes sin datos ficticios.
- [ ] **A5. Biblioteca conectada.** Navegación a fichas reales, búsqueda y consulta de interacciones/contraindicaciones/efectos adversos; ES/EN/IT sin inventar traducciones. **Aceptación:** enlaces profundos de resultados funcionan; fichas incompletas se etiquetan o se excluyen.
- [ ] **A6. Recorrido BASIC completo.** Inicio → objetivos → cuestionario → resultado → biblioteca → retorno; interfaz móvil y web. **Aceptación:** prueba extremo a extremo ejecutada y documentada.

**Hito 1:** VITAMI BASIC usable en entorno de pruebas, sin cobros ni datos comerciales DEMO presentados como reales.

## Bloque B — Recuperar experiencia y funciones existentes
- [ ] **B1. Carrito preservado y conectado.** Mostrar opción junto a PRO; compras solo voluntarias. Diferenciar catálogo DEMO de productos reales, sin checkout ficticio. **Aceptación:** navegación y estados de carrito comprobados.
- [ ] **B2. Mi seguimiento operativo.** Preservar historial; check-in y objetivos, sin equiparar compra con consumo. **Aceptación:** guardar, recuperar y editar un seguimiento real.
- [ ] **B3. PRO preparado sin simular servicio pago.** Definir experiencia, preguntas adicionales y seguridad; habilitar cobro e IA solo cuando existan proveedor, condiciones y pruebas verificadas. **Aceptación:** camino PRO honesto, sin promesas de pago/IA no implementadas.
- [ ] **B4. Actualidad y Consejos.** Recuperar módulos existentes; contenido con fecha, fuentes y enlaces a biblioteca. **Aceptación:** navegación operativa y contenidos claramente identificados.
- [ ] **B5. Idiomas y persistencia.** ES/EN/IT, sesiones, errores y conservación de datos. **Aceptación:** pruebas de cambio de idioma y reanudación.

**Hito 2:** VITAMI integral en beta, con PRO claramente diferenciado y comercio solo si es real.

## Bloque C — Publicación responsable
- [ ] **C1. Pruebas y seguridad mínimas de lanzamiento.** Regresiones clínicas, interacción con medicamentos, datos sensibles, consentimiento, permisos y accesibilidad básica.
- [ ] **C2. Despliegue independiente.** Configurar hosting, backend/base de datos y secretos fuera de Emergent; compilar y desplegar versión verificable.
- [ ] **C3. Beta y correcciones.** Probar con usuarios, corregir fallos críticos y validar métricas.
- [ ] **C4. Publicación y reversión.** Enlace funcional, monitoreo, recuperación y documentación operativa mínima.

**Hito 3:** versión publicada y comprobada, no solo código subido.

## Fuera del camino crítico (posponer)
- Auditoría editorial exhaustiva de 100 fichas antes de integrar las necesarias; revisar primero las fichas usadas en recomendaciones.
- Ampliar catálogo, reglas o cuestionarios más allá de lo requerido para el primer recorrido.
- IA PRO, cobros reales, analíticas avanzadas, notificaciones y funciones premium hasta tener BASIC estable.
- Informes extensos, matrices repetidas, refactorizaciones cosméticas y perfeccionismo sin incidencia funcional.

## Guion para trabajo autónomo
**Referencia obligatoria al retomar:** `phase2/integration/AUTONOMOUS_EXECUTION_RUNBOOK.md` — 22 pasos S01–S22, reglas para trabajar sin consultas repetidas, criterios de prueba y bloqueos que requieren aprobación. Guardado en commit `9517fe40767cfd55aadb1e3fca0fde26e482d491`. Este guion desglosa las 15 entregas, no agrega 22 nuevas metas al porcentaje.

## Método de ejecución
**Por cada tarea:** leer solo archivos afectados → implementar → ejecutar prueba focalizada → probar recorrido pertinente → guardar commit → marcar [x] con evidencia.  
**Orden:** A1 → A2 → A3 → A4 → A5 → A6 → B1… → C4. Si una tarea depende de otra, integrar verticalmente y no esperar a cerrar toda la biblioteca.
**Reporte al usuario:** indicar qué funciona realmente, qué se guardó, qué falta y bloqueos; no reportar porcentajes de código como si fueran de producto terminado.

## Estado inicial al adoptar este plan
- **0/15 tareas EXPRESS certificadas** (nueva línea de base; NO significa 0 % del producto construido).
- Aplicación original y biblioteca/motor existentes, pero integración completa aún no comprobada.
- Adaptador legado y tests preparados; **no afirmar que pasaron** hasta ejecutar CI.
- El plan de 53 tareas permanece archivado; su último progreso certificado era **1/53**.
- Próxima acción ejecutable: **A1**, crear rama segura en `luis-mae/vitami`, correr verificación base y comenzar A2.

## Registro de entregas
- 2026-11-13 — Plan EXPRESS adoptado. Se archiva plan original y se reduce la ruta crítica a 15 entregables verificables.
