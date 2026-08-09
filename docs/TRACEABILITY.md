# Modelo de trazabilidad

Ejemplo conceptual:

`question_id`
→ activa `rule_id`
→ la regla referencia `evidence_claim_id`
→ la afirmación referencia `source_id` + cita específica
→ el resultado puede mostrar "Por qué Vitami te lo muestra" + "Ver fuentes"

## Importante

El `source_registry.json` registra recursos generales (por ejemplo, NIH ODS).
Al poblar suplementos reales, no alcanza con citar solo "NIH": debe registrarse la ficha/documento concreto y, cuando corresponda, la referencia específica que sostiene la afirmación.

## Uso de fuentes

- NIH ODS: resúmenes de suplementos, valores de referencia, seguridad e interacciones.
- EFSA: referencias dietarias y límites superiores en contexto UE.
- EU Health Claims Register: estado de claims de salud en la UE.
- NCCIH: botánicos/complementarios, evidencia y seguridad.
- EMA: monografías de productos/herbales relevantes en la UE.
- USDA FoodData Central: composición de alimentos y estimación dietaria.
- NIH DSLD: presencia/etiquetado de productos; no prueba eficacia.


## Trazabilidad de preguntas

Flujo completo esperado:

`respuesta_usuario`
→ `question_id`
→ `rule_id`
→ `evidence_claim_id`
→ `source_id / cita específica`
→ `resultado + explicación + fuentes visibles`

Si una regla necesita un dato que el cuestionario no obtuvo, el motor debe devolver `insufficient_user_data` en lugar de inferirlo.
