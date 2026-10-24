import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)
RY = [{"ficha": "giro_y", "cable": q, "pos": 0} for q in (0, 1)]
CX = {"ficha": "cable_gemelo", "cable": 0, "pos": 1}


def predict(game, fichas):
    return client.post(f"/api/minigames/{game}/predictions", json={"circuito": {"fichas": fichas}, "conjunto": "prueba"})


def test_fregadero_needs_both_sensors_combined():
    assert predict("fregadero", RY).json()["acierto"] <= 0.6
    response = predict("fregadero", RY + [CX])
    assert response.status_code == 200
    assert response.json()["acierto"] == 1.0
    assert response.json()["meta"]["simulador"] == "Statevector"
    assert response.json()["meta"]["ms"] < 100


def test_pelusa_tutorial_can_classify_with_one_rotation():
    assert predict("pelusa", []).json()["acierto"] == 0.5
    assert predict("pelusa", [RY[1]]).json()["acierto"] >= 0.9


@pytest.mark.parametrize("fichas", [
    [{"ficha": "inventada", "cable": 0, "pos": 0}],
    [{"ficha": "giro_y", "cable": 2, "pos": 0}],
    [{"ficha": "giro_y", "cable": 0, "pos": -1}],
    [{"ficha": "giro_y", "cable": 0, "pos": 4}],
    [RY[0], RY[0]],
    [CX, {"ficha": "giro_y", "cable": 1, "pos": 1}],
    [{**RY[0], "escala": 3.5}],
])
def test_invalid_fichas_return_spanish_422(fichas):
    response = predict("fregadero", fichas)
    assert response.status_code == 422
    assert isinstance(response.json()["detail"], str)
