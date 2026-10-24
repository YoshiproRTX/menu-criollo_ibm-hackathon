# Breadboard — 1.2 «Fiebre en el Fregadero» (motor compartido)

Mapa de pantallas, interacciones y código del primer minijuego de punta a
punta. Como el motor es compartido, sirve de base para 1.1, 1.3, 1.4, 2.3 y 2.4.
De aquí salen el contrato de la API, el formato de configuración y las
fronteras entre los carriles de los agentes.

Cómo leer las tablas: **P** = lugar (pantalla o modal que bloquea lo de atrás),
**U** = algo que el jugador ve o toca, **N** = código, **S** = estado guardado.
*Dispara* = qué llama (flujo de control); *Alimenta* = adónde van los datos.

---

## 0. Hallazgo verificado con Qiskit

Probado en local con `qiskit==2.5.2` y 12 objetos XOR con ruido:

| Modelo | Sin CX | Con CX | ¿El CX importa? |
| --- | --- | --- | --- |
| **A. Lectura fija:** P(lavar) = probabilidad de medir 0 en el qubit 1 | 50 % | **100 %** | **Sí.** El CX mete la combinación de ambos sensores en el qubit que se lee |
| **B. Kernel de fidelidad (QSVM de libro)** | — | — | **No.** El kernel sale idéntico con y sin CX |

Mapa de decisión 32×32 con `Statevector` exacto: **250 ms**.

**Por qué pasa (verificado en el paper, `papers/schuld 2021.pdf`):** Schuld
(2021), *Supervised quantum machine learning models are kernel methods*,
arXiv:2101.11020. Un modelo cuántico tiene dos partes, la codificación de los
datos y la medición. Todo circuito que va *después* de la codificación forma
parte de la medición (figura 2 del paper). El modelo es lineal sobre los
estados que codifican los datos: **la codificación fija el kernel y la
medición traza la frontera** (sección II). En el 1.2, los Giro-Sensores son la
codificación y el Cable Gemelo cambia lo que se mide. Por eso el CX no altera
el kernel (modelo B) pero sí la predicción (modelo A).

Frase segura para el cromo: *«Un modelo cuántico es un método de kernel: tus
Giro-Sensores codificaron los datos y tu Cable Gemelo cambió lo que mide el
robot.»* Matiz del paper: Schuld evita el término «feature map cuántico»; usa
«modelo cuántico» y «kernel cuántico».

Extra para 1.3 Panqueques: con solo dos RY y leyendo `00` sale una isla central
**sin necesitar CX**. Rediseño verificado (`experiments/rediseno_1_3/resultados.md`):
la lección es la **escala de codificación** (D14). Con 1 ranura por cable y la
escala de fábrica, ningún circuito pasa del 67 %; con la perilla entre 2.5 y
5.5 rad se llega al 96–100 %. La regla recta se queda en 79 %.

---

## 1. Decisiones tomadas

