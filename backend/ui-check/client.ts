// Adaptador EXCLUSIVO del banco de pruebas. No sustituye el cliente D01.
import type { Estimate, Method } from '../minigames/doble-hueso/logic';
import type { GoldenTile, HistoryPoint } from '../minigames/trucos/logic';

type Prediction = { conjunto: string; perdida: number; acierto: number; predicciones: { id: string; p_accion: number; prediccion: string; correcto: boolean }[]; meta: { simulador: string } };

async function request<T>(id: string, resource: string, body: unknown): Promise<T> {
  const response = await fetch(`/api/minigames/${id}/${resource}`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail ?? 'No se pudo consultar el backend.');
  return data as T;
}

export const postEstimates = (id: string, body: { metodo: Method; tunel: string; presupuesto?: number; semilla?: number }) => request<Estimate>(id, 'estimates', body);
export const getPredictions = (id: string, circuito: { fichas: GoldenTile[] }, conjunto: 'prueba' | 'ejemplos') => request<Prediction>(id, 'predictions', { circuito, conjunto });
export const postTrain = (id: string, body: { theta_inicial: number[]; iteraciones: number; tasa: number }) => request<{ historial: HistoryPoint[]; meta: { simulador: string } }>(id, 'train', body);
