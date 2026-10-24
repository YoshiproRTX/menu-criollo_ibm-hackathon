"""Exporta los dos mapas reales del 1.2 (XOR sin CX y con CX) para la demo de la gelatina.

Mismo modelo que experiments/verificar_modelo_a.py: P(lavar) = P(medir 0 en el
qubit 1), con RY(π·humedad) en q0 y RY(π·peso) en q1.

Convención de `valores` (la misma que el endpoint decision-map):
valores[fila * resolucion + columna], columna = sensor 0 (humedad) de 0 a 1,
fila = sensor 1 (peso) de 0 a 1, con la fila 0 abajo.

Correr:
  uv run --no-project --with "qiskit==2.5.2" python experiments/gelatina/exportar_mapas.py
"""
import json
from pathlib import Path

import numpy as np
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

RES = 32
AQUI = Path(__file__).parent


def p_lavar(x, cx):
    qc = QuantumCircuit(2)
    qc.ry(np.pi * x[0], 0)
    qc.ry(np.pi * x[1], 1)
    if cx:
        qc.cx(0, 1)
    return float(Statevector(qc).probabilities([1])[0])


def mapa(cx):
    g = np.linspace(0, 1, RES)
    return [round(p_lavar([h, p], cx), 4) for p in g for h in g]


rng = np.random.default_rng(7)
esquinas = np.array([[0, 0], [1, 1], [0, 1], [1, 0]] * 3, dtype=float)
X = np.clip(esquinas + rng.normal(0, 0.08, esquinas.shape), 0, 1)
y = ["lavar", "lavar", "basura", "basura"] * 3

datos = {
    "resolucion": RES,
    "sin_cx": mapa(False),
    "con_cx": mapa(True),
    "ejemplos": [{"x": [round(a, 3), round(b, 3)], "accion": e} for (a, b), e in zip(X, y)],
    "meta": {"qiskit": "2.5.2", "simulador": "Statevector", "lectura": "P(q1 = 0) = lavar"},
}
(AQUI / "mapas.js").write_text("window.MAPAS = " + json.dumps(datos) + ";\n", encoding="utf-8")
print("mapas.js escrito:", len(datos["sin_cx"]), "valores por mapa")
