"""Exporta los datasets de los experimentos sin ejecutar sus búsquedas exhaustivas.

Desde backend/: uv run python scripts/export_content.py
Semillas y orden de consumo idénticos a experiments/verificar_minijuegos.py
y experiments/rediseno_1_3/verificar_escala.py.
"""

import json
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parents[2]
DEST = ROOT / "content" / "minigames"


def nubes(rng, centros, etiquetas, n, sd):
    points, labels = [], []
    for center, label in zip(centros, etiquetas):
        points.extend(np.clip(np.array(center) + rng.normal(0, sd, (n, 2)), 0, 1))
        labels.extend([label] * n)
    return np.array(points), np.array(labels)


def espiral(rng, n):
    points, labels = [], []
    for arm in (0, 1):
        t = rng.uniform(0.2, 1, n)
        angle = 2 * np.pi * t + arm * np.pi
        p = np.c_[t * np.cos(angle), t * np.sin(angle)] + rng.normal(0, 0.03, (n, 2))
        points.extend(np.clip(p, -1, 1))
        labels.extend([1 - arm] * n)
    return np.array(points), np.array(labels)


def uniforme(rng, n):
    points, labels = [], []
    while len(points) < n:
        p = rng.uniform(0, 1, 2)
        v = 0.22 - abs(p[0] - p[1])
        if abs(v) > 0.04:
            points.append(p)
            labels.append(int(v > 0))
    return np.array(points), np.array(labels)


def disco(rng, dentro, fuera):
    points = []
    while len(points) < dentro:
        p = rng.uniform(-1, 1, 2)
        if np.hypot(*p) < 0.35:
            points.append(p)
    while len(points) < dentro + fuera:
        p = rng.uniform(-1, 1, 2)
        if np.hypot(*p) > 0.55:
            points.append(p)
    return np.array(points), np.array([1] * dentro + [0] * fuera)


def base(game, title, level, room, sensors, positive, negative, objects, concept, lines):
    return {
        "id": game, "tipo": "clasificacion", "titulo": title, "nivel": level,
        "escenario": "casa" if level == 1 else "parque", "habitacion": room,
        "dificultad": 1, "sensores": sensors, "rango": [0, 1],
        "codificacion": {"escala": float(np.pi)},
        "lectura": {"qubits": [1], "resultado": "0", "accion": positive, "otra": negative},
        "ranuras": 4, "fichas_permitidas": ["giro_y", "prisma", "cable_gemelo"],
        "objetos": objects, "victoria": {"acierto_minimo": 0.9},
        "objeto_estrella": next(key for key, obj in objects.items() if obj["accion"] == positive),
        "desastres": [], "chispa": {"inicio": title, "primer_fallo": "Mira qué ejemplo confundió tu compañero.",
        "primera_ficha": "¡CLACK! Observa qué cambia al conectar las piezas.",
        "victoria": "¡Lo lograste! La decisión salió de tu circuito."},
        "cromo": {"concepto": concept, "titulo": title, "lineas": lines},
    }


