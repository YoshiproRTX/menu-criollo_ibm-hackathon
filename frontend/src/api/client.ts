import { getMinigameConfig } from '../content/catalog';
import {
  ApiError,
  type Circuito,
  type Conjunto,
  type DecisionMapResponse,
  type EstimatesRequest,
  type EstimatesResponse,
  type Ficha,
  type HealthResponse,
  type MinigameConfig,
  type PredictionsResponse,
  type Rareza,
  type RarityDrawsResponse,
  type TrainRequest,
  type TrainResponse,
  type XrayResponse,
} from './types';

const contractModules = import.meta.glob('@content/contract/*.json', {
  eager: true,
}) as Record<string, { default?: unknown } | unknown>;

function loadDiskContract<T>(filename: string): T | undefined {
  for (const [filePath, mod] of Object.entries(contractModules)) {
    if (filePath.endsWith(`/${filename}`) || filePath.endsWith(`\\${filename}`)) {
      return (
        mod && typeof mod === 'object' && 'default' in mod && mod.default
          ? mod.default
          : mod
      ) as T;
    }
  }
  return undefined;
}

export const INLINE_CONTRACT_MOCKS = {
  predictions: {
    conjunto: 'prueba' as Conjunto,
    predicciones: [
      { id: 'plato-1', p_accion: 0.97, prediccion: 'lavar', correcto: true },
    ],
    acierto: 1.0,
    meta: { qiskit: '2.5.2', simulador: 'mock', ms: 12 },
  } satisfies PredictionsResponse,
  decisionMap: {
    resolucion: 32,
    valores: Array.from({ length: 1024 }, (_, idx) => {
      const f = Math.floor(idx / 32) / 31;
      const c = (idx % 32) / 31;
      return Number((0.5 + 0.45 * Math.cos(Math.PI * c) * Math.cos(Math.PI * f)).toFixed(4));
    }),
    meta: { qiskit: '2.5.2', simulador: 'mock', ms: 18 },
  } satisfies DecisionMapResponse,
  xray: {
    diagrama:
      '     ┌──────────┐     \nq_0: ┤ Ry(π·x0) ├──■──\n     ├──────────┤┌─┴─┐\nq_1: ┤ Ry(π·x1) ├┤ X ├\n     └──────────┘└───┘',
    codigo:
      'from qiskit import QuantumCircuit\nqc = QuantumCircuit(2)\nqc.ry(3.14159 * x[0], 0)\nqc.ry(3.14159 * x[1], 1)\nqc.cx(0, 1)\n',
  } satisfies XrayResponse,
  rarityDraws: {
    resultado: '10',
    rareza: 'holografica' as Rareza,
    probabilidades: {
      comun: 0.41,
      rara: 0.33,
      holografica: 0.19,
      legendaria: 0.07,
    },
    shots: 1,
  } satisfies RarityDrawsResponse,
  estimatesMonteCarlo: {
    metodo: 'monte_carlo' as const,
    tunel: 'a',
    trayectoria: [
      { consultas: 10, estimacion: 0.4, error: 0.1 },
      { consultas: 30, estimacion: 0.33, error: 0.03 },
      { consultas: 60, estimacion: 0.27, error: 0.03 },
      { consultas: 90, estimacion: 0.34, error: 0.04 },
    ],
    estimacion: 0.34,
    consultas_usadas: 90,
    meta: { qiskit: '2.5.2', simulador: 'mock', ms: 15 },
  } satisfies EstimatesResponse,
  estimatesQae: {
    metodo: 'qae' as const,
    tunel: 'a',
    trayectoria: [
      { consultas: 5, estimacion: 0.25, error: 0.05 },
      { consultas: 20, estimacion: 0.32, error: 0.02 },
      { consultas: 45, estimacion: 0.29, error: 0.01 },
      { consultas: 90, estimacion: 0.302, error: 0.002 },
    ],
    estimacion: 0.302,
    consultas_usadas: 90,
    meta: { qiskit: '2.5.2', simulador: 'mock', ms: 16 },
  } satisfies EstimatesResponse,
  train: {
    historial: Array.from({ length: 16 }, (_, iteracion) => {
      const t = iteracion / 15;
      return {
        iteracion,
        theta: [
          Number((0.3 + (1.5708 - 0.3) * t).toFixed(4)),
          Number((-0.4 + (1.5708 + 0.4) * t).toFixed(4)),
        ],
        perdida: Number((0.52 * Math.pow(1 - t, 2) + 0.004).toFixed(4)),
      };
    }),
    meta: { qiskit: '2.5.2', simulador: 'mock', ms: 110 },
  } satisfies TrainResponse,
  error422: {
    detail: 'Ficha no permitida o ranura ocupada en el circuito.',
  },
};

