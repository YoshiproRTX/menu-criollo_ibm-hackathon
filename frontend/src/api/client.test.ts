import { describe, expect, it, beforeEach } from 'vitest';
import {
  ApiError,
  drawRarity,
  getDecisionMap,
  getHealth,
  getPredictions,
  getXray,
  postEstimates,
  postTrain,
  setMockMode,
} from './index';

describe('API client (D01)', () => {
  beforeEach(() => {
    setMockMode(true);
  });

  it('devuelve la forma del contrato para predictions en modo mock', async () => {
    const res = await getPredictions(
      'fregadero',
      {
        fichas: [
          { ficha: 'giro_y', cable: 0, pos: 0 },
          { ficha: 'giro_y', cable: 1, pos: 0 },
          { ficha: 'cable_gemelo', cable: 0, pos: 1 },
        ],
      },
      'prueba'
    );

    expect(res.conjunto).toBe('prueba');
    expect(Array.isArray(res.predicciones)).toBe(true);
    expect(res.predicciones.length).toBeGreaterThan(0);
    expect(res.predicciones[0]).toHaveProperty('id');
    expect(res.predicciones[0]).toHaveProperty('p_accion');
    expect(res.predicciones[0]).toHaveProperty('prediccion');
    expect(res.predicciones[0]).toHaveProperty('correcto');
    expect(res.acierto).toBe(1.0);
    expect(res.meta.simulador).toBe('mock');
  });

  it('lanza ApiError tipado con detail ante un 422 simulado', async () => {
    await expect(
      getPredictions('error-422', { fichas: [] }, 'prueba')
    ).rejects.toMatchObject({
      name: 'ApiError',
      status: 422,
    });

    try {
      await getPredictions(
        'pelusa',
        {
          fichas: [{ ficha: 'cable_gemelo', cable: 0, pos: 0 }],
        },
        'ejemplos'
      );
      expect.fail('Debió lanzar 422 por ficha no permitida en pelusa');
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).status).toBe(422);
      expect((err as ApiError).detail.length).toBeGreaterThan(0);
    }
  });

  it('cubre decision-map, xray, rarity-draws, estimates, train y health en modo mock', async () => {
    const health = await getHealth();
    expect(health.ok).toBe(true);

    const map = await getDecisionMap('fregadero', { fichas: [] }, 32);
    expect(map.resolucion).toBe(32);
    expect(map.valores).toHaveLength(1024);

    const xray = await getXray('fregadero', {
      fichas: [{ ficha: 'giro_y', cable: 0, pos: 0 }],
    });
    expect(xray.codigo).toContain('QuantumCircuit');
    expect(xray.diagrama.length).toBeGreaterThan(0);

    const rarity = await drawRarity(
      'fregadero',
      {
        fichas: [
          { ficha: 'giro_y', cable: 0, pos: 0 },
          { ficha: 'giro_y', cable: 1, pos: 0 },
          { ficha: 'cable_gemelo', cable: 0, pos: 1 },
        ],
      },
      7
    );
    expect(['comun', 'rara', 'holografica', 'legendaria']).toContain(
      rarity.rareza
    );
    expect(rarity.shots).toBe(1);

    const est = await postEstimates({
      metodo: 'qae',
      tunel: 'b',
      presupuesto: 90,
      semilla: 7,
    });
    expect(est.metodo).toBe('qae');
    expect(est.trayectoria.length).toBeGreaterThan(0);

    const tr = await postTrain({
      theta_inicial: [0.3, -0.4],
      iteraciones: 15,
      tasa: 1.0,
    });
    expect(tr.historial.length).toBeGreaterThan(0);
  });
});
