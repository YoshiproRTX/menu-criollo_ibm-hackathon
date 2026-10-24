import { expect, it } from 'vitest';
import { goldenTiles, validateHistory } from './logic';

it('conserva los ángulos finales al construir las fichas de victoria', () => {
  expect(goldenTiles([0.2, -0.7])).toEqual([
    { ficha: 'perilla_dorada', cable: 0, pos: 0, theta: 0.2 },
    { ficha: 'perilla_dorada', cable: 1, pos: 0, theta: -0.7 },
  ]);
});
it('mantiene cada punto del historial sin interpolar ni redondear', () => {
  const history = [{ iteracion: 0, theta: [2.4, -1.9], perdida: 0.7 }, { iteracion: 1, theta: [2.51, -2.02], perdida: 0.51 }];
  expect(validateHistory(history)).toBe(history);
});
it('rechaza ángulos o historiales no válidos', () => {
  expect(() => goldenTiles([NaN, 0])).toThrow();
  expect(() => validateHistory([])).toThrow();
});
