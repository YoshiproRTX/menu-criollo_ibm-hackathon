from fastapi.testclient import TestClient
import pytest

from app.main import app


def test_health_reports_installed_qiskit_version():
    with TestClient(app) as client:
        response = client.get("/api/health")

    assert response.status_code == 200
    assert response.json() == {"ok": True, "qiskit": "2.5.2"}


@pytest.mark.parametrize(
    "resource", ["predictions", "decision-map", "xray", "rarity-draws", "estimates", "train"]
)
def test_unknown_minigame_returns_spanish_404_before_resource_execution(resource):
    with TestClient(app) as client:
        response = client.post(f"/api/minigames/no-existe/{resource}", json={})

    assert response.status_code == 404
    assert response.json() == {"detail": "El minijuego 'no-existe' no existe."}


@pytest.mark.parametrize("resource", ["predictions", "decision-map", "xray", "rarity-draws"])
def test_implemented_resource_never_serves_contract_mocks(resource):
    with TestClient(app) as client:
        response = client.post(f"/api/minigames/fregadero/{resource}", json={})

    assert response.status_code == 200
    assert response.json()["meta"]["simulador"] != "mock"
