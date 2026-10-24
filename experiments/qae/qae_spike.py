"""Prueba del QAE hecho a mano para el 2.2 «Doble Hueso».

Monte Carlo y MLAE (Suzuki et al. 2020) sobre el MISMO oráculo A, con
consultas contadas como Σ shots·(2k+1). Sin qiskit-algorithms.

Correr:
  PYTHONIOENCODING=utf-8 uv run --no-project --with "qiskit==2.5.2" --with matplotlib \
      python experiments/qae/qae_spike.py
"""
import json
import time
from pathlib import Path

import numpy as np
from qiskit import QuantumCircuit
from qiskit.primitives import StatevectorSampler
from qiskit.quantum_info import Statevector

SEMILLA = 2026
SEMILLAS = 200
P_TUNELES = {"a": 0.30, "b": 0.36}
AQUI = Path(__file__).parent


# --- Q1. Operadores con compuertas explícitas --------------------------------

def operador_a(p):
    """A|0> = sqrt(1-p)|0> + sqrt(p)|1>: P(medir 1) = p = sin²θ."""
    qc = QuantumCircuit(1, name="A")
    qc.ry(2 * np.arcsin(np.sqrt(p)), 0)
    return qc


def operador_q(p):
    """Grover Q = A·S0·A†·Sχ (se aplica de derecha a izquierda)."""
    a = operador_a(p)
    qc = QuantumCircuit(1, name="Q")
    qc.z(0)                          # Sχ: cambia el signo del estado bueno |1>
    qc.compose(a.inverse(), inplace=True)
    qc.x(0)                          # S0 = I − 2|0><0| = X·Z·X
    qc.z(0)
    qc.x(0)
    qc.compose(a, inplace=True)
    return qc


def circuito_k(p, k, medir=True):
    """Q^k·A|0>, que da P(1) = sin²((2k+1)θ)."""
    qc = operador_a(p)
    q = operador_q(p)
    for _ in range(k):
        qc.compose(q, inplace=True)
    if medir:
        qc.measure_all()
    return qc


def p_uno(p, k):
    return float(Statevector(circuito_k(p, k, medir=False)).probabilities()[1])


# --- Estimadores --------------------------------------------------------------

GRILLA = np.linspace(0, np.pi / 2, 20_001)[1:-1]  # paso 7.9e-5 rad, muy por debajo del RMSE medido
EPS = 1e-300


def mlae(aciertos, shots, ks):
    """Máxima verosimilitud en una grilla de θ en (0, π/2)."""
    ll = np.zeros_like(GRILLA)
    for h, n, k in zip(aciertos, shots, ks):
        ang = (2 * k + 1) * GRILLA
        ll += h * np.log(np.sin(ang) ** 2 + EPS) + (n - h) * np.log(np.cos(ang) ** 2 + EPS)
    return float(np.sin(GRILLA[np.argmax(ll)]) ** 2)


def consultas(ks, shots):
    return int(sum(n * (2 * k + 1) for k, n in zip(ks, shots)))


class Oraculo:
    """Probabilidades exactas de Qiskit por potencia k; los shots se sortean aparte.

    Para las 200 semillas se muestrea binomialmente sobre las probabilidades de
    Statevector, que es lo mismo que hace StatevectorSampler (se valida abajo).
    """

    def __init__(self, p):
        self.p = p
        self._cache = {}

    def prob(self, k):
        if k not in self._cache:
            self._cache[k] = p_uno(self.p, k)
        return self._cache[k]

    def aciertos(self, ks, shots, rng):
        return [int(rng.binomial(n, self.prob(k))) for k, n in zip(ks, shots)]


def estimar_mlae(oraculo, ks, n_shot, rng):
    shots = [n_shot] * len(ks)
    return mlae(oraculo.aciertos(ks, shots, rng), shots, ks)


def estimar_mc(oraculo, n, rng):
    return oraculo.aciertos([0], [n], rng)[0] / n


def potencias(m, con_cero=True):
    ks = [2 ** j for j in range(m)]
    return ([0] if con_cero else []) + ks


