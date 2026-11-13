# VITAMI EXPRESS — Guion de ejecución autónoma
Fecha: 2026-11-13. Fuente de verdad: PROJECT_MASTER_PLAN.md.
Objetivo: ejecutar sin consultas repetidas, en bloques pequeños, con código real, pruebas y commits. Este documento permite retomar el trabajo desde cualquier dispositivo o conversación.

## Reglas de autonomía
- Avanzar sin pedir autorización por cada cambio técnico reversible. Usar GitHub y herramientas disponibles, no limitarse a describir pasos.
- Antes de cada sesión leer este archivo, el Plan Maestro y el último commit de la rama de trabajo; retomar desde el primer paso sin evidencia de aceptación.
- Trabajar sobre una rama de función en `luis-mae/vitami`; no modificar `main` ni producción sin verificación y autorización para un cambio de alto impacto.
- Mantener diseño, Francisco, idiomas ES/EN/IT, respuestas, carrito y seguimiento existentes. No borrar ni reescribir módulos innecesariamente.
- Hacer pruebas concretas y registrar si pasaron, fallaron o no pudieron ejecutarse. Nunca confundir código subido con app funcionando.
- Si una tarea se bloquea por permisos, infraestructura, credenciales, pago o decisión comercial, continuar con la siguiente tarea independiente, documentando el bloqueo.
- No hacer compras, activar cobros, publicar en producción, exponer datos personales ni cambiar permisos sin aprobación.
- No afirmar que el trabajo continúa mientras no hay una sesión o automatización activa; cada ejecución avanza hasta el límite de herramientas/tiempo.

## Secuencia operativa autónoma
### Ciclo 1 — Preparación e integración vertical
- [ ] **S01** Leer árbol y archivos de rutas, cuestionario, motor, resultados, biblioteca, carrito y contexto de la app. Entregable: rutas concretas, sin informe extenso.
- [x] **S02** Crear rama segura `feature/vitami-express` desde main. Entregable: referencia GitHub.
- [ ] **S03** Comprobar compilación/lint de base si existe ejecución disponible; registrar limitación si no.
- [ ] **S04** Incorporar banco de objetivos y preguntas científicas a la app mediante datos versionados; preservar IDs y compatibilidad.
- [ ] **S05** Hacer que la primera pantalla del cuestionario sea la elección de objetivos, con navegación anterior/siguiente y estado persistente.
- [ ] **S06** Activar perfil compacto, preguntas de seguridad y preguntas por objetivo sin duplicados.
- [ ] **S07** Integrar adaptador de respuestas conservador y motor BASIC determinístico. No usar el motor demostrativo para decisiones clínicas.
- [ ] **S08** Aplicar bloqueos X y estados de datos insuficientes antes de generar recomendaciones.
- [ ] **S09** Construir tarjeta BASIC con motivo, evidencia, cómo tomarlo, cantidad orientativa verificable, precauciones y enlace a ficha científica.
- [ ] **S10** Vincular enlaces profundos con fichas reales de la biblioteca y manejar fichas faltantes.
- [ ] **S11** Ejecutar recorrido completo inicio → objetivos → seguridad → BASIC → biblioteca → regreso; corregir fallos.

### Ciclo 2 — Recuperación de módulos
- [ ] **S12** Mantener dos opciones paralelas tras BASIC: PRO y Carrito. No forzar ninguna.
- [ ] **S13** Conectar carrito existente, conservando catálogo DEMO etiquetado y sin pagos ficticios.
- [ ] **S14** Recuperar Mi seguimiento y probar guardar/reabrir; compra no equivale a consumo.
- [ ] **S15** Recuperar Actualidad y Consejos con navegación y fuentes.
- [ ] **S16** Preparar interfaz PRO, sin activar IA ni cobro hasta validación de seguridad y proveedor.
- [ ] **S17** Probar ES/EN/IT, web/móvil y reanudación de respuestas.

