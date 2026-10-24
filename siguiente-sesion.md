# Investigaciones previas a la implementación — cerradas

Las cuatro investigaciones que bloqueaban a los carriles están resueltas. Cada
una terminó en un script con semilla fija y una tabla de resultados. Las
decisiones que salieron de ellas ya están en [goal.md](goal.md),
[breadboard-fregadero.md](breadboard-fregadero.md),
[minijuegos.md](minijuegos.md) y [docs/spec.md](docs/spec.md).

## Cómo correr los experimentos

```bash
PYTHONIOENCODING=utf-8 uv run --no-project --with "qiskit==2.5.2" python experiments/<script>.py
```

Si ya existe `backend/pyproject.toml`, usar `uv run` desde `backend/`. La
gráfica del QAE necesita además `--with matplotlib` (solo para el
experimento).

## Resumen

| # | Investigación | Resultado | Detalle |
| --- | --- | --- | --- |
| 1 | QAE del 2.2 | Pendiente del error −1.05 (QAE) contra −0.50 (Monte Carlo) sobre el mismo oráculo. Batería: 180 consultas, con las que QAE elige bien el túnel el 95 % de las veces y Monte Carlo cerca del 77 %. ~15 ms por estimación. Citas verificadas | [experiments/qae/resultados.md](experiments/qae/resultados.md) |
| 2 | Motor compartido | En 1.1, 1.2, 1.4, 2.3 y 2.4 la ficha clave es la que cruza el 90 % (búsqueda exhaustiva). El 1.4 se rediseñó (1 vuelta, 5 ranuras). `limite_fichas` del 2.4 = 5. Quedan fijadas `lectura`, `codificacion` y `ranuras` de cada JSON | [experiments/verificacion.md](experiments/verificacion.md) |
| 3 | Rediseño del 1.3 | Perilla de escala (D14) con 1 ranura: 67 % sin ella y 96–100 % con ella | [experiments/rediseno_1_3/resultados.md](experiments/rediseno_1_3/resultados.md) |
| 4 | Animación «gelatina» | Canvas 2D dentro de la consola, 0.5–0.7 ms por cuadro. Demo descartable en HTML | [experiments/gelatina/resultados.md](experiments/gelatina/resultados.md) |
| extra | Pérdida del 2.1 | Promedio de (1 − P(truco correcto))². El parameter-shift coincide con diferencias finitas | [experiments/parameter_shift/resultados.md](experiments/parameter_shift/resultados.md) |

## Hallazgos que cambiaron el diseño

- **1.3:** con dos ranuras se gana sin la perilla, apilando dos giros (duplica
  la escala). Por eso usa una sola ranura.
- **1.4:** con espirales cortas o pocos puntos la lección era falsa: la regla
  recta ganaba, o un circuito que leía un solo sensor sacaba 100 % en la
  cinta.
- **2.2:** con pocas mediciones por potencia, algunos alias de θ dominan el
  RMSE. Con 30 o más, la pendiente es −1. Se mantiene k = 0: sin él, una sola
  potencia no distingue θ de su alias.
- **2.2 (honestidad):** «el ruido se come la ventaja» exageraba. La fuente
  (Tanaka et al. 2021) dice que el error se satura.
- **2.4:** la caída de acierto con 7–8 fichas sale de llenar las ranuras; no
  es ruido y no se presenta como tal.

## Decisiones ya tomadas

El reparto en tres agentes está confirmado (sección final de `goal.md` y
sección 10 del breadboard).
