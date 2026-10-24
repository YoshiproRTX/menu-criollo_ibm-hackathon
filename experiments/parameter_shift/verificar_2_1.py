"""2.1 «Siéntate, Gira o Despega»: pérdida del Termómetro de Mareo y gradiente por parameter-shift.

Pérdida elegida: L(θ) = promedio sobre las órdenes de (1 − P(truco correcto))².
Va de 0 (Q-Boby obedece seguro) a 1 (hace siempre lo contrario): cabe en un
termómetro sin saturarse, a diferencia de la entropía cruzada, que no tiene tope.

Gradiente: ∂P/∂θ = [P(θ + π/2) − P(θ − π/2)] / 2 para cada perilla (RY), y la
regla de la cadena da ∂L/∂θ = promedio de −2(1 − P)·∂P/∂θ.

Correr:
  PYTHONIOENCODING=utf-8 uv run --no-project --with "qiskit==2.5.2" python experiments/parameter_shift/verificar_2_1.py
"""
import time

import numpy as np
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

SEMILLA = 3
PI = np.pi

# Órdenes: (silbato, mano), con grave/abajo = 0 y agudo/arriba = 1. Ejemplo
# provisional: «girar» cuando silbato y mano no coinciden; si no, «sentarse».
ORDENES = np.array([[0, 0], [1, 0], [0, 1], [1, 1]], dtype=float)
GIRAR = np.array([0, 1, 1, 0])


def circuito(orden, theta):
    qc = QuantumCircuit(2)
    qc.ry(PI * orden[0], 0)   # el silbato entra por el qubit 0
    qc.ry(PI * orden[1], 1)   # la mano entra por el qubit 1
    qc.ry(theta[0], 0)        # Perilla Dorada 1
    qc.ry(theta[1], 1)        # Perilla Dorada 2
    qc.cx(0, 1)
    return qc


def p_girar(orden, theta):
    return float(Statevector(circuito(orden, theta)).probabilities([1])[1])


def p_correcto(theta):
    p = np.array([p_girar(o, theta) for o in ORDENES])
    return np.where(GIRAR == 1, p, 1 - p)


def perdida(theta):
    return float(np.mean((1 - p_correcto(theta)) ** 2))


def gradiente_shift(theta):
    """Dos ejecuciones por perilla y por orden, con el ángulo desplazado ±π/2."""
    pc = p_correcto(theta)
    signo = np.where(GIRAR == 1, 1.0, -1.0)
    g = np.zeros(2)
    for j in range(2):
        mas, menos = theta.copy(), theta.copy()
        mas[j] += PI / 2
        menos[j] -= PI / 2
        dp = np.array([(p_girar(o, mas) - p_girar(o, menos)) / 2 for o in ORDENES]) * signo
        g[j] = np.mean(-2 * (1 - pc) * dp)
    return g


def gradiente_diferencias(theta, h=1e-5):
    g = np.zeros(2)
    for j in range(2):
        e = np.zeros(2)
        e[j] = h
        g[j] = (perdida(theta + e) - perdida(theta - e)) / (2 * h)
    return g


def entrenar(theta0, iteraciones=40, tasa=1.0):
    theta = np.array(theta0, dtype=float)
    historial = [{"iteracion": 0, "theta": theta.round(4).tolist(), "perdida": round(perdida(theta), 5)}]
    for i in range(1, iteraciones + 1):
        theta = theta - tasa * gradiente_shift(theta)
        historial.append({"iteracion": i, "theta": theta.round(4).tolist(), "perdida": round(perdida(theta), 5)})
    return theta, historial


if __name__ == "__main__":
    rng = np.random.default_rng(SEMILLA)

    # 1. Parameter-shift contra diferencias finitas en 50 puntos al azar
    dif = max(np.max(np.abs(gradiente_shift(t) - gradiente_diferencias(t)))
              for t in rng.uniform(-PI, PI, (50, 2)))
    print(f"1. Parameter-shift vs diferencias finitas (50 θ al azar): diferencia máx {dif:.1e}")

    # 2. Entrenamiento desde 20 inicios al azar
    finales, aciertos = [], []
    for _ in range(20):
        theta, hist = entrenar(rng.uniform(-PI, PI, 2))
        finales.append(hist[-1]["perdida"])
        pc = p_correcto(theta)
        aciertos.append(np.mean(pc > 0.5))
    print(f"2. 20 inicios al azar, 40 iteraciones, tasa 1.0: pérdida final mediana {np.median(finales):.4f} "
          f"(máx {np.max(finales):.4f}); obedece las 4 órdenes en {np.mean(np.array(aciertos) == 1):.0%} de los inicios")

    # 3. Una perilla congelada: ¿basta una sola?
    peores = []
    for t1 in np.linspace(-PI, PI, 13):
        mejor = min(perdida(np.array([t1, t2])) for t2 in np.linspace(-PI, PI, 721))
        peores.append((t1, mejor))
    print("3. Con la perilla 1 congelada, la mejor pérdida que alcanza la perilla 2:")
    for t1, l in peores:
        print(f"   θ1 = {t1:+.2f} rad → pérdida mínima {l:.3f}")

    # 4. Ejemplo de historial (como lo devolvería POST /train) y tiempo
    t0 = time.perf_counter()
    _, hist = entrenar([2.4, -1.9], iteraciones=30)
    ms = (time.perf_counter() - t0) * 1000
    print(f"4. Entrenamiento de 30 iteraciones desde θ = (2.4, −1.9): {ms:.0f} ms "
          f"({2 * 2 * len(ORDENES) + len(ORDENES)} circuitos por iteración)")
    for h in hist[::5]:
        print(f"   {h}")
