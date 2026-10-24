# 2.1 «Siéntate, Gira o Despega» — pérdida y parameter-shift

Script: `verificar_2_1.py` (Qiskit 2.5.2, semilla 3). Salida en `salida.txt`.

```bash
PYTHONIOENCODING=utf-8 uv run --no-project --with "qiskit==2.5.2" python experiments/parameter_shift/verificar_2_1.py
```

## Decisión: la pérdida del Termómetro de Mareo

**L(θ) = promedio sobre las órdenes de (1 − P(truco correcto))².**

- Va de 0 (Q-Boby obedece con seguridad) a 1 (hace siempre lo contrario).
  Cabe en un termómetro sin saturarse; la entropía cruzada no tiene tope.
- Se deriva con la regla de la cadena:
  ∂L/∂θ = promedio de −2·(1 − P)·∂P/∂θ.
- ∂P/∂θ sale del parameter-shift: [P(θ + π/2) − P(θ − π/2)] / 2, es decir,
  dos ejecuciones del circuito por perilla.

## Modelo de prueba

El silbato entra por q0 y la mano por q1 (RY(π·orden)). Luego van las dos
Perillas Doradas (RY(θ₁), RY(θ₂)) y un CX; P(girar) = P(q1 = 1). Las órdenes
son las cuatro combinaciones de silbato y mano. El mapeo de trucos es un
ejemplo provisional; el carril de contenido fija el definitivo.

## Resultados

| Prueba | Resultado |
| --- | --- |
| Parameter-shift contra diferencias finitas (50 θ al azar) | diferencia máxima 2.6·10⁻¹¹: el gradiente es exacto |
| Entrenamiento desde 20 inicios al azar (40 iteraciones, tasa 1.0) | pérdida final ≤ 0.0002; obedece las 4 órdenes en el 100 % de los inicios |
| Una perilla congelada en un mal valor (θ₁ = ±π/2) | la otra perilla no baja la pérdida de 0.25: hacen falta las dos |
| Tiempo de 30 iteraciones (20 circuitos por iteración) | 232 ms |

Ejemplo del `historial` que devolvería `train`:

| Iteración | θ | Pérdida |
| --- | --- | --- |
| 0 | (2.40, −1.90) | 0.145 |
| 5 | (2.75, −2.62) | 0.0099 |
| 10 | (2.87, −2.77) | 0.0026 |
| 30 | (2.98, −2.93) | 0.0003 |

## Honestidad

- El gradiente es real: cada paso ejecuta los circuitos desplazados ±π/2.
  No es una animación.
- La lección es **cómo** se obtiene el gradiente de un circuito cuántico, no
  que sea mejor que el descenso de gradiente clásico.
