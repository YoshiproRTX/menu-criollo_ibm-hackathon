import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as apiClient from '../api/client';
import { ApiError } from '../api/types';
import { classifyLinear } from '../brain/linearRule';
import { getMinigameConfig } from '../content/catalog';
import {
  setStoreDebounceMsForTests,
  STORAGE_KEYS,
  useGameStore,
} from './store';

describe('Store y regla lineal (D02)', () => {
  beforeEach(() => {
    apiClient.setMockMode(true);
    setStoreDebounceMsForTests(0);
    if (typeof localStorage !== 'undefined') {
      localStorage.clear();
    }
    useGameStore.setState({
      cromosGuardados: {},
      desastresVistos: {},
    });
    useGameStore.getState().loadMinigame('fregadero');
  });

  it('classifyLinear: en 1.1 Pelusa existe una regla que llega a 100% y en 1.2 Fregadero ninguna de una grilla supera 0.8', () => {
    const cfg11 = getMinigameConfig('pelusa')!;
    const cfg12 = getMinigameConfig('fregadero')!;

    let mejor11 = 0;
    let mejor12 = 0;

    for (let i = 0; i <= 60; i++) {
      const angulo = (i / 60) * Math.PI * 2;
      for (let j = 0; j <= 40; j++) {
        const desplazamiento = -1.5 + (j / 40) * 3.0;
        const r11 = classifyLinear(
          { angulo, desplazamiento },
          cfg11.prueba ?? [],
          cfg11
        );
        if (r11.acierto > mejor11) mejor11 = r11.acierto;

        const r12 = classifyLinear(
          { angulo, desplazamiento },
          cfg12.prueba ?? [],
          cfg12
        );
        if (r12.acierto > mejor12) mejor12 = r12.acierto;
      }
    }

    expect(mejor11).toBe(1.0);
    expect(mejor12).toBeLessThanOrEqual(0.8);
  });

  it('runTask con chip simple usa la regla lineal y con chip cuántico usa getPredictions', async () => {
    const spyPred = vi.spyOn(apiClient, 'getPredictions');

    // Modo simple: no llama a getPredictions
    useGameStore.getState().setMode('simple');
    const resSimple = await useGameStore.getState().runTask();
    expect(resSimple).not.toBeNull();
    expect(resSimple?.meta.simulador).toBe('ReglaLineal');
    expect(spyPred).not.toHaveBeenCalled();

    // Modo cuántico: llama a getPredictions con conjunto 'prueba'
    useGameStore.getState().setMode('cuantico');
    spyPred.mockClear();
    const resCuantico = await useGameStore.getState().runTask();
    expect(resCuantico).not.toBeNull();
    expect(spyPred).toHaveBeenCalledWith(
      'fregadero',
      expect.any(Object),
      'prueba'
    );
    spyPred.mockRestore();
  });

  it('checkWin respeta el umbral del JSON', () => {
    const store = useGameStore.getState();
    expect(store.checkWin(0.89)).toBe(false);
    expect(store.checkWin(0.9)).toBe(true);
    expect(store.checkWin(1.0)).toBe(true);
    expect(store.checkWin(0.75, 0.8)).toBe(false);
    expect(store.checkWin(0.8, 0.8)).toBe(true);
  });

  it('un mismo fallo registra el desastre una sola vez', async () => {
    const store = useGameStore.getState();
    const d1 = store.registerDisaster('plato', 'basura');
    expect(d1).not.toBeNull();
    expect(Object.keys(useGameStore.getState().desastresVistos)).toHaveLength(1);

    const d2 = useGameStore.getState().registerDisaster('plato', 'basura');
    expect(d2?.id).toBe(d1?.id);
    expect(Object.keys(useGameStore.getState().desastresVistos)).toHaveLength(1);
  });

  it('la victoria llama a drawRarity y guarda el cromo conservando la mejor rareza', async () => {
    const spyRarity = vi.spyOn(apiClient, 'drawRarity');

    useGameStore.getState().setMode('cuantico');
    await useGameStore.getState().placeFicha({ ficha: 'giro_y', cable: 0, pos: 0 });
    await useGameStore.getState().placeFicha({ ficha: 'giro_y', cable: 1, pos: 0 });
    await useGameStore.getState().placeFicha({ ficha: 'cable_gemelo', cable: 0, pos: 1 });

    const res = await useGameStore.getState().runTask();
    expect(res?.acierto).toBe(1.0);
    expect(spyRarity).toHaveBeenCalled();

    const state = useGameStore.getState();
    expect(state.estado).toBe('ganado');
    expect(state.cromoRevelado).not.toBeNull();
    expect(state.cromosGuardados['fregadero']).toBeDefined();
    expect(state.chispa).toBe(state.config.chispa.victoria);

    spyRarity.mockRestore();
  });

  it('un 422 en placeFicha revierte el circuito como estaba y guarda el error', async () => {
    useGameStore.getState().loadMinigame('pelusa');
    useGameStore.getState().setMode('cuantico');

    await useGameStore.getState().placeFicha({ ficha: 'giro_y', cable: 1, pos: 0 });
    expect(useGameStore.getState().circuito.fichas).toHaveLength(1);

    // En pelusa, cable_gemelo no está permitido -> 422
    await useGameStore
      .getState()
      .placeFicha({ ficha: 'cable_gemelo', cable: 0, pos: 1 });

    const state = useGameStore.getState();
    expect(state.circuito.fichas).toHaveLength(1);
    expect(state.circuito.fichas[0].ficha).toBe('giro_y');
    expect(state.error).toBeTruthy();

    // Ocupar la misma ranura también da 422 y revierte
    await useGameStore.getState().placeFicha({ ficha: 'giro_y', cable: 1, pos: 0 });
    expect(useGameStore.getState().circuito.fichas).toHaveLength(1);
  });
});
