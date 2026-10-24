import { useEffect, useRef, useState } from 'react';
import { getPredictions, postTrain } from '../../api/client';
import { animateTraining, goldenTiles, validateHistory, type GoldenTile, type HistoryPoint } from './logic';
import './style.css';

type Config = {
  id: string; titulo: string; theta_inicial: number[]; perillas: { min: number; max: number };
  train: { iteraciones: number; tasa: number }; chispa: Record<string, string>;
  ordenes: { id: string; x: number[]; truco: string }[];
  trucos: Record<string, { emoji: string; texto: string }>; desastres: { id: string }[];
};
type Prediction = { conjunto: string; perdida?: number; acierto: number; predicciones: { id: string; p_accion: number; prediccion: string; correcto: boolean }[]; meta: { simulador: string } };
type Props = { config: unknown; onWin: (circuito?: { fichas: GoldenTile[] }) => void; onDisaster: (id: string) => void; chispaSay: (text: string) => void };

export default function Trucos({ config: input, onWin, onDisaster, chispaSay }: Props) {
  const config = input as Config;
  const valid = config?.id === 'trucos' && config.theta_inicial?.length === 2;
  const [theta, setTheta] = useState(valid ? config.theta_inicial : [0, 0]);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [point, setPoint] = useState<HistoryPoint | null>(null);
  const [busy, setBusy] = useState(false);
  const [attempted, setAttempted] = useState(false);
  const [message, setMessage] = useState('');
  const runId = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const callbacks = useRef({ onWin, onDisaster, chispaSay });
  callbacks.current = { onWin, onDisaster, chispaSay };
  const won = useRef(false);

  useEffect(() => {
    if (valid) {
      callbacks.current.chispaSay(config.chispa.inicio);
      setTheta(config.theta_inicial); setAttempted(false); won.current = false;
      void infer(config.theta_inicial, false);
    }
    return () => { runId.current++; clearTimeout(timer.current); };
  }, [config]);

  function report(data: Prediction, angles: number[]) {
    if (data.acierto === 1) {
      setMessage('¡Q-Boby obedece las cuatro órdenes!');
      callbacks.current.chispaSay(config.chispa.victoria);
      if (!won.current) { won.current = true; callbacks.current.onWin({ fichas: goldenTiles(angles) }); }
    } else {
      setMessage('¡Q-Boby se convirtió en helicóptero! Prueba las dos perillas.');
      callbacks.current.onDisaster(config.desastres[0].id);
      callbacks.current.chispaSay(config.chispa.primer_fallo);
    }
  }

  async function infer(angles: number[], notify: boolean) {
    const id = ++runId.current;
    setBusy(true); setPoint(null);
    try {
      const result: Prediction = await getPredictions(config.id, { fichas: goldenTiles(angles) }, 'prueba');
      if (runId.current !== id) return;
      setPrediction(result);
      if (notify) { setAttempted(true); report(result, angles); }
    } catch (error) {
      if (runId.current === id) setMessage(error instanceof Error ? error.message : 'No se pudo leer el modelo.');
    } finally {
      if (runId.current === id) setBusy(false);
    }
  }

  function scheduleInference() {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { void infer(theta, true); }, 150);
  }

  async function train() {
    if (busy || !attempted) return;
    clearTimeout(timer.current);
    const id = ++runId.current;
    setBusy(true); setMessage('El optimizador está ajustando los ángulos…');
    try {
      const result: { historial: HistoryPoint[]; meta: { simulador: string } } = await postTrain(config.id, { theta_inicial: theta, ...config.train });
      const history = validateHistory(result.historial);
      const finished = await animateTraining(history, item => { setTheta(item.theta); setPoint(item); }, () => runId.current === id);
      if (!finished) return;
      const finalTheta = history.at(-1)!.theta;
      const final: Prediction = await getPredictions(config.id, { fichas: goldenTiles(finalTheta) }, 'prueba');
      if (runId.current !== id) return;
      setPrediction(final); report(final, finalTheta);
    } catch (error) {
      if (runId.current === id) setMessage(error instanceof Error ? error.message : 'No se pudo entrenar.');
    } finally {
      if (runId.current === id) setBusy(false);
    }
  }

  if (!valid) return <p role="alert">Falta la configuración de Trucos.</p>;
  const loss = point?.perdida ?? prediction?.perdida;
  return <section className="qb-tr" aria-label="Siéntate, Gira o Despega">
    <header><span className="qb-tr-kicker">Q-BOBY · TALLER DE TRUCOS</span><h1>{config.titulo}</h1><p>Prueba tus dos Perillas Doradas y observa el mareo de Q-Boby.</p></header>
    <div className="qb-tr-workbench"><div className="qb-tr-knobs">{theta.map((angle, q) => <label key={q}>
      <span>Perilla Dorada {q+1} <output>{angle.toFixed(3)} rad</output></span>
      <input type="range" min={config.perillas.min} max={config.perillas.max} step="0.01" value={angle} disabled={busy}
        aria-label={`Perilla Dorada ${q+1}`} onChange={event => { const value = Number(event.target.value); setTheta(previous => previous.map((t, i) => i === q ? value : t)); }}
        onPointerUp={scheduleInference} onKeyUp={scheduleInference} />
    </label>)}<button disabled={busy} onClick={() => void infer(theta, true)}>¡Prueba los trucos!</button></div>
    <div className="qb-tr-meter"><span aria-hidden="true">🐶</span><h2>Termómetro de Mareo</h2><meter min="0" max="1" value={loss ?? 0} aria-label="Pérdida del modelo" />
      <strong>{loss === undefined ? 'Leyendo el modelo…' : loss.toFixed(5)}</strong><small>0: obedece · 1: hace lo contrario</small>
      {point && <p>Iteración {point.iteracion} / {config.train.iteraciones}</p>}</div></div>
    <p className="qb-tr-note">Predicciones del último intento. Durante el entrenamiento, las perillas y la pérdida siguen el historial recibido.</p>
    <div className="qb-tr-orders">{config.ordenes.map(order => {
      const row = prediction?.predicciones.find(p => p.id === order.id);
      const trick = row && config.trucos[row.prediccion];
      return <article key={order.id}><span>{order.x[0] ? 'Silbato agudo' : 'Silbato grave'} · Mano {order.x[1] ? 'arriba' : 'abajo'}</span>
        <strong>{trick ? `${trick.emoji} ${trick.texto}` : 'Pendiente de inferencia'}</strong><small>{row ? `${row.correcto ? '✓ Correcto' : '↻ Confundido'} · P(correcto) ${row.p_accion.toFixed(3)}` : 'Sin predicción todavía'}</small></article>;
    })}</div>
    <button className="qb-tr-primary" disabled={busy || !attempted} onClick={() => void train()}>{busy && point ? 'Entrenando…' : '🎺 Silbato Auto-Entrenar'}</button>
    {!attempted && <p className="qb-tr-note">Haz primero un intento manual para desbloquear el silbato.</p>}
    <p role="status" aria-live="polite">{message || config.chispa.inicio}</p>
    <p className="qb-tr-note">Entrenar ajusta θ mediante un optimizador clásico y gradientes parameter-shift. Inferir usa los ángulos actuales. Una perilla congelada en un mal valor puede impedir aprender con la otra. {prediction?.meta.simulador === 'mock' ? 'Modo mock: cifras de ejemplo.' : 'La pérdida y los trucos proceden de Qiskit.'}</p>
  </section>;
}