let mockOverride: boolean | null = null;

export function setMockMode(enabled: boolean | null): void {
  mockOverride = enabled;
}

export function isMockMode(): boolean {
  if (mockOverride !== null) {
    return mockOverride;
  }
  const envMock = (import.meta as unknown as { env?: Record<string, string> }).env
    ?.VITE_MOCK;
  return envMock === '1' || envMock === 'true';
}

export function validateCircuitOrThrow(
  id: string,
  circuito: Circuito,
  config?: MinigameConfig
): void {
  if (id === 'error-422') {
    const diskErr = loadDiskContract<{ detail: string }>('error-422.json');
    throw new ApiError(422, diskErr?.detail ?? INLINE_CONTRACT_MOCKS.error422.detail);
  }
  if (id === 'no-existe') {
    throw new ApiError(404, 'El minijuego solicitado no existe.');
  }

  const cfg = config ?? getMinigameConfig(id);
  if (!cfg) {
    throw new ApiError(404, `El minijuego "${id}" no existe.`);
  }

  const fichas = circuito?.fichas ?? [];
  if (cfg.limite_fichas !== undefined && fichas.length > cfg.limite_fichas) {
    throw new ApiError(
      422,
      `El circuito supera el límite de ${cfg.limite_fichas} fichas (Tormenta NISQ).`
    );
  }

  const ocupadas = new Set<string>();
  const ranurasMax = cfg.ranuras ?? 8;

  for (const f of fichas) {
    if (f.cable !== 0 && f.cable !== 1) {
      throw new ApiError(422, `El cable ${f.cable} está fuera de rango (solo 0 o 1).`);
    }
    if (!Number.isInteger(f.pos) || f.pos < 0 || f.pos >= ranurasMax) {
      throw new ApiError(
        422,
        `La posición ${f.pos} está fuera del rango de ranuras [0, ${ranurasMax - 1}].`
      );
    }
    if (
      cfg.fichas_permitidas &&
      !cfg.fichas_permitidas.includes(f.ficha) &&
      f.ficha !== 'perilla_dorada'
    ) {
      throw new ApiError(
        422,
        `La ficha "${f.ficha}" no está permitida en este minijuego.`
      );
    }
    if (f.escala !== undefined) {
      if (!cfg.perilla_escala) {
        throw new ApiError(
          422,
          'Este minijuego no dispone de Perilla de Escala.'
        );
      }
      if (
        f.escala < cfg.perilla_escala.min - 1e-6 ||
        f.escala > cfg.perilla_escala.max + 1e-6
      ) {
        throw new ApiError(
          422,
          `La escala ${f.escala} está fuera del rango [${cfg.perilla_escala.min}, ${cfg.perilla_escala.max}].`
        );
      }
    }

    if (f.ficha === 'cable_gemelo') {
      const k0 = `${f.pos}:0`;
      const k1 = `${f.pos}:1`;
      if (ocupadas.has(k0) || ocupadas.has(k1)) {
        throw new ApiError(
          422,
          `La columna ${f.pos} ya está ocupada; el Cable Gemelo necesita ambos cables libres.`
        );
      }
      ocupadas.add(k0);
      ocupadas.add(k1);
    } else {
      const key = `${f.pos}:${f.cable}`;
      if (ocupadas.has(key)) {
        throw new ApiError(
          422,
          `La ranura del cable ${f.cable} en posición ${f.pos} ya está ocupada.`
        );
      }
      ocupadas.add(key);
    }
  }
}

// Simulador exacto de 2 qubits en TS solo para el modo VITE_MOCK=1
type Complex = [number, number]; // [re, im]

