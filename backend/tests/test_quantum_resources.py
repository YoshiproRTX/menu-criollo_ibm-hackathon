import numpy as np
import pytest
from fastapi.testclient import TestClient
from qiskit.quantum_info import Operator, Statevector

from app.main import app
from app.content import load_minigame
from app.model import star_circuit, p_accion

client = TestClient(app)
FICHAS = [{"ficha": "giro_y", "cable": q, "pos": 0} for q in (0, 1)] + [{"ficha": "cable_gemelo", "cable": 0, "pos": 1}]
BODY = {"circuito": {"fichas": FICHAS}}


def test_grid_values_match_exact_prediction_at_cell_centers():
    response = client.post("/api/minigames/fregadero/decision-map", json={**BODY, "resolucion": 3})
    assert response.status_code == 200
    data = response.json()
    config = load_minigame("fregadero")
    expected = [p_accion(config, FICHAS, [(col + 0.5) / 3, (row + 0.5) / 3]) for row in range(3) for col in range(3)]
    assert data["valores"] == pytest.approx(expected)


def test_asymmetric_multiqubit_reading_follows_contract_character_order():
    config = load_minigame("fregadero")
    config["lectura"].update(qubits=[1, 0], resultado="10")
    fichas = [{"ficha": "giro_y", "cable": 1, "pos": 0}]
    assert p_accion(config, fichas, [0, 1]) == pytest.approx(1)
    config["lectura"]["resultado"] = "01"
    assert p_accion(config, fichas, [0, 1]) == pytest.approx(0, abs=1e-12)


@pytest.mark.parametrize("game", ["doble-hueso", "trucos"])
def test_special_game_rarity_is_a_real_reproducible_shot(game):
    body = {"semilla": 9, "circuito": {"fichas": []}}
    a = client.post(f"/api/minigames/{game}/rarity-draws", json=body)
    b = client.post(f"/api/minigames/{game}/rarity-draws", json=body)
    assert a.status_code == 200
    assert a.json()["resultado"] == b.json()["resultado"]
    assert sum(a.json()["probabilidades"].values()) == pytest.approx(1)
    assert a.json()["meta"]["simulador"] == "StatevectorSampler"


def test_default_grid_is_complete_and_within_time_budget():
    response = client.post("/api/minigames/fregadero/decision-map", json=BODY)
    data = response.json()
    assert data["resolucion"] == 32
    assert len(data["valores"]) == 1024
    assert all(0 <= value <= 1 for value in data["valores"])
    assert data["meta"]["ms"] < 500


def test_xray_code_reconstructs_the_backend_operator():
    data = client.post("/api/minigames/fregadero/xray", json=BODY).json()
    namespace = {}
    exec(data["codigo"], namespace)
    expected = star_circuit(load_minigame("fregadero"), FICHAS)
    assert Operator(namespace["qc"]).equiv(Operator(expected))
    assert "sensor" in data["codigo"]


def test_rarity_is_born_probabilities_and_seeded_one_shot():
    body = {**BODY, "semilla": 7}
    first = client.post("/api/minigames/fregadero/rarity-draws", json=body).json()
    second = client.post("/api/minigames/fregadero/rarity-draws", json=body).json()
    labels = {"00": "comun", "01": "rara", "10": "holografica", "11": "legendaria"}
    assert first["resultado"] == second["resultado"]
    assert first["rareza"] == labels[first["resultado"]]
    assert first["shots"] == 1
    expected = Statevector(star_circuit(load_minigame("fregadero"), FICHAS)).probabilities()
    assert list(first["probabilidades"].values()) == pytest.approx(expected)
    assert sum(first["probabilidades"].values()) == pytest.approx(1)


@pytest.mark.parametrize("resolution", [0, 65, -1, 1.5, True])
def test_grid_resolution_is_bounded(resolution):
    assert client.post("/api/minigames/fregadero/decision-map", json={**BODY, "resolucion": resolution}).status_code == 422
