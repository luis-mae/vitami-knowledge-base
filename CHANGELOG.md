# Changelog

## 2.7.0 — 2026-08-09
- Cerrados 7 escenarios BASIC prioritarios para integración técnica: B12, vitamina D, creatina, vitamina C, zinc, calcio y cafeína.
- Cada escenario incluye disparadores, preguntas requeridas, safety gates, estado, información de dosis/referencia y texto ES/EN/IT.
- Cerrado el flujo final del cuestionario BASIC con objetivo aproximado de 14 preguntas universales y ramas condicionales.
- Preservada la secuencia actual de Emergent: Datos → Alimentación → Actividad → Descanso → Sol → Objetivos → Salud.
- Los objetivos abren ramas pero nunca prueban necesidad de suplementación.
- Safety X mantiene prioridad absoluta y nunca queda detrás de PRO.
- Los 7 escenarios quedan listos para cableado técnico, no desplegados todavía.

## 2.6.0 — 2026-08-09
- Seleccionados 13 caminos BASIC prioritarios como `candidate_for_validation`.
- Definidos disparadores, preguntas requeridas, safety gates, texto ES/EN/IT y política de dosis para cada camino.
- Incluidos B12, vitamina D, creatina, whey, omega-3, calcio, zinc, vitamina C, cafeína, beta-alanina, psyllium, electrolitos e hierro como guardrail.
- Ningún candidato queda activo automáticamente.
- Creada política de tarjetas BASIC de Francisco y snapshot de revisión de fuentes.
- Separadas claramente dosis de suplemento, ingestas de referencia y escenarios `professional_only`.

## 2.5.0 — 2026-08-09
- Añadidas 45 reglas determinísticas para los 20 componentes madurados en v1.4.
- Total de reglas draft: 87.
- Creado índice auditable de safety gates (31 gates).
- Añadidas 10 preguntas condicionales nuevas para seguridad y relevancia.
- Corregida la normalización yes/no -> boolean y el cargador del motor para ignorar archivos índice.
- Seguridad BASIC permanece fuera del paywall; análisis exhaustivo de interacciones continúa reservado a PRO/profesional.
- Reglas científicas siguen en estado DRAFT hasta validación/activación.

## 2.4.0 — 2026-08-09
- Madurados 20 componentes adicionales con deep records científicos.
- Total de deep records: 40.
- Incorporados vitamina A, K, B6, yodo, potasio, colina, melatonina, electrolitos, multivitamínicos y psyllium.
- Maduradas formas habituales: D3, citrato/glicinato de magnesio, citrato de calcio, gluconato de zinc, hierro bisglicinato, omega-3 de algas, whey, metilcobalamina y 5-MTHF.
- Registradas fuentes primarias oficiales NIH ODS, NCCIH y FDA verificadas para esta tanda.
- Ninguna nueva ficha activa recomendaciones BASIC por sí sola; faltan safety gates y reglas determinísticas específicas.

## 2.3.0 — 2026-08-09
- Catálogo ampliado de 50 a 100 componentes/ingredientes.
- Incorporadas presentaciones habituales por componente sin asociarlas todavía a marcas.
- Añadidas formas comunes de nutrientes ya existentes (p.ej. D2/D3, K2, B12, magnesio, zinc, calcio, hierro).
- Ampliadas categorías de proteínas, aminoácidos, carotenoides, botánicos y otros bioactivos.
- Creada plantilla futura para mapear componentes Vitami con SKU/productos de una farmacia.
- Los componentes nuevos permanecen `candidate_not_active` hasta revisión científica profunda.

## 2.2.0 — 2026-08-09
- Catálogo ampliado de 25 a 50 productos/ingredientes.
- Los 25 nuevos quedan como candidatos no activos hasta revisión científica profunda.
- Añadida política PRO para análisis exhaustivo de suplementos actuales e interacciones.
- La seguridad BASIC determinística nunca queda detrás del paywall.
- Priorizada la siguiente tanda de deep records y safety gates.