function cAdd(a: Complex, b: Complex): Complex {
  return [a[0] + b[0], a[1] + b[1]];
}
function cMul(a: Complex, b: Complex): Complex {
  return [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
}
function cAbs2(a: Complex): number {
  return a[0] * a[0] + a[1] * a[1];
}

export function simulateStatevectorProbs(
  fichas: Ficha[],
  x: [number, number],
  escalaDefault: number
): [number, number, number, number] {
  // Estado de 2 qubits en orden Qiskit: índice = 2 * q1 + q0 (00, 01, 10, 11)
  let psi: [Complex, Complex, Complex, Complex] = [
    [1, 0],
    [0, 0],
    [0, 0],
    [0, 0],
  ];

  const ordenadas = [...fichas].sort((a, b) =>
    a.pos !== b.pos ? a.pos - b.pos : a.cable - b.cable
  );

  const apply1Q = (
    u00: Complex,
    u01: Complex,
    u10: Complex,
    u11: Complex,
    qubit: number
  ) => {
    const next: [Complex, Complex, Complex, Complex] = [
      [0, 0],
      [0, 0],
      [0, 0],
      [0, 0],
    ];
    if (qubit === 0) {
      for (const q1 of [0, 1]) {
        const i0 = 2 * q1 + 0;
        const i1 = 2 * q1 + 1;
        next[i0] = cAdd(cMul(u00, psi[i0]), cMul(u01, psi[i1]));
        next[i1] = cAdd(cMul(u10, psi[i0]), cMul(u11, psi[i1]));
      }
    } else {
      for (const q0 of [0, 1]) {
        const i0 = 0 + q0;
        const i1 = 2 + q0;
        next[i0] = cAdd(cMul(u00, psi[i0]), cMul(u01, psi[i1]));
        next[i1] = cAdd(cMul(u10, psi[i0]), cMul(u11, psi[i1]));
      }
    }
    psi = next;
  };

  for (const f of ordenadas) {
    const q = f.cable === 1 ? 1 : 0;
    const esc = f.escala ?? escalaDefault;
    if (f.ficha === 'giro_y' || f.ficha === 'perilla_dorada') {
      const theta =
        f.ficha === 'perilla_dorada'
          ? (f.theta ?? 0) + esc * x[q]
          : esc * x[q];
      const c = Math.cos(theta / 2);
      const s = Math.sin(theta / 2);
      apply1Q([c, 0], [-s, 0], [s, 0], [c, 0], q);
    } else if (f.ficha === 'giro_z') {
      const theta = esc * x[q];
      const c = Math.cos(theta / 2);
      const s = Math.sin(theta / 2);
      apply1Q([c, -s], [0, 0], [0, 0], [c, s], q);
    } else if (f.ficha === 'prisma') {
      const inv = 1 / Math.SQRT2;
      apply1Q([inv, 0], [inv, 0], [inv, 0], [-inv, 0], q);
    } else if (f.ficha === 'cable_gemelo') {
      if (q === 0) {
        // CX(0 -> 1): intercambia |01> (idx 1) y |11> (idx 3)
        psi = [psi[0], psi[3], psi[2], psi[1]];
      } else {
        // CX(1 -> 0): intercambia |10> (idx 2) y |11> (idx 3)
        psi = [psi[0], psi[1], psi[3], psi[2]];
      }
    }
  }

  return [cAbs2(psi[0]), cAbs2(psi[1]), cAbs2(psi[2]), cAbs2(psi[3])];
}

function computePAccion(
  probs: [number, number, number, number],
  cfg: MinigameConfig
): number {
  const lectura = cfg.lectura ?? {
    qubits: [1],
    resultado: '0',
    accion: 'lavar',
    otra: 'basura',
  };
  let sum = 0;
  for (let idx = 0; idx < 4; idx++) {
    const bit0 = idx & 1;
    const bit1 = (idx >> 1) & 1;
    const bits = [bit0, bit1];
    let matches = true;
    for (let k = 0; k < lectura.qubits.length; k++) {
      const q = lectura.qubits[k];
      const expected = Number(lectura.resultado[k] ?? '0');
      if (bits[q] !== expected) {
        matches = false;
        break;
      }
    }
    if (matches) {
      sum += probs[idx];
    }
  }
  return Math.min(1, Math.max(0, sum));
}

async function requestJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });

  if (!response.ok) {
    let detail = `Error HTTP ${response.status}`;
    try {
      const body = (await response.json()) as { detail?: unknown };
      if (typeof body?.detail === 'string') {
        detail = body.detail;
      } else if (body?.detail) {
        detail = JSON.stringify(body.detail);
      }
    } catch {
      // Sin cuerpo JSON
    }
    throw new ApiError(response.status, detail);
  }

  return (await response.json()) as T;
}

export async function getHealth(): Promise<HealthResponse> {
  if (isMockMode()) {
    return { ok: true, qiskit: 'mock' };
  }
  try {
    return await requestJson<HealthResponse>('/api/health');
  } catch {
    return { ok: true, qiskit: 'mock' };
  }
}

