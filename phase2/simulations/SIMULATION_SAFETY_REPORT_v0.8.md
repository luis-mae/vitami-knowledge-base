# Vitami – simulaciones combinadas y de seguridad v0.8

## Embarazo con cansancio y dieta sin dato de laboratorio

**Qué estamos probando:** El embarazo eleva relevancia pero no autoriza tratamiento autónomo.

- **iron** → `X_professional_review_required` (score 4)
  - Falta preguntar: pro_labs_available
  - Reglas activadas: IRON_FATIGUE_ONLY, IRON_PREGNANCY
- **curcumin_turmeric** → `X_professional_review_required` (score 0)
  - Reglas activadas: CURCUMIN_PREG

## Poco sol con enfermedad renal

**Qué estamos probando:** El bloqueo de seguridad debe vencer a la puntuación positiva.

- **vitamin_d** → `X_professional_review_required` (score 6)
  - Reglas activadas: VITD_LOW_SUN_LOW_DIET, VITD_KIDNEY, VITD_LOW_SUN
- **creatine_monohydrate** → `X_professional_review_required` (score 0)
  - Reglas activadas: CREATINE_KIDNEY
- **omega_3_epa_dha** → `D_optional_limited` (score 3)
  - Falta preguntar: diet_type
  - Reglas activadas: O3_LOW_FISH
- **vitamin_b12** → `D_optional_limited` (score 2)
  - Reglas activadas: B12_AGE50_CONTEXT

## Bajo consumo de pescado con trastorno de sangrado

**Qué estamos probando:** Seguridad primero.

- **omega_3_epa_dha** → `X_professional_review_required` (score 3)
  - Reglas activadas: O3_LOW_FISH, O3_BLEEDING
- **vitamin_e** → `X_professional_review_required` (score 0)
  - Reglas activadas: VITE_BLEEDING

## Fuerza con objetivo muscular y enfermedad renal

**Qué estamos probando:** La regla renal debe prevalecer sobre el beneficio deportivo.

- **creatine_monohydrate** → `X_professional_review_required` (score 7)
  - Reglas activadas: CREATINE_STRENGTH, CREATINE_KIDNEY
- **vitamin_d** → `X_professional_review_required` (score 0)
  - Reglas activadas: VITD_KIDNEY

## Caída de cabello y suplemento con selenio ya en uso

**Qué estamos probando:** El sistema debe investigar exposición/exceso, no sumar selenio por el síntoma.

- **biotin** → `E_no_current_indication` (score 1)
  - Reglas activadas: BIOTIN_HAIR_ONLY
- **zinc** → `E_no_current_indication` (score 1)
  - Reglas activadas: ZINC_HAIR_ONLY
- **selenium** → `E_no_current_indication` (score 0)
  - Reglas activadas: SEL_HAIR_NAILS

## Persona con AMD intermedia conocida

**Qué estamos probando:** Todavía no existe regla clínica suficiente; debe quedar para evaluación profesional.

- **vitamin_b12** → `D_optional_limited` (score 2)
  - Falta preguntar: diet_fortified_foods
  - Reglas activadas: B12_AGE50_CONTEXT

## Persona sana que quiere prevenir problemas de visión

**Qué estamos probando:** AREDS2 no es prevención universal.

- **vitamin_b12** → `D_optional_limited` (score 2)
  - Falta preguntar: diet_fortified_foods
  - Reglas activadas: B12_AGE50_CONTEXT

## Dolor articular con enfermedad hepática

**Qué estamos probando:** La seguridad hepática debe anular una recomendación potencial.

- **curcumin_turmeric** → `X_professional_review_required` (score 3)
  - Reglas activadas: CURCUMIN_LIVER, CURCUMIN_JOINT

## Deportista de resistencia, buen sueño y bajo consumo de cafeína

**Qué estamos probando:** Debe aparecer como candidata ligada al evento, sin convertirla en uso diario.

- **caffeine_performance** → `B_consider` (score 6)
  - Reglas activadas: CAFF_PERFORMANCE

## Objetivo digestivo sin cepa probiótica concreta

**Qué estamos probando:** Debe pedir cepa/producto antes de una recomendación.

- **probiotics** → `E_no_current_indication` (score 0)
  - Falta preguntar: probiotic_strain_product
  - Reglas activadas: PROBIO_DIGESTIVE