| # | Decisión | Elegido |
| --- | --- | --- |
| D1 | Modelo del cerebro cuántico en el motor compartido | **A. Lectura fija:** el jugador diseña el circuito y se lee la probabilidad de un resultado. Sin entrenamiento automático |
| D2 | Relación con la consigna (SVM ➔ QSVM) | **Modelo cuántico como método de kernel,** con la cita de Schuld (2021) verificada |
| D3 | Dónde se calcula el chip simple (la regla) | **Frontend (TypeScript)** |
| D4 | Dónde viven los datos del minijuego | **`content/minigames/<id>.json`,** leído por backend y frontend |
| D5 | Endpoints | **REST, un recurso por endpoint:** predicciones, mapa de decisión, Rayos-X y sorteo de rareza (sección 8) |
| D6 | Cuándo se recalcula el mapa | **Al soltar cada ficha,** con espera de 150 ms |
| D7 | Entrenamiento frente a prueba | **Ejemplos etiquetados en el radar** para diseñar; **objetos nuevos en la cinta** para medir el acierto |
| D8 | Condición de victoria | **Umbral por defecto de 90 %** en la cinta, ajustable por minijuego |
| D9 | Rareza del cromo | **1 shot real** del circuito ganador sobre el objeto estrella; `00`, `01`, `10`, `11` = común, rara, holográfica, legendaria; se muestran las probabilidades |
| D10 | Estado del frontend | **zustand** |
| D11 | Persistencia de álbumes | **`localStorage`** |
| D12 | Rayos-X | **Diagrama en texto** (`qc.draw("text")`) y código Qiskit |
| D13 | Comando único | **`package.json` en la raíz con `concurrently`** (`uv run uvicorn` y `vite`), con proxy de Vite de `/api` a `:8000` |
| D14 | Perilla de escala (1.3) | **Campo opcional `escala` en cada ficha de giro,** con rango en el JSON del minijuego. Los cuerpos sin `escala` siguen siendo válidos y usan la del JSON. Las Perillas Doradas del Nivel 2 siguen el mismo patrón (campo numérico opcional en la ficha, rango en el JSON) |
| D15 | Endpoint del 2.2 | **Una llamada por método** que devuelve la trayectoria completa de una corrida real (sección 8) |
| D16 | Ruido en el 2.4 | **Límite de fichas como regla del juego y estática solo decorativa.** El robot decide siempre con el circuito real sin ruido. Sin `qiskit-aer` |
| D17 | Endpoint del 2.1 | **`train`** devuelve el historial real de pérdida y de θ; las perillas a mano usan `predictions` |
| D18 | Pruebas | **pytest** (backend, con uv) y **Vitest** (frontend) |

---

## 2. Flujo en 8 pasos

1. Se entra a la casa por la sala (1.1) y se pasa a la cocina (P1). Cae la
   nota adhesiva con los ejemplos.
2. El jugador pulsa **¡Hazlo, Q-Anacleto!** con el chip simple. La regla
   clasifica en el frontend y Q-Anacleto tira la vajilla de la abuela: se
   desbloquea un desastre.
3. Chispa sugiere abrir el cerebro. Se abre la consola (P2).
4. El radar muestra los ejemplos y un aro parpadea sobre el ejemplo mal clasificado.
5. El jugador cambia al chip cuántico y encaja dos Giro-Sensores y un Cable
   Gemelo. Con cada ficha el backend recalcula el mapa y las predicciones de
   los ejemplos, y el mapa se dobla.
6. **¡Prueba otra vez!** La cinta trae objetos nuevos y el backend decide cada
   acción. Si el acierto llega al umbral, gana.
7. Al ganar se lanza 1 shot real y se revela el cromo con su rareza (P3).
   Rayos-X (P4) muestra el circuito y el código.
8. El cromo y los desastres quedan en los álbumes (P5).

---

## 3. Lugares

| # | Lugar | Descripción |
| --- | --- | --- |
| P0 | Casa: sala y pasillo | Recorrido natural; desde aquí se entra a la cocina. Baño y habitación son simples, sin minijuego |
| P1 | Cocina (escena 3D) | Mundo isométrico con Q-Anacleto y la cinta transportadora |
| P1.1 | Nota adhesiva | Subárea: aparece 1.5 s al inicio, no bloquea |
| P1.2 | HUD | Subárea: acierto, Chispa, botones de cerebro y álbum |
| P2 | Consola del cerebro | Modal tipo Game Boy |
| P2.1 | Radar 2D | Subárea compartida por todos los minijuegos de clasificación |
| P2.2 | Panel chip simple | Subárea visible en modo simple |
| P2.3 | Panel chip cuántico | Subárea visible en modo cuántico |
| P3 | Revelación del cromo | Modal de victoria |
| P4 | Rayos-X Qiskit | Modal sobre P3 |
| P5 | Álbumes | Modal: cromos y desastres |
| P6 | Backend | FastAPI con Qiskit |

## 4. Interfaz (U)

