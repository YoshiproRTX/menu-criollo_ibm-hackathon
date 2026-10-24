"""Investigación 2: ¿la ficha que «enseña» cada concepto es la que cambia el resultado?

Para cada minijuego del motor compartido (1.1, 1.2, 1.4, 2.3, 2.4) se recorren
TODOS los circuitos posibles con sus fichas permitidas y ranuras, y se agrupa
el mejor acierto en la cinta según si usan o no la ficha clave. El 1.3 ya está
verificado en experiments/rediseno_1_3/.

Las búsquedas usan un simulador numpy vectorizado validado contra Qiskit; cada
circuito ganador se vuelve a evaluar con Qiskit (Statevector).

Correr:
  PYTHONIOENCODING=utf-8 uv run --no-project --with "qiskit==2.5.2" python experiments/verificar_minijuegos.py
"""
import itertools
import time

import numpy as np
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

SEMILLA = 21
UMBRAL = 0.9
PI = np.pi

# --- Lecturas fijas: probabilidad de la acción positiva ----------------------
# Índice del estado en Qiskit = 2·q1 + q0.
LECTURAS = {
    "q0=0": lambda pr: pr[:, 0] + pr[:, 2],
    "q1=0": lambda pr: pr[:, 0] + pr[:, 1],
    "00": lambda pr: pr[:, 0],
}


# --- Datos ---------------------------------------------------------------------

def nubes(rng, centros, etiquetas, n_por_centro, sd, lo=0.0, hi=1.0):
    X, y = [], []
    for c, e in zip(centros, etiquetas):
        X.append(np.clip(np.array(c) + rng.normal(0, sd, (n_por_centro, 2)), lo, hi))
        y += [e] * n_por_centro
    return np.vstack(X), np.array(y)


def espiral(rng, n_por_brazo, vueltas, ruido=0.03):
    """Dos brazos entrelazados en [-1, 1]²: camisas (1) y calcetines rojos (0)."""
    X, y = [], []
    for brazo in (0, 1):
        t = rng.uniform(0.2, 1.0, n_por_brazo)
        ang = 2 * PI * vueltas * t + brazo * PI
        pts = np.c_[t * np.cos(ang), t * np.sin(ang)] + rng.normal(0, ruido, (n_por_brazo, 2))
        X.append(np.clip(pts, -1, 1))
        y += [1 - brazo] * n_por_brazo
    return np.vstack(X), np.array(y)


def uniforme(rng, n, regla, margen, lo=0.0, hi=1.0):
    """Puntos al azar etiquetados por `regla`, sin puntos a menos de `margen` de la frontera."""
    X, y = [], []
    while len(X) < n:
        p = rng.uniform(lo, hi, 2)
        v = regla(p)
        if abs(v) > margen:
            X.append(p)
            y.append(int(v > 0))
    return np.array(X), np.array(y)


# --- Simulador numpy y búsqueda exhaustiva ----------------------------------------

H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)


def ry(t):
    c, s = np.cos(t / 2), np.sin(t / 2)
    return np.stack([np.stack([c, -s], -1), np.stack([s, c], -1)], -2)


def rz(t):
    e = np.exp(-0.5j * t)
    z = np.zeros_like(e)
    return np.stack([np.stack([e, z], -1), np.stack([z, e.conj()], -1)], -2)


def aplicar_1q(psi, U, q):
    t = psi.reshape(-1, 2, 2)  # (N, q1, q0)
    if U.ndim == 2:
        U = np.broadcast_to(U, (psi.shape[0], 2, 2))
    t = np.einsum("nab,ncb->nca", U, t) if q == 0 else np.einsum("nab,nbc->nac", U, t)
    return t.reshape(-1, 4)


def aplicar_columna(psi, col, mats):
    if col[0] == "cx":
        return psi[:, [0, 3, 2, 1] if col[1] == 0 else [0, 1, 3, 2]]
    for q, f in enumerate(col):
        if f:
            psi = aplicar_1q(psi, mats[(f, q)], q)
    return psi


def matrices(X, escala):
    m = {}
    for q in (0, 1):
        m[("giro_y", q)] = ry(escala * X[:, q])
        m[("giro_z", q)] = rz(escala * X[:, q])
        m[("prisma", q)] = H
    return m


