"""Modelo y regla de la cadena de experiments/parameter_shift/verificar_2_1.py."""

import numpy as np
from qiskit import QuantumCircuit
from qiskit.quantum_info import Operator, Statevector


def circuito(order, theta):
    qc = QuantumCircuit(2)
    qc.ry(np.pi * order[0], 0)
    qc.ry(np.pi * order[1], 1)
    qc.ry(float(theta[0]), 0)
    qc.ry(float(theta[1]), 1)
    qc.cx(0, 1)
    return qc


def validate_theta(config, theta):
    if len(theta) != 2 or any(not np.isfinite(t) or not config["perillas"]["min"] <= t <= config["perillas"]["max"] for t in theta):
        raise ValueError("Theta está fuera del rango permitido para las dos perillas.")


def theta_from_fichas(config, fichas):
    theta = list(config["theta_inicial"])
    occupied = set()
    for f in fichas:
        if f["ficha"] != "perilla_dorada" or f["cable"] not in (0, 1) or f["pos"] != 0 or "theta" not in f or "escala" in f:
            raise ValueError("Trucos admite dos Perillas Doradas en la posición 0, con theta.")
        if f["cable"] in occupied:
            raise ValueError("La ranura ya está ocupada.")
        occupied.add(f["cable"])
        theta[f["cable"]] = f["theta"]
    validate_theta(config, theta)
    return np.array(theta)


def probabilities(config, theta):
    # Para las cuatro órdenes binarias, RY(π·x) prepara un estado de base.
    # Calcular el operador Qiskit una vez permite leer sus cuatro columnas,
    # evitando reconstruir el mismo ansatz cuatro veces por desplazamiento.
    if all(x in (0, 1) for order in config["ordenes"] for x in order["x"]):
        qc = QuantumCircuit(2)
        qc.ry(float(theta[0]), 0)
        qc.ry(float(theta[1]), 1)
        qc.cx(0, 1)
        operator = Operator(qc).data
        return np.clip([float(Statevector(operator[:, int(o["x"][0]) + 2*int(o["x"][1])]).probabilities([1])[1]) for o in config["ordenes"]], 0, 1)
    return np.clip([float(Statevector(circuito(o["x"], theta)).probabilities([1])[1]) for o in config["ordenes"]], 0, 1)


def correct_probabilities(config, theta):
    p = probabilities(config, theta)
    return np.array([value if order["truco"] == "girar" else 1-value for value, order in zip(p, config["ordenes"])])


def loss(config, theta):
    return float(np.mean((1 - correct_probabilities(config, theta))**2))


def gradient_shift(config, theta):
    theta = np.array(theta, dtype=float)
    pc = correct_probabilities(config, theta)
    sign = np.array([1 if o["truco"] == "girar" else -1 for o in config["ordenes"]])
    gradient = np.zeros(2)
    for j in range(2):
        offset = np.eye(2)[j] * np.pi / 2
        dp = (probabilities(config, theta+offset) - probabilities(config, theta-offset)) * sign / 2
        gradient[j] = np.mean(-2 * (1-pc) * dp)
    return gradient


def predict_tricks(config, theta, conjunto="prueba"):
    validate_theta(config, theta)
    p = probabilities(config, theta)
    rows = []
    for value, order in zip(p, config["ordenes"]):
        action = "girar" if value >= 0.5 else "sentarse"
        rows.append({"id": order["id"], "p_accion": float(value if order["truco"] == "girar" else 1-value),
                     "prediccion": action, "correcto": action == order["truco"]})
    return {"conjunto": conjunto, "predicciones": rows,
            "acierto": sum(row["correcto"] for row in rows) / len(rows),
            "perdida": float(np.mean([(1-row["p_accion"])**2 for row in rows]))}


def train_tricks(config, theta_inicial, iteraciones=30, tasa=1.0):
    validate_theta(config, theta_inicial)
    theta = np.array(theta_inicial, dtype=float)
    history = [{"iteracion": 0, "theta": theta.tolist(), "perdida": loss(config, theta)}]
    for i in range(1, iteraciones+1):
        theta = theta - tasa * gradient_shift(config, theta)
        # RY es periódica en probabilidades: conservar ángulos de UI en [-π, π].
        theta = (theta + np.pi) % (2*np.pi) - np.pi
        history.append({"iteracion": i, "theta": theta.tolist(), "perdida": loss(config, theta)})
    return {"historial": history}
