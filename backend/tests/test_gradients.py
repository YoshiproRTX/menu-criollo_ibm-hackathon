import numpy as np
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.content import load_minigame
from app.gradients import loss, gradient_shift, probabilities, circuito
from qiskit.quantum_info import Statevector

client = TestClient(app)


def test_optimized_operator_matches_full_input_encoding_circuits():
    config = load_minigame("trucos")
    for theta in np.random.default_rng(11).uniform(-3, 3, (8, 2)):
        expected = [Statevector(circuito(order["x"], theta)).probabilities([1])[1] for order in config["ordenes"]]
        assert probabilities(config, theta) == pytest.approx(expected, abs=1e-12)


def test_parameter_shift_matches_finite_differences():
    config = load_minigame("trucos")
    rng = np.random.default_rng(3)
    for theta in rng.uniform(-3, 3, (8, 2)):
        numerical = []
        for j in range(2):
            offset = np.eye(2)[j] * 1e-5
            numerical.append((loss(config, theta+offset) - loss(config, theta-offset)) / 2e-5)
        assert gradient_shift(config, theta) == pytest.approx(numerical, abs=1e-6)


def test_training_reaches_low_loss_with_real_history():
    config = load_minigame("trucos")
    response = client.post("/api/minigames/trucos/train", json={"theta_inicial": config["theta_inicial"], **config["train"]})
    assert response.status_code == 200
    data = response.json()
    history = data["historial"]
    assert len(history) == 31
    assert history[-1]["perdida"] < 0.01
    assert max(b["perdida"] - a["perdida"] for a, b in zip(history, history[1:])) <= 0.01
    for point in history:
        assert point["perdida"] == pytest.approx(loss(config, point["theta"]))
    fichas = [{"ficha": "perilla_dorada", "cable": q, "pos": 0, "theta": t} for q, t in enumerate(history[-1]["theta"])]
    assert client.post("/api/minigames/trucos/predictions", json={"circuito": {"fichas": fichas}}).json()["acierto"] == 1
    assert data["meta"]["ms"] < 500


def test_theta_outside_allowed_interval_is_rejected():
    assert client.post("/api/minigames/trucos/train", json={"theta_inicial": [4, 0]}).status_code == 422
    body = {"circuito": {"fichas": [{"ficha": "perilla_dorada", "cable": 1, "pos": 0, "theta": 9}]}}
    assert client.post("/api/minigames/trucos/predictions", json=body).status_code == 422
