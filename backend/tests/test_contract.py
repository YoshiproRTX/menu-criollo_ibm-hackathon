"""Fixtures públicos consumidos por el carril frontend, no resultados científicos."""

import json
from pathlib import Path

import pytest

CONTRACT_DIR = Path(__file__).resolve().parents[2] / "content" / "contract"
RESOURCE_FIELDS = {
    "predictions": {"conjunto", "predicciones", "acierto"},
    "decision-map": {"resolucion", "valores"},
    "xray": {"diagrama", "codigo"},
    "rarity-draws": {"resultado", "rareza", "probabilidades", "shots"},
    "estimates.monte_carlo": {"metodo", "tunel", "trayectoria", "estimacion", "consultas_usadas"},
    "estimates.qae": {"metodo", "tunel", "trayectoria", "estimacion", "consultas_usadas"},
    "train": {"historial"},
    "error-422": {"detail"},
}


def fixture(name):
    return json.loads((CONTRACT_DIR / f"{name}.json").read_text(encoding="utf-8"))


@pytest.mark.parametrize("name,fields", RESOURCE_FIELDS.items())
def test_fixture_matches_resource_contract_and_is_explicitly_mock(name, fields):
    data = fixture(name)
    assert set(data) == fields | {"meta"}
    assert data["meta"] == {"qiskit": "2.5.2", "simulador": "mock", "ms": 0}


def test_decision_map_is_32_by_32_with_numeric_probabilities():
    data = fixture("decision-map")
    assert data["resolucion"] == 32
    assert len(data["valores"]) == 1024
    assert all(isinstance(p, (float, int)) and 0 <= p <= 1 for p in data["valores"])


def test_predictions_preserve_object_fields():
    data = fixture("predictions")
    assert data["conjunto"] in {"prueba", "ejemplos"}
    assert 0 <= data["acierto"] <= 1
    assert data["predicciones"]
    for result in data["predicciones"]:
        assert set(result) == {"id", "p_accion", "prediccion", "correcto"}
        assert isinstance(result["id"], str)
        assert isinstance(result["prediccion"], str)
        assert isinstance(result["correcto"], bool)
        assert 0 <= result["p_accion"] <= 1


def test_rarity_labels_match_bitstring_and_probabilities():
    data = fixture("rarity-draws")
    labels = {"00": "comun", "01": "rara", "10": "holografica", "11": "legendaria"}
    assert data["rareza"] == labels[data["resultado"]]
    assert set(data["probabilidades"]) == set(labels.values())
    assert all(0 <= p <= 1 for p in data["probabilidades"].values())
    assert sum(data["probabilidades"].values()) == pytest.approx(1)
    assert data["shots"] == 1


@pytest.mark.parametrize("method", ["monte_carlo", "qae"])
def test_estimates_have_a_coherent_mock_trajectory(method):
    data = fixture(f"estimates.{method}")
    assert data["metodo"] == method
    assert data["tunel"] in {"a", "b"}
    assert data["trayectoria"]
    previous = 0
    for point in data["trayectoria"]:
        assert set(point) == {"consultas", "estimacion", "error"}
        assert isinstance(point["consultas"], int)
        assert previous < point["consultas"] <= data["consultas_usadas"]
        assert 0 <= point["estimacion"] <= 1
        assert 0 <= point["error"] <= 1
        previous = point["consultas"]
    assert data["estimacion"] == data["trayectoria"][-1]["estimacion"]
    assert data["consultas_usadas"] == previous


def test_training_history_has_iterations_two_angles_and_bounded_loss():
    history = fixture("train")["historial"]
    assert history
    for index, point in enumerate(history):
        assert set(point) == {"iteracion", "theta", "perdida"}
        assert point["iteracion"] == index
        assert len(point["theta"]) == 2
        assert all(isinstance(angle, (int, float)) for angle in point["theta"])
        assert 0 <= point["perdida"] <= 1


def test_xray_text_and_code_can_be_consumed_by_frontend():
    data = fixture("xray")
    assert isinstance(data["diagrama"], str) and data["diagrama"].strip()
    assert isinstance(data["codigo"], str) and data["codigo"].strip()
    compile(data["codigo"], "mock-xray.py", "exec")


def test_error_fixture_uses_spanish_detail():
    assert fixture("error-422")["detail"] == "Ficha no permitida en este minijuego."