### Ciclo 3 — Verificación y despliegue
- [ ] **S18** Ejecutar tests automatizados de reglas, bloqueos y adaptadores; corregir fallos.
- [ ] **S19** Revisar protección de datos sensibles, secretos, errores y consentimiento mínimo.
- [ ] **S20** Preparar configuración independiente de Emergent (build, hosting y backend) sin desplegar cambios irreversibles.
- [ ] **S21** Generar build de prueba; registrar enlace solo si se verificó realmente.
- [ ] **S22** Preparar beta y lista corta de pruebas humanas; esperar aprobación para lanzamiento público.

## Criterio de terminación de cada paso
Código/artefacto integrado + prueba focalizada ejecutada + commit y evidencia. Si no es posible ejecutar la prueba, marcar `IMPLEMENTADO / SIN VERIFICAR`, no [x].

## Bloqueos que requieren intervención del usuario
- Acceso o autorización a servicios externos no conectados.
- Contratación de hosting, proveedor de pagos o costes.
- Decisiones clínicas o comerciales que cambian el alcance.
- Despliegue público, cobro real o cambios irreversibles.

## Bitácora breve
Formato por ejecución: fecha; pasos tocados; commits; pruebas y resultado; siguiente paso; bloqueo. Actualizar aquí y en el Plan Maestro sin duplicar informes largos.

2026-11-13: guion creado. S01–S22 pendientes de aceptación. Existen motores, cuestionarios y pruebas en repositorio científico; integración en app principal todavía no certificada.

2026-11-13 — Ejecución: creada rama `feature/vitami-express` en app; inspeccionados archivos de rutas, cuestionario, estado, motor y resultados (S01 parcial). Cambio funcional commit `7069aa28794a50847bd057cdf2bba95c405faed3`: el cuestionario ahora presenta objetivos antes de perfil sin rehacer componentes. S05 IMPLEMENTADO / SIN VERIFICAR: falta ejecutar compilación y recorrido. Se detectó que `questionnaire.tsx` todavía guarda resultado del motor legado `generateOrientation`; pantalla `result.tsx` usa motor científico. Integración y coherencia de estados pendientes.

2026-11-13 — Integración vertical: commit `ac3e4a4` retira `generateOrientation` y `commitSuggestion` del final del cuestionario, evitando persistir orientación clínica legada; commit `ac9a504` conecta `/analyzing` directamente con `/result` (motor científico ya invocado en esa pantalla); commit `eb794f3` separa resultados provisionales de tarjetas BASIC utilizables. S07 y S08 PARCIALMENTE IMPLEMENTADOS / SIN VERIFICAR. Pendiente ejecutar TypeScript/Expo y pruebas E2E; no se ha desplegado. Nota: wellness-dashboard sigue en el repositorio, pero se omite en el recorrido nuevo; revisar efectos en navegación y seguimiento antes de certificar.

2026-11-13 — Paso S09 parcial: commit `aec53e0` añade resumen de evidencia y precauciones a las tarjetas BASIC; mantiene «Cómo tomarlo» con aviso de ausencia de pauta validada, sin inventar horarios o dosis. S03: commit `64acf1c` habilita GitHub Actions TypeScript en pushes de rama EXPRESS (workflow preexistente solo corría en main/PR). Resultado de CI todavía no comprobado. Pendiente dosis diaria fiable y pruebas de compilación.

2026-11-13 — PR borrador de validación #1 creada: https://github.com/luis-mae/vitami/pull/1, sin merge a main; habilita comprobaciones de pull_request ya configuradas. La API no devuelve todavía ejecuciones de CI. Commit `1488ceb` completa normalización conservadora de respuestas negativas para enfermedad, embarazo y lactancia en adaptador. S03 sigue pendiente de resultados CI. No afirmar compilación exitosa.

