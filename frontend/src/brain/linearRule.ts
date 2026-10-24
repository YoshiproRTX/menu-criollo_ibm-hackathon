import type {
  Conjunto,
  MinigameConfig,
  PrediccionObjeto,
  PredictionsResponse,
  PuntoDataset,
} from '../api/types';

export interface ReglaLineal {
  angulo: number;
  desplazamiento: number;
}

export function createDefaultRuler(config?: MinigameConfig): ReglaLineal {
  const [minR, maxR] = config?.rango ?? [0, 1];
  const span = maxR - minR;
  // 90% del rango y ángulo π/2 para que el primer intento con chip simple falle de forma natural
  return {
    angulo: Math.PI / 2,
    desplazamiento: minR + 0.9 * span,
  };
}

/**
 * Clasificador lineal puro del Chip Simple (perceptrón / hiperplano 2D).
 * Normal n = (cos a, sin a); acción positiva si n · x - d >= 0.
 */
export function classifyLinear(
  regla: ReglaLineal,
  puntos: PuntoDataset[],
  config: MinigameConfig,
  conjunto: Conjunto = 'prueba'
): PredictionsResponse {
  const nx = Math.cos(regla.angulo);
  const ny = Math.sin(regla.angulo);
  const accionPos = config.lectura?.accion ?? 'lavar';
  const accionNeg = config.lectura?.otra ?? 'basura';

  const predicciones: PrediccionObjeto[] = puntos.map((pt) => {
    const score = nx * pt.x[0] + ny * pt.x[1] - regla.desplazamiento;
    const esPositivo = score >= 0;
    const prediccion = esPositivo ? accionPos : accionNeg;
    const esperada = config.objetos?.[pt.objeto]?.accion ?? accionPos;
    // Probabilidad sigmoide suave para visualización coherente con PrediccionObjeto
    const p_accion = Number((1 / (1 + Math.exp(-8 * score))).toFixed(4));
    return {
      id: pt.id,
      p_accion: esPositivo ? Math.max(0.51, p_accion) : Math.min(0.49, p_accion),
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
    meta: {
      qiskit: 'lineal-ts',
      simulador: 'ReglaLineal',
      ms: 1,
    },
  };
}