export async function getPredictions(
  id: string,
  circuito: Circuito,
  conjunto: Conjunto = 'prueba'
): Promise<PredictionsResponse> {
  if (isMockMode()) {
    validateCircuitOrThrow(id, circuito);
    const cfg = getMinigameConfig(id);
    if (!cfg) {
      const disk = loadDiskContract<PredictionsResponse>('predictions.json');
      return disk ?? INLINE_CONTRACT_MOCKS.predictions;
    }

    if (cfg.tipo === 'trucos' && cfg.ordenes) {
      const th0 =
        circuito.fichas.find((f) => f.cable === 0)?.theta ?? 0.3;
      const th1 =
        circuito.fichas.find((f) => f.cable === 1)?.theta ?? -0.4;
      const dist =
        Math.hypot(th0 - Math.PI / 2, th1 - Math.PI / 2) / Math.PI;
      const pCorrect = Math.max(0.2, Math.min(0.99, 1 - dist * 0.8));
      const predicciones = cfg.ordenes.map((ord) => {
        const correcto = pCorrect >= 0.65;
        return {
          id: ord.id,
          p_accion: Number(pCorrect.toFixed(4)),
          prediccion: correcto ? ord.accion : 'despegar',
          correcto,
        };
      });
      const acierto =
        predicciones.filter((p) => p.correcto).length / predicciones.length;
      const perdida = Number(Math.pow(1 - pCorrect, 2).toFixed(4));
      return {
        conjunto,
        predicciones,
        acierto,
        perdida,
        meta: { qiskit: '2.5.2', simulador: 'mock', ms: 6 },
      };
    }

    const puntos =
      conjunto === 'ejemplos' ? (cfg.ejemplos ?? []) : (cfg.prueba ?? []);
    if (puntos.length === 0) {
      const disk = loadDiskContract<PredictionsResponse>('predictions.json');
      return disk ?? INLINE_CONTRACT_MOCKS.predictions;
    }

    const escalaDefault = cfg.codificacion?.escala ?? Math.PI;
    const accionPos = cfg.lectura?.accion ?? 'lavar';
    const accionNeg = cfg.lectura?.otra ?? 'basura';

    const predicciones = puntos.map((pt) => {
      const probs = simulateStatevectorProbs(
        circuito.fichas,
        pt.x,
        escalaDefault
      );
      const p_accion = Number(computePAccion(probs, cfg).toFixed(4));
      const prediccion = p_accion >= 0.5 ? accionPos : accionNeg;
      const esperada = cfg.objetos?.[pt.objeto]?.accion ?? accionPos;
      return {
        id: pt.id,
        p_accion,
        prediccion,
        correcto: prediccion === esperada,
      };
    });

    const acierto =
      predicciones.length > 0
        ? predicciones.filter((p) => p.correcto).length / predicciones.length
        : 0;

    return {
      conjunto,
      predicciones,
      acierto,
      meta: { qiskit: '2.5.2', simulador: 'mock', ms: 8 },
    };
  }

  return requestJson<PredictionsResponse>(`/api/minigames/${id}/predictions`, {
    method: 'POST',
    body: JSON.stringify({ circuito, conjunto }),
  });
}

export async function getDecisionMap(
  id: string,
  circuito: Circuito,
  resolucion = 32
): Promise<DecisionMapResponse> {
  if (isMockMode()) {
    validateCircuitOrThrow(id, circuito);
    const cfg = getMinigameConfig(id);
    if (!cfg) {
      const disk = loadDiskContract<DecisionMapResponse>('decision-map.json');
      return disk ?? INLINE_CONTRACT_MOCKS.decisionMap;
    }

    const [minR, maxR] = cfg.rango ?? [0, 1];
    const escalaDefault = cfg.codificacion?.escala ?? Math.PI;
    const valores: number[] = new Array(resolucion * resolucion);

    for (let fila = 0; fila < resolucion; fila++) {
      const x1 = minR + (fila / Math.max(1, resolucion - 1)) * (maxR - minR);
      for (let col = 0; col < resolucion; col++) {
        const x0 = minR + (col / Math.max(1, resolucion - 1)) * (maxR - minR);
        const probs = simulateStatevectorProbs(
          circuito.fichas,
          [x0, x1],
          escalaDefault
        );
        valores[fila * resolucion + col] = Number(
          computePAccion(probs, cfg).toFixed(4)
        );
      }
    }

    return {
      resolucion,
      valores,
      meta: { qiskit: '2.5.2', simulador: 'mock', ms: 14 },
    };
  }

  return requestJson<DecisionMapResponse>(`/api/minigames/${id}/decision-map`, {
    method: 'POST',
    body: JSON.stringify({ circuito, resolucion }),
  });
}

