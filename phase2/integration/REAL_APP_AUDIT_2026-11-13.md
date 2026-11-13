# VITAMI — inspección del repositorio real (13/11/2026)

## Fuentes verificadas
- App: `luis-mae/vitami`, rama `main`.
- Ciencia: `luis-mae/vitami-knowledge-base`, rama `design/adaptive-questionnaire-v2`.
- `frontend/package.json`: Expo 54, React Native 0.81.5, Expo Router 6, React 19.1; comandos web/ios/android.
- `frontend/app/index.tsx`: selector inicial de idioma ES/EN/IT, Francisco.
- `frontend/app/questionnaire.tsx`: interfaz existente, una pregunta por paso, `getVisibleQuestions`, resultado calculado por `generateOrientation`.
- `frontend/src/data/questions.ts`: cuestionario propio, identificadores españoles (`edad`, `peso`, `objetivos`, etc.) y condicionales `visibleIf`.
- `frontend/src/rules/engine.ts`: motor local **demostrativo**, sin IA, que construye suplementos y pautas; actualmente contiene cantidades fijas (p.ej. vitamina D 1000–2000 UI, B12 500–1000 mcg, magnesio 300 mg) activadas por condiciones amplias. **No considerar estas pautas clínicamente aprobadas.**
- `frontend/src/state/AppContext.tsx`: carrito, órdenes, solicitudes de análisis, seguimiento (etapas 1/2) y última sugerencia guardada; persistencia con storage local.
- `backend/server.py`: FastAPI + MongoDB, pero las rutas inspeccionadas son ejemplo de status, sin API científica VITAMI. No asumir que existe integración.
- `phase2/engine/adaptiveQuestionnaire.js` en repo científico: módulo independiente aún no conectado con interfaz Expo.

## Hallazgos críticos
1. Hay **dos motores BASIC**: el demostrativo dentro de la app y el motor científico en el repositorio de conocimiento. La app todavía llama al demostrativo. Prioridad alta: unificar sin perder UI ni datos.
2. Hay **dos bancos de preguntas con IDs distintos**. Requiere adaptador explícito y tests de mapeo, no sustituir indiscriminadamente.
3. El carrito y seguimiento **sí tienen estructuras existentes** en AppContext. Deben preservarse.
4. El backend observado es esqueleto de ejemplo; no afirmar API lista ni cobro PRO validado.
5. Antes de lanzamiento, suprimir recomendaciones accionables del motor demostrativo o sustituirlas por motor científico con bloqueos y evidencia. El código actual podría mostrar dosis sin verificación clínica contextual.

## Estado de integración (evidencia limitada a archivos inspeccionados)
| Área | Aplicación actual | Ciencia | Próximo paso |
|---|---|---|---|
| Entrada/idiomas | Sí, en frontend | Contratos | Mantener |
| Cuestionario | Sí, IDs legados | Banco 73 preguntas, rutas | Adaptador y agrupación |
| BASIC | Motor demostrativo activo | Motor determinístico separado | Integrar y validar |
| Biblioteca | Por inspeccionar en frontend | Índice de 100 fichas | Verificar UI y rutas |
| PRO | Solicitudes/cola en estado local | Política de PRO | Verificar pago y ejecución |
| Carrito | Estado/órdenes en AppContext | Mapeo comercial pendiente | Conservar y probar |
| Seguimiento | Estado local etapas 1/2 | Contrato ampliado | Reutilizar y ampliar |
| Noticias/Consejos | Por inspeccionar | Reglas y contratos | Inspeccionar |

## Próximas acciones concretas
- Inspeccionar rutas de resultados, biblioteca, carrito, seguimiento y noticias, y comprobar qué persiste realmente.
- Construir tabla de equivalencia `frontend/src/data/questions.ts` -> `data/questions/question_bank_master.json`.
- Probar motor científico fuera de la app y conectar su respuesta a la UI existente.
- No publicar recomendaciones de dosis del motor demostrativo como consejo personalizado.

**Alcance:** inspección de código remoto, no ejecución, compilación ni verificación de app desplegada.
