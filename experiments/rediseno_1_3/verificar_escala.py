"""Rediseño del 1.3 Panqueques, opción A1: la lección es la escala de codificación.

Pregunta: con la lectura fija `00` y la escala por defecto del JSON, ¿algún
circuito de fichas llega al 90 %? Y con dos `giro_y` y la perilla de escala
ajustada, ¿sí llega? Si lo primero es «no» y lo segundo «sí», la perilla es la
pieza que enseña el concepto.

Correr:
  uv run --no-project --with "qiskit==2.5.2" python experiments/rediseno_1_3/verificar_escala.py
"""
import itertools
import time

import numpy as np
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector

SEMILLA = 13
RADIO = 0.45          # «en su punto» si la desviación (fuego, espesor) está dentro de este radio
MARGEN = 0.10         # sin objetos pegados a la frontera
ESCALA_DEFECTO = 1.5  # radianes por unidad de desviación: isla demasiado grande
UMBRAL = 0.9

rng = np.random.default_rng(SEMILLA)


def muestrear(n_dentro, n_fuera):
    """Puntos en [-1, 1]²: dentro del disco (listo) y fuera (frío, quemado, aguado, espeso)."""
    dentro = []
    while len(dentro) < n_dentro:
        p = rng.uniform(-1, 1, 2)
        if np.hypot(*p) < RADIO - MARGEN:
            dentro.append(p)
    fuera = []
    while len(fuera) < n_fuera:
        p = rng.uniform(-1, 1, 2)
        if np.hypot(*p) > RADIO + MARGEN:
            fuera.append(p)
    X = np.array(dentro + fuera)
    y = np.array([1] * n_dentro + [0] * n_fuera)
    return X, y


X_ej, y_ej = muestrear(8, 12)     # ejemplos del radar
X_pr, y_pr = muestrear(10, 14)    # cinta de prueba


# --- Circuitos con Qiskit (lo que hará el backend) -------------------------

def circuito(fichas, x):
    """fichas: lista de (ficha, cable, pos, escala). Mismo catálogo que el breadboard."""
    qc = QuantumCircuit(2)
    for ficha, cable, _pos, escala in sorted(fichas, key=lambda f: f[2]):
        if ficha == "giro_y":
            qc.ry(escala * x[cable], cable)
        elif ficha == "giro_z":
            qc.rz(escala * x[cable], cable)
        elif ficha == "prisma":
            qc.h(cable)
        elif ficha == "cable_gemelo":
            qc.cx(cable, 1 - cable)
    return qc


def p_listo_qiskit(fichas, X):
    """Lectura fija del 1.3: P(medir 00)."""
    return np.array([Statevector(circuito(fichas, x)).probabilities()[0] for x in X])


def acierto(p, y):
    return float(np.mean((p > 0.5).astype(int) == y))


def dos_giros(escala):
    return [("giro_y", 0, 0, escala), ("giro_y", 1, 0, escala)]


# --- Simulador numpy vectorizado, solo para la búsqueda exhaustiva ---------
# Se valida contra Qiskit más abajo; los resultados que se reportan como
# «del juego» salen de Qiskit.

H = np.array([[1, 1], [1, -1]]) / np.sqrt(2)


def aplicar_1q(psi, U, q):
    """psi: (N, 4) en orden de Qiskit (índice = 2·q1 + q0). U: (N, 2, 2) o (2, 2)."""
    t = psi.reshape(-1, 2, 2)  # ejes: (N, q1, q0)
    if U.ndim == 2:
        U = np.broadcast_to(U, (psi.shape[0], 2, 2))
    if q == 0:
        t = np.einsum("nab,ncb->nca", U, t)
    else:
        t = np.einsum("nab,nbc->nac", U, t)
    return t.reshape(-1, 4)


def ry(theta):
    c, s = np.cos(theta / 2), np.sin(theta / 2)
    return np.stack([np.stack([c, -s], -1), np.stack([s, c], -1)], -2)


def rz(theta):
    e = np.exp(-0.5j * theta)
    z = np.zeros_like(e)
    return np.stack([np.stack([e, z], -1), np.stack([z, e.conj()], -1)], -2)


def p_listo_np(columnas, X, escala):
    """columnas: lista de posiciones; cada una es ("cx", control) o (ficha_q0, ficha_q1)."""
    psi = np.zeros((len(X), 4), dtype=complex)
    psi[:, 0] = 1
    for col in columnas:
        if col[0] == "cx":
            c = col[1]
            perm = [0, 3, 2, 1] if c == 0 else [0, 1, 3, 2]
            psi = psi[:, perm]
            continue
        for q, f in enumerate(col):
            if f == "giro_y":
                psi = aplicar_1q(psi, ry(escala * X[:, q]), q)
            elif f == "giro_z":
                psi = aplicar_1q(psi, rz(escala * X[:, q]), q)
            elif f == "prisma":
                psi = aplicar_1q(psi, H, q)
    return np.abs(psi[:, 0]) ** 2


def columnas_a_fichas(columnas, escala):
    fichas = []
    for pos, col in enumerate(columnas):
        if col[0] == "cx":
            fichas.append(("cable_gemelo", col[1], pos, escala))
        else:
            fichas += [(f, q, pos, escala) for q, f in enumerate(col) if f]
    return fichas


def opciones_columna(permitidas):
    simples = [None] + [f for f in permitidas if f != "cable_gemelo"]
    ops = [c for c in itertools.product(simples, simples)]
    if "cable_gemelo" in permitidas:
        ops += [("cx", 0), ("cx", 1)]
    return ops


