# Vitami → Emergent: paquete final de integración

Este directorio contiene las instrucciones para integrar la Knowledge Base de Vitami en la app existente.

## Objetivo

BASIC debe dejar de depender de IA y pasar a usar el motor determinístico Vitami.
La IA queda reservada para PRO.

## Orden recomendado

1. Ejecutar primero **03_PROMPT_A_EMERGENT_INSPECCION.txt**.
2. No permitir que Emergent implemente nada en esa primera ejecución.
3. Copiar el mapa real de archivos que devuelva Emergent.
4. Recién entonces ejecutar **04_PROMPT_B_EMERGENT_INTEGRACION.txt** junto con este paquete.
5. Probar contra **06_ACCEPTANCE_CHECKLIST.json**.
6. Corregir únicamente errores concretos.

## Principio central

Emergent implementa. Vitami decide la ciencia.

La UI puede mostrar el resultado, pero no modificar estados, dosis, safety gates ni razones científicas.
