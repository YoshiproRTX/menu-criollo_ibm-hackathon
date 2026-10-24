"""Circuitos de dos qubits construidos desde las fichas autorizadas."""

from math import isfinite
from qiskit import QuantumCircuit


def validate_fichas(config, fichas):
    if len(fichas) > config.get("limite_fichas", 2 * config["ranuras"]):
        raise ValueError("Se superó el límite de fichas del minijuego.")
    occupied = set()
    for f in fichas:
        name, cable, pos = f["ficha"], f["cable"], f["pos"]
        if name not in config["fichas_permitidas"]:
            raise ValueError("Ficha no permitida en este minijuego.")
        if type(cable) is not int or cable not in (0, 1):
            raise ValueError("El cable debe ser 0 o 1.")
        if type(pos) is not int or not 0 <= pos < config["ranuras"]:
            raise ValueError("La posición está fuera de las ranuras disponibles.")
        slots = {(cable, pos)} if name != "cable_gemelo" else {(0, pos), (1, pos)}
        if occupied & slots:
            raise ValueError("La ranura ya está ocupada.")
        occupied |= slots
        if "theta" in f:
            raise ValueError("Esta ficha no acepta theta.")
        if "escala" in f:
            perilla = config.get("perilla_escala")
            if name not in ("giro_y", "giro_z") or not perilla:
                raise ValueError("La escala no está permitida en este minijuego o ficha.")
            if not isfinite(f["escala"]) or not perilla["min"] <= f["escala"] <= perilla["max"]:
                raise ValueError("La escala está fuera del rango permitido.")


def build_circuit(config, fichas, x):
    """Construye sin medir; el consumidor decide lectura exacta o muestreo."""
    qc = QuantumCircuit(2)
    for f in sorted(fichas, key=lambda f: (f["pos"], f["cable"])):
        name, q = f["ficha"], f["cable"]
        if name in ("giro_y", "giro_z"):
            angle = f.get("escala", config["codificacion"]["escala"]) * x[q]
            (qc.ry if name == "giro_y" else qc.rz)(angle, q)
        elif name == "prisma":
            qc.h(q)
        elif name == "cable_gemelo":
            qc.cx(q, 1 - q)
    return qc