## 2.1.0 — 2026-08-09
- Creado el primer motor determinístico BASIC en JavaScript, sin IA.
- El motor normaliza respuestas, deriva clases de actividad, evalúa reglas, aplica puntuaciones, techos y overrides de seguridad.
- Añadida detección de preguntas pendientes antes de permitir una decisión completa.
- Separadas recomendaciones, no-recomendaciones educativas y casos de revisión profesional.
- Añadido adaptador de respuestas de la UI actual hacia valores canónicos Vitami.
- Formalizado contrato de ramificación condicional del cuestionario.
- Añadidos 10 perfiles automáticos de prueba.
- Resultado de validación técnica inicial: 10/10 perfiles pasaron.
- Las reglas científicas continúan en estado DRAFT; superar los tests no equivale a validación clínica.

## 2.0.0 — 2026-08-09
- Completadas 20 fichas de Biblioteca Vitami en ES/EN/IT.
- Creado clasificador científico de actividad a partir de la UI existente.
- Definido contrato JSON exacto Emergent → motor Vitami → Emergent.
- Definida especificación completa de salida BASIC.
- Añadidos payloads de ejemplo y paquete de integración para Emergent.
- La ciencia permanece en estado draft hasta validación; la UI puede integrarse sin inventar reglas.

## 1.9.0 — 2026-08-09
- Mapeado el cuestionario visual actualmente implementado en Emergent.
- Se decidió conservar el flujo Datos → Alimentación → Actividad → Descanso → Sol → Objetivos → Salud.
- Añadidas al banco maestro duración de sesión, intensidad, sudoración y horas de sueño.
- Añadido plan de ramas condicionales para no convertir el BASIC en un formulario largo.
- Creada capa de compatibilidad UI → valores canónicos → reglas científicas.

## 1.8.0 — 2026-08-09
- Añadidas 10 fichas iniciales de Biblioteca Vitami en español, inglés e italiano.
- Añadidos textos de usuario para los estados A/B/C/D/E/X e información insuficiente.
- Añadidos 10 perfiles sintéticos combinados y de seguridad.
- La nueva auditoría de seguridad pasó con 0 resultados prohibidos o inconsistencias esperadas.
- Separado formalmente el contenido educativo de Biblioteca de la recomendación personalizada.

## 1.7.0 — 2026-08-09
- Corregido el simulador para no marcar como pendientes preguntas ya contestadas.
- Añadida regla de creatina para deportes intermitentes de alta intensidad.
- Auditoría de los 6 perfiles sintéticos: 0 huecos de cobertura esperada.
- Añadidas 9 preguntas condicionales/producto sin ampliar el núcleo universal BASIC.
- Añadidas 6 reglas específicas de dosis/frecuencia.
- Incorporada evidencia primaria sobre hierro en días alternos, mantenida como contexto profesional.
- Añadido motor de equivalencia matemática con barrera de equivalencia clínica.

## 1.6.0 — 2026-08-09
- Ejecutado primer simulador determinístico sobre 6 perfiles sintéticos.
- Añadido estado provisional cuando una regla necesita preguntas adicionales.
- Generados reporte, resultados JSON, auditoría y código de referencia del simulador.

## 1.5.0 — 2026-08-09
- Creado motor de reglas draft con seguridad antes de puntuación positiva.
- Añadidas primeras reglas pregunta→evidencia→resultado para 16 suplementos.
- Añadidos techos de recomendación, override profesional e insufficient_user_data.
- Añadidos 6 perfiles sintéticos para comenzar simulaciones.

## 1.4.0 — 2026-08-09
- Completado segundo bloque profundo FASE 2.
- Añadidos hierro, magnesio, calcio, zinc, folato, selenio, vitamina E, probióticos, CoQ10 y curcumina.
- Incorporadas diferencias de UL según fuente/jurisdicción cuando corresponden.
- Detectadas nuevas preguntas candidatas: nueces de Brasil, malabsorción grasa y cepa/producto probiótico.

