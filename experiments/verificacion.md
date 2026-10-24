# Verificación de los minijuegos del motor compartido

Script: `verificar_minijuegos.py` (Qiskit 2.5.2, semilla 21). Salida completa
en `verificacion_salida.txt`.

```bash
PYTHONIOENCODING=utf-8 uv run --no-project --with "qiskit==2.5.2" python experiments/verificar_minijuegos.py
```

## Método

- Para cada minijuego se recorren **todos** los circuitos posibles con sus
  fichas permitidas y ranuras (hasta 161 051 por minijuego).
- Los circuitos se agrupan según usen o no la ficha clave, y se toma el
  mejor acierto de cada grupo.
- La búsqueda se hace sobre ejemplos y cinta juntos, porque el circuito del
  jugador tiene que servir en ambos. Después se reporta cada conjunto por
  separado.
- La búsqueda usa un simulador numpy validado contra Qiskit (diferencia
  máxima 6.7·10⁻¹⁶ en 200 circuitos al azar). Cada circuito ganador se vuelve
  a evaluar con `Statevector`.
- La regla recta es la mejor posible, buscada en una grilla de ángulos y
  desplazamientos. Umbral de victoria: 90 %.

## Resultado

| Minijuego | Ficha clave | Mejor sin ella (cinta) | Mejor con ella (cinta · ejemplos) | Regla recta | Veredicto |
| --- | --- | --- | --- | --- | --- |
| 1.1 Pelusa | `giro_y` | 50 % (vacío) | 100 % · 100 % (un RY en q1) | 100 % | **Se sostiene** (tutorial: lo clásico también gana) |
| 1.2 Fregadero | `cable_gemelo` | 45 % | 100 % · 100 % (RY·RY → CX) | 75 % | **Se sostiene** |
| 1.3 Panqueques | Perilla de escala | 67 % | 96–100 % | 79 % | **Se sostiene** (ver `rediseno_1_3/`) |
| 1.4 Lavandería | Recarga de sensores tras el Cable Gemelo | 85 % · 70 % (cada sensor una vez); 87 % · 78 % (repetido sin CX de por medio) | 95 % · 90 % | 72 % | **Se sostiene, con el rediseño de abajo** |
| 2.3 Pista | `prisma` después de la fase | 50 % (sin prisma); 65 % (prisma sin H final) | 100 % · 100 % | 75 % | **Se sostiene** |
| 2.4 Copa | `cable_gemelo` y el límite de fichas | 63 % (sin CX); 78 % (con 4 fichas) | 97 % · 95 % (5 fichas) | 73 % | **Se sostiene** |

## Configuración que llena cada JSON (Q5)

| Minijuego | `lectura` | `codificacion.escala` | `ranuras` | `fichas_permitidas` | Datos |
| --- | --- | --- | --- | --- | --- |
| 1.1 | qubit 1 = `0` → barrer | π | 2 | `giro_y` | Polvo en (0.2, 0.25) y gato en (0.8, 0.75), σ = 0.08 |
| 1.2 | qubit 1 = `0` → lavar | π | 4 | `giro_y`, `prisma`, `cable_gemelo` | Esquinas XOR, σ = 0.08 |
| 1.3 | `00` → listo | 1.5 rad, perilla 0.5–8 | 1 | `giro_y`, `prisma`, `cable_gemelo` | Disco de radio 0.45 en [−1, 1]² |
| 1.4 | qubit 0 = `0` → camisa | π | **5** | `giro_y`, `prisma`, `cable_gemelo` | Espiral doble de **1 vuelta** en [−1, 1]², 50 puntos por brazo |
| 2.3 | qubit 1 = `0` → saltar | π | 4 | `prisma`, `giro_z`, `cable_gemelo` | Tablero 2×2, centros en 0.25 y 0.75, σ = 0.06 |
| 2.4 | qubit 1 = `0` → atrapar | 2π | 4 | catálogo completo; **`limite_fichas`: 5** | Pasillo diagonal \|viento − giro\| < 0.22 |