def opciones_columna(permitidas):
    simples = [None] + [f for f in permitidas if f != "cable_gemelo"]
    ops = list(itertools.product(simples, simples))
    if "cable_gemelo" in permitidas:
        ops += [("cx", 0), ("cx", 1)]
    return ops


def recorrer(permitidas, ranuras, X, escala, alhoja):
    """DFS sobre todos los circuitos; llama alhoja(columnas, probabilidades)."""
    ops = opciones_columna(permitidas)
    mats = matrices(X, escala)
    psi0 = np.zeros((len(X), 4), dtype=complex)
    psi0[:, 0] = 1

    def dfs(psi, cols):
        if len(cols) == ranuras:
            alhoja(tuple(cols), np.abs(psi) ** 2)
            return
        for op in ops:
            dfs(aplicar_columna(psi, op, mats), cols + [op])

    dfs(psi0, [])
    return len(ops) ** ranuras


def n_fichas(cols):
    return sum(1 if c[0] == "cx" else sum(f is not None for f in c) for c in cols)


def acierto(p, y):
    return float(np.mean((p > 0.5).astype(int) == y))


def buscar(m, X, y, clases, lectura=None, escala=None):
    """Mejor acierto por clase (predicado sobre las columnas) y por número de fichas."""
    lectura = lectura or m["lectura"]
    escala = escala if escala is not None else m["escala"]
    mejor = {c: (-1.0, None) for c in clases}
    por_fichas = {}

    def hoja(cols, pr):
        a = acierto(LECTURAS[lectura](pr), y)
        for c, pred in clases.items():
            if a > mejor[c][0] and pred(cols):
                mejor[c] = (a, cols)
        n = n_fichas(cols)
        if a > por_fichas.get(n, (-1.0, None))[0]:
            por_fichas[n] = (a, cols)

    total = recorrer(m["fichas"], m["ranuras"], X, escala, hoja)
    return mejor, por_fichas, total


def explorar(fichas, ranuras, X, y, clases, escala):
    """Como buscar(), pero con las tres lecturas en un solo recorrido."""
    mejor = {l: {c: 0.0 for c in clases} for l in LECTURAS}
    minimo = {l: None for l in LECTURAS}

    def hoja(cols, pr):
        for l, f in LECTURAS.items():
            a = acierto(f(pr), y)
            for c, pred in clases.items():
                if a > mejor[l][c] and pred(cols):
                    mejor[l][c] = a
            if a >= UMBRAL:
                n = n_fichas(cols)
                if minimo[l] is None or n < minimo[l]:
                    minimo[l] = n

    recorrer(fichas, ranuras, X, escala, hoja)
    return mejor, minimo


# --- Qiskit: lo que hará el backend -------------------------------------------------

def a_qiskit(cols, x, escala):
    qc = QuantumCircuit(2)
    for col in cols:
        if col[0] == "cx":
            qc.cx(col[1], 1 - col[1])
            continue
        for q, f in enumerate(col):
            if f == "giro_y":
                qc.ry(escala * x[q], q)
            elif f == "giro_z":
                qc.rz(escala * x[q], q)
            elif f == "prisma":
                qc.h(q)
    return qc


def acierto_qiskit(cols, X, y, lectura, escala):
    pr = np.array([Statevector(a_qiskit(cols, x, escala)).probabilities() for x in X])
    return acierto(LECTURAS[lectura](pr), y)


def describir(cols):
    if cols is None:
        return "—"
    partes = []
    for col in cols:
        if col[0] == "cx":
            partes.append(f"CX({col[1]}→{1 - col[1]})")
        else:
            nombres = {"giro_y": "RY", "giro_z": "RZ", "prisma": "H"}
            g = [f"{nombres[f]}{q}" for q, f in enumerate(col) if f]
            if g:
                partes.append("·".join(g))
    return " → ".join(partes) if partes else "(vacío)"


def mejor_regla(X, y):
    mejor = 0.0
    for ang in np.linspace(0, PI, 181):
        proy = X @ np.array([np.cos(ang), np.sin(ang)])
        for b in np.linspace(-1.5, 1.5, 301):
            mejor = max(mejor, acierto(proy - b, y), acierto(b - proy, y))
    return mejor


