# Vitami Knowledge Base

## Objetivo

Este repositorio contiene la arquitectura de la base de conocimiento y del motor de reglas de **Vitami**.

La evaluación inicial gratuita de Vitami está pensada para ser **determinística**: respuestas del usuario → reglas predefinidas → orientación. La IA no es necesaria para decidir esa orientación inicial.

## Principio de trazabilidad

Vitami debe poder responder, para cada resultado:

1. **Qué regla se activó.**
2. **Qué respuestas del usuario activaron esa regla.**
3. **Qué afirmación científica justifica la regla.**
4. **Qué fuente o fuentes respaldan esa afirmación.**
5. **Cuándo se revisó por última vez.**

Una afirmación científica sin fuente no puede pasar a estado `active`.

Una regla sin `evidence_claim_ids` no puede pasar a estado `active`.

## Separación de capas

- `data/supplements/`: conocimiento científico y texto de Biblioteca por ingrediente/suplemento.
- `data/rules/`: lógica de decisión de Vitami.
- `data/sources/`: registro de fuentes y organismos.
- `schema/`: contratos JSON que permiten validar la estructura.
- `config/`: niveles de evidencia, niveles de orientación y política de fuentes.

Esta separación permite actualizar evidencia sin reescribir la app, y modificar una regla sin perder la trazabilidad científica.

## Fuente ≠ recomendación

Que una sustancia aparezca en una base comercial, en una etiqueta o en la Biblioteca Vitami **no significa que Vitami deba recomendarla**.

La decisión de mostrar una orientación depende de:
- la evidencia aplicable al objetivo concreto;
- las respuestas del usuario;
- las reglas Vitami;
- los bloqueos de seguridad;
- el estado de revisión de la regla.

## Biblioteca Vitami

La Biblioteca debe leer, cuando sea posible, la misma ficha estructurada que usa el motor. Esto evita mantener dos verdades distintas.

La ficha pública podrá mostrar:
- qué es;
- para qué se estudió;
- nivel de evidencia por uso;
- valores de referencia cuando correspondan;
- precauciones e interacciones;
- por qué Vitami podría mostrarlo;
- fuentes;
- fecha de revisión.

## Flujo de trabajo recomendado

### Fase 1 — arquitectura
Definir estructura, fuentes, trazabilidad, seguridad, niveles y versionado. **Este repositorio está en esta fase.**

### Fase 2 — carga de evidencia
Crear fichas reales de suplementos y afirmaciones científicas con fuentes.

### Fase 3 — cuestionario y reglas
Cruzar la evidencia con las preguntas de Vitami. Agregar, modificar o eliminar preguntas y crear reglas ponderadas/condicionales.

### Fase 4 — ampliación
Añadir suplementos menos frecuentes, botánicos, compuestos bioactivos y registros informativos de evidencia insuficiente.

### Fase 5 — implementación
Emergent u otro desarrollador integra estos archivos en la aplicación.

## Estados

- `draft`: incompleto o no auditado.
- `reviewed`: revisado, todavía no necesariamente utilizado por la app.
- `active`: aprobado para uso por el motor/Biblioteca.
- `deprecated`: se conserva por historial pero no debe usarse.

## Regla crítica

No generar automáticamente una dosis personalizada por intuición o simple proporcionalidad. Cualquier ajuste automático de dosis debe tener una regla explícita y una fuente que respalde ese ajuste para ese contexto. En caso contrario, mostrar valores de referencia o derivar a evaluación profesional.

## GitHub

Este directorio puede subirse tal cual a un repositorio GitHub. Tanto ChatGPT como Emergent pueden trabajar sobre los JSON, siempre preservando:
- IDs estables;
- fuentes;
- historial de cambios;
- estados de revisión;
- compatibilidad con los esquemas.


## Fase 1B — Arquitectura del cuestionario

Vitami también mantiene las preguntas como datos estructurados en `data/questions/`.

La relación debe ser bidireccional:

`question_id → rule_id → evidence_claim_id → source`

y, a la inversa:

`rule_id → required_questions / optional_questions / safety_questions`

Una regla no debe emitir una orientación fuerte si faltan preguntas requeridas.

La lógica separa tres decisiones:
1. **Relevancia:** si hay motivos para mostrar un suplemento.
2. **Seguridad:** si existe alguna condición que bloquee o limite la orientación.
3. **Cantidad:** si hay evidencia y datos suficientes para mostrar una dosis/referencia o si debe limitarse a información general.

Las preguntas se clasifican como:
- `BASIC`: evaluación inicial gratuita, corta y determinística.
- `PRO`: profundización adaptativa, potencialmente asistida por IA.
- `BOTH`: aplicable en ambos niveles.

La arquitectura incluye preguntas universales, condicionales y específicas de regla para evitar cuestionarios innecesariamente largos.

## Fase 1E — Banco de objetivos y campañas

Los objetivos se almacenan en `data/goals/goal_bank_master.json`.

Vitami distingue:
- objetivos del usuario;
- situaciones/entradas temáticas de campañas;
- reglas científicas.

Una campaña puede preseleccionar un objetivo, pero nunca un suplemento. El motor sigue evaluando preguntas, seguridad, evidencia y reglas.

Esto permite crear en el futuro accesos como “quiero cuidar mi piel”, “sé que mi dieta no es la mejor”, “entreno mucho” o “quiero envejecer de forma saludable” sin crear motores distintos para cada campaña.

## FASE 1 CERRADA — v1.0

La Fase 1 queda cerrada con la arquitectura completa de:
- evidencia y fuentes;
- seguridad;
- reglas determinísticas;
- preguntas BASIC/PRO;
- objetivos;
- campañas/entradas temáticas;
- perfiles especiales;
- trazabilidad;
- versionado.

A partir de esta versión, la Fase 2 consiste en cargar conocimiento real por suplemento y activar reglas únicamente cuando la evidencia y las preguntas necesarias estén documentadas.
