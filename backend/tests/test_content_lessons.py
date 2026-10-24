import itertools
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.content import load_minigame
from app.model import p_accion

client = TestClient(app)


def ficha(name, cable, pos, **extra):
    return {"ficha": name, "cable": cable, "pos": pos, **extra}


def accuracy(game, fichas):
    response = client.post(f"/api/minigames/{game}/predictions", json={"circuito": {"fichas": fichas}, "conjunto": "prueba"})
    assert response.status_code == 200, response.text
    return response.json()["acierto"]


def test_best_known_fregadero_without_cx_still_does_not_win():
    # experiments/verificacion_salida.txt: RY1 -> H1 -> RY0 RY1.
    fs = [ficha("giro_y", 1, 0), ficha("prisma", 1, 1), ficha("giro_y", 0, 2), ficha("giro_y", 1, 2)]
    assert accuracy("fregadero", fs) < 0.9


def test_chef_factory_scale_cannot_win_any_one_slot_circuit():
    options = [None, "giro_y", "prisma"]
    circuits = [[ficha(name, q, 0) for q, name in enumerate(pair) if name] for pair in itertools.product(options, repeat=2)]
    circuits += [[ficha("cable_gemelo", q, 0)] for q in (0, 1)]
    assert max(accuracy("chef", fs) for fs in circuits) < 0.9


def test_chef_scale_unlocks_classification_and_enforces_range():
    fs = [ficha("giro_y", q, 0, escala=3.5) for q in (0, 1)]
    assert accuracy("chef", fs) >= 0.9
    for game, scale in [("chef", 9), ("fregadero", 3.5)]:
        assert client.post(f"/api/minigames/{game}/predictions", json={"circuito": {"fichas": [ficha("giro_y", 0, 0, escala=scale)]}}).status_code == 422
    data = client.post("/api/minigames/chef/decision-map", json={"circuito": {"fichas": fs}, "resolucion": 2}).json()
    expected = [p_accion(load_minigame("chef"), fs, [x, y]) for y in (-0.5, 0.5) for x in (-0.5, 0.5)]
    assert data["valores"] == pytest.approx(expected)


def test_lavanderia_winning_seven_tiles_reuploads_sensors():
    fs = [ficha("prisma", 0, 0), ficha("giro_y", 1, 0), ficha("cable_gemelo", 0, 1),
          ficha("giro_y", 1, 2), ficha("giro_y", 0, 3), ficha("prisma", 1, 3), ficha("cable_gemelo", 1, 4)]
    assert accuracy("lavanderia", fs) >= 0.9


def test_pista_needs_interference_after_encoding_phase():
    fs = [ficha("prisma", q, 0) for q in (0, 1)] + [ficha("giro_z", q, 1) for q in (0, 1)]
    fs += [ficha("cable_gemelo", 1, 2), ficha("prisma", 1, 3)]
    assert accuracy("pista", fs) == 1
    assert accuracy("pista", [f for f in fs if f["ficha"] != "prisma"]) <= 0.6


def test_copa_wins_with_five_tiles_and_rejects_six():
    fs = [ficha("prisma", 1, 0), ficha("cable_gemelo", 1, 1)]
    fs += [ficha("giro_y", q, 2) for q in (0, 1)] + [ficha("cable_gemelo", 0, 3)]
    assert accuracy("copa", fs) >= 0.9
    response = client.post("/api/minigames/copa/predictions", json={"circuito": {"fichas": fs + [ficha("prisma", 0, 0)]}})
    assert response.status_code == 422
    assert "límite" in response.json()["detail"]


@pytest.mark.parametrize("game", ["pelusa", "fregadero", "chef", "lavanderia", "pista", "copa"])
def test_configs_have_labelled_examples_short_intro_and_three_line_card(game):
    config = load_minigame(game)
    assert len(config["chispa"]["inicio"].split()) <= 14
    assert len(config["cromo"]["lineas"]) == 3
    for group in ("ejemplos", "prueba"):
        assert len({obj["id"] for obj in config[group]}) == len(config[group])
        for obj in config[group]:
            assert obj["objeto"] in config["objetos"]
            assert len(obj["x"]) == 2