## Detalle por minijuego

### 1.1 Pelusa Rebelde

Sin fichas el robot barre todo (50 %, gato incluido). Un solo `giro_y` en el
cable del calor llega al 100 %. La regla recta también gana: es el tutorial
donde Chispa dice que, si una recta basta, no hace falta lo cuántico.

### 1.2 Fiebre en el Fregadero

Confirma `verificar_modelo_a.py` con búsqueda exhaustiva: ningún circuito sin
`cable_gemelo` pasa del 45 % en la cinta. El mínimo ganador es RY·RY → CX
(3 fichas).

### 1.4 Lavandería en Remolino — rediseño

Con el diseño original (4 ranuras, espirales de pocas vueltas y pocos puntos)
la lección no se sostenía. Con media vuelta, la regla recta ya ganaba. Con 16
puntos por brazo, un circuito que leía un solo sensor sacaba 100 % en la
cinta y 70 % en los ejemplos: la «espiral» era demasiado pobre.

Diseño verificado: espiral de 1 vuelta, 50 puntos por brazo, 5 ranuras,
lectura qubit 0 y escala π.

| Grupo de circuitos | Cinta | Ejemplos |
| --- | --- | --- |
| Cada sensor se carga una sola vez | 85 % | 70 % |
| Sensores repetidos sin Cable Gemelo entre cargas (apilar giros) | 87 % | 78 % |
| **Sensores → Cable Gemelo → sensores otra vez** | **95 %** | **90 %** |

Es exactamente la lección de `minijuegos.md`. Apilar giros, que en el 1.3
duplicaba la escala, aquí no alcanza. El circuito ganador más corto tiene
7 fichas: H0·RY1 → CX(0→1) → RY1 → RY0·H1 → CX(1→0).

Base: Pérez-Salinas et al. (2020), *Data re-uploading for a universal quantum
classifier*, Quantum 4, 226 (arXiv:1907.02085). Y Schuld, Sweke y Meyer
(2021), *The effect of data encoding on the expressive power of variational
quantum machine learning models*, Phys. Rev. A 103, 032430
(arXiv:2008.08605): repetir las compuertas de codificación da acceso a
espectros de frecuencias más ricos. Ambos abstracts verificados en arXiv el
2026-10-24.

### 2.3 Pista Láser-Musical

Con `prisma`, `giro_z` y `cable_gemelo`:

- Sin prisma, los giros de fase no cambian ninguna probabilidad (50 %).
- Con prisma pero sin H después de la fase, la fase sigue invisible (65 %).
- El sándwich H → RZ → CX → H llega al 100 %.

La lección «la fase solo se ve si una H la hace interferir» es cierta. El
mínimo ganador tiene 6 fichas: H·H → RZ·RZ → CX → H. Con lectura `00` o
escala 2π no se gana: hay que usar la configuración de la tabla.

### 2.4 Gran Copa Canina

Mejor acierto por número de fichas, con 4 ranuras y el catálogo completo:

| Fichas | 0 | 1 | 2 | 3 | 4 | **5** | 6 | 7 | 8 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Mejor acierto | 36 % | 64 % | 64 % | 70 % | 78 % | **96 %** | 96 % | 78 % | 72 % |

**`limite_fichas`: 5**, el mínimo exacto, para el ⭐⭐⭐. Si resulta demasiado
difícil, 6 también deja ganar. La caída con 7 y 8 fichas sale de llenar casi
todas las ranuras; **no** es un efecto de ruido y no se presenta como tal. El
ganador mínimo es H1 → CX(1→0) → RY0·RY1 → CX(0→1).

## Avisos

- Los datos de cada minijuego se generan con la semilla del script. Al
  escribir los JSON de `content/` hay que copiar esos puntos, o volver a
  verificar si se cambian.
- El 2.3 y el 2.4 usan escalas y lecturas distintas de las del 1.2. Por eso
  `codificacion` y `lectura` viven en el JSON de cada minijuego.
