# Vitami — lógica de dosis, frecuencia y temporalidad (FASE 2 v0.7)

## Principio central

Vitami separa tres preguntas:

1. ¿Este suplemento es relevante para esta persona?
2. ¿Qué cantidad o rango está respaldado para ese objetivo/contexto?
3. ¿Cómo puede administrarse esa cantidad con el producto concreto que tiene la persona?

La tercera pregunta no puede modificar arbitrariamente la segunda.

## Promedio diario equivalente

El motor puede calcular una dosis semanal total y dividirla por siete para mostrar un `average_daily_equivalent`.
Ese valor es matemático y sirve para comparar productos o detectar excesos. No demuestra que dos pautas produzcan el mismo efecto biológico.

## Ejemplos

### Omega-3

Una cápsula de 1.000 mg cada dos días tiene un promedio matemático de 500 mg/día.
Vitami no debe convertir esa equivalencia en recomendación hasta que exista respaldo para la pauta intermitente en el objetivo relevante.
Si se necesita una dosis diaria menor, el motor puede preferir una presentación de menor concentración.

### Creatina

La creatina se modela como acumulativa. Cuando la pauta respaldada es diaria, una presentación en polvo permite adaptar la cantidad diaria.
No se debe transformar automáticamente 3 g/día en 6 g cada dos días.

### Cafeína

Es un ejemplo agudo ligado al evento. El cálculo depende del peso y de la cantidad de cafeína ya consumida ese día.
No tiene sentido convertir su pauta a un promedio semanal.

### Hierro

Hay estudios primarios sobre administración en días alternos en mujeres con depleción o deficiencia de hierro. La evidencia no justifica convertir esto en una regla BASIC universal.
Vitami conserva el esquema como `professional_only_draft`.

## Producto real

Antes de proponer una pauta, Vitami necesita conocer:
- cantidad de ingrediente activo por unidad;
- unidad de medida;
- forma farmacéutica;
- si una tableta realmente puede dividirse;
- otros suplementos/productos que aporten el mismo ingrediente;
- contexto temporal relevante (entrenamiento, sueño, comidas, etc.).

Cuando el producto disponible no permite reproducir una pauta respaldada, es preferible sugerir otra concentración o forma antes que inventar una frecuencia.
