# Rediseño del 1.3 Panqueques — resultados (opción A1)

Script: `verificar_escala.py` (Qiskit 2.5.2, semilla 13). Correr:

```bash
PYTHONIOENCODING=utf-8 uv run --no-project --with "qiskit==2.5.2" python experiments/rediseno_1_3/verificar_escala.py
```

## Montaje

- Sensores: desviación de fuego y de espesor, en [−1, 1]. «En su punto» si
  la distancia al centro es menor que 0.45; ningún objeto a menos de 0.10 de
  la frontera.
- 20 ejemplos para el radar (8 listos) y 24 objetos nuevos en la cinta
  (10 listos).
- Lectura fija: P(listo) = P(medir `00`). Umbral de victoria: 90 %.
- Escala de fábrica (`codificacion.escala`): 1.5 rad por unidad de sensor.
- Perilla de escala en cada `giro_y` (D14), de 0.5 a 8 rad.

La búsqueda exhaustiva usa un simulador numpy vectorizado, validado contra
Qiskit en 300 circuitos al azar (diferencia máxima 8.9·10⁻¹⁶). El mejor
circuito de cada búsqueda se vuelve a evaluar con Qiskit.

## 1. Sin perilla

| Cerebro | Acierto en la cinta |
| --- | --- |
| Sin fichas (siempre «listo») | 42 % |
| Dos `giro_y` a escala de fábrica | 67 % |
| Mejor regla recta (chip simple, búsqueda en grilla) | 79 % |

## 2. Perilla de escala con dos `giro_y` (Qiskit)

| Escala (rad) | Ejemplos | Cinta | P(00) en el borde (1, 0) | Qué se ve |
| --- | --- | --- | --- | --- |
| 0.5 – 1.0 | 40 % | 42 % | 0.94 – 0.77 | Isla gigante: todo «listo» |
| 1.5 (fábrica) | 55 % | 67 % | 0.54 | Isla demasiado grande |
| 2.0 | 95 % | 83 % | 0.29 | Se ve bien en el radar y falla en la cinta |
| **2.5 – 5.5** | 75 – 100 % | **96 – 100 %** | 0.10 – 0.85 | **Gana** |
| 6.0 – 6.5 | 70 – 60 % | 83 – 79 % | 0.98 – 0.99 | Islas fantasma en los bordes |
| 7.0 – 8.0 | 45 – 50 % | 58 – 54 % | 0.88 – 0.43 | Mapa caótico |

Ventana ganadora: **2.5 a 5.5 rad**, ancha, como corresponde a un ⭐. A 2.0
rad se ve la diferencia entre entrenamiento e inferencia (D7): 95 % en los
ejemplos y 83 % en objetos nuevos. A partir de 6 rad aparecen islas fantasma
porque el giro es periódico: una vuelta completa equivale a no girar.

## 3. ¿Se puede ganar sin tocar la perilla?

Búsqueda exhaustiva de todos los circuitos a la escala de fábrica:

| Fichas permitidas | Ranuras por cable | Circuitos | Mejor acierto | Veredicto |
| --- | --- | --- | --- | --- |
| `giro_y`, `prisma`, `cable_gemelo` | 1 | 11 | 67 % | No gana |
| `giro_y`, `prisma`, `cable_gemelo` | 2 – 4 | 121 – 14 641 | 100 % | Gana sin perilla |
| Catálogo completo (con `giro_z`) | 1 | 18 | 67 % | No gana |
| Catálogo completo (con `giro_z`) | 2 – 4 | 324 – 104 976 | 100 % | Gana sin perilla |

Con dos ranuras o más gana apilando dos `giro_y` en el mismo cable:
RY(a)·RY(a) = RY(2a), o sea, el doble de escala (1.5 → 3.0 rad, dentro de la
ventana). Es la misma lección, pero a saltos y sin pasar por la perilla.

**Decisión: el 1.3 usa `ranuras: 1`.** Así la perilla es la única pieza que
lleva al 90 %, con cualquier subconjunto del catálogo.

## 4. Por qué es ciencia correcta

Con dos `giro_y`, el kernel de fidelidad es

|⟨ψ(x)|ψ(x′)⟩|² = cos²(escala·Δ₀/2) · cos²(escala·Δ₁/2),  con Δᵢ = xᵢ − x′ᵢ.

Verificado con Qiskit en 150 pares y tres escalas (diferencia máxima
6.1·10⁻¹⁶). La escala es el **ancho del kernel**. Cerca de Δ = 0,
cos²(u) ≈ 1 − u² ≈ e^(−u²), así que el kernel se parece a un RBF clásico
exp(−γ‖Δ‖²) con γ ≈ escala²/4. Lejos de cero es periódico, y de ahí salen las
islas fantasma.

Coincide con Schuld (2021, arXiv:2101.11020, sección II): la codificación
fija el kernel. La perilla cambia la codificación; la lectura `00` es la
medición.

## 5. Costo

Mapa 32×32 con `Statevector`: ~200 ms. La perilla recalcula el mapa al
soltarla, con la misma espera de 150 ms que las fichas (D6).

## Veredicto

**La lección se sostiene** con `ranuras: 1`, escala de fábrica 1.5 rad y
`perilla_escala` de 0.5 a 8 rad. El chip simple pierde (79 % < 90 %), el
chip cuántico sin perilla pierde (67 %) y con la perilla gana (96 – 100 %).
