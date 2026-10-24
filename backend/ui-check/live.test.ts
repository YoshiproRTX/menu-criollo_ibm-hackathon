import { expect, it } from 'vitest';
import { animateRound, chooseTunnel, type Series } from './src/minigames/doble-hueso/logic';
import { animateTraining, goldenTiles, type HistoryPoint } from './src/minigames/trucos/logic';
import { postEstimates, getPredictions, postTrain } from './src/api/client';
import doble from './content/doble-hueso.json';
import trucos from './content/trucos.json';

// El cliente conserva URLs relativas de D01; en Node se anclan a localhost.
const nativeFetch = globalThis.fetch;
const runtime = globalThis as typeof globalThis & { process?: { env?: Record<string, string | undefined> } };
const live = runtime.process?.env?.QB_LIVE === '1';
if (live) globalThis.fetch = (input, init) => nativeFetch(new URL(String(input), 'http://127.0.0.1:8000'), init);

it.runIf(live)('anima las dos corridas reales sin interpolar puntos ni inventar batería', async () => {
  for (const metodo of ['monte_carlo', 'qae'] as const) {
    const results = await Promise.all(['a', 'b'].map(tunel => postEstimates('doble-hueso', { metodo, tunel, presupuesto: 90, semilla: 7 })));
    let final: Series[] = [];
    const spent: number[] = [];
    expect(await animateRound(results, (series, battery) => { final = series; spent.push(battery); }, () => true, async () => {})).toBe(true);
    for (const result of results) expect(final.find(s => s.tunnel === result.tunel)?.points).toEqual(result.trayectoria);
    expect(spent.at(-1)).toBe(180);
    expect(spent.every((value, i) => value <= 180 && (i === 0 || value >= spent[i-1]))).toBe(true);
    expect(chooseTunnel(doble.tuneles, results).tunnel).toMatch(/^[ab]$/);
  }
});

it.runIf(live)('anima el historial real y conserva fichas finales que clasifican las cuatro órdenes', async () => {
  const initial = await getPredictions('trucos', { fichas: goldenTiles(trucos.theta_inicial) }, 'prueba');
  const trained = await postTrain('trucos', { theta_inicial: trucos.theta_inicial, ...trucos.train });
  const frames: HistoryPoint[] = [];
  expect(await animateTraining(trained.historial, point => frames.push(point), () => true, async () => {})).toBe(true);
  expect(frames).toEqual(trained.historial);
  const tiles = goldenTiles(frames.at(-1)!.theta);
  const final = await getPredictions('trucos', { fichas: tiles }, 'prueba');
  expect(final.acierto).toBe(1);
  expect(final.perdida).toBeLessThan(initial.perdida);
});