# --- Trayectoria, tal como la devolvería el endpoint (D15) -------------------

def trayectoria_qae(p, ks, n_shot, semilla):
    """Una corrida con StatevectorSampler: estimación tras cada potencia."""
    sampler = StatevectorSampler(seed=semilla)
    circuitos = [circuito_k(p, k) for k in ks]
    res = sampler.run(circuitos, shots=n_shot).result()
    aciertos = [int(r.data.meas.get_counts().get("1", 0)) for r in res]
    puntos = []
    for i in range(1, len(ks) + 1):
        est = mlae(aciertos[:i], [n_shot] * i, ks[:i])
        puntos.append({"consultas": consultas(ks[:i], [n_shot] * i),
                       "estimacion": round(est, 4), "error": round(abs(est - p), 4)})
    return puntos


def trayectoria_mc(p, presupuesto, semilla, cada=1):
    """Una corrida con StatevectorSampler: promedio acumulado olfateo a olfateo."""
    sampler = StatevectorSampler(seed=semilla)
    res = sampler.run([circuito_k(p, 0)], shots=presupuesto).result()[0]
    bits = np.array([int(b) for b in res.data.meas.get_bitstrings()])
    medias = np.cumsum(bits) / np.arange(1, presupuesto + 1)
    return [{"consultas": int(n), "estimacion": round(float(medias[n - 1]), 4),
             "error": round(abs(float(medias[n - 1]) - p), 4)}
            for n in range(cada, presupuesto + 1, cada)]


def pendiente(x, y):
    return float(np.polyfit(np.log(x), np.log(y), 1)[0])



def graficar(filas):
    """RMSE contra consultas, log-log, con los datos reales de Q3 (30 shots por potencia)."""
    import matplotlib
    matplotlib.use("Agg")
    import matplotlib.pyplot as plt

    tinta, tinta2, muda, rejilla, eje = "#0b0b0b", "#52514e", "#898781", "#e1e0d9", "#c3c2b7"
    azul, naranja = "#2a78d6", "#eb6834"  # ranuras 1 y 2 de la paleta categórica de referencia
    qae = sorted([f for f in filas if f["metodo"] == "mlae" and f["n_shot"] == 30 and f["con_cero"]],
                 key=lambda f: f["consultas"])
    mc = sorted([f for f in filas if f["metodo"] == "mc"], key=lambda f: f["consultas"])

    fig, ax = plt.subplots(figsize=(7.2, 4.4), dpi=150)
    fig.patch.set_facecolor("#fcfcfb")
    ax.set_facecolor("#fcfcfb")
    for serie, color, nombre in ((mc, azul, "Monte Carlo"), (qae, naranja, "QAE (MLAE)")):
        x = [f["consultas"] for f in serie]
        y = [f["rmse"] for f in serie]
        ax.plot(x, y, color=color, lw=2, marker="o", ms=4.5, mec="#fcfcfb", mew=1.5, label=nombre)
        ax.annotate(nombre, (x[-1], y[-1]), xytext=(6, 0), textcoords="offset points",
                    va="center", color=tinta2, fontsize=9)
    ax.set_xscale("log")
    ax.set_yscale("log")
    ax.set_xlabel("Consultas al oráculo A (batería gastada)", color=tinta2, fontsize=9)
    ax.set_ylabel("Error (RMSE, 200 semillas)", color=tinta2, fontsize=9)
    ax.set_title("Mismo oráculo, misma precisión, muchas menos consultas", color=tinta,
                 fontsize=11, loc="left")
    ax.grid(True, which="major", color=rejilla, lw=0.6)
    ax.tick_params(colors=muda, labelsize=8)
    for lado in ("top", "right"):
        ax.spines[lado].set_visible(False)
    for lado in ("left", "bottom"):
        ax.spines[lado].set_color(eje)
    ax.legend(frameon=False, fontsize=9, labelcolor=tinta2, loc="lower left")
    ax.set_xlim(right=max(f["consultas"] for f in mc) * 3)
    fig.text(0.01, 0.01, "p = 0.30 · MLAE con 30 shots por potencia, k = 0, 1, 2, 4, … · Qiskit 2.5.2 "
             "(probabilidades de Statevector, shots muestreados)", color=muda, fontsize=7)
    fig.tight_layout(rect=(0, 0.03, 1, 1))
    fig.savefig(AQUI / "error_vs_consultas.png")


