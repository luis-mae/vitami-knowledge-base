# VITAMI — Plan maestro de ejecución y control

Fecha de recuperación: 2026-11-13
Rama de trabajo: design/adaptive-questionnaire-v2
Objetivo inmediato: alcanzar 25% de 53 tareas (mínimo 14 tareas verificadas).

## Reglas de medición
- Una tarea cuenta solo si hay archivo/commit verificable y, cuando corresponde, prueba ejecutada.
- Porcentaje = tareas verificadas / 53 × 100. No confundir avance de diseño con integración en producción.
- Mantener la web pública sin cambios hasta completar pruebas y revisión de seguridad.

## Áreas del plan (10)
1. Arquitectura, esquemas y trazabilidad.
2. Banco de objetivos y cuestionario adaptativo BASIC/PRO.
3. Motor determinístico de recomendaciones y prioridades.
4. Seguridad: contraindicaciones, interacciones, acumulados y datos faltantes.
5. Biblioteca científica de compuestos y fichas.
6. Resultados gratuitos: justificación, cantidad orientativa, cómo tomarlo y enlace a ficha.
7. Análisis PRO de pago y cuestionario ampliado.
8. Carrito y selección de productos vinculados a recomendaciones.
9. Seguimiento, historial y reevaluación.
10. Noticias, reglas generales, pruebas, despliegue y mantenimiento.

## Contrato funcional del cuestionario BASIC
- Pantalla 1: selección de hasta cinco objetivos con orden de prioridad.
- Pantalla 2: edad, altura, peso y otros datos pertinentes agrupados; mostrar subpreguntas solo cuando correspondan.
- Pantalla 3: seguridad universal antes de emitir recomendaciones; respuestas críticas faltantes impiden recomendaciones personalizadas.
- Pantalla 4: preguntas específicas por objetivos, con ramas condicionales y evitando duplicados.
- Resultado: motor determinístico, no IA generativa para decidir recomendaciones gratuitas.

## Contrato de resultado para cada ingrediente recomendado
1. Nombre y motivo vinculado a objetivo y regla trazable.
2. Nivel de evidencia y fuentes, con fecha de revisión.
3. Cantidad diaria orientativa SOLO cuando existe regla sustentada; unidades precisas y equivalencia cotidiana únicamente si es fiable.
4. «Cómo tomarlo»: momento de ingesta, con/sin alimentos, frecuencia y duración solo según evidencia aplicable.
5. Advertencias, contraindicaciones, efectos adversos e interacciones, y avisos de seguridad antes del cuestionario y antes de los resultados.
6. Enlace directo a la ficha de Biblioteca VITAMI (qué es, usos, evidencia, interacciones, precauciones y fuentes).
7. Carrito existente, sin convertir presencia en catálogo en una recomendación.

## Puertas de calidad
- No activar una regla sin evidence_claim_ids válidos ni afirmación sin fuente.
- No inferir dosis por peso/edad mediante proporcionalidad sin regla y fuente.
- No emitir recomendación fuerte con datos de seguridad requeridos ausentes.
- Verificar suma de ingredientes repetidos en distintos productos.
- Pruebas unitarias, de regresión y de integración extremo a extremo antes de desplegar.

## Registro de avance
- [x] Recuperar y registrar especificación de ejecución en GitHub (este documento).
- [ ] Inventariar las 53 tareas originales y cotejar commits existentes.
- [ ] Ejecutar pruebas del motor de interacciones y conservar evidencia.
- [ ] Ejecutar pruebas del cuestionario adaptativo y conservar evidencia.
- [ ] Integrar cuestionario → motor → ficha → carrito en entorno de prueba.
- [ ] Auditar seguridad de recomendaciones y PRO.

Estado: avance global pendiente de auditoría; no declarar 25% sin 14 tareas verificadas.
