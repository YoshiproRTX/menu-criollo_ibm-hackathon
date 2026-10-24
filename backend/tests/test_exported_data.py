"""La referencia independiente son los experimentos ya verificados del equipo."""

import importlib.util
from pathlib import Path

import numpy as np

from app.content import load_minigame

ROOT = Path(__file__).resolve().parents[2]


def test_exported_clouds_preserve_the_original_rng_consumption_order():
    spec = importlib.util.spec_from_file_location("verified_research", ROOT / "experiments/verificar_minijuegos.py")
    research = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(research)
    rng = np.random.default_rng(21)
    cases = [
        ("pelusa", [(0.2, 0.25), (0.8, 0.75)], [1, 0], 8, 10, 0.08),
        ("fregadero", [(0, 0), (1, 1), (0, 1), (1, 0)], [1, 1, 0, 0], 3, 5, 0.08),
        ("pista", [(0.25, 0.25), (0.75, 0.75), (0.25, 0.75), (0.75, 0.25)], [1, 1, 0, 0], 3, 5, 0.06),
    ]
    for game, centers, labels, train_count, test_count, sd in cases:
        config = load_minigame(game)
        for group, count in [("ejemplos", train_count), ("prueba", test_count)]:
            points, expected_labels = research.nubes(rng, centers, labels, count, sd)
            assert np.array_equal([obj["x"] for obj in config[group]], points)
            actual_labels = [int(config["objetos"][obj["objeto"]]["accion"] == config["lectura"]["accion"]) for obj in config[group]]
            assert np.array_equal(actual_labels, expected_labels)


def test_simple_classical_reference_is_sufficient_for_pelusa():
    config = load_minigame("pelusa")
    correct = [((obj["x"][1] < 0.5) == (obj["objeto"] == "polvo")) for obj in config["prueba"]]
    assert sum(correct) / len(correct) == 1
