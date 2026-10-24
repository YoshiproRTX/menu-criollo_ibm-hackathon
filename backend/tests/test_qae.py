import numpy as np
import pytest
from fastapi.testclient import TestClient
from qiskit.quantum_info import Statevector

from app.main import app
from app.qae import circuito_k

client = TestClient(app)


@pytest.mark.parametrize("p", [0.01, 0.30, 0.36, 0.87])
def test_grover_powers_match_amplitude_amplification(p):
    theta = np.arcsin(np.sqrt(p))
    for k in range(9):
        actual = Statevector(circuito_k(p, k, medir=False)).probabilities()[1]
        assert actual == pytest.approx(np.sin((2*k+1)*theta)**2, abs=1e-9)


@pytest.mark.parametrize("method", ["monte_carlo", "qae"])
def test_estimate_is_reproducible_budgeted_and_returns_real_trajectory(method):
    body = {"metodo": method, "tunel": "a", "semilla": 7}
    first = client.post("/api/minigames/doble-hueso/estimates", json=body)
    second = client.post("/api/minigames/doble-hueso/estimates", json=body)
    assert first.status_code == 200
    a, b = first.json(), second.json()
    assert a["trayectoria"] == b["trayectoria"]
    assert a["consultas_usadas"] == 90
    assert a["estimacion"] == a["trayectoria"][-1]["estimacion"]
    for point in a["trayectoria"]:
        assert point["error"] == pytest.approx(abs(point["estimacion"] - 0.30))
    assert a["meta"]["simulador"] == "StatevectorSampler"
    assert a["meta"]["ms"] < 100


@pytest.mark.parametrize("change,status", [({"tunel": "z"}, 404), ({"metodo": "falso"}, 422), ({"presupuesto": 181}, 422), ({"presupuesto": 0}, 422)])
def test_invalid_estimates_are_rejected(change, status):
    response = client.post("/api/minigames/doble-hueso/estimates", json={"metodo": "qae", "tunel": "a", **change})
    assert response.status_code == status


@pytest.mark.parametrize("method", ["qae", "monte_carlo"])
def test_small_and_nonmultiple_budgets_never_overspend(method):
    for budget in [1, 7, 23, 89, 95, 180]:
        data = client.post("/api/minigames/doble-hueso/estimates", json={"metodo": method, "tunel": "b", "presupuesto": budget, "semilla": 42}).json()
        assert 0 < data["consultas_usadas"] <= budget
        assert data["trayectoria"][-1]["consultas"] == data["consultas_usadas"]