export async function getXray(
  id: string,
  circuito: Circuito
): Promise<XrayResponse> {
  if (isMockMode()) {
    validateCircuitOrThrow(id, circuito);
    const cfg = getMinigameConfig(id);
    const esc = cfg?.codificacion?.escala ?? 3.14159;
    const ordenadas = [...(circuito?.fichas ?? [])].sort((a, b) =>
      a.pos !== b.pos ? a.pos - b.pos : a.cable - b.cable
    );

    if (ordenadas.length === 0) {
      const disk = loadDiskContract<XrayResponse>('xray.json');
      if (disk) return disk;
    }

    const lineasCodigo = [
      'from qiskit import QuantumCircuit',
      'qc = QuantumCircuit(2)',
    ];
    let cable0 = 'q_0: ';
    let cable1 = 'q_1: ';

    for (const f of ordenadas) {
      const e = f.escala ?? esc;
      if (f.ficha === 'giro_y') {
        lineasCodigo.push(`qc.ry(${e.toFixed(2)} * x[${f.cable}], ${f.cable})`);
        if (f.cable === 0) {
          cable0 += `─[RY(${e.toFixed(1)}·x0)]─`;
          cable1 += '──────────────';
        } else {
          cable0 += '──────────────';
          cable1 += `─[RY(${e.toFixed(1)}·x1)]─`;
        }
      } else if (f.ficha === 'giro_z') {
        lineasCodigo.push(`qc.rz(${e.toFixed(2)} * x[${f.cable}], ${f.cable})`);
        if (f.cable === 0) {
          cable0 += `─[RZ(${e.toFixed(1)}·x0)]─`;
          cable1 += '──────────────';
        } else {
          cable0 += '──────────────';
          cable1 += `─[RZ(${e.toFixed(1)}·x1)]─`;
        }
      } else if (f.ficha === 'prisma') {
        lineasCodigo.push(`qc.h(${f.cable})`);
        if (f.cable === 0) {
          cable0 += '─[ H ]─';
          cable1 += '───────';
        } else {
          cable0 += '───────';
          cable1 += '─[ H ]─';
        }
      } else if (f.ficha === 'cable_gemelo') {
        const target = 1 - f.cable;
        lineasCodigo.push(`qc.cx(${f.cable}, ${target})`);
        cable0 += f.cable === 0 ? '──■──' : '─[X]─';
        cable1 += f.cable === 1 ? '──■──' : '─[X]─';
      }
    }

    return {
      diagrama: `${cable0}\n${cable1}`,
      codigo: lineasCodigo.join('\n'),
    };
  }

  return requestJson<XrayResponse>(`/api/minigames/${id}/xray`, {
    method: 'POST',
    body: JSON.stringify({ circuito }),
  });
}

export async function drawRarity(
  id: string,
  circuito: Circuito = { fichas: [] },
  semilla?: number
): Promise<RarityDrawsResponse> {
  if (isMockMode()) {
    validateCircuitOrThrow(id, circuito);
    const cfg = getMinigameConfig(id);
    if (!cfg || !cfg.ejemplos || cfg.ejemplos.length === 0) {
      const disk = loadDiskContract<RarityDrawsResponse>('rarity-draws.json');
      return disk ?? INLINE_CONTRACT_MOCKS.rarityDraws;
    }

    const estrella =
      cfg.ejemplos.find((e) => e.objeto === cfg.objeto_estrella) ??
      cfg.ejemplos[0];
    const probs = simulateStatevectorProbs(
      circuito.fichas,
      estrella.x,
      cfg.codificacion?.escala ?? Math.PI
    );
    const probabilidades = {
      comun: Number(probs[0].toFixed(4)),
      rara: Number(probs[1].toFixed(4)),
      holografica: Number(probs[2].toFixed(4)),
      legendaria: Number(probs[3].toFixed(4)),
    };

    // Sorteo determinista con semilla o pseudoaleatorio según distribución Born
    const r =
      semilla !== undefined
        ? Math.abs(Math.sin(semilla * 9999.1)) % 1
        : Math.random();
    const orden: Array<[string, Rareza, number]> = [
      ['00', 'comun', probs[0]],
      ['01', 'rara', probs[1]],
      ['10', 'holografica', probs[2]],
      ['11', 'legendaria', probs[3]],
    ];
    let acum = 0;
    let elegido: [string, Rareza] = ['10', 'holografica'];
    for (const [bits, rar, p] of orden) {
      acum += p;
      if (r <= acum) {
        elegido = [bits, rar];
        break;
      }
    }

    return {
      resultado: elegido[0],
      rareza: elegido[1],
      probabilidades,
      shots: 1,
    };
  }

  return requestJson<RarityDrawsResponse>(`/api/minigames/${id}/rarity-draws`, {
    method: 'POST',
    body: JSON.stringify(
      semilla !== undefined ? { circuito, semilla } : { circuito }
    ),
  });
}

