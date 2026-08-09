# Vitami — integración con el cuestionario actual de Emergent

## Decisión de arquitectura

No rehacer el cuestionario actual.

La interfaz mostrada ya contiene una estructura útil y coherente:
Datos → Alimentación → Actividad → Descanso → Sol → Objetivos → Salud.

Vitami debe mantener esa experiencia visual y reemplazar únicamente la lógica que decide:
- qué preguntas adicionales aparecen;
- qué variables canónicas guarda cada respuesta;
- qué reglas científicas se activan;
- qué resultado BASIC se muestra.

## Cambios prioritarios

1. Mapear cada opción visible a un valor canónico estable.
2. Mantener objetivos como disparadores de exploración, no como evidencia.
3. Mantener el bloque de Actividad actual, porque duración + intensidad + frecuencia permite clasificar mejor el contexto deportivo.
4. Agregar preguntas científicas nuevas solo condicionalmente.
5. En Salud, asegurar medicación, suplementos actuales y condiciones de seguridad antes de mostrar pautas.
6. Francisco debe explicar la pregunta, no inferir diagnósticos.
7. El motor determinístico debe devolver estado, razones, preguntas pendientes y restricciones de dosis.
8. La IA se reserva para PRO, después del resultado BASIC.

## Observaciones de copy

- “¿Con qué frecuencia comés pescado?” debería mencionar ejemplos de pescado graso cuando el objetivo sea estimar EPA/DHA.
- “La carne puede aportar B12, hierro…” está bien como explicación neutral.
- “La exposición al sol puede influir en vitamina D. Es solo un dato más del rompecabezas.” está bien alineado con Vitami.
- La estética de barras y tarjetas es compatible con respuestas ordinales y debe conservarse.
