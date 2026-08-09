# Vitami – Simulación determinística v0.6

## Adulto vegano, pocos fortificados, sin suplementos

- **vitamin_b12** → B_consider (score 6); estado: provisional_pending_questions
  - Preguntas pendientes: supplements_current_use
  - Reglas: B12_VEGAN_LOW_FORTIFIED
- **omega_3_epa_dha** → D_optional_limited (score 3); estado: provisional_pending_questions
  - Preguntas pendientes: diet_type
  - Reglas: O3_LOW_FISH
- **iron** → D_optional_limited (score 2); estado: provisional_pending_questions
  - Preguntas pendientes: pro_labs_available
  - Reglas: IRON_VEGETARIAN_CONTEXT
- **zinc** → D_optional_limited (score 2); estado: complete_for_available_draft_rules
  - Reglas: ZINC_VEGAN

**Control esperado:** No inferir hierro bajo sin laboratorio.

## Adulto sano, entrenamiento de fuerza, objetivo masa/fuerza

- **creatine_monohydrate** → B_consider (score 7); estado: complete_for_available_draft_rules
  - Reglas: CREATINE_STRENGTH

**Control esperado:** Creatina debe modelarse como acumulativa, no solo días de entrenamiento.

## Caída de cabello sin diagnóstico

- **biotin** → E_no_current_indication (score 1); estado: complete_for_available_draft_rules
  - Reglas: BIOTIN_HAIR_ONLY
- **zinc** → E_no_current_indication (score 1); estado: complete_for_available_draft_rules
  - Reglas: ZINC_HAIR_ONLY
- **selenium** → E_no_current_indication (score 0); estado: provisional_pending_questions
  - Preguntas pendientes: diet_brazil_nuts_frequency, supplements_current_use
  - Reglas: SEL_HAIR_NAILS

**Control esperado:** Ninguno debe escalar a recomendación fuerte solo por caída de cabello.

## Poco sol, poco pescado y pocos fortificados

- **vitamin_d** → B_consider (score 6); estado: provisional_pending_questions
  - Preguntas pendientes: diet_fatty_fish_weekly, diet_fortified_foods
  - Reglas: VITD_LOW_SUN_LOW_DIET, VITD_LOW_SUN
- **omega_3_epa_dha** → D_optional_limited (score 3); estado: provisional_pending_questions
  - Preguntas pendientes: diet_type
  - Reglas: O3_LOW_FISH

**Control esperado:** Vitamina D no implica diagnóstico de deficiencia.

## Deportista con mal sueño y alto consumo habitual de cafeína

- **beta_alanine** → C_potential_benefit (score 5); estado: complete_for_available_draft_rules
  - Reglas: BA_HIGH_INTENSITY
- **caffeine_performance** → D_optional_limited (score 3); estado: provisional_pending_questions
  - Preguntas pendientes: lifestyle_caffeine_daily, pro_weight, symptom_sleep
  - Reglas: CAFF_PERFORMANCE, CAFF_SLEEP

**Control esperado:** Cafeína debe bajar de prioridad por sueño y consumo basal.

## Usuario sano que solo busca antioxidantes

- **selenium** → E_no_current_indication (score 0); estado: complete_for_available_draft_rules
  - Reglas: SEL_ANTIOXIDANT_ONLY
- **vitamin_e** → E_no_current_indication (score 0); estado: complete_for_available_draft_rules
  - Reglas: VITE_ANTIOXIDANT_ONLY

**Control esperado:** No recomendar vitamina E o selenio solo por objetivo antioxidante.
