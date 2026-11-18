> **GOBERNANZA Y DATOS — PRECEDENCIA OBLIGATORIA (18/11/2026):** El único plan operativo es [VITAMI_PLAN_MAESTRO_UNICO.md](https://github.com/luis-mae/vitami/blob/main/VITAMI_PLAN_MAESTRO_UNICO.md); el único concepto es [CONCEPTO_DIRECTOR_VITAMI.md](https://github.com/luis-mae/vitami/blob/main/frontend/CONCEPTO_DIRECTOR_VITAMI.md); la única auditoría maestra es [AUDITORIA.md](https://github.com/luis-mae/vitami/blob/main/AUDITORIA.md). Este repositorio es la **fuente científica maestra**. Su base canónica es `main/phase2/library/` (100 registros según `LIBRARY_INDEX.json`). Las ramas alternativas y planes/auditorías antiguos son históricos o material de trabajo; no son fuentes maestras paralelas. La copia `frontend/src/vitami/data/library.json` del repositorio de app es un snapshot de ejecución que debe derivarse de esta base, no editarse como fuente independiente.

> **GOBERNANZA ÚNICA VITAMI (18/11/2026):** El único plan operativo vigente es [VITAMI_PLAN_MAESTRO_UNICO.md](https://github.com/luis-mae/vitami/blob/main/VITAMI_PLAN_MAESTRO_UNICO.md), regido por [CONCEPTO_DIRECTOR_VITAMI.md](https://github.com/luis-mae/vitami/blob/main/frontend/CONCEPTO_DIRECTOR_VITAMI.md). Este archivo se conserva como referencia técnica/histórica, NO como roadmap independiente. Las tareas científicas útiles se ejecutan exclusivamente dentro de los bloques E3–E4 del plan único; no crear motores ni cuestionarios alternativos.

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

## Flujo de trabajo

Las fases históricas descritas en este README explican la evolución del repositorio; **no constituyen un plan activo**. Toda ejecución debe seguir exclusivamente los bloques A/B/C del Plan Maestro Único del repositorio de la app. La base maestra permanece en `main/phase2/library/`; las ramas alternativas son fuentes de comparación selectiva, no bases independientes.

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


## Qué es y qué no es la base canónica

La única biblioteca científica canónica es `phase2/library/`: 100 fichas por ingrediente más archivos auxiliares de índice/QA/taxonomía. `data/supplements/` conserva registros profundos anteriores y plantillas; `phase2/pilot/` conserva catálogos/pilotos; no son bibliotecas canónicas alternativas ni deben alimentar el motor como segunda fuente. Las copias vendorizadas dentro de `luis-mae/vitami/vitami_kb/` y las ramas alternativas se conservan por compatibilidad/historia, no como autoridad. La app puede tener una proyección de ejecución derivada; sus identificadores deben reconciliarse con esta biblioteca y sus campos no sustituyen el expediente científico completo.
