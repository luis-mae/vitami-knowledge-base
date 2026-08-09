# Vitami – Simulación determinística v0.7

## Adulto vegano, pocos fortificados, sin suplementos

- **vitamin_b12** → B_consider (score 6) — complete_for_available_draft_rules
- **omega_3_epa_dha** → D_optional_limited (score 3) — complete_for_available_draft_rules
- **iron** → D_optional_limited (score 2) — provisional_pending_questions
  - Falta preguntar: pro_labs_available
- **zinc** → D_optional_limited (score 2) — complete_for_available_draft_rules

Control: No inferir hierro bajo sin laboratorio.

## Adulto sano, entrenamiento de fuerza, objetivo masa/fuerza

- **creatine_monohydrate** → B_consider (score 7) — complete_for_available_draft_rules

Control: Creatina debe modelarse como acumulativa, no solo días de entrenamiento.

## Caída de cabello sin diagnóstico

- **biotin** → E_no_current_indication (score 1) — complete_for_available_draft_rules
- **zinc** → E_no_current_indication (score 1) — complete_for_available_draft_rules
- **selenium** → E_no_current_indication (score 0) — provisional_pending_questions
  - Falta preguntar: diet_brazil_nuts_frequency, supplements_current_use

Control: Ninguno debe escalar a recomendación fuerte solo por caída de cabello.

## Poco sol, poco pescado y pocos fortificados

- **vitamin_d** → B_consider (score 6) — complete_for_available_draft_rules
- **omega_3_epa_dha** → D_optional_limited (score 3) — provisional_pending_questions
  - Falta preguntar: diet_type

Control: Vitamina D no implica diagnóstico de deficiencia.

## Deportista con mal sueño y alto consumo habitual de cafeína

- **beta_alanine** → C_potential_benefit (score 5) — complete_for_available_draft_rules
- **creatine_monohydrate** → C_potential_benefit (score 5) — provisional_pending_questions
  - Falta preguntar: activity_days_per_week
- **caffeine_performance** → E_no_current_indication (score -1) — provisional_pending_questions
  - Falta preguntar: pro_weight

Control: Cafeína debe bajar de prioridad por sueño y consumo basal.

## Usuario sano que solo busca antioxidantes

- **selenium** → E_no_current_indication (score 0) — complete_for_available_draft_rules
- **vitamin_e** → E_no_current_indication (score 0) — complete_for_available_draft_rules

Control: No recomendar vitamina E o selenio solo por objetivo antioxidante.
