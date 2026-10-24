import { describe, expect, it } from 'vitest';
import { chooseTunnel, seedFromSearch, type Estimate } from './logic';

const tunnels = [{ id: 'a', p: 0.30, emoji: '🕳️' }, { id: 'b', p: 0.36, emoji: '🕳️' }];
const estimates = (a: number, b: number) => [
  { tunel: 'a', estimacion: a }, { tunel: 'b', estimacion: b },
] as Estimate[];

describe('decisión de Doble Hueso', () => {
  it('gana al elegir el mayor estimado si coincide con el mejor túnel', () => {
    expect(chooseTunnel(tunnels, estimates(0.29, 0.37))).toEqual({ tunnel: 'b', won: true });
  });
  it('registra fallo si el muestreo prefiere el túnel incorrecto', () => {
    expect(chooseTunnel(tunnels, estimates(0.4, 0.2)).won).toBe(false);
  });
  it('no resuelve empates usando la probabilidad oculta', () => {
    expect(chooseTunnel(tunnels, estimates(0.3, 0.3))).toEqual({ tunnel: 'a', won: false });
  });
  it('rechaza resultados incompletos', () => {
    expect(() => chooseTunnel(tunnels, [])).toThrow();
  });
  it('solo usa semillas enteras no negativas de la URL', () => {
    expect(seedFromSearch('?semilla=7')).toBe(7);
    for (const query of ['', '?semilla=-1', '?semilla=NaN', '?semilla=4294967296']) {
      expect(seedFromSearch(query)).toBeUndefined();
    }
  });
});