2026-11-13 — S05 persistencia parcial implementada: commit `e96abae` guarda y restaura borrador de respuestas localmente al reiniciar. Advertencia: contiene datos de salud, revisar política de privacidad y borrado antes de publicar. S08 seguridad adicional: commits `195e439` y `32b77a6` retienen sugerencias BASIC y evitan falso mensaje de éxito ante alergia relevante, enfermedad «Otra» o medicamentos «otros» sin evaluación individual. PR #1 sigue en borrador, CI sin resultado confirmado; no hay compilación validada.

2026-11-13 — S05 reanudación: commit `8fbbd03` usa estado ready y posiciona el cuestionario en la primera pregunta obligatoria incompleta al volver a abrir. PR borrador #1 sigue mergeable y sin fusionar; status API sin comprobaciones visibles, por lo que CI continúa SIN VERIFICAR. Próximo: revisar consentimiento de almacenamiento de respuestas sensibles y ejecutar TypeScript de forma efectiva.

2026-11-13 — UX y seguridad: `f6fbc16` reordena las pestañas de etapas para que Objetivos aparezca primero; `7b6d244` espera hidratación de respuestas persistidas antes de inicializar valores por defecto; `6e7bebd` evita presentar texto genérico de dosis de biblioteca como «Cantidad diaria orientativa» personalizada, que queda explícitamente sin determinar hasta validar regla aplicable. S09 parcial; CI/Expo siguen sin resultado comprobado.

2026-11-13 — Nuevos commits en frontend: `999b946` impide mostrar resultados antes de hidratar respuestas locales (evita falso estado vacío o recomendaciones por perfil incompleto durante carga); `471686c` deriva diabetes a revisión profesional hasta validar reglas específicas. CI configurado con workflow de npm/tsc en `.github/workflows/vitami-frontend-check.yml`, pero no hay evidencia de ejecución exitosa, pendiente comprobar en Actions. No fusionar PR #1 aún.

2026-11-13 — Revisión de seguridad detectó y corrigió bypass en tarjetas secundarias: `302dd36` usa `canShowSuggestions` también para secundarios, y exige revisión ante cualquier medicación regular hasta validar interacciones por clase. CI fortalecido: `5c7a221` añade `npx expo export --platform web --output-dir dist-ci` después de TypeScript. Las comprobaciones deben ejecutarse y consultarse; no afirmar éxito antes de observarlo.


## PLAN DE CIERRE VITAMI EXPRESS — 2026-11-13 15:04:17 (Argentina, UTC−03:00)
**Estado estimado comunicado al usuario:** 65% hacia primera versión funcional (estimación subjetiva, no indicador automático). Objetivo: aplicación web BASIC utilizable, segura, verificable e independiente de Emergent. Repositorio app `luis-mae/vitami`, rama `feature/vitami-express`; PR borrador #1, no fusionar hasta validación. Repositorio ciencia `luis-mae/vitami-knowledge-base`, rama `design/adaptive-questionnaire-v2`. No modificar versión pública prematuramente.

