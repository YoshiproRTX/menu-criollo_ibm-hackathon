# Siguiente sesión — investigaciones pendientes

Archivo para una próxima sesión de Claude Code. Antes de empezar, leer
[goal.md](goal.md), [breadboard-fregadero.md](breadboard-fregadero.md) y la
sección del minijuego que toque en [minijuegos.md](minijuegos.md).

Objetivo: resolver lo que todavía no sabemos *cómo* hacer, antes de que los
carriles construyan encima. Cada investigación termina en un script que corre
y una tabla de resultados, no en una opinión.

## Cómo correr Qiskit

Sin proyecto de uv todavía, esto funcionó en esta máquina (Windows, Python 3.14
global, uv con Python 3.13):

```bash
uv run --no-project --with "qiskit==2.5.2" --with scipy python experiments/<script>.py
```

Si ya existe `backend/pyproject.toml`, usar `uv run` desde `backend/`.
Referencia de verificación ya hecha: `experiments/verificar_modelo_a.py`
(modelo de lectura fija en XOR: 50 % sin CX, 100 % con CX; kernel de fidelidad
idéntico con y sin CX; mapa 32×32 en 250 ms; isla del 1.3 sin CX).

## Orden y tiempo sugeridos

| # | Investigación | Por qué primero | Tiempo |
| --- | --- | --- | --- |
| 1 | QAE del 2.2 | Es el minijuego estrella y la única ventaja cuántica del pitch | 30–40 min |
| 2 | Verificar los minijuegos del motor compartido | Evita escribir contenido sobre una lección falsa, como pasó con el 1.3 | 20–30 min |
| 3 | Rediseño del 1.3 | Depende del resultado de la 2 | 10–15 min |
| 4 | Animación «gelatina» del mapa | Riesgo visual, no científico; puede ir en paralelo | 20 min |

---

## 1. Prueba del QAE (minijuego 2.2)

### Contexto

Q-Boby estima la probabilidad *p* de que el hueso esté en un túnel. Con el
chip simple usa Monte Carlo (error ~ 1/√N consultas). Con el chip cuántico usa
Quantum Amplitude Estimation (error ~ 1/N). Tiene que ser un QAE hecho a mano
con 1 o 2 qubits, sin `qiskit-algorithms`.

### Preguntas

| # | Pregunta |
| --- | --- |
| Q1 | ¿Cómo se construyen en Qiskit el operador A (con P(medir 1) = p) y el operador de Grover Q = A·S₀·A†·S_χ de forma explícita, con compuertas reales? Comprobar que Qᵏ·A da P(1) = sin²((2k+1)θ), con p = sin²θ |
| Q2 | ¿Cómo se implementa la estimación por máxima verosimilitud (MLAE) con el plan de potencias k = 0, 1, 2, 4, 8 y búsqueda en una grilla de θ en [0, π/2]? |
| Q3 | Contando consultas al oráculo como Σ shots·(2k+1), ¿cuál es la pendiente log-log del error (RMSE) frente a las consultas, para Monte Carlo y para MLAE, promediando 200 semillas? Se espera cerca de −0.5 y cerca de −1 |
| Q4 | ¿Hace falta el k = 0 para evitar la ambigüedad de sin² (varios θ dan el mismo valor)? ¿Qué pasa si se quita? |
| Q5 | Para dos túneles con p = 0.30 y p = 0.36, ¿con qué presupuesto de batería (consultas) MLAE elige bien el túnel en al menos 95 % de las semillas y Monte Carlo no? Ese presupuesto es la batería del minijuego |
| Q6 | ¿Cuánto tarda una estimación completa en local? Tiene que quedar bajo 300 ms para que la gráfica se vea en vivo |
| Q7 | (Opcional, para la línea de Chispa) Con un modelo de ruido despolarizante de `qiskit-aer`, ¿desde qué nivel de ruido se pierde la ventaja? |
| Q8 | ¿Qué dicen las fuentes primarias? Verificar Brassard et al. (2002), *Quantum amplitude amplification and estimation*, y Suzuki et al. (2020), *Amplitude estimation without phase estimation*, antes de citarlas en cromos o en el pitch |

### Entregables

- `experiments/qae/qae_spike.py`: script reproducible con semilla fija.
- `experiments/qae/resultados.md`: tabla de Q3, presupuesto de Q5, tiempos
  de Q6 y la gráfica de error contra consultas.
- Un borrador del endpoint para confirmar con el equipo, por ejemplo
  `POST /api/minigames/doble-hueso/estimates` con
  `{ "metodo": "monte_carlo" | "qae", "presupuesto": N, "tunel": "a" }` y
  respuesta `{ "estimacion", "consultas_usadas", "error_real" }`.