| # | Lugar | Elemento | Control | Dispara | Alimentado por |
| --- | --- | --- | --- | --- | --- |
| U0 | P0 | Puerta a la cocina | click | → P1 | — |
| U1 | P1.1 | Nota adhesiva con ejemplos | render | — | S1 |
| U2 | P1 | Botón **¡Hazlo, Q-Anacleto!** | click | → N10 | — |
| U3 | P1 | Cinta con objetos de prueba | render | — | S1 |
| U4 | P1 | Q-Anacleto (acción o desastre) | render | — | N12 |
| U5 | P1.2 | Burbuja de Chispa | render | — | N15 |
| U6 | P1.2 | Contador de acierto | render | — | S5 |
| U7 | P1.2 | Botón abrir cerebro | click | → P2 | — |
| U8 | P1.2 | Aviso «¡Nuevo desastre!» | render | — | N13 |
| U9 | P1.2 | Botón álbum | click | → P5 | — |
| U10 | P2 | Interruptor simple / cuántico | click | → N20 | S2 |
| U11 | P2.1 | Puntos de ejemplo etiquetados | render | — | S1 |
| U12 | P2.1 | Mapa de decisión (se dobla «como gelatina») | render | — | S6 |
| U13 | P2.1 | Aro sobre el ejemplo mal clasificado | render | — | S5 |
| U14 | P2.2 | Regla: arrastrar y girar | drag | → N21 | S3 |
| U15 | P2.3 | Ranuras de los cables q0 y q1 | drop | → N22 | S4 |
| U16 | P2.3 | Bandeja de fichas permitidas | drag | → U15 | S1 |
| U17 | P2.3 | Silueta guía (primera vez) | render | — | N15 |
| U18 | P2 | Botón **¡Prueba otra vez!** | click | → P1, → N10 | — |
| U19 | P3 | Cromo con destello según rareza | render | — | S8 |
| U20 | P3 | Probabilidades de cada rareza | render | — | S8 |
| U21 | P3 | Botón Rayos-X | click | → N42, → P4 | — |
| U22 | P3 | Botón continuar | click | → P1 (siguiente minijuego) | — |
| U23 | P4 | Diagrama del circuito y código Qiskit | render | — | S7 |
| U24 | P5 | Grilla de cromos | render | — | S8 |
| U25 | P5 | Grilla de desastres | render | — | S9 |
| U26 | P2.3 | Perilla de escala en un Giro-Sensor (solo si el minijuego define `perilla_escala`, p. ej. 1.3) | drag | → N23 | S4 |

## 5. Código del frontend (N)

| # | Carpeta | Código | Control | Dispara | Alimenta |
| --- | --- | --- | --- | --- | --- |
| N1 | `state/` | `loadMinigame(id)`: importa el JSON de `content/` | call | → S1 | — |
| N10 | `state/` | `runTask()`: elige chip según S2, conjunto `prueba` | call | → N11 (simple) o → N40 (cuántico), → N12 | — |
| N11 | `brain/` | `classifyLinear(regla, objetos)` | call | → S5 | → N10 |
| N12 | `world/` | `playOutcome(predicciones)`: anima cada objeto | call | → N13 (si falla), → N14 | → U4 |
| N13 | `meta/` | `registerDisaster(objeto, accion)` | call | → S9 | → U8 |
| N14 | `state/` | `checkWin(acierto, umbral)` | call | → N30 (gana) o → N15 (falla) | — |
| N15 | `meta/` | `chispaSay(evento)`: textos de S1 | call | — | → U5, U17 |
| N20 | `brain/` | `setMode(modo)` | call | → S2 | — |
| N21 | `brain/` | `updateRuler(angulo, desplazamiento)` | call | → S3, → N11 (vista previa) | — |
| N22 | `brain/` | `placeFicha(cable, pos, ficha)` | call | → S4, → N40 y N43 (conjunto `ejemplos`, espera 150 ms) | — |
| N23 | `brain/` | `setEscala(cable, pos, escala)`: al soltar la perilla | call | → S4, → N40 y N43 (conjunto `ejemplos`, espera 150 ms) | — |
| N30 | `meta/` | `revealCromo()` | call | → N41, → P3 | — |
| N40 | `api/` | `getPredictions(id, circuito, conjunto)` | call | → N50 | → S5 |
| N41 | `api/` | `drawRarity(id, circuito)` | call | → N55 | → S8 |
| N42 | `api/` | `getXray(id, circuito)` | call | → N56 | → S7 |
| N43 | `api/` | `getDecisionMap(id, circuito)` | call | → N54 | → S6 |