# --- Predicados de clase ---------------------------------------------------------

def usa(ficha):
    return lambda cols: any((c[0] == "cx") if ficha == "cable_gemelo" else (ficha in c) for c in cols)


def no(pred):
    return lambda cols: not pred(cols)


def cargas_por_cable(cols):
    n = [0, 0]
    for c in cols:
        if c[0] != "cx":
            for q, f in enumerate(c):
                if f in ("giro_y", "giro_z"):
                    n[q] += 1
    return n


def cada_sensor_una_vez(cols):
    return max(cargas_por_cable(cols)) <= 1


def recarga_tras_cx(cols):
    """Algún sensor se vuelve a cargar después de un Cable Gemelo."""
    vio_cx, vio_giro = False, [False, False]
    for c in cols:
        if c[0] == "cx":
            vio_cx = True
            continue
        for q, f in enumerate(c):
            if f in ("giro_y", "giro_z"):
                if vio_cx and vio_giro[q]:
                    return True
                vio_giro[q] = True
    return False


def h_despues_de_fase(cols):
    """Hay una H en un cable después de un giro de fase en ese cable."""
    fase = [False, False]
    for c in cols:
        if c[0] == "cx":
            continue
        for q, f in enumerate(c):
            if f == "giro_z":
                fase[q] = True
            elif f == "prisma" and fase[q]:
                return True
    return False


def validar_simulador():
    rng = np.random.default_rng(1)
    ops = opciones_columna(["giro_y", "giro_z", "prisma", "cable_gemelo"])
    X = rng.uniform(-1, 1, (20, 2))
    dif = 0.0
    for _ in range(200):
        cols = [ops[i] for i in rng.integers(len(ops), size=4)]
        esc = rng.uniform(0.5, 7)
        psi = np.zeros((len(X), 4), dtype=complex)
        psi[:, 0] = 1
        mats = matrices(X, esc)
        for c in cols:
            psi = aplicar_columna(psi, c, mats)
        pq = np.array([Statevector(a_qiskit(cols, x, esc)).probabilities() for x in X])
        dif = max(dif, np.max(np.abs(np.abs(psi) ** 2 - pq)))
    return dif


# --- Minijuegos ----------------------------------------------------------------------

def informe(nombre, m, clases, X_pr, y_pr, X_ej, y_ej, extra=""):
    """Busca sobre ejemplos y cinta juntos (un circuito debe servir en ambos) y reporta cada uno."""
    t0 = time.perf_counter()
    mejor, por_fichas, total = buscar(m, np.vstack([X_pr, X_ej]), np.r_[y_pr, y_ej], clases)
    print(f"\n## {nombre}  ({total} circuitos, {time.perf_counter() - t0:.0f} s) {extra}")
    print(f"   lectura {m['lectura']}, escala {m['escala'] / PI:.2f}π, ranuras {m['ranuras']}, "
          f"fichas {m['fichas']}")
    print(f"   regla recta: cinta {mejor_regla(X_pr, y_pr):.0%}")
    filas = {}
    for c, (a, cols) in mejor.items():
        aq = acierto_qiskit(cols, X_pr, y_pr, m["lectura"], m["escala"]) if cols else float("nan")
        ae = acierto_qiskit(cols, X_ej, y_ej, m["lectura"], m["escala"]) if cols else float("nan")
        filas[c] = (aq, cols)
        print(f"   {c:34s} cinta {aq:5.0%} · ejemplos {ae:5.0%} · {describir(cols)}")
    minimo = min((n for n, (a, _) in por_fichas.items() if a >= UMBRAL), default=None)
    if minimo is not None:
        print(f"   circuito mínimo que pasa el {UMBRAL:.0%}: {minimo} fichas · {describir(por_fichas[minimo][1])}")
    return filas, minimo