### P0 — Imprescindible para versión funcional (orden de ejecución)
- [ ] **CI del HEAD**: comprobar GitHub Actions de los commits posteriores a `4e3a8d9`, con TypeScript, export Expo web y artefacto descargable; leer logs de fallos y corregir hasta obtener verde del último commit. Éxito histórico confirmado: run #36 (commit `5c7a221`) pasó TS y export web; NO prueba commits posteriores.
- [ ] **Pruebas end-to-end reales**: iniciar app web en entorno de prueba; completar cuestionario desde cero, retomar borrador, editar respuestas, volver atrás, abrir resultados, responder followups, acceder a biblioteca y navegar sin errores. Probar ES/EN/IT, móvil y escritorio.
- [ ] **Matriz de seguridad BASIC**: pruebas de ausencia de datos, contradicciones, alergias, medicamentos, enfermedad renal/hepática/cardiaca/diabetes, embarazo/lactancia, cirugía próxima, duplicación de suplementos y menores; ningún resultado accionable sin datos mínimos ni en perfiles bloqueados. Validar reglas X y overrides; no confundir revisión con recomendación.
- [ ] **Validar motor y adaptador**: auditar correspondencia exacta entre preguntas, opciones, `toCanonical`, reglas científicas y followups; casos de prueba con salidas esperadas; revisar si followups desconocidos o PRO bloquean injustificadamente BASIC. Corregir fallos de navegación, estados vacíos y persistencia.
- [ ] **Integridad biblioteca y vínculos**: para cada recomendación comprobar `supplement_id` existente, ficha navegable, evidencia, contraindicaciones, interacciones, efectos adversos, fuentes y estado de revisión; no exponer como validado contenido borrador.
- [ ] **«Cómo tomarlo» + «Cantidad diaria orientativa»**: presentes desde BASIC y PRO, en ES/EN/IT. Solo ofrecer horario/comidas, dosis, unidades y equivalencia cotidiana cuando reglas específicas estén científicamente verificadas y sean apropiadas al perfil; de lo contrario indicar explícitamente «no determinado», sin inventar dosis ni equivalencias.
- [ ] **Privacidad y datos de salud**: revisar persistencia automática `vitami.questionnaire.draft.v1` y almacenamiento local de respuestas sensibles; informar y obtener consentimiento adecuado, ofrecer borrar/restablecer datos y verificar que no se envían a terceros inesperadamente. Revisar secretos y configuración.
- [ ] **Construcción publicable**: obtener artefacto web verificado; configurar hosting independiente de Emergent, variables de entorno, rutas SPA, HTTPS, dominio, rendimiento básico y analítica respetuosa de privacidad; desplegar primero en URL de prueba, comprobar carga y navegación.
- [ ] **Criterios de aceptación**: sin errores bloqueantes, seguridad clínica revisada, pruebas manuales y automáticas documentadas, validación de tres idiomas, enlaces a biblioteca funcionando, versión desplegada; recién entonces evaluar merge de PR #1 y publicación.

### P1 — Calidad necesaria antes de lanzamiento amplio
- [ ] Auditoría clínica documentada por ingrediente: calidad de evidencia, criterios de elegibilidad, límites, dosis, horario/comidas, interacciones, contraindicaciones, fuentes y fecha de revisión; desactivar ingredientes no validados.
- [ ] Revisión de UX y accesibilidad: textos claros, contraste, teclado, lector de pantalla, tamaños de fuente, errores de formularios, indicadores de progreso, navegación en teléfonos.
- [ ] Pruebas automatizadas unitarias del motor, adaptador y gates de seguridad; smoke test web en CI, reportes y artefactos por versión.
- [ ] Revisión del flujo PRO: sin recomendaciones clínicas ficticias, sin pagos/ventas simulados como reales; definir y probar cualquier carrito o comercio antes de habilitarlo.
- [ ] Observabilidad y mantenimiento: seguimiento de errores sin datos clínicos identificables, versiones, rollback y procedimiento de incidentes.

### P2 — Mejoras posteriores (no bloquean MVP seguro)
- [ ] Personalización ampliada de dosis y horarios basada en reglas aprobadas y fuentes.
- [ ] Catálogo/productos, equivalencias por presentación, compras y PRO reales solo tras validación comercial/legal.
- [ ] Mejoras de analítica de uso, rendimiento, SEO/PWA, distribución móvil e iteración con usuarios.

### Secuencia de entregables
**65→75%**: HEAD CI verde + pruebas motor/seguridad + correcciones bloqueantes.
**75→85%**: flujo E2E web y biblioteca verificados, UX/idiomas, privacidad.
**85→95%**: despliegue de prueba independiente, pruebas reales, correcciones.
**95→100%**: aceptación clínica/técnica, publicación y plan de rollback.
Estos porcentajes son metas orientativas, no hitos certificados. Reportar siempre cambios con commit y pruebas observadas; no prometer trabajo autónomo entre mensajes sin automatización.