## 6. Backend (P6)

| # | Módulo | Código | Control | Dispara | Alimenta |
| --- | --- | --- | --- | --- | --- |
| N50 | `api.py` | `POST /api/minigames/{id}/predictions` | call | → N51, N52, N53 | → N40 |
| N51 | `content.py` | `load_minigame(id)` | call | — | → N50, N54, N55, N56 |
| N52 | `circuits.py` | `build_circuit(fichas, x)`: valida contra las fichas permitidas | call | — | → N53, N54, N55, N56 |
| N53 | `model.py` | `predict(objetos)`: probabilidades exactas con `Statevector` y la lectura del config | call | — | → N50 |
| N54 | `api.py` + `model.py` | `POST /api/minigames/{id}/decision-map` | call | → N51, N52 | → N43 |
| N55 | `api.py` | `POST /api/minigames/{id}/rarity-draws`: 1 shot con `StatevectorSampler` sobre el objeto estrella | call | → N51, N52 | → N41 |
| N56 | `api.py` + `xray.py` | `POST /api/minigames/{id}/xray`: `qc.draw("text")` y el código | call | → N51, N52 | → N42 |

## 7. Estado (S)

| # | Dónde | Estado | Lo leen |
| --- | --- | --- | --- |
| S1 | frontend | Configuración del minijuego (de `content/`) | U1, U3, U11, U16, N14, N15 |
| S2 | frontend | Modo: `simple` o `cuantico` | U10, N10 |
| S3 | frontend | Regla: ángulo y desplazamiento | U14, N11 |
| S4 | frontend | Circuito: lista de fichas colocadas | U15, N40–N43 |
| S5 | frontend | Último resultado: predicciones y acierto | U6, U13, N12 |
| S6 | frontend | Mapa de decisión (actual y anterior, para la animación) | U12 |
| S7 | frontend | Rayos-X: diagrama y código | U23 |
| S8 | `localStorage` | Álbum de cromos con rareza | U19, U20, U24 |
| S9 | `localStorage` | Desastres vistos | U25 |
| S10 | `content/` | `minigames/fregadero.json` | N1, N51 |

---

## 8. Borrador del contrato de la API

Todas las rutas reciben el circuito del jugador en el cuerpo. Los datos del
minijuego los lee el backend de `content/`; el frontend nunca los envía.
Se usa `POST` porque el circuito va en el cuerpo; `rarity-draws` además no es
idempotente (cada llamada es un sorteo nuevo).

Cuerpo común:

```json
{
  "circuito": {
    "fichas": [
      { "ficha": "giro_y", "cable": 0, "pos": 0 },
      { "ficha": "giro_y", "cable": 1, "pos": 0 },
      { "ficha": "cable_gemelo", "cable": 0, "pos": 1 }
    ]
  }
}
```

### `POST /api/minigames/{id}/predictions`

Cuerpo común más `"conjunto": "ejemplos" | "prueba"`.

```json
{
  "conjunto": "prueba",
  "predicciones": [
    { "id": "plato-1", "p_accion": 0.97, "prediccion": "lavar", "correcto": true }
  ],
  "acierto": 1.0,
  "meta": { "qiskit": "2.5.2", "simulador": "Statevector", "ms": 12 }
}
```

### `POST /api/minigames/{id}/decision-map`

