"""Inferencia exacta de los minijuegos de clasificación."""

from qiskit.quantum_info import Operator, Statevector
from app.circuits import build_circuit, validate_fichas


def p_accion(config, fichas, x):
    state = Statevector(build_circuit(config, fichas, x))
    reading = config["lectura"]
    # resultado se escribe en el orden de lectura.qubits, no en orden q1q0.
    index = sum(int(bit) << i for i, bit in enumerate(reading["resultado"]))
    return min(1.0, max(0.0, float(state.probabilities(reading["qubits"])[index])))


def predict(config, fichas, conjunto):
    validate_fichas(config, fichas)
    rows = []
    for obj in config[conjunto]:
        p = p_accion(config, fichas, obj["x"])
        action = config["lectura"]["accion" if p >= 0.5 else "otra"]
        rows.append({"id": obj["id"], "p_accion": p, "prediccion": action,
                     "correcto": action == config["objetos"][obj["objeto"]]["accion"]})
    return {"conjunto": conjunto, "predicciones": rows,
            "acierto": sum(row["correcto"] for row in rows) / len(rows)}


def decision_map(config, fichas, resolucion):
    validate_fichas(config, fichas)
    lo, hi = config.get("rango", [0, 1])
    centers = [lo + (i + 0.5) * (hi - lo) / resolucion for i in range(resolucion)]
    reading = config["lectura"]
    index = sum(int(bit) << i for i, bit in enumerate(reading["resultado"]))
    ordered = sorted(fichas, key=lambda f: (f["pos"], f["cable"]))
    # Cada rotación tiene solo `resolucion` ángulos distintos en la grilla.
    # Compilar esos operadores Qiskit una vez evita 1024 construcciones de QC;
    # cada punto sigue siendo una evolución Statevector, sin fórmulas sustitutas.
    operators = []
    for f in ordered:
        if f["ficha"] in ("giro_y", "giro_z"):
            operators.append([Operator(build_circuit(config, [f], [v, v])) for v in centers])
        else:
            operators.append([Operator(build_circuit(config, [f], [0, 0]))])
    values = []
    for row in range(resolucion):
        for col in range(resolucion):
            state = Statevector([1, 0, 0, 0])
            for f, ops in zip(ordered, operators):
                state = state.evolve(ops[(col if f["cable"] == 0 else row) if len(ops) > 1 else 0])
            values.append(min(1.0, max(0.0, float(state.probabilities(reading["qubits"])[index]))))
    return {"resolucion": resolucion, "valores": values}


def star_circuit(config, fichas):
    validate_fichas(config, fichas)
    obj = next(o for o in config["ejemplos"] if o["objeto"] == config["objeto_estrella"])
    return build_circuit(config, fichas, obj["x"])
