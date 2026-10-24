export type GoldenTile = { ficha: 'perilla_dorada'; cable: number; pos: number; theta: number };
export type HistoryPoint = { iteracion: number; theta: number[]; perdida: number };

export function goldenTiles(theta: number[]): GoldenTile[] {
  if (theta.length !== 2 || theta.some(t => !Number.isFinite(t))) throw new Error('Se necesitan dos ángulos finitos.');
  return theta.map((angle, cable) => ({ ficha: 'perilla_dorada', cable, pos: 0, theta: angle }));
}

export function validateHistory(history: HistoryPoint[]): HistoryPoint[] {
  if (!history.length || history.some((point, i) => point.iteracion !== i || point.theta.length !== 2 ||
    point.theta.some(t => !Number.isFinite(t)) || !Number.isFinite(point.perdida) || point.perdida < 0 || point.perdida > 1)) {
    throw new Error('El historial de entrenamiento está incompleto.');
  }
  return history;
}

export async function animateTraining(
  history: HistoryPoint[], onPoint: (point: HistoryPoint) => void,
  isCurrent: () => boolean,
  wait: (ms: number) => Promise<unknown> = ms => new Promise(resolve => setTimeout(resolve, ms)),
) {
  for (const point of validateHistory(history)) {
    await wait(60);
    if (!isCurrent()) return false;
    onPoint(point);
  }
  return true;
}