Cuerpo común más `"resolucion": 32` (opcional). Orden de `valores`:
`valores[fila * resolucion + columna]`. La columna es el sensor 0, de 0 a 1;
la fila es el sensor 1, de 0 a 1, con la fila 0 abajo. La animación que lo
consume está descrita en `experiments/gelatina/resultados.md`.

```json
{
  "resolucion": 32,
  "valores": [0.98, 0.95, "… 1024 valores de P(acción positiva), fila por fila"],
  "meta": { "qiskit": "2.5.2", "simulador": "Statevector", "ms": 250 }
}
```

### `POST /api/minigames/{id}/xray`

```json
{
  "diagrama": "     ┌──────────┐…",
  "codigo": "qc = QuantumCircuit(2)\nqc.ry(pi * humedad, 0)\n…"
}
```

### `POST /api/minigames/{id}/rarity-draws`

```json
{
  "resultado": "10",
  "rareza": "holografica",
  "probabilidades": { "comun": 0.41, "rara": 0.33, "holografica": 0.19, "legendaria": 0.07 },
  "shots": 1
}
```

### Endpoints propios del 2.2 y el 2.1 (borrador, D15 y D17)

`POST /api/minigames/doble-hueso/estimates`: una llamada por método. La
trayectoria sale de **una sola corrida real**; el frontend la anima punto a
punto, sin suavizarla.

```json
{ "metodo": "qae", "tunel": "a", "presupuesto": 200, "semilla": 7 }
```

```json
{
  "metodo": "qae",
  "tunel": "a",
  "trayectoria": [
    { "consultas": 10, "estimacion": 0.27, "error": 0.03 },
    { "consultas": 40, "estimacion": 0.31, "error": 0.01 }
  ],
  "estimacion": 0.31,
  "consultas_usadas": 190,
  "meta": { "qiskit": "2.5.2", "simulador": "StatevectorSampler", "ms": 120 }
}
```

`metodo` es `monte_carlo` o `qae`; ambos usan el mismo oráculo A. Las
consultas se cuentan como Σ shots·(2k+1). `error` es |estimación − p real|,
con la p real del JSON del minijuego. `semilla` es opcional (pruebas y video).
Valores verificados (`experiments/qae/resultados.md`): QAE con potencias
k = 0, 1, 2, 4 y 5 shots por potencia, es decir, 90 consultas por túnel.
Batería del minijuego: 180 consultas. Con ella QAE elige bien el túnel el
95 % de las veces y Monte Carlo cerca del 77 %. Monte Carlo usa las mismas
90 consultas por túnel, cada una con k = 0. Una estimación tarda unos 15 ms.

`POST /api/minigames/{id}/train` (2.1): recibe `theta_inicial`, `iteraciones`
y `tasa`; devuelve `historial` (`iteracion`, `theta`, `perdida`) y `meta`. El
gradiente es parameter-shift (dos ejecuciones por perilla, ±π/2). Corre bajo
demanda, nunca por fotograma. Pérdida: promedio de (1 − P(truco correcto))²,
entre 0 y 1 (`experiments/parameter_shift/resultados.md`).

### Errores

| Código | Cuándo |
| --- | --- |
| `404` | El minijuego no existe |
| `422` | Ficha no permitida, ranura ocupada, cable fuera de rango, `escala` enviada en un minijuego sin perilla o fuera de su rango, o más fichas que `limite_fichas` |

### Catálogo de fichas (común a todos los minijuegos)

`escala` es opcional en `giro_y` y `giro_z`: si no viene, se usa la de
`codificacion.escala`. Solo se acepta si el minijuego define `perilla_escala`.

```json
{ "ficha": "giro_y", "cable": 0, "pos": 0, "escala": 3.5 }
```

