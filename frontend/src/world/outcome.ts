import type { MinigameConfig, PredictionsResponse } from '../api/types';

export interface OutcomeStep {
  id: string;
  objeto: string;
  emoji: string;
  prediccion: string;
  correcto: boolean;
  desastreTexto?: string;
}

/**
 * Construye la secuencia de pasos que anima el robot sobre la cinta de prueba.
 * La acción animada coincide siempre con `prediccion` del store (regla lineal o API Qiskit).
 */
export function buildOutcomeSteps(
  config: MinigameConfig,
  resultado: PredictionsResponse | null
): OutcomeStep[] {
  const prueba = config.prueba ?? [];
  const predMap = new Map(
    (resultado?.predicciones ?? []).map((p) => [p.id, p])
  );

  return prueba.map((pt) => {
    const objCfg = config.objetos?.[pt.objeto];
    const pred = predMap.get(pt.id);
    const prediccion = pred?.prediccion ?? objCfg?.accion ?? 'esperando';
    const correcto = pred ? pred.correcto : true;
    const desastre = !correcto
      ? config.desastres?.find(
          (d) => d.objeto === pt.objeto && d.accion_erronea === prediccion
        ) ?? config.desastres?.[0]
      : undefined;

    return {
      id: pt.id,
      objeto: pt.objeto,
      emoji: objCfg?.emoji ?? '📦',
      prediccion,
      correcto,
      desastreTexto: desastre?.texto,
    };
  });
}
