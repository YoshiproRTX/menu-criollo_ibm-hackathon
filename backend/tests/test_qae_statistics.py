"""Corridas completas con Sampler real; no se ajustan semillas a los resultados."""

import numpy as np
import pytest

from app.content import load_minigame
from app.qae import estimate, qae_trajectory, mc_trajectory


@pytest.mark.slow
def test_two_hundred_seeded_rounds_choose_the_better_tunnel():
    config = load_minigame("doble-hueso")
    rates = {}
    for method in ("qae", "monte_carlo"):
        wins = 0
        for seed in range(200):
            a = estimate(config, method, "a", 90, seed)["estimacion"]
            b = estimate(config, method, "b", 90, seed)["estimacion"]
            wins += b > a
        rates[method] = wins / 200
    print("\n200 semillas, 90 consultas/tunel:", rates)
    assert rates["qae"] >= 0.92
    assert rates["monte_carlo"] <= 0.85


@pytest.mark.slow
def test_rmse_slopes_for_fifty_seeds():
    costs, q_errors, mc_errors = [], [], []
    for m in range(1, 6):
        ks = [0] + [2**j for j in range(m)]
        budget = 30 * sum(2*k+1 for k in ks)
        q, mc = [], []
        for seed in range(50):
            q.append(qae_trajectory(0.30, ks, [30]*len(ks), np.random.default_rng(seed))[-1]["error"])
            mc.append(mc_trajectory(0.30, budget, budget, np.random.default_rng(seed))[-1]["error"])
        costs.append(budget)
        q_errors.append(np.sqrt(np.mean(np.square(q))))
        mc_errors.append(np.sqrt(np.mean(np.square(mc))))
    q_slope = np.polyfit(np.log(costs), np.log(q_errors), 1)[0]
    mc_slope = np.polyfit(np.log(costs), np.log(mc_errors), 1)[0]
    print("\nPendientes RMSE, 50 semillas:", {"qae": q_slope, "monte_carlo": mc_slope})
    assert q_slope <= -0.85
    assert -0.6 <= mc_slope <= -0.4