| Ficha | Compuerta | Ocupa | Efecto |
| --- | --- | --- | --- |
| `giro_y` | `RY(escala · x[cable])` | 1 cable | El cable *i* lee el sensor *i* (codificación) |
| `giro_z` | `RZ(escala · x[cable])` | 1 cable | Igual, en el eje Z |
| `prisma` | `H` | 1 cable | Moneda cuántica |
| `cable_gemelo` | `CX(cable → otro)` | ambos cables en esa posición | Combina los dos sensores en el qubit destino |

## 9. Borrador del formato de configuración

Campos opcionales que no usa el 1.2:

| Campo | Lo usa | Formato |
| --- | --- | --- |
| `perilla_escala` | 1.3 | `{ "min": 0.5, "max": 8, "paso": 0.25 }`, en radianes por unidad de sensor. El 1.3 usa además `ranuras: 1` y `codificacion.escala: 1.5` |
| `limite_fichas` | 2.4 | Número máximo de fichas; pasarse dispara la Tormenta NISQ (D16) |

`content/minigames/fregadero.json`

```json
{
  "id": "fregadero",
  "nivel": 1,
  "escenario": "casa",
  "habitacion": "cocina",
  "titulo": "¡Fiebre en el Fregadero!",
  "dificultad": 1,
  "sensores": ["humedad", "peso"],
  "codificacion": { "escala": 3.14159 },
  "lectura": { "qubits": [1], "resultado": "0", "accion": "lavar", "otra": "basura" },
  "ranuras": 4,
  "fichas_permitidas": ["giro_y", "cable_gemelo", "prisma"],
  "objetos": {
    "plato": { "emoji": "🍽️", "accion": "lavar" },
    "cucharita": { "emoji": "🥄", "accion": "lavar" },
    "sandia": { "emoji": "🍉", "accion": "basura" },
    "servilleta": { "emoji": "🧻", "accion": "basura" }
  },
  "ejemplos": [{ "id": "ej-1", "objeto": "plato", "x": [0.9, 0.9] }],
  "prueba": [{ "id": "plato-1", "objeto": "plato", "x": [0.86, 0.95] }],
  "victoria": { "acierto_minimo": 0.9 },
  "objeto_estrella": "plato",
  "desastres": [
    { "id": "triple", "objeto": "plato", "accion_erronea": "basura", "texto": "¡TRIPLE!" }
  ],
  "chispa": {
    "inicio": "¡Lava lo que sirve, tira lo demás!",
    "primer_fallo": "La regla es recta… y los platos no.",
    "primera_ficha": "¡CLACK! Mira cómo se dobla el mapa.",
    "victoria": "Una red neuronal clásica también podría. ¡Pero tú lo hiciste con qubits!"
  },
  "cromo": {
    "concepto": "SVM ➔ modelo cuántico como método de kernel",
    "titulo": "Cable Gemelo",
    "lineas": [
      "Tus Giro-Sensores codificaron humedad y peso en dos qubits.",
      "Tu Cable Gemelo cambió lo que mide Q-Anacleto.",
      "Así funciona un modelo cuántico de kernel (Schuld, 2021)."
    ]
  }
}
```

---

## 10. Fronteras por carril

Tres agentes (confirmado):

| Carril | Es dueño de | Carpeta |
| --- | --- | --- |
| 1. QML y contenido | P6, N50–N56, S10 (recibe los textos del carril 3) | `backend/`, `content/` |
| 2. Cerebro e integración | P2, U10–U18, U26, N1, N10, N11, N14, N20–N23, cliente de la API N40–N43, store S1–S7 | `frontend/src/brain/`, `frontend/src/api/`, `frontend/src/state/` |
| 3. Mundo y meta | P0, P1, P3–P5, U0–U9, U19–U25, N12, N13, N15, N30, S8–S9 | `frontend/src/world/`, `frontend/src/meta/` |

El store (S1–S9), el contrato (sección 8) y el formato (sección 9) se fijan en
los primeros 15 minutos. Después, cada carril trabaja contra ellos con datos
falsos hasta que el backend responda.

## 11. Desconocidos

Plan detallado en [siguiente-sesion.md](siguiente-sesion.md).