def mejor_circuito(permitidas, ranuras, escala, X, y):
    ops = opciones_columna(permitidas)
    mejor = (-1.0, None)
    for columnas in itertools.product(ops, repeat=ranuras):
        a = acierto(p_listo_np(columnas, X, escala), y)
        if a > mejor[0]:
            mejor = (a, columnas)
    return mejor, len(ops) ** ranuras


# --- Referencia clásica: la mejor regla recta ------------------------------

def mejor_regla(X, y):
    mejor = 0.0
    for ang in np.linspace(0, np.pi, 181):
        w = np.array([np.cos(ang), np.sin(ang)])
        proy = X @ w
        for b in np.linspace(-1.5, 1.5, 301):
            for signo in (1, -1):
                mejor = max(mejor, acierto(signo * (proy - b), y))
    return mejor


if __name__ == "__main__":
    print(f"qiskit 2.5.2 · semilla {SEMILLA} · radio {RADIO} · escala por defecto {ESCALA_DEFECTO}")
    print(f"ejemplos: {len(y_ej)} ({y_ej.sum()} listos) · prueba: {len(y_pr)} ({y_pr.sum()} listos)\n")

    # 0. Validar el simulador numpy contra Qiskit en circuitos al azar
    ops = opciones_columna(["giro_y", "giro_z", "prisma", "cable_gemelo"])
    r = np.random.default_rng(1)
    max_dif = 0.0
    for _ in range(300):
        cols = [ops[i] for i in r.integers(len(ops), size=4)]
        esc = r.uniform(0.5, 8)
        a = p_listo_np(cols, X_pr, esc)
        b = p_listo_qiskit(columnas_a_fichas(cols, esc), X_pr)
        max_dif = max(max_dif, np.max(np.abs(a - b)))
    print(f"0. Simulador numpy vs Qiskit (300 circuitos al azar): diferencia máx {max_dif:.1e}\n")

    # 1. Referencias sin perilla
    print("1. Sin perilla (escala por defecto), con Qiskit:")
    print(f"   sin fichas (siempre 'listo')      prueba {acierto(p_listo_qiskit([], X_pr), y_pr):.0%}")
    print(f"   dos giro_y                        prueba {acierto(p_listo_qiskit(dos_giros(ESCALA_DEFECTO), X_pr), y_pr):.0%}")
    print(f"   mejor regla recta (chip simple)   prueba {mejor_regla(X_pr, y_pr):.0%}\n")

    # 2. Barrido de la perilla con dos giro_y (Qiskit)
    print("2. Perilla de escala con dos giro_y (Qiskit):")
    print("   escala | ejemplos | prueba | P(00) centro | P(00) en (1, 0) | P(00) en (1, 1)")
    escalas = np.arange(0.5, 8.01, 0.5)
    barrido = []
    for s in escalas:
        f = dos_giros(s)
        ae, ap = acierto(p_listo_qiskit(f, X_ej), y_ej), acierto(p_listo_qiskit(f, X_pr), y_pr)
        bordes = p_listo_qiskit(f, np.array([[0, 0], [1, 0], [1, 1]]))
        barrido.append((s, ae, ap))
        print(f"   {s:6.2f} | {ae:8.0%} | {ap:6.0%} | {bordes[0]:12.2f} | {bordes[1]:15.2f} | {bordes[2]:15.2f}")
    ganan = [s for s, ae, ap in barrido if ap >= UMBRAL]
    print(f"   ventana ganadora (prueba >= {UMBRAL:.0%}): {min(ganan):.2f} a {max(ganan):.2f} rad\n" if ganan
          else "   ninguna escala gana\n")

    # 3. Búsqueda exhaustiva a escala por defecto: ¿se gana sin tocar la perilla?
    print("3. Búsqueda exhaustiva de circuitos a escala por defecto (numpy validado):")
    for permitidas in (["giro_y", "prisma", "cable_gemelo"],
                       ["giro_y", "giro_z", "prisma", "cable_gemelo"]):
        for ranuras in (1, 2, 3, 4):
            (a, cols), n = mejor_circuito(permitidas, ranuras, ESCALA_DEFECTO, X_pr, y_pr)
            fichas = columnas_a_fichas(cols, ESCALA_DEFECTO)
            a_q = acierto(p_listo_qiskit(fichas, X_pr), y_pr)  # confirmar con Qiskit
            veredicto = "gana SIN perilla" if a_q >= UMBRAL else "no gana"
            nombres = [f"{f}@{c}.{p}" for f, c, p, _ in fichas]
            print(f"   {'+'.join(permitidas):34s} ranuras {ranuras}: {n:6d} circuitos, "
                  f"mejor {a_q:.0%} ({veredicto}) {nombres}")
    print()

    # 4. Kernel: la escala es el ancho del kernel de fidelidad
    pares = rng.uniform(-1, 1, (50, 2, 2))
    max_dif = 0.0
    for s in (1.0, 3.0, 6.0):
        for xa, xb in pares:
            fa = Statevector(circuito(dos_giros(s), xa))
            fb = Statevector(circuito(dos_giros(s), xb))
            k = abs(fa.inner(fb)) ** 2
            formula = np.prod(np.cos(s * (xa - xb) / 2) ** 2)
            max_dif = max(max_dif, abs(k - formula))
    print(f"4. Kernel |<psi(x)|psi(x')>|² = prod cos²(escala·(x_i - x'_i)/2): diferencia máx {max_dif:.1e}\n")

    # 5. Costo del mapa 32x32 con la perilla
    g = np.linspace(-1, 1, 32)
    malla = np.array([[a, b] for b in g for a in g])
    t0 = time.perf_counter()
    p_listo_qiskit(dos_giros(3.5), malla)
    print(f"5. Mapa 32x32 con Statevector: {(time.perf_counter() - t0) * 1000:.0f} ms")
