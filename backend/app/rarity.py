"""Sorteo Born de un solo shot sobre el circuito usado por el jugador."""

from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler
from qiskit.quantum_info import Statevector

from app.model import star_circuit

LABELS = ("comun", "rara", "holografica", "legendaria")


def reward_circuit(config, fichas):
    if config.get("tipo", "clasificacion") == "doble-hueso":
        from app.qae import operador_a
        qc = QuantumCircuit(2)
        for q, tunnel in enumerate(config["tuneles"]):
            qc.compose(operador_a(tunnel["p"]), [q], inplace=True)
        return qc
    if config.get("tipo", "clasificacion") == "trucos":
        from app.gradients import circuito, theta_from_fichas
        return circuito(config["ordenes"][0]["x"], theta_from_fichas(config, fichas))
    return star_circuit(config, fichas)


def draw_rarity(config, fichas, semilla=None):
    qc = reward_circuit(config, fichas)
    probabilities = Statevector(qc).probabilities()
    qc.measure_all()
    pub = StatevectorSampler(seed=semilla).run([qc], shots=1).result()[0]
    result = pub.data.meas.get_bitstrings()[0]
    return {"resultado": result, "rareza": LABELS[int(result, 2)],
            "probabilidades": dict(zip(LABELS, map(float, probabilities))), "shots": 1}