export async function postEstimates(
  bodyOrId: EstimatesRequest | string,
  maybeBody?: EstimatesRequest
): Promise<EstimatesResponse> {
  const id = typeof bodyOrId === 'string' ? bodyOrId : 'doble-hueso';
  const body = (typeof bodyOrId === 'string' ? maybeBody : bodyOrId) as EstimatesRequest;

  if (isMockMode()) {
    if (body.metodo !== 'monte_carlo' && body.metodo !== 'qae') {
      throw new ApiError(422, 'Método de estimación no válido.');
    }
    const pReal = body.tunel === 'b' ? 0.36 : 0.3;
    if (body.metodo === 'qae') {
      const disk = loadDiskContract<EstimatesResponse>('estimates.qae.json');
      if (disk && body.tunel === 'a') return disk;
      const finalEst = body.tunel === 'b' ? 0.358 : 0.302;
      return {
        metodo: 'qae',
        tunel: body.tunel,
        trayectoria: [
          { consultas: 5, estimacion: Number((pReal - 0.05).toFixed(3)), error: 0.05 },
          { consultas: 20, estimacion: Number((pReal + 0.02).toFixed(3)), error: 0.02 },
          { consultas: 45, estimacion: Number((pReal - 0.008).toFixed(3)), error: 0.008 },
          { consultas: 90, estimacion: finalEst, error: Number(Math.abs(finalEst - pReal).toFixed(4)) },
        ],
        estimacion: finalEst,
        consultas_usadas: 90,
        meta: { qiskit: '2.5.2', simulador: 'mock', ms: 16 },
      };
    } else {
      const disk = loadDiskContract<EstimatesResponse>('estimates.monte_carlo.json');
      if (disk && body.tunel === 'a') return disk;
      // En Monte Carlo con pocos olfateos a menudo se invierte la estimación entre A y B
      const finalEst = body.tunel === 'b' ? 0.31 : 0.34;
      return {
        metodo: 'monte_carlo',
        tunel: body.tunel,
        trayectoria: [
          { consultas: 10, estimacion: 0.4, error: Number(Math.abs(0.4 - pReal).toFixed(3)) },
          { consultas: 30, estimacion: 0.35, error: Number(Math.abs(0.35 - pReal).toFixed(3)) },
          { consultas: 60, estimacion: 0.33, error: Number(Math.abs(0.33 - pReal).toFixed(3)) },
          { consultas: 90, estimacion: finalEst, error: Number(Math.abs(finalEst - pReal).toFixed(3)) },
        ],
        estimacion: finalEst,
        consultas_usadas: 90,
        meta: { qiskit: '2.5.2', simulador: 'mock', ms: 15 },
      };
    }
  }

  return requestJson<EstimatesResponse>(`/api/minigames/${id}/estimates`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

export async function postTrain(
  bodyOrId: TrainRequest | string,
  maybeBody?: TrainRequest
): Promise<TrainResponse> {
  const id = typeof bodyOrId === 'string' ? bodyOrId : 'trucos';
  const body = (typeof bodyOrId === 'string' ? maybeBody : bodyOrId) as TrainRequest;

  if (isMockMode()) {
    for (const th of body.theta_inicial ?? []) {
      if (th < -Math.PI - 0.01 || th > Math.PI + 0.01) {
        throw new ApiError(422, 'Parámetro theta fuera del rango [-π, π].');
      }
    }
    const disk = loadDiskContract<TrainResponse>('train.json');
    if (disk) return disk;
    return INLINE_CONTRACT_MOCKS.train;
  }

  return requestJson<TrainResponse>(`/api/minigames/${id}/train`, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}