if __name__ == "__main__":
    rng = np.random.default_rng(SEMILLA)
    salida = {}

    # Q1 --------------------------------------------------------------------
    print("Q1. P(1) de Q^k·A contra sin²((2k+1)θ):")
    max_dif = 0.0
    for p in (0.05, 0.30, 0.36, 0.70):
        th = np.arcsin(np.sqrt(p))
        for k in range(0, 17):
            max_dif = max(max_dif, abs(p_uno(p, k) - np.sin((2 * k + 1) * th) ** 2))
    print(f"    diferencia máx (4 valores de p, k = 0..16): {max_dif:.1e}")
    print(circuito_k(0.30, 1).draw("text"))

    # Validar el atajo binomial contra StatevectorSampler
    p, k, n = 0.30, 2, 40_000
    res = StatevectorSampler(seed=1).run([circuito_k(p, k)], shots=n).result()[0]
    frec = res.data.meas.get_counts().get("1", 0) / n
    exacta = p_uno(p, k)
    sigma = np.sqrt(exacta * (1 - exacta) / n)
    print(f"    StatevectorSampler k={k}: frecuencia {frec:.4f} vs exacta {exacta:.4f} "
          f"({abs(frec - exacta) / sigma:.1f} σ)\n")

    # Q3 y Q4 ---------------------------------------------------------------
    print(f"Q3/Q4. RMSE contra consultas, p = 0.30, {SEMILLAS} semillas:")
    orac = Oraculo(0.30)
    filas = []

    def medir(err):
        a = np.abs(err)
        return {"rmse": float(np.sqrt(np.mean(err ** 2))), "mediana": float(np.median(a)),
                "grueso": float(np.mean(a > 0.1))}

    for n_shot in (10, 30, 100):
        for m in range(0, 8):
            for con_cero in (True, False):
                ks = potencias(m, con_cero)
                if not ks:
                    continue
                q = consultas(ks, [n_shot] * len(ks))
                err = np.array([estimar_mlae(orac, ks, n_shot, rng) - 0.30 for _ in range(SEMILLAS)])
                filas.append({"metodo": "mlae", "n_shot": n_shot, "ks": ks, "con_cero": con_cero,
                              "consultas": q, **medir(err)})
    for q in sorted({f["consultas"] for f in filas if f["con_cero"]}):
        err = np.array([estimar_mc(orac, q, rng) - 0.30 for _ in range(SEMILLAS)])
        filas.append({"metodo": "mc", "consultas": q, **medir(err)})

    print("    método | shots/k | potencias                   | consultas | RMSE   | mediana | errores > 0.1")
    for f in filas:
        if f["metodo"] == "mlae" and f["n_shot"] == 30:
            print(f"    MLAE   | {f['n_shot']:7d} | {str(f['ks']):27s} | {f['consultas']:9d} | "
                  f"{f['rmse']:.4f} | {f['mediana']:.4f}  | {f['grueso']:.0%}")
    mc = sorted([f for f in filas if f["metodo"] == "mc"], key=lambda f: f["consultas"])
    pend = {}
    for n_shot in (10, 30, 100):
        serie = sorted([f for f in filas if f["metodo"] == "mlae" and f["n_shot"] == n_shot
                        and f["con_cero"] and len(f["ks"]) >= 3], key=lambda f: f["consultas"])
        for metrica in ("rmse", "mediana"):
            pend[f"mlae_{n_shot}_{metrica}"] = pendiente([f["consultas"] for f in serie],
                                                         [f[metrica] for f in serie])
    for metrica in ("rmse", "mediana"):
        pend[f"mc_{metrica}"] = pendiente([f["consultas"] for f in mc], [f[metrica] for f in mc])
    print("    pendientes log-log (MLAE con k=0 y al menos 3 potencias):")
    for k, v in pend.items():
        print(f"      {k:22s} {v:+.2f}")
    sin_cero = [f for f in filas if f["metodo"] == "mlae" and not f["con_cero"] and f["n_shot"] == 10]
    con_cero = [f for f in filas if f["metodo"] == "mlae" and f["con_cero"] and f["n_shot"] == 10]
    print("    Q4 (10 shots/k): errores gruesos con k=0:",
          [f"{f['grueso']:.0%}" for f in con_cero], "| sin k=0:",
          [f"{f['grueso']:.0%}" for f in sin_cero], "\n")
    salida["q3"] = {"filas": filas, "pendientes": pend}

    # Q5 --------------------------------------------------------------------
    print("Q5. Elegir el túnel bueno (p = 0.36 frente a 0.30), 1000 semillas por fila:")
    oa, ob = Oraculo(P_TUNELES["a"]), Oraculo(P_TUNELES["b"])
    q5 = []
    for n_shot in (2, 3, 5, 10):
        for m in range(2, 7):
            ks = potencias(m)
            q = consultas(ks, [n_shot] * len(ks))
            bien_qae = np.mean([estimar_mlae(ob, ks, n_shot, rng) > estimar_mlae(oa, ks, n_shot, rng)
                                for _ in range(1000)])
            bien_mc = np.mean([estimar_mc(ob, q, rng) > estimar_mc(oa, q, rng) for _ in range(1000)])
            q5.append({"n_shot": n_shot, "ks": ks, "consultas_por_tunel": q,
                       "acierto_qae": float(bien_qae), "acierto_mc": float(bien_mc)})
    print("    shots/k | potencias            | consultas/túnel | QAE elige bien | MC elige bien")
    for f in sorted(q5, key=lambda f: f["consultas_por_tunel"]):
        marca = "  <- QAE ≥ 95 % y MC no" if f["acierto_qae"] >= 0.95 > f["acierto_mc"] else ""
        print(f"    {f['n_shot']:7d} | {str(f['ks']):20s} | {f['consultas_por_tunel']:15d} | "
              f"{f['acierto_qae']:14.1%} | {f['acierto_mc']:13.1%}{marca}")
    # MC: cuántas consultas necesita para 95 %
    for q in (100, 200, 300, 400, 500, 700):
        bien = np.mean([estimar_mc(ob, q, rng) > estimar_mc(oa, q, rng) for _ in range(2000)])
        print(f"    MC con {q:4d} consultas por túnel: elige bien {bien:.1%}")
    print()
    salida["q5"] = q5

    # Q6 --------------------------------------------------------------------
    print("Q6. Tiempo de una estimación completa con StatevectorSampler (mediana de 20):")
    tiempos = {}
    for nombre, f in (("qae k=0,1,2,4,8 · 3 shots", lambda s: trayectoria_qae(0.30, potencias(4), 3, s)),
                      ("qae k=0,1,2,4,8,16 · 3 shots", lambda s: trayectoria_qae(0.30, potencias(5), 3, s)),
                      ("monte carlo 300 consultas", lambda s: trayectoria_mc(0.30, 300, s))):
        ts = []
        for s in range(20):
            t0 = time.perf_counter()
            f(s)
            ts.append((time.perf_counter() - t0) * 1000)
        tiempos[nombre] = float(np.median(ts))
        print(f"    {nombre:30s} {tiempos[nombre]:6.1f} ms")
    salida["q6_ms"] = tiempos

    # Ejemplo de respuesta del endpoint --------------------------------------
    ejemplo = {"qae": trayectoria_qae(0.30, potencias(4), 3, 7),
               "monte_carlo": trayectoria_mc(0.30, 105, 7, cada=15)}
    print("\nEjemplo de trayectorias (semilla 7, p = 0.30):")
    print(json.dumps(ejemplo, indent=1))
    salida["ejemplo_trayectorias"] = ejemplo

    (AQUI / "resultados.json").write_text(json.dumps(salida, indent=1), encoding="utf-8")
    graficar(filas)