def examples(data, config, cluster_objects=None):
    X, labels = data
    positive = config["lectura"]["accion"]
    by_label = {label: [key for key, obj in config["objetos"].items() if (obj["accion"] == positive) == bool(label)][0]
                for label in (0, 1)}
    counts, rows = {}, []
    for i, (point, label) in enumerate(zip(X, labels)):
        obj = cluster_objects[i // (len(X) // len(cluster_objects))] if cluster_objects else by_label[int(label)]
        counts[obj] = counts.get(obj, 0) + 1
        rows.append({"id": f"{obj}-{counts[obj]}", "objeto": obj, "x": point.tolist()})
    return rows


def write(config, train=None, test=None, clusters=None):
    if train is not None:
        config["ejemplos"] = examples(train, config, clusters)
        config["prueba"] = examples(test, config, clusters)
    DEST.mkdir(parents=True, exist_ok=True)
    (DEST / f"{config['id']}.json").write_text(json.dumps(config, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def export():
    rng = np.random.default_rng(21)
    p = base("pelusa", "¡Operación Pelusa Rebelde!", 1, "sala", ["tamaño", "calor"], "barrer", "ignorar",
             {"polvo": {"emoji": "☁️", "accion": "barrer"}, "gato": {"emoji": "🐱", "accion": "ignorar"}},
             "SVM lineal → codificación RY", ["Si una recta basta, lo clásico también gana.", "RY convierte un sensor en una rotación.", "Codificar datos no es entrenar un modelo."])
    p.update(ranuras=2, fichas_permitidas=["giro_y"])
    p["chispa"].update(inicio="Barre el polvo; deja dormir al gato.", victoria="Si una recta basta, no hace falta lo cuántico. ¡Prueba los Giro-Sensores!")
    p["desastres"] = [{"id": "gato", "objeto": "gato", "accion_erronea": "barrer", "texto": "¡Sr. Bigotes no es pelusa!"}, {"id": "mantita", "objeto": "polvo", "accion_erronea": "ignorar", "texto": "Le puso mantita al polvo."}]
    centers = [(0.2, 0.25), (0.8, 0.75)]
    train = nubes(rng, centers, [1, 0], 8, 0.08)
    test = nubes(rng, centers, [1, 0], 10, 0.08)
    write(p, train, test)

    f = base("fregadero", "¡Fiebre en el Fregadero!", 1, "cocina", ["humedad", "peso"], "lavar", "basura",
             {"plato": {"emoji": "🍽️", "accion": "lavar"}, "cucharita": {"emoji": "🥄", "accion": "lavar"}, "sandia": {"emoji": "🍉", "accion": "basura"}, "servilleta": {"emoji": "🧻", "accion": "basura"}},
             "SVM → modelo cuántico como método de kernel", ["Los Giro-Sensores codifican humedad y peso.", "El Cable Gemelo cambia lo que mide el robot.", "Una red clásica también resuelve XOR (Schuld, 2021)."])
    f["chispa"].update(inicio="¡Lava lo que sirve, tira lo demás!", victoria="Una red neuronal clásica también podría. ¡Aquí experimentaste con qubits!")
    f["desastres"] = [{"id": "triple", "objeto": "plato", "accion_erronea": "basura", "texto": "¡TRIPLE! Vajilla de la abuela al basurero."}, {"id": "vitrina", "objeto": "sandia", "accion_erronea": "lavar", "texto": "¡Cáscara lavada y perfumada para la vitrina!"}]
    centers = [(0, 0), (1, 1), (0, 1), (1, 0)]
    train = nubes(rng, centers, [1, 1, 0, 0], 3, 0.08)
    test = nubes(rng, centers, [1, 1, 0, 0], 5, 0.08)
    write(f, train, test, ["cucharita", "plato", "sandia", "servilleta"])

    # El rng principal continúa aquí: lavandería y copa tienen rng independientes.
    s = base("pista", "¡Pista de Agilidad Láser-Musical!", 2, "pista", ["ritmo", "baldosa"], "saltar", "agacharse",
             {"valla": {"emoji": "🚧", "accion": "saltar"}, "resorte": {"emoji": "🎵", "accion": "agacharse"}},
             "Distribuciones → fase e interferencia", ["RZ cambia fases; por sí sola no cambia estas probabilidades.", "El Prisma final convierte la fase en interferencia visible.", "La decisión se calcula con el circuito real."])
    s["fichas_permitidas"] = ["prisma", "giro_z", "cable_gemelo"]
    s["chispa"]["inicio"] = "¡Salta la valla y sigue el ritmo!"
    s["desastres"] = [{"id": "algodon", "objeto": "resorte", "accion_erronea": "saltar", "texto": "¡Peluca de algodón de azúcar!"}]
    centers = [(0.25, 0.25), (0.75, 0.75), (0.25, 0.75), (0.75, 0.25)]
    train = nubes(rng, centers, [1, 1, 0, 0], 3, 0.06)
    test = nubes(rng, centers, [1, 1, 0, 0], 5, 0.06)
    write(s, train, test)

    c = base("chef", "¡Chef Catástrofe: En su Punto!", 1, "cocina", ["desviacion_fuego", "desviacion_espesor"], "listo", "revisar",
             {"panqueque": {"emoji": "🥞", "accion": "listo"}, "crudo": {"emoji": "🥣", "accion": "revisar"}},
             "Ancho del kernel → escala de codificación", ["Dos giros dibujan una isla de panqueques listos.", "La escala controla su tamaño; demasiado giro crea islas fantasma.", "Un kernel clásico también tiene ancho (Schuld, 2021)."])
    c.update(rango=[-1, 1], ranuras=1, codificacion={"escala": 1.5}, perilla_escala={"min": 0.5, "max": 8, "paso": 0.25})
    c["lectura"].update(qubits=[0, 1], resultado="00")
    c["chispa"].update(inicio="¡Sirve solo los panqueques en su punto!", primer_fallo="Isla gigante: estás sirviendo mezcla cruda.", victoria="Un kernel clásico también tiene su perilla de ancho.")
    c["desastres"] = [{"id": "crudo", "objeto": "crudo", "accion_erronea": "listo", "texto": "¡Mezcla cruda en tu bolsillo!"}]
    r = np.random.default_rng(13)
    train, test = disco(r, 8, 12), disco(r, 10, 14)
    write(c, train, test)

    l = base("lavanderia", "¡Lavandería en Remolino!", 1, "lavanderia", ["giro", "posicion"], "camisa", "calcetin",
             {"camisa": {"emoji": "👔", "accion": "camisa"}, "calcetin": {"emoji": "🧦", "accion": "calcetin"}},
             "Underfitting → data re-uploading", ["Una capa no basta para estas espirales.", "Recargar sensores después del Cable Gemelo amplía la representación.", "Pérez-Salinas et al., Quantum 4, 226 (2020)."])
    l.update(ranuras=5, rango=[-1, 1], dificultad=2)
    l["lectura"]["qubits"] = [0]
    l["chispa"]["inicio"] = "¡Separa camisas blancas de calcetines rojos!"
    l["desastres"] = [{"id": "espuma", "objeto": "calcetin", "accion_erronea": "camisa", "texto": "¡Explosión de espuma rosada y ropa de chihuahua!"}]
    r = np.random.default_rng(35)
    test, train = espiral(r, 30), espiral(r, 20)
    write(l, train, test)

    c = base("copa", "¡Gran Copa Canina de Villa Qubit!", 2, "estadio", ["viento", "giro"], "atrapar", "esperar",
             {"frisbee": {"emoji": "🥏", "accion": "atrapar"}, "obstaculo": {"emoji": "🚧", "accion": "esperar"}},
             "Expresividad → presupuesto NISQ", ["El circuito ganador usa cinco fichas.", "El límite representa un presupuesto de compuertas, no ruido simulado.", "La estática es decorativa: Qiskit decide sin ruido."])
    c.update(dificultad=3, limite_fichas=5, codificacion={"escala": float(2 * np.pi)}, fichas_permitidas=["giro_y", "giro_z", "prisma", "cable_gemelo"])
    c["chispa"].update(inicio="¡Atrapa el frisbee con cinco fichas como máximo!", primer_fallo="La estática es decorativa; el robot decide con el circuito real.")
    c["desastres"] = [{"id": "tormenta", "texto": "¡Enterró el peluquín del juez!"}, {"id": "frisbee", "objeto": "frisbee", "accion_erronea": "esperar", "texto": "¡El frisbee se fue al palco!"}]
    r = np.random.default_rng(45)
    test, train = uniforme(r, 30), uniforme(r, 20)
    write(c, train, test)

    write({"id": "doble-hueso", "tipo": "doble-hueso", "nivel": 2, "escenario": "parque", "titulo": "¡El Dilema del Doble Hueso!", "dificultad": 2,
        "tuneles": [{"id": "a", "p": 0.30, "emoji": "🕳️"}, {"id": "b", "p": 0.36, "emoji": "🕳️"}],
        "bateria": 180, "qae": {"potencias": [0, 1, 2, 4], "shots_por_potencia": 5}, "monte_carlo": {"paso": 10},
        "chispa": {"inicio": "¿Qué túnel esconde más huesos? ¡Cuida tu batería!", "primer_fallo": "¡Una rana! Prueba el otro chip.",
        "victoria": "¡Elegiste el túnel con mayor probabilidad!", "comparacion": "La ventaja es en consultas, no en tiempo: aquí todo corre en una laptop.",
        "ruido": "En chips ruidosos, el error deja de bajar pasado cierto punto (Tanaka et al., 2021)."},
        "desastres": [{"id": "rana", "texto": "¡Rana en la nariz!"}, {"id": "barro", "texto": "Sin batería: Q-Boby ronca en el barro."}],
        "cromo": {"titulo": "Olfato amplificado", "concepto": "Monte Carlo → QAE", "lineas": ["Ambos chips consultan el mismo oráculo.", "QAE puede ahorrar consultas, no tiempo de laptop (Brassard et al., 2002).", "MLAE combina mediciones de distintas amplificaciones (Suzuki et al., 2020)."]}})
    write({"id": "trucos", "tipo": "trucos", "nivel": 2, "escenario": "parque", "titulo": "¡Siéntate, Gira o Despega!", "dificultad": 1,
        "ordenes": [{"id": f"orden-{i+1}", "x": x, "truco": "girar" if x[0] != x[1] else "sentarse"} for i, x in enumerate([[0, 0], [1, 0], [0, 1], [1, 1]])],
        "trucos": {"sentarse": {"emoji": "🐕", "texto": "Sentarse"}, "girar": {"emoji": "🌀", "texto": "Girar"}},
        "perillas": {"min": -3.1416, "max": 3.1416}, "theta_inicial": [2.4, -1.9], "train": {"iteraciones": 30, "tasa": 1.0},
        "chispa": {"inicio": "¡Enseña a Q-Boby a sentarse y girar!", "primer_fallo": "¡Se convirtió en helicóptero! Ajusta las dos perillas.",
        "victoria": "Entrenar ajusta los parámetros; inferir solo los usa."},
        "desastres": [{"id": "helicoptero", "texto": "¡Su cabecita gira y sigue ladrando!"}],
        "cromo": {"titulo": "Perillas que aprenden", "concepto": "Descenso de gradiente → parameter-shift", "lineas": ["La pérdida mide cuánto se equivoca Q-Boby.", "Parameter-shift evalúa dos desplazamientos por perilla.", "El optimizador clásico usa ese gradiente para ajustar los ángulos."]}})


if __name__ == "__main__":
    export()
    print("Exportados 8 minijuegos con semillas reproducibles.")
