"""Monte Carlo y MLAE portados de experiments/qae/qae_spike.py.

Una respuesta es una corrida real. El producto muestrea siempre con
StatevectorSampler; no usa aproximaciones binomiales para generar trayectorias.
"""

from functools import lru_cache

import numpy as np
from fastapi import HTTPException
from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler

GRILLA = np.linspace(0, np.pi / 2, 20_002)[1:-1]


def operador_a(p):
    qc = QuantumCircuit(1, name="A")
    qc.ry(2 * np.arcsin(np.sqrt(p)), 0)
    return qc


def operador_q(p):
    a = operador_a(p)
    qc = QuantumCircuit(1, name="Q")
    qc.z(0)
    qc.compose(a.inverse(), inplace=True)
    qc.x(0)
    qc.z(0)
    qc.x(0)
    qc.compose(a, inplace=True)
    return qc


def circuito_k(p, k, medir=True):
    qc = operador_a(p)
    q = operador_q(p)
    for _ in range(k):
        qc.compose(q, inplace=True)
    if medir:
        qc.measure_all()
    return qc


@lru_cache(maxsize=64)
def log_probabilities(k):
    angle = (2 * k + 1) * GRILLA
    return np.log(np.sin(angle)**2 + 1e-300), np.log(np.cos(angle)**2 + 1e-300)


def mlae(hits, shots, ks):
    likelihood = np.zeros_like(GRILLA)
    for h, n, k in zip(hits, shots, ks):
        log_p, log_not_p = log_probabilities(k)
        likelihood += h * log_p + (n - h) * log_not_p
    return float(np.sin(GRILLA[np.argmax(likelihood)])**2)


def qae_trajectory(p, ks, shots, rng):
    pubs = [(circuito_k(p, k), None, n) for k, n in zip(ks, shots)]
    results = StatevectorSampler(seed=rng).run(pubs).result()
    hits = [int(result.data.meas.get_counts().get("1", 0)) for result in results]
    points, used = [], 0
    for i, (k, n) in enumerate(zip(ks, shots)):
        used += n * (2*k + 1)
        value = mlae(hits[:i+1], shots[:i+1], ks[:i+1])
        points.append({"consultas": used, "estimacion": value, "error": abs(value - p)})
    return points


def mc_trajectory(p, budget, step, rng):
    result = StatevectorSampler(seed=rng).run([circuito_k(p, 0)], shots=budget).result()[0]
    bits = np.array([int(bit) for bit in result.data.meas.get_bitstrings()])
    cumulative = np.cumsum(bits)
    checkpoints = list(range(step, budget + 1, step))
    if not checkpoints or checkpoints[-1] != budget:
        checkpoints.append(budget)
    return [{"consultas": n, "estimacion": float(cumulative[n-1] / n),
             "error": abs(float(cumulative[n-1] / n) - p)} for n in checkpoints]


def estimate(config, method, tunnel_id, budget=None, seed=None):
    tunnels = config["tuneles"]
    tunnel = next((t for t in tunnels if t["id"] == tunnel_id), None)
    if tunnel is None:
        raise HTTPException(404, "El túnel no existe.")
    ks = config["qae"]["potencias"]
    cost = sum(2*k + 1 for k in ks)
    budget = budget if budget is not None else cost * config["qae"]["shots_por_potencia"]
    if not 1 <= budget <= config["bateria"]:
        raise ValueError("El presupuesto debe ser positivo y no superar la batería.")
    # Un flujo independiente por túnel y potencia evita correlaciones artificiales
    # de reutilizar una semilla entera para todos los PUBs.
    rng = np.random.default_rng(np.random.SeedSequence([seed, tunnels.index(tunnel)]) if seed is not None else None)
    if method == "monte_carlo":
        points = mc_trajectory(tunnel["p"], budget, config["monte_carlo"]["paso"], rng)
    elif method == "qae":
        n = max(1, budget // cost)
        used, selected_ks, selected_shots = 0, [], []
        for k in ks:
            count = min(n, (budget - used) // (2*k + 1))
            if count < 1:
                break
            selected_ks.append(k)
            selected_shots.append(count)
            used += count * (2*k + 1)
        points = qae_trajectory(tunnel["p"], selected_ks, selected_shots, rng)
    else:
        raise ValueError("El método debe ser monte_carlo o qae.")
    return {"metodo": method, "tunel": tunnel_id, "trayectoria": points,
            "estimacion": points[-1]["estimacion"], "consultas_usadas": points[-1]["consultas"]}