## 1.3.0 — 2026-08-09
- Cargados 10 registros profundos con valores de referencia, dosis estudiadas, seguridad, patrón temporal y revisión.
- Diferenciados valores nutricionales de dosis suplementarias y terapéuticas.
- Añadidos límites explícitos a reglas intermitentes y revisiones automáticas.

## 1.2.0 — 2026-08-09
- Añadidos patrones temporales de suplementación: sostenido, acumulativo, agudo, peri-evento e híbrido.
- Separados días calendario, días de entrenamiento y ventanas de evento.
- Añadidos cafeína, nitrato/remolacha, beta-alanina, bicarbonato, tart cherry y proteína al piloto.
- Reforzada la regla: equivalencia semanal matemática no implica equivalencia clínica.

## 1.1.0 — 2026-08-09
- Iniciada FASE 2 con 19 ingredientes piloto.
- Añadida arquitectura de dosis, frecuencia, forma farmacéutica y revisión.
- Añadida política de equivalencia matemática vs equivalencia clínica.
- Añadidas fuentes específicas para el piloto.

## 1.0.0 — 2026-08-09
- Cerrada FASE 1.
- Añadidos perfiles especiales: adolescentes, mayores de 65, embarazo, lactancia, dietas específicas, sedentarismo, deportistas, turnos nocturnos, viajes frecuentes y alta exigencia mental.
- Añadidas preguntas contextuales para turnos, viajes y carga mental.
- Añadida política final de consistencia y auditoría de cierre.

## 0.6.0 — 2026-08-09
- Ampliado banco de objetivos con estudio/exámenes, alta carga mental, sedentarismo, caída del cabello y prevención.
- Añadidos objetivos y campañas por antecedentes familiares.
- Añadida pregunta condicional sobre antecedentes familiares.
- Añadida política específica de prevención y antecedentes familiares.

## 0.5.0 — 2026-08-09
- Añadido banco maestro de objetivos para población general.
- Ampliados objetivos: piel, peso, envejecimiento saludable, cognición, deporte, dieta, etc.
- Añadidas entradas temáticas para campañas/marketing sin preseleccionar suplementos.
- Reescrita pregunta de objetivos para permitir 1–3 áreas de interés.
- Añadida política que impide usar objetivos como evidencia clínica por sí solos.
- Añadido esquema JSON de objetivos y documentación de uso comercial.

## 0.4.0 — 2026-08-09
- Auditado cuestionario BASIC (Fase 1D).
- Reducido núcleo universal; muchas preguntas pasan a modo condicional/a demanda.
- Añadida pantalla compacta de seguridad conceptual.
- Añadida pregunta sobre cirugía/procedimiento próximo.
- Añadido yodo/sal yodada como pregunta potencial específica de regla.
- Añadido flujo BASIC optimizado y flujo conceptual PRO.

## 0.3.0 — 2026-08-09
- Añadido banco maestro de preguntas Fase 1C.
- Definidas preguntas BASIC y PRO en ES/EN/IT.
- Añadida lógica condicional para medicación, suplementos, alergias y datos PRO.
- Separadas preguntas de perfil, dieta, estilo de vida, seguridad, objetivos, síntomas y laboratorio.
- Añadido flujo de cuestionario para implementación futura.

## 0.2.0 — 2026-08-09
- Añadida Fase 1B: arquitectura de cuestionario.
- Añadido esquema de preguntas BASIC/PRO/BOTH.
- Añadidas dependencias obligatorias pregunta↔regla.
- Añadidos estados de suficiencia de datos.
- Añadida validación conceptual de dosis, seguridad y preguntas requeridas.
- Añadido catálogo inicial de familias de preguntas (sin activar decisiones clínicas).

## 0.1.0 — 2026-08-09
- Creada arquitectura Fase 1.
- Separadas capas de suplementos, reglas y fuentes.
- Incorporada trazabilidad obligatoria de evidencia.
- Incorporados bloqueos de seguridad.
- Incorporado soporte ES/EN/IT.
- Incorporados niveles de evidencia y de orientación.
- Creado registro inicial de fuentes oficiales.
