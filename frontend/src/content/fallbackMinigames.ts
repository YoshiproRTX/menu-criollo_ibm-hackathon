// Configuraciones de respaldo verificadas con Qiskit (se usan solo si content/minigames/*.json aún no existe)
import type { MinigameConfig } from '../api/types';

export const FALLBACK_MINIGAMES: Record<string, MinigameConfig> = {
  "pelusa": {
    "id": "pelusa",
    "tipo": "clasificacion",
    "nivel": 1,
    "escenario": "casa",
    "habitacion": "sala",
    "titulo": "¡Operación Pelusa Rebelde!",
    "dificultad": 1,
    "rango": [
      0,
      1
    ],
    "sensores": [
      "tamaño",
      "calor"
    ],
    "codificacion": {
      "escala": 3.14159
    },
    "lectura": {
      "qubits": [
        1
      ],
      "resultado": "0",
      "accion": "barrer",
      "otra": "ignorar"
    },
    "ranuras": 2,
    "fichas_permitidas": [
      "giro_y"
    ],
    "objetos": {
      "polvo": {
        "emoji": "🧹",
        "accion": "barrer"
      },
      "ceniza": {
        "emoji": "💨",
        "accion": "barrer"
      },
      "gato": {
        "emoji": "🐱",
        "accion": "ignorar"
      }
    },
    "ejemplos": [
      {
        "id": "ej-ceniza-1",
        "objeto": "ceniza",
        "x": [
          0.2287,
          0.3709
        ]
      },
      {
        "id": "ej-polvo-2",
        "objeto": "polvo",
        "x": [
          0.0571,
          0.3849
        ]
      },
      {
        "id": "ej-ceniza-3",
        "objeto": "ceniza",
        "x": [
          0.1962,
          0.186
        ]
      },
      {
        "id": "ej-polvo-4",
        "objeto": "polvo",
        "x": [
          0.1358,
          0.1634
        ]
      },
      {
        "id": "ej-ceniza-5",
        "objeto": "ceniza",
        "x": [
          0.1821,
          0.3167
        ]
      },
      {
        "id": "ej-polvo-6",
        "objeto": "polvo",
        "x": [
          0.2467,
          0.3011
        ]
      },
      {
        "id": "ej-ceniza-7",
        "objeto": "ceniza",
        "x": [
          0.0644,
          0.1243
        ]
      },
      {
        "id": "ej-polvo-8",
        "objeto": "polvo",
        "x": [
          0.3243,
          0.3275
        ]
      },
      {
        "id": "ej-gato-9",
        "objeto": "gato",
        "x": [
          0.9747,
          0.8468
        ]
      },
      {
        "id": "ej-gato-10",
        "objeto": "gato",
        "x": [
          0.718,
          0.8528
        ]
      },
      {
        "id": "ej-gato-11",
        "objeto": "gato",
        "x": [
          0.8503,
          0.7672
        ]
      },
      {
        "id": "ej-gato-12",
        "objeto": "gato",
        "x": [
          0.7344,
          0.7502
        ]
      },
      {
        "id": "ej-gato-13",
        "objeto": "gato",
        "x": [
          0.7882,
          0.8214
        ]
      },
      {
        "id": "ej-gato-14",
        "objeto": "gato",
        "x": [
          0.81,
          0.8768
        ]
      },
      {
        "id": "ej-gato-15",
        "objeto": "gato",
        "x": [
          0.738,
          0.7877
        ]
      },
      {
        "id": "ej-gato-16",
        "objeto": "gato",
        "x": [
          0.8399,
          0.6809
        ]
      }
    ],
    "prueba": [
      {
        "id": "pr-ceniza-1",
        "objeto": "ceniza",
        "x": [
          0.1055,
          0.3311
        ]
      },
      {
        "id": "pr-polvo-2",
        "objeto": "polvo",
        "x": [
          0.2414,
          0.237
        ]
      },
      {
        "id": "pr-ceniza-3",
        "objeto": "ceniza",
        "x": [
          0.2315,
          0.196
        ]
      },
      {
        "id": "pr-polvo-4",
        "objeto": "polvo",
        "x": [
          0.2191,
          0.2016
        ]
      },
      {
        "id": "pr-ceniza-5",
        "objeto": "ceniza",
        "x": [
          0.2151,
          0.3289
        ]
      },
      {
        "id": "pr-polvo-6",
        "objeto": "polvo",
        "x": [
          0.1728,
          0.318
        ]
      },
      {
        "id": "pr-ceniza-7",
        "objeto": "ceniza",
        "x": [
          0.1173,
          0.2269
        ]
      },
      {
        "id": "pr-polvo-8",
        "objeto": "polvo",
        "x": [
          0.0908,
          0.242
        ]
      },
      {
        "id": "pr-ceniza-9",
        "objeto": "ceniza",
        "x": [
          0.2063,
          0.2342
        ]
      },
      {
        "id": "pr-polvo-10",
        "objeto": "polvo",
        "x": [
          0.1786,
          0.3572
        ]
      },
      {
        "id": "pr-gato-11",
        "objeto": "gato",
        "x": [
          0.9139,
          0.6527
        ]
      },
      {
        "id": "pr-gato-12",
        "objeto": "gato",
        "x": [
          0.8939,
          0.6122
        ]
      },
      {
        "id": "pr-gato-13",
        "objeto": "gato",
        "x": [
          0.7412,
          0.7361
        ]
      },
      {
        "id": "pr-gato-14",
        "objeto": "gato",
        "x": [
          0.8089,
          0.6662
        ]
      },
      {
        "id": "pr-gato-15",
        "objeto": "gato",
        "x": [
          0.7422,
          0.7561
        ]
      },
      {
        "id": "pr-gato-16",
        "objeto": "gato",
        "x": [
          0.7445,
          0.6987
        ]
      },
      {
        "id": "pr-gato-17",
        "objeto": "gato",
        "x": [
          0.8533,
          0.8245
        ]
      },
      {
        "id": "pr-gato-18",
        "objeto": "gato",
        "x": [
          0.7952,
          0.7515
        ]
      },
      {
        "id": "pr-gato-19",
        "objeto": "gato",
        "x": [
          0.7984,
          0.7136
        ]
      },
      {
        "id": "pr-gato-20",
        "objeto": "gato",
        "x": [
          0.7591,
          0.667
        ]
      }
    ],
    "victoria": {
      "acierto_minimo": 0.9
    },
    "objeto_estrella": "polvo",
    "desastres": [
      {
        "id": "gato-recogedor",
        "objeto": "gato",
        "accion_erronea": "barrer",
        "texto": "¡MIAU! Q-Anacleto barrió al Sr. Bigotes y quedó pegado a su cara LED."
      },
      {
        "id": "polvo-mantita",
        "objeto": "polvo",
        "accion_erronea": "ignorar",
        "texto": "Q-Anacleto arropó la bola de polvo con una mantita y le dio croquetas."
      },
      {
        "id": "ceniza-mantita",
        "objeto": "ceniza",
        "accion_erronea": "ignorar",
        "texto": "Q-Anacleto tomó la escoba al revés y esparció toda la ceniza."
      }
    ],
    "chispa": {
      "inicio": "¡Barre el polvo frío y deja dormir al Sr. Bigotes!",
      "primer_fallo": "¡Cuidado con el michi! Abre el cerebro y ajusta la regla o prueba un Giro-Sensor.",
      "primera_ficha": "¡CLACK! El Giro-Sensor RY convierte el sensor en una rotación del qubit.",
      "victoria": "Cuando una recta basta, no hace falta gastar batería cuántica. ¡Pero ya sabes rotar un qubit!"
    },
    "cromo": {
      "concepto": "Margen lineal SVM ➔ codificación por rotación RY",
      "titulo": "Giro-Sensor RY",
      "lineas": [
        "El polvo frío y el gato tibio se separan con una simple línea recta.",
        "En el cerebro cuántico, el Giro-Sensor RY convierte el dato del sensor en un ángulo del qubit.",
        "Codificar datos como rotaciones es el primer ladrillo de cualquier modelo QML."
      ]
    }
  },
  "fregadero": {
    "id": "fregadero",
    "tipo": "clasificacion",
    "nivel": 1,
    "escenario": "casa",
    "habitacion": "cocina",
    "titulo": "¡Fiebre en el Fregadero!",
    "dificultad": 1,
    "rango": [
      0,
      1
    ],
    "sensores": [
      "humedad",
      "peso"
    ],
    "codificacion": {
      "escala": 3.14159
    },
    "lectura": {
      "qubits": [
        1
      ],
      "resultado": "0",
      "accion": "lavar",
      "otra": "basura"
    },
    "ranuras": 4,
    "fichas_permitidas": [
      "giro_y",
      "cable_gemelo",
      "prisma"
    ],
    "objetos": {
      "plato": {
        "emoji": "🍽️",
        "accion": "lavar"
      },
      "cucharita": {
        "emoji": "🥄",
        "accion": "lavar"
      },
      "sandia": {
        "emoji": "🍉",
        "accion": "basura"
      },
      "servilleta": {
        "emoji": "🧻",
        "accion": "basura"
      }
    },
    "ejemplos": [
      {
        "id": "ej-cucharita-1",
        "objeto": "cucharita",
        "x": [
          0.0519,
          0.0
        ]
      },
      {
        "id": "ej-cucharita-2",
        "objeto": "cucharita",
        "x": [
          0.0,
          0.016
        ]
      },
      {
        "id": "ej-cucharita-3",
        "objeto": "cucharita",
        "x": [
          0.0425,
          0.1137
        ]
      },
      {
        "id": "ej-plato-4",
        "objeto": "plato",
        "x": [
          0.9781,
          0.9679
        ]
      },
      {
        "id": "ej-plato-5",
        "objeto": "plato",
        "x": [
          1.0,
          0.9324
        ]
      },
      {
        "id": "ej-plato-6",
        "objeto": "plato",
        "x": [
          1.0,
          1.0
        ]
      },
      {
        "id": "ej-sandia-7",
        "objeto": "sandia",
        "x": [
          0.0555,
          0.9904
        ]
      },
      {
        "id": "ej-sandia-8",
        "objeto": "sandia",
        "x": [
          0.0592,
          1.0
        ]
      },
      {
        "id": "ej-sandia-9",
        "objeto": "sandia",
        "x": [
          0.04,
          0.9776
        ]
      },
      {
        "id": "ej-servilleta-10",
        "objeto": "servilleta",
        "x": [
          0.8652,
          0.0758
        ]
      },
      {
        "id": "ej-servilleta-11",
        "objeto": "servilleta",
        "x": [
          0.9717,
          0.0
        ]
      },
      {
        "id": "ej-servilleta-12",
        "objeto": "servilleta",
        "x": [
          1.0,
          0.0271
        ]
      }
    ],
    "prueba": [
      {
        "id": "pr-cucharita-1",
        "objeto": "cucharita",
        "x": [
          0.0,
          0.0
        ]
      },
      {
        "id": "pr-cucharita-2",
        "objeto": "cucharita",
        "x": [
          0.0,
          0.0794
        ]
      },
      {
        "id": "pr-cucharita-3",
        "objeto": "cucharita",
        "x": [
          0.0,
          0.0
        ]
      },
      {
        "id": "pr-cucharita-4",
        "objeto": "cucharita",
        "x": [
          0.0,
          0.1135
        ]
      },
      {
        "id": "pr-cucharita-5",
        "objeto": "cucharita",
        "x": [
          0.0,
          0.0
        ]
      },
      {
        "id": "pr-plato-6",
        "objeto": "plato",
        "x": [
          0.8893,
          1.0
        ]
      },
      {
        "id": "pr-plato-7",
        "objeto": "plato",
        "x": [
          1.0,
          1.0
        ]
      },
      {
        "id": "pr-plato-8",
        "objeto": "plato",
        "x": [
          1.0,
          0.9358
        ]
      },
      {
        "id": "pr-plato-9",
        "objeto": "plato",
        "x": [
          1.0,
          0.9991
        ]
      },
      {
        "id": "pr-plato-10",
        "objeto": "plato",
        "x": [
          0.9839,
          1.0
        ]
      },
      {
        "id": "pr-sandia-11",
        "objeto": "sandia",
        "x": [
          0.102,
          0.9279
        ]
      },
      {
        "id": "pr-sandia-12",
        "objeto": "sandia",
        "x": [
          0.0,
          0.9947
        ]
      },
      {
        "id": "pr-sandia-13",
        "objeto": "sandia",
        "x": [
          0.0,
          0.9348
        ]
      },
      {
        "id": "pr-sandia-14",
        "objeto": "sandia",
        "x": [
          0.0,
          1.0
        ]
      },
      {
        "id": "pr-sandia-15",
        "objeto": "sandia",
        "x": [
          0.107,
          1.0
        ]
      },
      {
        "id": "pr-servilleta-16",
        "objeto": "servilleta",
        "x": [
          1.0,
          0.0997
        ]
      },
      {
        "id": "pr-servilleta-17",
        "objeto": "servilleta",
        "x": [
          0.8407,
          0.0
        ]
      },
      {
        "id": "pr-servilleta-18",
        "objeto": "servilleta",
        "x": [
          0.9436,
          0.0
        ]
      },
      {
        "id": "pr-servilleta-19",
        "objeto": "servilleta",
        "x": [
          0.9208,
          0.0056
        ]
      },
      {
        "id": "pr-servilleta-20",
        "objeto": "servilleta",
        "x": [
          0.8972,
          0.0
        ]
      }
    ],
    "victoria": {
      "acierto_minimo": 0.9
    },
    "objeto_estrella": "plato",
    "desastres": [
      {
        "id": "triple",
        "objeto": "plato",
        "accion_erronea": "basura",
        "texto": "¡TRIPLE! Q-Anacleto lanzó la vajilla fina de la abuela al basurero: ¡CRASH!"
      },
      {
        "id": "cucharita-basura",
        "objeto": "cucharita",
        "accion_erronea": "basura",
        "texto": "¡Al basurero las cucharitas de postre! La abuela se quedó sin flan."
      },
      {
        "id": "sandia-vitrina",
        "objeto": "sandia",
        "accion_erronea": "lavar",
        "texto": "Q-Anacleto lavó con esponja y perfume una cáscara de sandía y la guardó en la vitrina."
      },
      {
        "id": "servilleta-vitrina",
        "objeto": "servilleta",
        "accion_erronea": "lavar",
        "texto": "Q-Anacleto planchó y lustró una servilleta mojada como si fuera porcelana."
      }
    ],
    "chispa": {
      "inicio": "¡Lava platos y cucharitas, tira cáscaras y servilletas!",
      "primer_fallo": "La regla es recta… y las esquinas cruzadas no se dejan separar con una línea.",
      "primera_ficha": "¡CLACK! Conecta ambos cables con el Cable Gemelo para curvar el mapa.",
      "victoria": "Una red neuronal clásica también podría; aquí lo hicimos con qubits para ver cómo piensan."
    },
    "cromo": {
      "concepto": "SVM ➔ modelo cuántico como método de kernel",
      "titulo": "Cable Gemelo",
      "lineas": [
        "Tus Giro-Sensores codificaron humedad y peso en dos qubits.",
        "Tu Cable Gemelo cambió lo que mide Q-Anacleto para cruzar ambos sensores.",
        "Así funciona un modelo cuántico de kernel (Schuld, 2021)."
      ]
    }
  },
  "chef": {
    "id": "chef",
    "tipo": "clasificacion",
    "nivel": 1,
    "escenario": "casa",
    "habitacion": "cocina",
    "titulo": "¡Chef Catástrofe: En su Punto!",
    "dificultad": 1,
    "rango": [
      -1,
      1
    ],
    "sensores": [
      "desviación fuego",
      "desviación espesor"
    ],
    "codificacion": {
      "escala": 1.5
    },
    "perilla_escala": {
      "min": 0.5,
      "max": 8.0,
      "paso": 0.25
    },
    "lectura": {
      "qubits": [
        0,
        1
      ],
      "resultado": "00",
      "accion": "listo",
      "otra": "descartar"
    },
    "ranuras": 1,
    "fichas_permitidas": [
      "giro_y",
      "prisma",
      "cable_gemelo"
    ],
    "objetos": {
      "panqueque": {
        "emoji": "🥞",
        "accion": "listo"
      },
      "quemado": {
        "emoji": "炭",
        "accion": "descartar"
      },
      "crudo": {
        "emoji": "🥣",
        "accion": "descartar"
      }
    },
    "ejemplos": [
      {
        "id": "ej-panqueque-1",
        "objeto": "panqueque",
        "x": [
          0.3193,
          -0.0884
        ]
      },
      {
        "id": "ej-panqueque-2",
        "objeto": "panqueque",
        "x": [
          0.0596,
          0.3086
        ]
      },
      {
        "id": "ej-panqueque-3",
        "objeto": "panqueque",
        "x": [
          -0.1623,
          -0.2002
        ]
      },
      {
        "id": "ej-panqueque-4",
        "objeto": "panqueque",
        "x": [
          -0.1495,
          -0.0781
        ]
      },
      {
        "id": "ej-panqueque-5",
        "objeto": "panqueque",
        "x": [
          0.106,
          -0.2924
        ]
      },
      {
        "id": "ej-panqueque-6",
        "objeto": "panqueque",
        "x": [
          0.0686,
          -0.0704
        ]
      },
      {
        "id": "ej-panqueque-7",
        "objeto": "panqueque",
        "x": [
          0.2953,
          0.0488
        ]
      },
      {
        "id": "ej-panqueque-8",
        "objeto": "panqueque",
        "x": [
          0.1654,
          0.1692
        ]
      },
      {
        "id": "ej-crudo-9",
        "objeto": "crudo",
        "x": [
          -0.1723,
          0.9559
        ]
      },
      {
        "id": "ej-quemado-10",
        "objeto": "quemado",
        "x": [
          -0.914,
          0.4873
        ]
      },
      {
        "id": "ej-crudo-11",
        "objeto": "crudo",
        "x": [
          -0.4713,
          -0.8783
        ]
      },
      {
        "id": "ej-quemado-12",
        "objeto": "quemado",
        "x": [
          -0.6409,
          0.5018
        ]
      },
      {
        "id": "ej-crudo-13",
        "objeto": "crudo",
        "x": [
          0.8174,
          0.5508
        ]
      },
      {
        "id": "ej-quemado-14",
        "objeto": "quemado",
        "x": [
          -0.763,
          -0.1607
        ]
      },
      {
        "id": "ej-crudo-15",
        "objeto": "crudo",
        "x": [
          -0.4843,
          -0.9368
        ]
      },
      {
        "id": "ej-quemado-16",
        "objeto": "quemado",
        "x": [
          -0.4176,
          0.8568
        ]
      },
      {
        "id": "ej-crudo-17",
        "objeto": "crudo",
        "x": [
          -0.7721,
          0.7956
        ]
      },
      {
        "id": "ej-quemado-18",
        "objeto": "quemado",
        "x": [
          -0.817,
          -0.9234
        ]
      },
      {
        "id": "ej-crudo-19",
        "objeto": "crudo",
        "x": [
          -0.7758,
          0.5053
        ]
      },
      {
        "id": "ej-quemado-20",
        "objeto": "quemado",
        "x": [
          0.8682,
          -0.8086
        ]
      }
    ],
    "prueba": [
      {
        "id": "pr-panqueque-1",
        "objeto": "panqueque",
        "x": [
          0.1907,
          0.2321
        ]
      },
      {
        "id": "pr-panqueque-2",
        "objeto": "panqueque",
        "x": [
          -0.0497,
          -0.2799
        ]
      },
      {
        "id": "pr-panqueque-3",
        "objeto": "panqueque",
        "x": [
          -0.0015,
          0.0796
        ]
      },
      {
        "id": "pr-panqueque-4",
        "objeto": "panqueque",
        "x": [
          -0.2249,
          -0.0138
        ]
      },
      {
        "id": "pr-panqueque-5",
        "objeto": "panqueque",
        "x": [
          0.138,
          0.0428
        ]
      },
      {
        "id": "pr-panqueque-6",
        "objeto": "panqueque",
        "x": [
          -0.215,
          -0.0954
        ]
      },
      {
        "id": "pr-panqueque-7",
        "objeto": "panqueque",
        "x": [
          -0.0275,
          -0.1779
        ]
      },
      {
        "id": "pr-panqueque-8",
        "objeto": "panqueque",
        "x": [
          -0.0131,
          0.0587
        ]
      },
      {
        "id": "pr-panqueque-9",
        "objeto": "panqueque",
        "x": [
          0.068,
          -0.231
        ]
      },
      {
        "id": "pr-panqueque-10",
        "objeto": "panqueque",
        "x": [
          -0.1594,
          -0.043
        ]
      },
      {
        "id": "pr-crudo-11",
        "objeto": "crudo",
        "x": [
          -0.8008,
          0.8545
        ]
      },
      {
        "id": "pr-quemado-12",
        "objeto": "quemado",
        "x": [
          -0.7919,
          0.758
        ]
      },
      {
        "id": "pr-crudo-13",
        "objeto": "crudo",
        "x": [
          0.393,
          -0.492
        ]
      },
      {
        "id": "pr-quemado-14",
        "objeto": "quemado",
        "x": [
          0.807,
          0.7562
        ]
      },
      {
        "id": "pr-crudo-15",
        "objeto": "crudo",
        "x": [
          0.6512,
          -0.991
        ]
      },
      {
        "id": "pr-quemado-16",
        "objeto": "quemado",
        "x": [
          0.9032,
          0.9259
        ]
      },
      {
        "id": "pr-crudo-17",
        "objeto": "crudo",
        "x": [
          -0.8372,
          0.8858
        ]
      },
      {
        "id": "pr-quemado-18",
        "objeto": "quemado",
        "x": [
          -0.4326,
          0.6251
        ]
      },
      {
        "id": "pr-crudo-19",
        "objeto": "crudo",
        "x": [
          0.7292,
          -0.6436
        ]
      },
      {
        "id": "pr-quemado-20",
        "objeto": "quemado",
        "x": [
          -0.3159,
          0.9137
        ]
      },
      {
        "id": "pr-crudo-21",
        "objeto": "crudo",
        "x": [
          0.5685,
          0.4043
        ]
      },
      {
        "id": "pr-quemado-22",
        "objeto": "quemado",
        "x": [
          -0.5312,
          0.4649
        ]
      },
      {
        "id": "pr-crudo-23",
        "objeto": "crudo",
        "x": [
          -0.9213,
          -0.4719
        ]
      },
      {
        "id": "pr-quemado-24",
        "objeto": "quemado",
        "x": [
          -0.5014,
          -0.8857
        ]
      }
    ],
    "victoria": {
      "acierto_minimo": 0.9
    },
    "objeto_estrella": "panqueque",
    "desastres": [
      {
        "id": "disco-carbonizado",
        "objeto": "quemado",
        "accion_erronea": "listo",
        "texto": "¡DING! Q-Anacleto sirvió un disco carbonizado en llamas y activó el rociador del techo."
      },
      {
        "id": "mezcla-bolsillo",
        "objeto": "crudo",
        "accion_erronea": "listo",
        "texto": "Q-Anacleto vertió mezcla cruda directamente en tu bolsillo con una reverencia."
      },
      {
        "id": "panqueque-basura",
        "objeto": "panqueque",
        "accion_erronea": "descartar",
        "texto": "¡Nooo! Q-Anacleto tiró el panqueque dorado perfecto por la ventana."
      }
    ],
    "chispa": {
      "inicio": "¡Sirve solo los panqueques del centro ideal!",
      "primer_fallo": "La isla de fábrica es gigante y deja pasar panqueques crudos. ¡Ajusta la Perilla de Escala!",
      "primera_ficha": "Gira la perilla de cada Giro-Sensor entre 3 y 4 rad para achicar la isla.",
      "islas_fantasma": "¡Si giras de más aparecen islas fantasma en los bordes porque el giro es periódico!",
      "victoria": "Un kernel clásico también tiene su perilla de ancho; aquí es cuánto gira el qubit."
    },
    "cromo": {
      "concepto": "Ancho del kernel clásico ➔ escala de la codificación cuántica",
      "titulo": "Perilla de Escala",
      "lineas": [
        "Dos Giro-Sensores leyendo 00 dibujan una isla en el centro del radar.",
        "La Perilla de Escala ajusta cuánto gira cada qubit por unidad de sensor: el ancho del kernel.",
        "Como la rotación es periódica, girar de más crea islas fantasma en los bordes."
      ]
    }
  },
  "lavanderia": {
    "id": "lavanderia",
    "tipo": "clasificacion",
    "nivel": 1,
    "escenario": "casa",
    "habitacion": "lavanderia",
    "titulo": "¡Lavandería en Remolino!",
    "dificultad": 2,
    "rango": [
      -1,
      1
    ],
    "sensores": [
      "giro tambor X",
      "giro tambor Y"
    ],
    "codificacion": {
      "escala": 3.14159
    },
    "lectura": {
      "qubits": [
        0
      ],
      "resultado": "0",
      "accion": "camisa",
      "otra": "calcetin"
    },
    "ranuras": 5,
    "fichas_permitidas": [
      "giro_y",
      "prisma",
      "cable_gemelo"
    ],
    "objetos": {
      "camisa": {
        "emoji": "👕",
        "accion": "camisa"
      },
      "calcetin": {
        "emoji": "🧦",
        "accion": "calcetin"
      }
    },
    "ejemplos": [
      {
        "id": "ej-camisa-1",
        "objeto": "camisa",
        "x": [
          -0.3892,
          0.1155
        ]
      },
      {
        "id": "ej-camisa-2",
        "objeto": "camisa",
        "x": [
          0.0262,
          0.2393
        ]
      },
      {
        "id": "ej-camisa-3",
        "objeto": "camisa",
        "x": [
          -0.2831,
          -0.618
        ]
      },
      {
        "id": "ej-camisa-4",
        "objeto": "camisa",
        "x": [
          -0.365,
          -0.5372
        ]
      },
      {
        "id": "ej-camisa-5",
        "objeto": "camisa",
        "x": [
          -0.022,
          -0.7619
        ]
      },
      {
        "id": "ej-camisa-6",
        "objeto": "camisa",
        "x": [
          0.8121,
          -0.45
        ]
      },
      {
        "id": "ej-camisa-7",
        "objeto": "camisa",
        "x": [
          -0.3299,
          0.2347
        ]
      },
      {
        "id": "ej-camisa-8",
        "objeto": "camisa",
        "x": [
          -0.1914,
          -0.7082
        ]
      },
      {
        "id": "ej-camisa-9",
        "objeto": "camisa",
        "x": [
          0.6835,
          -0.5068
        ]
      },
      {
        "id": "ej-camisa-10",
        "objeto": "camisa",
        "x": [
          0.9622,
          -0.265
        ]
      },
      {
        "id": "ej-camisa-11",
        "objeto": "camisa",
        "x": [
          -0.4074,
          0.16
        ]
      },
      {
        "id": "ej-camisa-12",
        "objeto": "camisa",
        "x": [
          -0.2256,
          -0.6372
        ]
      },
      {
        "id": "ej-camisa-13",
        "objeto": "camisa",
        "x": [
          -0.261,
          -0.678
        ]
      },
      {
        "id": "ej-camisa-14",
        "objeto": "camisa",
        "x": [
          0.6566,
          -0.6376
        ]
      },
      {
        "id": "ej-camisa-15",
        "objeto": "camisa",
        "x": [
          0.0948,
          0.1466
        ]
      },
      {
        "id": "ej-camisa-16",
        "objeto": "camisa",
        "x": [
          0.5178,
          -0.6465
        ]
      },
      {
        "id": "ej-camisa-17",
        "objeto": "camisa",
        "x": [
          -0.5084,
          0.0162
        ]
      },
      {
        "id": "ej-camisa-18",
        "objeto": "camisa",
        "x": [
          0.0022,
          -0.6775
        ]
      },
      {
        "id": "ej-camisa-19",
        "objeto": "camisa",
        "x": [
          0.6701,
          -0.6146
        ]
      },
      {
        "id": "ej-camisa-20",
        "objeto": "camisa",
        "x": [
          0.6347,
          -0.6455
        ]
      },
      {
        "id": "ej-calcetin-21",
        "objeto": "calcetin",
        "x": [
          0.4566,
          0.373
        ]
      },
      {
        "id": "ej-calcetin-22",
        "objeto": "calcetin",
        "x": [
          0.0451,
          -0.2849
        ]
      },
      {
        "id": "ej-calcetin-23",
        "objeto": "calcetin",
        "x": [
          -0.2515,
          0.7238
        ]
      },
      {
        "id": "ej-calcetin-24",
        "objeto": "calcetin",
        "x": [
          0.5206,
          0.0325
        ]
      },
      {
        "id": "ej-calcetin-25",
        "objeto": "calcetin",
        "x": [
          -0.1863,
          0.7576
        ]
      },
      {
        "id": "ej-calcetin-26",
        "objeto": "calcetin",
        "x": [
          -0.9627,
          0.0557
        ]
      },
      {
        "id": "ej-calcetin-27",
        "objeto": "calcetin",
        "x": [
          -0.6493,
          0.6231
        ]
      },
      {
        "id": "ej-calcetin-28",
        "objeto": "calcetin",
        "x": [
          -0.9584,
          0.1631
        ]
      },
      {
        "id": "ej-calcetin-29",
        "objeto": "calcetin",
        "x": [
          -0.7745,
          0.4742
        ]
      },
      {
        "id": "ej-calcetin-30",
        "objeto": "calcetin",
        "x": [
          0.352,
          -0.141
        ]
      },
      {
        "id": "ej-calcetin-31",
        "objeto": "calcetin",
        "x": [
          -0.1564,
          0.7432
        ]
      },
      {
        "id": "ej-calcetin-32",
        "objeto": "calcetin",
        "x": [
          -0.9656,
          0.0781
        ]
      },
      {
        "id": "ej-calcetin-33",
        "objeto": "calcetin",
        "x": [
          0.4812,
          0.3164
        ]
      },
      {
        "id": "ej-calcetin-34",
        "objeto": "calcetin",
        "x": [
          -0.0379,
          -0.2125
        ]
      },
      {
        "id": "ej-calcetin-35",
        "objeto": "calcetin",
        "x": [
          0.5052,
          0.03
        ]
      },
      {
        "id": "ej-calcetin-36",
        "objeto": "calcetin",
        "x": [
          0.2566,
          0.6299
        ]
      },
      {
        "id": "ej-calcetin-37",
        "objeto": "calcetin",
        "x": [
          0.5188,
          0.2017
        ]
      },
      {
        "id": "ej-calcetin-38",
        "objeto": "calcetin",
        "x": [
          0.1883,
          0.6286
        ]
      },
      {
        "id": "ej-calcetin-39",
        "objeto": "calcetin",
        "x": [
          -0.308,
          0.8174
        ]
      },
      {
        "id": "ej-calcetin-40",
        "objeto": "calcetin",
        "x": [
          -0.9819,
          0.1006
        ]
      }
    ],
    "prueba": [
      {
        "id": "pr-camisa-1",
        "objeto": "camisa",
        "x": [
          -0.4088,
          0.0744
        ]
      },
      {
        "id": "pr-camisa-2",
        "objeto": "camisa",
        "x": [
          -0.5163,
          -0.2122
        ]
      },
      {
        "id": "pr-camisa-3",
        "objeto": "camisa",
        "x": [
          0.9488,
          -0.3312
        ]
      },
      {
        "id": "pr-camisa-4",
        "objeto": "camisa",
        "x": [
          0.969,
          -0.2863
        ]
      },
      {
        "id": "pr-camisa-5",
        "objeto": "camisa",
        "x": [
          0.0093,
          0.3076
        ]
      },
      {
        "id": "pr-camisa-6",
        "objeto": "camisa",
        "x": [
          0.0778,
          0.182
        ]
      },
      {
        "id": "pr-camisa-7",
        "objeto": "camisa",
        "x": [
          -0.4718,
          -0.1878
        ]
      },
      {
        "id": "pr-camisa-8",
        "objeto": "camisa",
        "x": [
          0.8685,
          -0.4509
        ]
      },
      {
        "id": "pr-camisa-9",
        "objeto": "camisa",
        "x": [
          0.4927,
          -0.681
        ]
      },
      {
        "id": "pr-camisa-10",
        "objeto": "camisa",
        "x": [
          0.8372,
          -0.476
        ]
      },
      {
        "id": "pr-camisa-11",
        "objeto": "camisa",
        "x": [
          0.4532,
          -0.6708
        ]
      },
      {
        "id": "pr-camisa-12",
        "objeto": "camisa",
        "x": [
          -0.1709,
          0.2965
        ]
      },
      {
        "id": "pr-camisa-13",
        "objeto": "camisa",
        "x": [
          0.9445,
          -0.0998
        ]
      },
      {
        "id": "pr-camisa-14",
        "objeto": "camisa",
        "x": [
          -0.5111,
          0.0063
        ]
      },
      {
        "id": "pr-camisa-15",
        "objeto": "camisa",
        "x": [
          0.026,
          0.2016
        ]
      },
      {
        "id": "pr-camisa-16",
        "objeto": "camisa",
        "x": [
          -0.0276,
          0.1796
        ]
      },
      {
        "id": "pr-camisa-17",
        "objeto": "camisa",
        "x": [
          0.0108,
          0.2283
        ]
      },
      {
        "id": "pr-camisa-18",
        "objeto": "camisa",
        "x": [
          -0.3195,
          -0.5528
        ]
      },
      {
        "id": "pr-camisa-19",
        "objeto": "camisa",
        "x": [
          -0.3244,
          -0.5753
        ]
      },
      {
        "id": "pr-camisa-20",
        "objeto": "camisa",
        "x": [
          -0.0694,
          0.3226
        ]
      },
      {
        "id": "pr-camisa-21",
        "objeto": "camisa",
        "x": [
          -0.038,
          -0.7333
        ]
      },
      {
        "id": "pr-camisa-22",
        "objeto": "camisa",
        "x": [
          -0.1827,
          0.3028
        ]
      },
      {
        "id": "pr-camisa-23",
        "objeto": "camisa",
        "x": [
          -0.5579,
          -0.1064
        ]
      },
      {
        "id": "pr-camisa-24",
        "objeto": "camisa",
        "x": [
          -0.4659,
          0.0882
        ]
      },
      {
        "id": "pr-camisa-25",
        "objeto": "camisa",
        "x": [
          0.6745,
          -0.5681
        ]
      },
      {
        "id": "pr-camisa-26",
        "objeto": "camisa",
        "x": [
          -0.316,
          0.2225
        ]
      },
      {
        "id": "pr-camisa-27",
        "objeto": "camisa",
        "x": [
          0.9375,
          -0.1722
        ]
      },
      {
        "id": "pr-camisa-28",
        "objeto": "camisa",
        "x": [
          0.9333,
          -0.2203
        ]
      },
      {
        "id": "pr-camisa-29",
        "objeto": "camisa",
        "x": [
          -0.2114,
          0.2292
        ]
      },
      {
        "id": "pr-camisa-30",
        "objeto": "camisa",
        "x": [
          -0.001,
          0.2447
        ]
      },
      {
        "id": "pr-calcetin-31",
        "objeto": "calcetin",
        "x": [
          0.5308,
          -0.0267
        ]
      },
      {
        "id": "pr-calcetin-32",
        "objeto": "calcetin",
        "x": [
          0.283,
          -0.1923
        ]
      },
      {
        "id": "pr-calcetin-33",
        "objeto": "calcetin",
        "x": [
          0.5497,
          0.1905
        ]
      },
      {
        "id": "pr-calcetin-34",
        "objeto": "calcetin",
        "x": [
          -1.0,
          -0.0113
        ]
      },
      {
        "id": "pr-calcetin-35",
        "objeto": "calcetin",
        "x": [
          0.4801,
          -0.0778
        ]
      },
      {
        "id": "pr-calcetin-36",
        "objeto": "calcetin",
        "x": [
          -0.8714,
          0.3471
        ]
      },
      {
        "id": "pr-calcetin-37",
        "objeto": "calcetin",
        "x": [
          0.3851,
          -0.2145
        ]
      },
      {
        "id": "pr-calcetin-38",
        "objeto": "calcetin",
        "x": [
          -0.08,
          0.742
        ]
      },
      {
        "id": "pr-calcetin-39",
        "objeto": "calcetin",
        "x": [
          0.0245,
          0.7777
        ]
      },
      {
        "id": "pr-calcetin-40",
        "objeto": "calcetin",
        "x": [
          -0.9958,
          0.0823
        ]
      },
      {
        "id": "pr-calcetin-41",
        "objeto": "calcetin",
        "x": [
          0.0584,
          0.7624
        ]
      },
      {
        "id": "pr-calcetin-42",
        "objeto": "calcetin",
        "x": [
          -0.0688,
          0.787
        ]
      },
      {
        "id": "pr-calcetin-43",
        "objeto": "calcetin",
        "x": [
          -0.7107,
          0.625
        ]
      },
      {
        "id": "pr-calcetin-44",
        "objeto": "calcetin",
        "x": [
          -0.6375,
          0.6598
        ]
      },
      {
        "id": "pr-calcetin-45",
        "objeto": "calcetin",
        "x": [
          0.5083,
          0.3088
        ]
      },
      {
        "id": "pr-calcetin-46",
        "objeto": "calcetin",
        "x": [
          -0.8762,
          0.3795
        ]
      },
      {
        "id": "pr-calcetin-47",
        "objeto": "calcetin",
        "x": [
          0.4632,
          -0.1101
        ]
      },
      {
        "id": "pr-calcetin-48",
        "objeto": "calcetin",
        "x": [
          -0.4268,
          0.7028
        ]
      },
      {
        "id": "pr-calcetin-49",
        "objeto": "calcetin",
        "x": [
          0.0461,
          -0.2885
        ]
      },
      {
        "id": "pr-calcetin-50",
        "objeto": "calcetin",
        "x": [
          0.3842,
          -0.1842
        ]
      },
      {
        "id": "pr-calcetin-51",
        "objeto": "calcetin",
        "x": [
          0.0268,
          -0.2437
        ]
      },
      {
        "id": "pr-calcetin-52",
        "objeto": "calcetin",
        "x": [
          0.1721,
          -0.3066
        ]
      },
      {
        "id": "pr-calcetin-53",
        "objeto": "calcetin",
        "x": [
          -0.0309,
          -0.1959
        ]
      },
      {
        "id": "pr-calcetin-54",
        "objeto": "calcetin",
        "x": [
          0.5247,
          0.3141
        ]
      },
      {
        "id": "pr-calcetin-55",
        "objeto": "calcetin",
        "x": [
          0.4777,
          0.0928
        ]
      },
      {
        "id": "pr-calcetin-56",
        "objeto": "calcetin",
        "x": [
          0.2135,
          0.6873
        ]
      },
      {
        "id": "pr-calcetin-57",
        "objeto": "calcetin",
        "x": [
          0.1067,
          -0.2901
        ]
      },
      {
        "id": "pr-calcetin-58",
        "objeto": "calcetin",
        "x": [
          -0.8678,
          0.3511
        ]
      },
      {
        "id": "pr-calcetin-59",
        "objeto": "calcetin",
        "x": [
          0.5328,
          0.2143
        ]
      },
      {
        "id": "pr-calcetin-60",
        "objeto": "calcetin",
        "x": [
          0.3058,
          -0.2397
        ]
      }
    ],
    "victoria": {
      "acierto_minimo": 0.9
    },
    "objeto_estrella": "camisa",
    "desastres": [
      {
        "id": "espuma-rosada",
        "objeto": "calcetin",
        "accion_erronea": "camisa",
        "texto": "¡EXPLOSIÓN DE ESPUMA ROSA! Q-Anacleto desfila con ropa encogida al tamaño de un chihuahua."
      },
      {
        "id": "camisa-fuera",
        "objeto": "camisa",
        "accion_erronea": "calcetin",
        "texto": "Q-Anacleto centrifugó tu camisa favorita con los calcetines rojos."
      }
    ],
    "chispa": {
      "inicio": "¡Separa las camisas blancas del remolino de calcetines rojos!",
      "primer_fallo": "Una sola capa no alcanza para seguir el remolino. ¡Recarga los sensores después del Cable Gemelo!",
      "primera_ficha": "Prueba: Sensores ➔ Cable Gemelo ➔ Sensores otra vez (data re-uploading).",
      "victoria": "¡Eso es data re-uploading! Repetir la codificación tras entrelazar da frecuencias más ricas."
    },
    "cromo": {
      "concepto": "Red profunda ➔ QNN con data re-uploading",
      "titulo": "Recarga en Espiral",
      "lineas": [
        "Cargar cada sensor una sola vez no logra curvar el mapa en espiral.",
        "Volver a aplicar Giro-Sensores tras un Cable Gemelo es data re-uploading (Pérez-Salinas, 2020).",
        "Repetir la codificación amplía las frecuencias que el circuito puede representar (Schuld et al., 2021)."
      ]
    }
  },
  "doble-hueso": {
    "id": "doble-hueso",
    "tipo": "doble-hueso",
    "nivel": 2,
    "escenario": "parque",
    "habitacion": "parque",
    "titulo": "¡El Dilema del Doble Hueso!",
    "dificultad": 2,
    "bateria": 180,
    "tuneles": {
      "a": {
        "nombre": "Túnel A",
        "p": 0.3
      },
      "b": {
        "nombre": "Túnel B",
        "p": 0.36
      }
    },
    "desastres": [
      {
        "id": "rana",
        "texto": "¡CROAC! Q-Boby entró al túnel equivocado y salió con una rana pegada en la nariz."
      },
      {
        "id": "barro",
        "texto": "¡ZZZ! Q-Boby gastó toda su batería olfateando y se quedó dormido roncando en el barro."
      }
    ],
    "chispa": {
      "inicio": "¡Encuentra el túnel con más olor a hueso antes de agotar la batería!",
      "primer_fallo": "Monte Carlo baja el error como 1/√N: con pocos olfateos se confunde fácil. ¡Prueba el chip cuántico!",
      "ruido": "En chips ruidosos actuales el error se satura pasado cierto punto: el ruido le pone un piso a la ventaja (Tanaka et al., 2021).",
      "victoria": "Con el mismo olfato, QAE necesitó ~4 veces menos consultas al oráculo que Monte Carlo."
    },
    "cromo": {
      "concepto": "Monte Carlo ➔ Quantum Amplitude Estimation (QAE)",
      "titulo": "Olfato Amplificado (QAE)",
      "lineas": [
        "Monte Carlo promedia muestras sueltas: su error baja lento, como 1/√N.",
        "QAE amplifica la amplitud con el operador de Grover y estima por máxima verosimilitud: error ~ 1/N.",
        "Es una ventaja cuántica real en consultas al oráculo (Brassard et al., 2002; Suzuki et al., 2020)."
      ]
    }
  },
  "trucos": {
    "id": "trucos",
    "tipo": "trucos",
    "nivel": 2,
    "escenario": "parque",
    "habitacion": "parque",
    "titulo": "¡Siéntate, Gira o Despega!",
    "dificultad": 1,
    "ordenes": [
      {
        "id": "ord-00",
        "texto": "Silbato grave + Mano abajo",
        "emoji": "🔉👇",
        "x": [
          0,
          0
        ],
        "accion": "sentarse"
      },
      {
        "id": "ord-01",
        "texto": "Silbato grave + Mano arriba",
        "emoji": "🔉👆",
        "x": [
          0,
          1
        ],
        "accion": "pata"
      },
      {
        "id": "ord-10",
        "texto": "Silbato agudo + Mano abajo",
        "emoji": "🔊👇",
        "x": [
          1,
          0
        ],
        "accion": "girar"
      },
      {
        "id": "ord-11",
        "texto": "Silbato agudo + Mano arriba",
        "emoji": "🔊👆",
        "x": [
          1,
          1
        ],
        "accion": "despegar"
      }
    ],
    "desastres": [
      {
        "id": "lampara",
        "texto": "¡FIIIUUU! Q-Boby encendió sus propulsores al oír «Siéntate» y quedó colgado de la lámpara."
      },
      {
        "id": "helicoptero",
        "texto": "Q-Boby giró como helicóptero hasta que su cabecita cayó en la alfombra ladrando feliz."
      }
    ],
    "chispa": {
      "inicio": "¡Gira las Perillas Doradas para bajar el Termómetro de Mareo!",
      "primer_fallo": "Con una sola perilla, arreglar «Sentarse» estropea «Girar». ¡Usa las dos o el Silbato Auto-Entrenar!",
      "victoria": "El entrenamiento ajustó θ con la regla de parameter-shift; al actuar, Q-Boby solo hace inferencia."
    },
    "cromo": {
      "concepto": "Descenso de gradiente ➔ regla de parameter-shift en VQC",
      "titulo": "Perillas Doradas y Parameter-Shift",
      "lineas": [
        "El Termómetro de Mareo mide la función de pérdida promedio sobre las órdenes.",
        "Para cada perilla θ, el gradiente exacto sale de evaluar el circuito en θ + π/2 y θ − π/2.",
        "Entrenar es ajustar las perillas; actuar en el parque es solo inferencia."
      ]
    }
  },
  "pista": {
    "id": "pista",
    "tipo": "clasificacion",
    "nivel": 2,
    "escenario": "parque",
    "habitacion": "parque",
    "titulo": "¡Pista de Agilidad Láser-Musical!",
    "dificultad": 1,
    "rango": [
      0,
      1
    ],
    "sensores": [
      "pulso BUM",
      "pulso CLAP"
    ],
    "codificacion": {
      "escala": 3.14159
    },
    "lectura": {
      "qubits": [
        1
      ],
      "resultado": "0",
      "accion": "saltar",
      "otra": "agacharse"
    },
    "ranuras": 4,
    "fichas_permitidas": [
      "prisma",
      "giro_z",
      "cable_gemelo"
    ],
    "objetos": {
      "valla": {
        "emoji": "🚧",
        "accion": "saltar"
      },
      "laser": {
        "emoji": "⚡",
        "accion": "agacharse"
      }
    },
    "ejemplos": [
      {
        "id": "ej-valla-1",
        "objeto": "valla",
        "x": [
          0.1274,
          0.1916
        ]
      },
      {
        "id": "ej-valla-2",
        "objeto": "valla",
        "x": [
          0.3307,
          0.2174
        ]
      },
      {
        "id": "ej-valla-3",
        "objeto": "valla",
        "x": [
          0.2694,
          0.2925
        ]
      },
      {
        "id": "ej-valla-4",
        "objeto": "valla",
        "x": [
          0.7205,
          0.7847
        ]
      },
      {
        "id": "ej-valla-5",
        "objeto": "valla",
        "x": [
          0.7629,
          0.7918
        ]
      },
      {
        "id": "ej-valla-6",
        "objeto": "valla",
        "x": [
          0.7119,
          0.6636
        ]
      },
      {
        "id": "ej-laser-7",
        "objeto": "laser",
        "x": [
          0.1887,
          0.7167
        ]
      },
      {
        "id": "ej-laser-8",
        "objeto": "laser",
        "x": [
          0.2821,
          0.7377
        ]
      },
      {
        "id": "ej-laser-9",
        "objeto": "laser",
        "x": [
          0.2261,
          0.7392
        ]
      },
      {
        "id": "ej-laser-10",
        "objeto": "laser",
        "x": [
          0.816,
          0.2155
        ]
      },
      {
        "id": "ej-laser-11",
        "objeto": "laser",
        "x": [
          0.8407,
          0.1763
        ]
      },
      {
        "id": "ej-laser-12",
        "objeto": "laser",
        "x": [
          0.7145,
          0.3013
        ]
      }
    ],
    "prueba": [
      {
        "id": "pr-valla-1",
        "objeto": "valla",
        "x": [
          0.2811,
          0.1987
        ]
      },
      {
        "id": "pr-valla-2",
        "objeto": "valla",
        "x": [
          0.2435,
          0.2075
        ]
      },
      {
        "id": "pr-valla-3",
        "objeto": "valla",
        "x": [
          0.3011,
          0.2824
        ]
      },
      {
        "id": "pr-valla-4",
        "objeto": "valla",
        "x": [
          0.2072,
          0.2738
        ]
      },
      {
        "id": "pr-valla-5",
        "objeto": "valla",
        "x": [
          0.228,
          0.2457
        ]
      },
      {
        "id": "pr-valla-6",
        "objeto": "valla",
        "x": [
          0.7539,
          0.7162
        ]
      },
      {
        "id": "pr-valla-7",
        "objeto": "valla",
        "x": [
          0.7755,
          0.7776
        ]
      },
      {
        "id": "pr-valla-8",
        "objeto": "valla",
        "x": [
          0.7756,
          0.8163
        ]
      },
      {
        "id": "pr-valla-9",
        "objeto": "valla",
        "x": [
          0.7337,
          0.661
        ]
      },
      {
        "id": "pr-valla-10",
        "objeto": "valla",
        "x": [
          0.7207,
          0.762
        ]
      },
      {
        "id": "pr-laser-11",
        "objeto": "laser",
        "x": [
          0.2513,
          0.7847
        ]
      },
      {
        "id": "pr-laser-12",
        "objeto": "laser",
        "x": [
          0.2984,
          0.7429
        ]
      },
      {
        "id": "pr-laser-13",
        "objeto": "laser",
        "x": [
          0.2434,
          0.6908
        ]
      },
      {
        "id": "pr-laser-14",
        "objeto": "laser",
        "x": [
          0.312,
          0.7342
        ]
      },
      {
        "id": "pr-laser-15",
        "objeto": "laser",
        "x": [
          0.185,
          0.6831
        ]
      },
      {
        "id": "pr-laser-16",
        "objeto": "laser",
        "x": [
          0.7251,
          0.3433
        ]
      },
      {
        "id": "pr-laser-17",
        "objeto": "laser",
        "x": [
          0.7964,
          0.1484
        ]
      },
      {
        "id": "pr-laser-18",
        "objeto": "laser",
        "x": [
          0.7426,
          0.2658
        ]
      },
      {
        "id": "pr-laser-19",
        "objeto": "laser",
        "x": [
          0.7876,
          0.2706
        ]
      },
      {
        "id": "pr-laser-20",
        "objeto": "laser",
        "x": [
          0.7116,
          0.2747
        ]
      }
    ],
    "victoria": {
      "acierto_minimo": 0.9
    },
    "objeto_estrella": "valla",
    "desastres": [
      {
        "id": "resorte-nubes",
        "objeto": "valla",
        "accion_erronea": "agacharse",
        "texto": "¡BOING! Q-Boby se agachó sobre un resorte y salió disparado hasta las nubes."
      },
      {
        "id": "algodon-azucar",
        "objeto": "laser",
        "accion_erronea": "saltar",
        "texto": "Q-Boby saltó de cabeza dentro del carrito de algodón de azúcar y salió con peluca rosa."
      }
    ],
    "chispa": {
      "inicio": "¡Arma el sándwich de interferencia para seguir el ritmo!",
      "primer_fallo": "La fase RZ sola es invisible al medir. ¡Ponla entre dos Prismas H para que interfiera!",
      "primera_ficha": "Receta del sándwich: Prisma H ➔ Giro Z + Cable Gemelo ➔ Prisma H.",
      "victoria": "¡Interferencia cuántica! El segundo Prisma H convierte las fases en probabilidades."
    },
    "cromo": {
      "concepto": "Distribuciones ➔ superposición, fase e interferencia",
      "titulo": "Sándwich de Interferencia",
      "lineas": [
        "El Prisma H es una moneda cuántica: prepara superposición con amplitudes bien definidas.",
        "Los giros RZ cambian la fase relativa, invisible si mides directamente.",
        "El segundo Prisma H hace interferir las fases: refuerza la acción correcta y cancela la errónea."
      ]
    }
  },
  "copa": {
    "id": "copa",
    "tipo": "clasificacion",
    "nivel": 2,
    "escenario": "parque",
    "habitacion": "parque",
    "titulo": "¡La Gran Copa Canina de Villa Qubit!",
    "dificultad": 3,
    "rango": [
      0,
      1
    ],
    "sensores": [
      "viento",
      "giro frisbee"
    ],
    "codificacion": {
      "escala": 6.283185
    },
    "lectura": {
      "qubits": [
        1
      ],
      "resultado": "0",
      "accion": "atrapar",
      "otra": "esquivar"
    },
    "ranuras": 4,
    "limite_fichas": 5,
    "fichas_permitidas": [
      "giro_y",
      "giro_z",
      "prisma",
      "cable_gemelo"
    ],
    "objetos": {
      "frisbee": {
        "emoji": "🥏",
        "accion": "atrapar"
      },
      "reflector": {
        "emoji": "🔦",
        "accion": "esquivar"
      }
    },
    "ejemplos": [
      {
        "id": "ej-reflector-1",
        "objeto": "reflector",
        "x": [
          0.2457,
          0.789
        ]
      },
      {
        "id": "ej-frisbee-2",
        "objeto": "frisbee",
        "x": [
          0.6933,
          0.773
        ]
      },
      {
        "id": "ej-frisbee-3",
        "objeto": "frisbee",
        "x": [
          0.1595,
          0.3093
        ]
      },
      {
        "id": "ej-frisbee-4",
        "objeto": "frisbee",
        "x": [
          0.826,
          0.7056
        ]
      },
      {
        "id": "ej-reflector-5",
        "objeto": "reflector",
        "x": [
          0.5169,
          0.9119
        ]
      },
      {
        "id": "ej-reflector-6",
        "objeto": "reflector",
        "x": [
          0.4886,
          0.1718
        ]
      },
      {
        "id": "ej-reflector-7",
        "objeto": "reflector",
        "x": [
          0.2084,
          0.6331
        ]
      },
      {
        "id": "ej-reflector-8",
        "objeto": "reflector",
        "x": [
          0.0001,
          0.3973
        ]
      },
      {
        "id": "ej-reflector-9",
        "objeto": "reflector",
        "x": [
          0.2935,
          0.7703
        ]
      },
      {
        "id": "ej-reflector-10",
        "objeto": "reflector",
        "x": [
          0.4431,
          0.9205
        ]
      },
      {
        "id": "ej-reflector-11",
        "objeto": "reflector",
        "x": [
          0.8404,
          0.1934
        ]
      },
      {
        "id": "ej-reflector-12",
        "objeto": "reflector",
        "x": [
          0.9216,
          0.5884
        ]
      },
      {
        "id": "ej-frisbee-13",
        "objeto": "frisbee",
        "x": [
          0.1172,
          0.1211
        ]
      },
      {
        "id": "ej-frisbee-14",
        "objeto": "frisbee",
        "x": [
          0.4499,
          0.4756
        ]
      },
      {
        "id": "ej-reflector-15",
        "objeto": "reflector",
        "x": [
          0.9795,
          0.1857
        ]
      },
      {
        "id": "ej-reflector-16",
        "objeto": "reflector",
        "x": [
          0.1486,
          0.6985
        ]
      },
      {
        "id": "ej-reflector-17",
        "objeto": "reflector",
        "x": [
          0.5708,
          0.1385
        ]
      },
      {
        "id": "ej-frisbee-18",
        "objeto": "frisbee",
        "x": [
          0.2996,
          0.228
        ]
      },
      {
        "id": "ej-reflector-19",
        "objeto": "reflector",
        "x": [
          0.5069,
          0.2019
        ]
      },
      {
        "id": "ej-reflector-20",
        "objeto": "reflector",
        "x": [
          0.0764,
          0.4938
        ]
      }
    ],
    "prueba": [
      {
        "id": "pr-frisbee-1",
        "objeto": "frisbee",
        "x": [
          0.5731,
          0.5285
        ]
      },
      {
        "id": "pr-frisbee-2",
        "objeto": "frisbee",
        "x": [
          0.7637,
          0.8117
        ]
      },
      {
        "id": "pr-reflector-3",
        "objeto": "reflector",
        "x": [
          0.5102,
          0.7793
        ]
      },
      {
        "id": "pr-reflector-4",
        "objeto": "reflector",
        "x": [
          0.4086,
          0.6713
        ]
      },
      {
        "id": "pr-reflector-5",
        "objeto": "reflector",
        "x": [
          0.9641,
          0.4688
        ]
      },
      {
        "id": "pr-frisbee-6",
        "objeto": "frisbee",
        "x": [
          0.8111,
          0.8653
        ]
      },
      {
        "id": "pr-reflector-7",
        "objeto": "reflector",
        "x": [
          0.6298,
          0.0469
        ]
      },
      {
        "id": "pr-frisbee-8",
        "objeto": "frisbee",
        "x": [
          0.0549,
          0.1199
        ]
      },
      {
        "id": "pr-reflector-9",
        "objeto": "reflector",
        "x": [
          0.7023,
          0.0441
        ]
      },
      {
        "id": "pr-reflector-10",
        "objeto": "reflector",
        "x": [
          0.7002,
          0.4199
        ]
      },
      {
        "id": "pr-frisbee-11",
        "objeto": "frisbee",
        "x": [
          0.1064,
          0.1254
        ]
      },
      {
        "id": "pr-reflector-12",
        "objeto": "reflector",
        "x": [
          0.7778,
          0.1746
        ]
      },
      {
        "id": "pr-frisbee-13",
        "objeto": "frisbee",
        "x": [
          0.7097,
          0.7019
        ]
      },
      {
        "id": "pr-reflector-14",
        "objeto": "reflector",
        "x": [
          0.5229,
          0.9604
        ]
      },
      {
        "id": "pr-reflector-15",
        "objeto": "reflector",
        "x": [
          0.3733,
          0.0354
        ]
      },
      {
        "id": "pr-reflector-16",
        "objeto": "reflector",
        "x": [
          0.4954,
          0.2025
        ]
      },
      {
        "id": "pr-reflector-17",
        "objeto": "reflector",
        "x": [
          0.1243,
          0.9925
        ]
      },
      {
        "id": "pr-reflector-18",
        "objeto": "reflector",
        "x": [
          0.3584,
          0.6922
        ]
      },
      {
        "id": "pr-frisbee-19",
        "objeto": "frisbee",
        "x": [
          0.7072,
          0.8184
        ]
      },
      {
        "id": "pr-frisbee-20",
        "objeto": "frisbee",
        "x": [
          0.3191,
          0.4363
        ]
      },
      {
        "id": "pr-reflector-21",
        "objeto": "reflector",
        "x": [
          0.3749,
          0.8743
        ]
      },
      {
        "id": "pr-frisbee-22",
        "objeto": "frisbee",
        "x": [
          0.316,
          0.3406
        ]
      },
      {
        "id": "pr-frisbee-23",
        "objeto": "frisbee",
        "x": [
          0.7507,
          0.6122
        ]
      },
      {
        "id": "pr-reflector-24",
        "objeto": "reflector",
        "x": [
          0.5302,
          0.1412
        ]
      },
      {
        "id": "pr-reflector-25",
        "objeto": "reflector",
        "x": [
          0.383,
          0.8993
        ]
      },
      {
        "id": "pr-reflector-26",
        "objeto": "reflector",
        "x": [
          0.0968,
          0.8121
        ]
      },
      {
        "id": "pr-reflector-27",
        "objeto": "reflector",
        "x": [
          0.6768,
          0.1141
        ]
      },
      {
        "id": "pr-reflector-28",
        "objeto": "reflector",
        "x": [
          0.8033,
          0.5012
        ]
      },
      {
        "id": "pr-frisbee-29",
        "objeto": "frisbee",
        "x": [
          0.2333,
          0.1817
        ]
      },
      {
        "id": "pr-frisbee-30",
        "objeto": "frisbee",
        "x": [
          0.4163,
          0.515
        ]
      }
    ],
    "victoria": {
      "acierto_minimo": 0.9
    },
    "objeto_estrella": "frisbee",
    "desastres": [
      {
        "id": "peluquin-juez",
        "objeto": "frisbee",
        "accion_erronea": "esquivar",
        "texto": "¡TORMENTA NISQ! Q-Boby saltó al palco, robó el peluquín del juez y lo enterró en la cancha."
      },
      {
        "id": "reflector-choque",
        "objeto": "reflector",
        "accion_erronea": "atrapar",
        "texto": "Q-Boby intentó atrapar el haz del reflector y quedó deslumbrado persiguiendo su propia cola."
      }
    ],
    "chispa": {
      "inicio": "¡Atrapa el frisbee en el pasillo diagonal usando máximo 5 fichas!",
      "primer_fallo": "En un chip cuántico real cada compuerta suma ruido: ¡no pases del límite de 5 fichas!",
      "primera_ficha": "Pista de campeón: H en q1 ➔ CX(1→0) ➔ RY en q0 y q1 ➔ CX(0→1).",
      "victoria": "¡Campeón NISQ! Resolviste la Gran Copa con el circuito mínimo de 5 fichas."
    },
    "cromo": {
      "concepto": "Red neuronal ➔ VQC con presupuesto NISQ",
      "titulo": "Trofeo NISQ Compacto",
      "lineas": [
        "En la era NISQ, cada compuerta adicional acumula ruido real en el hardware.",
        "Aquí el límite de 5 fichas representa ese presupuesto y la estática es decorativa.",
        "Diseñar circuitos cortos y expresivos es clave para ejecutar modelos QML hoy."
      ]
    }
  }
};