### Aceptación

La investigación termina cuando podamos describir cómo se construye el
circuito, cuántas consultas necesita cada método para la precisión del
minijuego, cuánto tarda, y qué frase honesta dice Chispa sobre la ventaja.

### Cuidados de honestidad

- La ventaja es en **número de consultas al oráculo**, no en tiempo de reloj:
  en simulador, ambos corren en una laptop.
- Monte Carlo y QAE deben usar el mismo oráculo A, para que la comparación sea justa.
- No mostrar curvas suavizadas a mano: la gráfica sale de las corridas reales.

---

## 2. Verificar los minijuegos del motor compartido

### Contexto

En el 1.3 descubrimos que la isla aparece sin la ficha que supuestamente la
desbloquea. Antes de escribir el contenido de cada minijuego, hay que
comprobar con Qiskit que la ficha que «enseña» el concepto es la que hace la
diferencia.

### Preguntas

| # | Minijuego | Pregunta |
| --- | --- | --- |
| Q1 | 1.1 Pelusa | ¿Con dos `giro_y` y una lectura de un qubit se llega al 90 % con los grupos separados? ¿También lo logra la regla? (Debe lograrlo: es el tutorial donde gana lo clásico) |
| Q2 | 1.4 Lavandería | ¿Con 2 qubits y como máximo 4 ranuras, separa la espiral doble una sola capa (giros → CX) o hacen falta dos (giros → CX → giros)? Si una capa ya basta, la lección de data re-uploading es falsa |
| Q3 | 2.3 Pista | ¿El «sándwich» H → giro de fase + CX → H separa el tablero 2×2? ¿Y sin la H final? |
| Q4 | 2.4 Copa | ¿Qué circuito mínimo pasa el umbral, y cuánto ruido aguanta? |
| Q5 | Todos | Para cada minijuego, ¿qué lectura (qubit o resultado) y qué escala de codificación se usan? Esto llena los campos `lectura` y `codificacion` de cada JSON |

### Entregable

`experiments/verificar_minijuegos.py` y una tabla en
`experiments/verificacion.md`: minijuego, circuito sin la ficha clave,
circuito con la ficha clave, acierto de cada uno y veredicto («la lección se
sostiene» o «hay que rediseñar»).

### Aceptación

Para cada minijuego del motor compartido podemos describir qué ficha cambia
el resultado y por cuánto.

---

## 3. Rediseño del 1.3 Panqueques

### Hallazgo

Con dos `giro_y` y lectura `00` sale una isla central (P = 1.0 en el centro,
0.1 en el borde), sin H, RZ ni CX.

### Opciones a probar

| Opción | Idea | Qué hay que verificar |
| --- | --- | --- |
| A | La lección es **la escala de codificación**: una perilla de escala agranda o achica la isla. Coincide con el «multiplicador del giro» del diseño original y con Schuld (la codificación fija el kernel) | Que con la escala por defecto la isla quede mal y solo al ajustarla llegue al 90 % |
| B | La lección es **qué se mide**: leer un solo qubit da franjas, leer `00` da la isla | Que leyendo un qubit no se pase del 60 % aproximadamente |
| C | Cambiar el dataset para que la isla esté descentrada y haga falta otra ficha | Que exista una ficha concreta que lo resuelva y su ausencia no |

Recomendación previa: **A**, porque reutiliza una mecánica ya diseñada y la
explicación es correcta. Confirmar con los números de la investigación 2.

---

## 4. Animación «gelatina» del mapa de decisión

### Preguntas

| # | Pregunta |
| --- | --- |
| Q1 | ¿Qué es más simple en React Three Fiber: un plano con shader y dos `DataTexture` de 32×32 interpoladas con un uniform `t`, o un canvas 2D aparte con `ImageData`? |
| Q2 | ¿Cómo se suaviza el escalado de 32×32 al tamaño del radar sin que se vean cuadros? (filtro lineal de la textura) |
| Q3 | ¿Cómo se añade el temblor de «gelatina» (desplazamiento senoidal que se amortigua en unos 400 ms) sin bajar de 60 fps? |

### Entregable

Una demo aislada en `experiments/gelatina/` con dos mapas reales fijos: XOR
sin CX y con CX, generados por `experiments/verificar_modelo_a.py` y
exportados a JSON. Un botón alterna entre ambos.

### Aceptación

Podemos describir el componente, sus props (mapa anterior, mapa nuevo,
duración) y cómo lo consume el carril del cerebro.

---

## Decisión pendiente del equipo (no es investigación)

Confirmar el reparto en tres agentes (sección final de `goal.md` y sección 10
del breadboard).