if __name__ == "__main__":
    print(f"qiskit 2.5.2 · semilla {SEMILLA}")
    print(f"Simulador numpy vs Qiskit (200 circuitos al azar): diferencia máx {validar_simulador():.1e}")
    rng = np.random.default_rng(SEMILLA)

    # 1.1 Pelusa Rebelde: polvo (barrer) frío y pequeño; gato grande y tibio.
    m11 = {"lectura": "q1=0", "escala": PI, "ranuras": 2, "fichas": ["giro_y"]}
    centros, etiq = [(0.2, 0.25), (0.8, 0.75)], [1, 0]
    X_ej, y_ej = nubes(rng, centros, etiq, 8, 0.08)
    X_pr, y_pr = nubes(rng, centros, etiq, 10, 0.08)
    informe("1.1 Pelusa Rebelde", m11,
            {"sin giro_y": no(usa("giro_y")), "con giro_y": usa("giro_y")}, X_pr, y_pr, X_ej, y_ej)

    # 1.2 Fregadero: XOR (lavar si ambos altos o ambos bajos).
    m12 = {"lectura": "q1=0", "escala": PI, "ranuras": 4, "fichas": ["giro_y", "prisma", "cable_gemelo"]}
    centros, etiq = [(0, 0), (1, 1), (0, 1), (1, 0)], [1, 1, 0, 0]
    X_ej, y_ej = nubes(rng, centros, etiq, 3, 0.08)
    X_pr, y_pr = nubes(rng, centros, etiq, 5, 0.08)
    informe("1.2 Fiebre en el Fregadero", m12,
            {"sin cable_gemelo": no(usa("cable_gemelo")), "con cable_gemelo": usa("cable_gemelo")},
            X_pr, y_pr, X_ej, y_ej)

    # 1.4 Lavandería: exploración de diseño (vueltas, escala, lectura).
    clases14 = {"cada sensor una vez": cada_sensor_una_vez,
                "sensor repetido": no(cada_sensor_una_vez),
                "repetido, sin recarga tras CX": lambda c: not cada_sensor_una_vez(c) and not recarga_tras_cx(c),
                "recarga tras Cable Gemelo": recarga_tras_cx}
    fichas14 = ["giro_y", "prisma", "cable_gemelo"]

    def datos14(vueltas):
        r = np.random.default_rng(SEMILLA + 14)
        X_pr, y_pr = espiral(r, 30, vueltas)
        X_ej, y_ej = espiral(r, 20, vueltas)
        return X_pr, y_pr, X_ej, y_ej

    print("\n## 1.4 exploración (fichas giro_y, prisma, cable_gemelo; 50 puntos por brazo, ejemplos + cinta)")
    print("   vueltas | ranuras | escala | lectura | una vez | repetido | sin recarga tras CX | recarga tras CX | regla")
    candidatos = []
    for vueltas in (0.6, 0.75, 0.9, 1.0):
        X_pr, y_pr, X_ej, y_ej = datos14(vueltas)
        X, y = np.vstack([X_pr, X_ej]), np.r_[y_pr, y_ej]
        regla = mejor_regla(X, y)
        for ranuras in (4, 5):
            for escala in (PI / 2, PI, 1.5 * PI, 2 * PI):
                mejores, _ = explorar(fichas14, ranuras, X, y, clases14, escala)
                for lectura in LECTURAS:
                    u, rep, srec, rec = (mejores[lectura][c] for c in clases14)
                    candidatos.append((vueltas, ranuras, escala, lectura, u, rep, regla))
                    if rep >= UMBRAL:
                        print(f"   {vueltas:7.2f} | {ranuras:7d} | {escala / PI:5.2f}π | {lectura:7s} | {u:7.0%} | "
                              f"{rep:8.0%} | {srec:19.0%} | {rec:15.0%} | {regla:.0%}")
    validos = [c for c in candidatos if c[4] < UMBRAL and c[5] >= UMBRAL and c[6] < UMBRAL]
    print(f"   diseños donde la lección se sostiene (una vez < 90 %, repetido ≥ 90 %, regla < 90 %): {len(validos)}")
    if validos:
        # Se prefiere la espiral con más vueltas, luego menos ranuras y el mayor salto de acierto.
        vueltas, ranuras, escala, lectura = max(validos, key=lambda c: (c[0], -c[1], c[5] - c[4]))[:4]
        X_pr, y_pr, X_ej, y_ej = datos14(vueltas)
        m14 = {"lectura": lectura, "escala": escala, "ranuras": ranuras, "fichas": fichas14}
        informe("1.4 Lavandería en Remolino (diseño elegido)", m14, clases14,
                X_pr, y_pr, X_ej, y_ej, extra=f"vueltas {vueltas}")

    # 2.3 Pista Láser-Musical: tablero 2×2 (saltar en dos baldosas opuestas).
    clases23 = {"sin prisma": no(usa("prisma")),
                "prisma pero sin H después de la fase": lambda c: usa("prisma")(c) and not h_despues_de_fase(c),
                "sándwich (H después de la fase)": h_despues_de_fase}
    centros, etiq = [(0.25, 0.25), (0.75, 0.75), (0.25, 0.75), (0.75, 0.25)], [1, 1, 0, 0]
    X_ej, y_ej = nubes(rng, centros, etiq, 3, 0.06)
    X_pr, y_pr = nubes(rng, centros, etiq, 5, 0.06)
    for escala in (PI, 2 * PI):
        for lectura in LECTURAS:
            m23 = {"lectura": lectura, "escala": escala, "ranuras": 4,
                   "fichas": ["prisma", "giro_z", "cable_gemelo"]}
            informe("2.3 Pista Láser-Musical", m23, clases23, X_pr, y_pr, X_ej, y_ej)

    # 2.4 Gran Copa: candidatos de dataset; se busca el circuito mínimo.
    print("\n## 2.4 exploración (catálogo completo, 4 ranuras)")
    datasets24 = {
        "pasillo diagonal": lambda p: 0.22 - abs(p[0] - p[1]),
        "curva del frisbee": lambda p: p[1] - (0.5 + 0.25 * np.sin(2 * PI * p[0])),
        "dos reflectores": lambda p: 0.3 - min(np.hypot(p[0] - 0.25, p[1] - 0.25), np.hypot(p[0] - 0.75, p[1] - 0.75)),
    }
    clases24 = {"sin cable_gemelo": no(usa("cable_gemelo")), "con cable_gemelo": usa("cable_gemelo")}
    print("   dataset            | escala | lectura | sin CX | con CX | mínimo de fichas ≥ 90 % | regla")
    elegibles = []
    for nombre, regla in datasets24.items():
        r = np.random.default_rng(SEMILLA + 24)
        X_pr, y_pr = uniforme(r, 30, regla, 0.04)
        X_ej, y_ej = uniforme(r, 20, regla, 0.04)
        X, y = np.vstack([X_pr, X_ej]), np.r_[y_pr, y_ej]
        rr = mejor_regla(X, y)
        for escala in (PI, 2 * PI):
            mejores, minimos = explorar(["giro_y", "giro_z", "prisma", "cable_gemelo"], 4,
                                        X, y, clases24, escala)
            for lectura in LECTURAS:
                s, c = mejores[lectura]["sin cable_gemelo"], mejores[lectura]["con cable_gemelo"]
                print(f"   {nombre:18s} | {escala / PI:5.2f}π | {lectura:7s} | {s:6.0%} | {c:6.0%} | "
                      f"{str(minimos[lectura]):23s} | {rr:.0%}")
                if minimos[lectura] and s < UMBRAL and rr < UMBRAL:
                    elegibles.append((minimos[lectura], nombre, escala, lectura))
    if elegibles:
        # El 2.4 es ⭐⭐⭐: se prefiere el diseño cuyo circuito mínimo es más largo.
        _, nombre, escala, lectura = max(elegibles)
        r = np.random.default_rng(SEMILLA + 24)
        X_pr, y_pr = uniforme(r, 30, datasets24[nombre], 0.04)
        X_ej, y_ej = uniforme(r, 20, datasets24[nombre], 0.04)
        m24 = {"lectura": lectura, "escala": escala, "ranuras": 4,
               "fichas": ["giro_y", "giro_z", "prisma", "cable_gemelo"]}
        informe(f"2.4 Gran Copa (diseño elegido: {nombre})", m24, clases24, X_pr, y_pr, X_ej, y_ej)
