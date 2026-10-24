import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as apiClient from '../api/client';
import {
  getMinigameConfig,
  setCatalogOverrideForTests,
} from '../content/catalog';
import { buildOutcomeSteps } from '../world/outcome';
import { setStoreDebounceMsForTests, useGameStore } from './store';

describe('Criterios de aceptación D03–D08', () => {
  beforeEach(() => {
    apiClient.setMockMode(true);
    setStoreDebounceMsForTests(0);
    setCatalogOverrideForTests(null);
    useGameStore.setState({
      cromosGuardados: {},
      desastresVistos: {},
    });
  });

  it('D03: en 1.2 Fregadero dos Giro-Sensores dan ~50% y al añadir Cable Gemelo llega a 100% en ejemplos y mapa XOR', async () => {
    const store = useGameStore.getState();
    store.loadMinigame('fregadero');
    store.setMode('cuantico');

    await useGameStore.getState().placeFicha({ ficha: 'giro_y', cable: 0, pos: 0 });
    await useGameStore.getState().placeFicha({ ficha: 'giro_y', cable: 1, pos: 0 });

    const sinCx = useGameStore.getState().resultadoEjemplos;
    expect(sinCx).not.toBeNull();
    expect(sinCx!.acierto).toBeLessThanOrEqual(0.6);

    await useGameStore
      .getState()
      .placeFicha({ ficha: 'cable_gemelo', cable: 0, pos: 1 });

    const conCx = useGameStore.getState().resultadoEjemplos;
    expect(conCx).not.toBeNull();
    expect(conCx!.acierto).toBe(1.0);
    expect(useGameStore.getState().mapaActual?.valores).toHaveLength(1024);
  });

  it('D04: en 1.2 con chip simple provoca desastre, muestra nuevoDesastre, Chispa sugiere abrir el cerebro y buildOutcomeSteps coincide con las predicciones', async () => {
    useGameStore.getState().loadMinigame('fregadero');
    useGameStore.getState().setMode('simple');

    const res = await useGameStore.getState().runTask();
    expect(res).not.toBeNull();
    expect(res!.acierto).toBeLessThan(0.9);

    const state = useGameStore.getState();
    expect(state.nuevoDesastre).not.toBeNull();
    expect(state.chispa).toBe(state.config.chispa.primer_fallo);

    const steps = buildOutcomeSteps(state.config, state.ultimoResultado);
    expect(steps).toHaveLength(state.ultimoResultado!.predicciones.length);
    for (let i = 0; i < steps.length; i++) {
      expect(steps[i].prediccion).toBe(
        state.ultimoResultado!.predicciones[i].prediccion
      );
      expect(steps[i].correcto).toBe(
        state.ultimoResultado!.predicciones[i].correcto
      );
    }
  });

  it('D05 y D06: ganar 1.2 revela cromo y Rayos-X; Continuar desde 1.1 va a 1.2 y desde 1.2 (sin chef) abre el parque con Doble Hueso', async () => {
    // Simular catálogo Prioridad A (pelusa, fregadero, doble-hueso)
    setCatalogOverrideForTests(['pelusa', 'fregadero', 'doble-hueso']);

    useGameStore.getState().loadMinigame('pelusa');
    useGameStore.getState().nextMinigame();
    expect(useGameStore.getState().minijuegoId).toBe('fregadero');

    // Ganar 1.2
    useGameStore.getState().setMode('cuantico');
    await useGameStore.getState().placeFicha({ ficha: 'giro_y', cable: 0, pos: 0 });
    await useGameStore.getState().placeFicha({ ficha: 'giro_y', cable: 1, pos: 0 });
    await useGameStore
      .getState()
      .placeFicha({ ficha: 'cable_gemelo', cable: 0, pos: 1 });
    await useGameStore.getState().runTask();

    expect(useGameStore.getState().cromoRevelado?.minijuegoId).toBe('fregadero');
    await useGameStore.getState().openXray();
    expect(useGameStore.getState().xray?.codigo).toContain('QuantumCircuit');

    // Continuar desde 1.2 (sin chef) lleva al parque con doble-hueso
    useGameStore.getState().nextMinigame();
    expect(useGameStore.getState().minijuegoId).toBe('doble-hueso');
    expect(useGameStore.getState().escena).toBe('parque');

    // En 2.2 Doble Hueso: registrar desastre y ganar guarda en el álbum
    useGameStore.getState().registerDisaster('rana');
    expect(useGameStore.getState().desastresVistos['rana']).toBeDefined();

    await useGameStore.getState().win();
    expect(useGameStore.getState().cromosGuardados['doble-hueso']).toBeDefined();
  });

  it('D07: en 1.3 Chef Catástrofe con escala 1.5 no se gana y con escala 3.5 en ambos Giro-Sensores se gana; en 1.2 no hay perilla', async () => {
    expect(getMinigameConfig('fregadero')?.perilla_escala).toBeUndefined();
    expect(getMinigameConfig('chef')?.perilla_escala).toBeDefined();

    useGameStore.getState().loadMinigame('chef');
    useGameStore.getState().setMode('cuantico');

    await useGameStore.getState().placeFicha({ ficha: 'giro_y', cable: 0, pos: 0 });
    await useGameStore.getState().placeFicha({ ficha: 'giro_y', cable: 1, pos: 0 });

    const resFabrica = await useGameStore.getState().runTask();
    expect(resFabrica!.acierto).toBeLessThan(0.9);
    expect(useGameStore.getState().estado).not.toBe('ganado');

    await useGameStore.getState().setEscala(0, 0, 3.5);
    await useGameStore.getState().setEscala(1, 0, 3.5);

    const resAjustada = await useGameStore.getState().runTask();
    expect(resAjustada!.acierto).toBeGreaterThanOrEqual(0.9);
    expect(useGameStore.getState().estado).toBe('ganado');
  });

  it('D08: en 2.4 la sexta ficha dispara la Tormenta NISQ sin llamar a la API; 1.4, 2.3 y 2.4 se ganan con los circuitos de verificacion.md', async () => {
    // 1.4 Lavandería en Remolino: 7 fichas H0·RY1 → CX(0→1) → RY1 → RY0·H1 → CX(1→0)
    useGameStore.getState().loadMinigame('lavanderia');
    useGameStore.getState().setMode('cuantico');
    await useGameStore.getState().placeFicha({ ficha: 'prisma', cable: 0, pos: 0 });
    await useGameStore.getState().placeFicha({ ficha: 'giro_y', cable: 1, pos: 0 });
    await useGameStore
      .getState()
      .placeFicha({ ficha: 'cable_gemelo', cable: 0, pos: 1 });
    await useGameStore.getState().placeFicha({ ficha: 'giro_y', cable: 1, pos: 2 });
    await useGameStore.getState().placeFicha({ ficha: 'giro_y', cable: 0, pos: 3 });
    await useGameStore.getState().placeFicha({ ficha: 'prisma', cable: 1, pos: 3 });
    await useGameStore
      .getState()
      .placeFicha({ ficha: 'cable_gemelo', cable: 1, pos: 4 });
    const res14 = await useGameStore.getState().runTask();
    expect(res14!.acierto).toBeGreaterThanOrEqual(0.9);

    // 2.3 Pista Láser-Musical: 6 fichas H0·H1 → RZ0·RZ1 → CX(1→0) → H1
    useGameStore.getState().loadMinigame('pista');
    useGameStore.getState().setMode('cuantico');
    await useGameStore.getState().placeFicha({ ficha: 'prisma', cable: 0, pos: 0 });
    await useGameStore.getState().placeFicha({ ficha: 'prisma', cable: 1, pos: 0 });
    await useGameStore.getState().placeFicha({ ficha: 'giro_z', cable: 0, pos: 1 });
    await useGameStore.getState().placeFicha({ ficha: 'giro_z', cable: 1, pos: 1 });
    await useGameStore
      .getState()
      .placeFicha({ ficha: 'cable_gemelo', cable: 1, pos: 2 });
    await useGameStore.getState().placeFicha({ ficha: 'prisma', cable: 1, pos: 3 });
    const res23 = await useGameStore.getState().runTask();
    expect(res23!.acierto).toBe(1.0);

    // 2.4 Gran Copa Canina: 5 fichas H1 → CX(1→0) → RY0·RY1 → CX(0→1)
    useGameStore.getState().loadMinigame('copa');
    useGameStore.getState().setMode('cuantico');
    await useGameStore.getState().placeFicha({ ficha: 'prisma', cable: 1, pos: 0 });
    await useGameStore
      .getState()
      .placeFicha({ ficha: 'cable_gemelo', cable: 1, pos: 1 });
    await useGameStore.getState().placeFicha({ ficha: 'giro_y', cable: 0, pos: 2 });
    await useGameStore.getState().placeFicha({ ficha: 'giro_y', cable: 1, pos: 2 });
    await useGameStore
      .getState()
      .placeFicha({ ficha: 'cable_gemelo', cable: 0, pos: 3 });

    // Intentar poner una 6ta ficha dispara la Tormenta NISQ SIN llamar a la API
    const spyPred = vi.spyOn(apiClient, 'getPredictions');
    await useGameStore.getState().placeFicha({ ficha: 'prisma', cable: 0, pos: 0 });
    expect(spyPred).not.toHaveBeenCalled();
    expect(useGameStore.getState().tormentaActiva).toBe(true);
    expect(useGameStore.getState().circuito.fichas).toHaveLength(5);
    spyPred.mockRestore();

    // Y con las 5 fichas ganadoras supera el 90%
    const res24 = await useGameStore.getState().runTask();
    expect(res24!.acierto).toBeGreaterThanOrEqual(0.9);
  });
});
