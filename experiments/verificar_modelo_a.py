"""Verifica dos modelos candidatos para el motor compartido (1.2 Fregadero, XOR)."""
import time
import numpy as np
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

rng = np.random.default_rng(7)
# 12 objetos de prueba: esquinas XOR con ruido. x en [0,1]: (humedad, peso)
corners = np.array([[0, 0], [1, 1], [0, 1], [1, 0]] * 3, dtype=float)
X = np.clip(corners + rng.normal(0, 0.08, corners.shape), 0, 1)
y = np.array([1, 1, 0, 0] * 3)  # 1 = lavar (ambos altos o ambos bajos)


def feature_map(x, cx):
    qc = QuantumCircuit(2)
    qc.ry(np.pi * x[0], 0)
    qc.ry(np.pi * x[1], 1)
    if cx:
        qc.cx(0, 1)
    return qc


def p_q1_zero(x, cx):
    """Modelo A: lectura fija. P(lavar) = P(medir 0 en el qubit 1)."""
    probs = Statevector(feature_map(x, cx)).probabilities([1])
    return probs[0]


for cx in (False, True):
    preds = np.array([p_q1_zero(x, cx) > 0.5 for x in X]).astype(int)
    print(f"Modelo A, CX={cx}: acierto {np.mean(preds == y):.0%}")

# Modelo B: kernel de fidelidad. ¿Cambia algo el CX al final?
def kernel(Xa, Xb, cx):
    Sa = np.array([Statevector(feature_map(x, cx)).data for x in Xa])
    Sb = np.array([Statevector(feature_map(x, cx)).data for x in Xb])
    return np.abs(Sa.conj() @ Sb.T) ** 2

print("Modelo B, kernel igual con y sin CX:",
      np.allclose(kernel(X, X, False), kernel(X, X, True)))

# Costo del mapa de decisión 32x32 con statevector exacto
g = np.linspace(0, 1, 32)
t0 = time.perf_counter()
grid = np.array([[p_q1_zero([a, b], True) for a in g] for b in g])
print(f"Mapa 32x32 exacto: {(time.perf_counter() - t0) * 1000:.0f} ms")

# 1.3 Panqueques: ¿sale una isla central leyendo '00'? x = desviación en [-1,1]
def p00(x):
    qc = QuantumCircuit(2)
    qc.ry(np.pi * x[0], 0)
    qc.ry(np.pi * x[1], 1)
    return Statevector(qc).probabilities()[0]
print("1.3 isla: centro", round(p00([0, 0]), 2), "| borde", round(p00([0.8, 0]), 2),
      "| esquina", round(p00([0.6, 0.6]), 2))
