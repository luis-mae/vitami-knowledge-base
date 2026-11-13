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
