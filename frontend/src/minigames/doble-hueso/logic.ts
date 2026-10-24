export type Method = 'monte_carlo' | 'qae';
export type Point = { consultas: number; estimacion: number; error: number };
export type Estimate = {
  metodo: Method; tunel: string; trayectoria: Point[]; estimacion: number;
  consultas_usadas: number; meta: { simulador: string; qiskit: string; ms: number };
};
export type Tunnel = { id: string; p: number; emoji: string };
export type Series = { method: Method; tunnel: string; points: Point[] };

export async function animateRound(
  results: Estimate[],
  onFrame: (series: Series[], spent: number) => void,
  isCurrent: () => boolean,
  wait: (ms: number) => Promise<unknown> = ms => new Promise(resolve => setTimeout(resolve, ms)),
) {
  const steps = Math.max(...results.map(r => r.trayectoria.length));
  for (let step = 1; step <= steps; step++) {
    await wait(150);
    if (!isCurrent()) return false;
    const frame = results.map(r => ({ method: r.metodo, tunnel: r.tunel, points: r.trayectoria.slice(0, step) }));
    onFrame(frame, frame.reduce((sum, s) => sum + (s.points.at(-1)?.consultas ?? 0), 0));
  }
  return true;
}

export function chooseTunnel(tunnels: Tunnel[], results: Estimate[]) {
  if (tunnels.length !== 2 || results.length !== 2 || tunnels.some(t => !results.some(r => r.tunel === t.id))) {
    throw new Error('Se necesitan las estimaciones de ambos túneles.');
  }
  const best = tunnels.reduce((a, b) => b.p > a.p ? b : a);
  // Empates: conservar el primero; no favorecer al túnel conocido como correcto.
  const selected = results.reduce((a, b) => b.estimacion > a.estimacion ? b : a);
  return { tunnel: selected.tunel, won: selected.tunel === best.id };
}

export function seedFromSearch(search: string): number | undefined {
  const value = new URLSearchParams(search).get('semilla');
  if (value === null || !/^\d+$/.test(value)) return undefined;
  const seed = Number(value);
  return Number.isSafeInteger(seed) && seed <= 2 ** 32 - 1 ? seed : undefined;
}
