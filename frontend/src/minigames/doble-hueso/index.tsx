import { useEffect, useRef, useState } from 'react';
import { postEstimates } from '../../api/client';
import { animateRound, chooseTunnel, seedFromSearch, type Estimate, type Method, type Tunnel, type Series } from './logic';
import './style.css';

type Config = { id: string; titulo: string; bateria: number; tuneles: Tunnel[]; chispa: Record<string, string> };
type Props = { config: unknown; onWin: (circuito?: { fichas: [] }) => void; onDisaster: (id: string) => void; chispaSay: (text: string) => void };
const names: Record<Method, string> = { monte_carlo: 'Simple · Monte Carlo', qae: 'Cuántico · QAE' };

export default function DobleHueso({ config: input, onWin, onDisaster, chispaSay }: Props) {
  const config = input as Config;
  const valid = config?.id === 'doble-hueso' && config.tuneles?.length === 2 && config.bateria > 0;
  const [method, setMethod] = useState<Method>('monte_carlo');
  const [series, setSeries] = useState<Series[]>([]);
  const [used, setUsed] = useState(0);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [isMock, setIsMock] = useState(false);
  const runId = useRef(0);
  const completed = useRef(new Set<Method>());
  const say = useRef(chispaSay);
  say.current = chispaSay;

  useEffect(() => {
    if (valid) {
      say.current(config.chispa.inicio);
      setSeries([]); setUsed(0); setBusy(false); setMessage('');
      completed.current.clear();
    }
    return () => { runId.current += 1; };
  }, [config, valid]);

  async function run() {
    if (!valid || busy) return;
    const id = ++runId.current;
    setBusy(true); setUsed(0); setMessage('Q-Boby está olfateando…');
    try {
      const seed = seedFromSearch(window.location.search);
      const results: Estimate[] = await Promise.all(config.tuneles.map(t => postEstimates(config.id, {
        metodo: method, tunel: t.id, presupuesto: Math.floor(config.bateria / 2),
        ...(seed === undefined ? {} : { semilla: seed }),
      })));
      if (runId.current !== id) return;
      setIsMock(results.some(r => r.meta.simulador === 'mock'));
      const finished = await animateRound(results, (current, spent) => {
        setSeries(previous => [...previous.filter(s => s.method !== method), ...current]);
        setUsed(spent);
      }, () => runId.current === id);
      if (!finished) return;
      completed.current.add(method);
      const outcome = chooseTunnel(config.tuneles, results);
      setMessage(outcome.won ? `¡Túnel ${outcome.tunnel.toUpperCase()}! Q-Boby encontró el mejor olfato.` : '¡Una rana en la nariz! Puedes probar el otro chip.');
      if (outcome.won) onWin();
      else { onDisaster('rana'); chispaSay(config.chispa.primer_fallo); }
      if (completed.current.size === 2) chispaSay(`${config.chispa.comparacion} ${config.chispa.ruido}`);
      else if (outcome.won) chispaSay(config.chispa.victoria);
    } catch (error) {
      if (runId.current === id) setMessage(error instanceof Error ? error.message : 'No se pudo consultar el olfato de Q-Boby.');
    } finally {
      if (runId.current === id) setBusy(false);
    }
  }

  if (!valid) return <p role="alert">Falta la configuración de Doble Hueso.</p>;
  const maxQueries = config.bateria / 2;
  return <section className="qb-dh" aria-label="Doble Hueso">
    <header><span className="qb-dh-kicker">Q-BOBY · EL PARQUE</span><h1>{config.titulo}</h1><p>Dos túneles, el mismo olfato. ¿Cómo aprovecharás la batería?</p></header>
    <div className="qb-dh-controls"><div role="group" aria-label="Chip del robot">{(['monte_carlo', 'qae'] as Method[]).map(m =>
      <button key={m} aria-pressed={method === m} disabled={busy} onClick={() => setMethod(m)}>{names[m]}</button>)}</div>
      <button className="qb-dh-primary" disabled={busy} onClick={run}>{busy ? 'Olfateando…' : '¡Olfatea, Q-Boby!'}</button></div>
    <label className="qb-dh-battery">Batería: {Math.max(0, config.bateria-used)} / {config.bateria} consultas
      <progress value={Math.min(used, config.bateria)} max={config.bateria} /></label>
    <figure><svg viewBox="0 0 780 250" role="img" aria-label="Error de estimación frente a consultas por túnel">
      {[0, 0.25, 0.5, 0.75, 1].map(tick => <g key={tick}><line x1="60" y1={210-180*tick} x2="750" y2={210-180*tick} stroke="#DEE7ED" /><text x="48" y={214-180*tick} textAnchor="end">{tick}</text></g>)}
      <path d="M60 25V210H750" fill="none" stroke="#243B53" />
      <text x="60" y="16">Error |estimación − p|</text><text x="375" y="244">Consultas por túnel</text>
      <text x="60" y="228">0</text><text x="750" y="228" textAnchor="end">{maxQueries}</text>
      {series.map(s => <g key={`${s.method}-${s.tunnel}`}>
        <polyline fill="none" stroke={s.method === 'qae' ? '#285F8C' : '#8A4937'} strokeWidth="2.5" strokeDasharray={s.tunnel === 'b' ? '7 4' : undefined}
          points={s.points.map(p => `${60+690*p.consultas/maxQueries},${210-180*p.error}`).join(' ')} />
        {s.points.map(p => <circle key={p.consultas} cx={60+690*p.consultas/maxQueries} cy={210-180*p.error} r="3" fill={s.method === 'qae' ? '#285F8C' : '#8A4937'} />)}
      </g>)}
    </svg><figcaption>Monte Carlo: terracota · QAE: azul. Túnel A: línea continua · B: discontinua.</figcaption></figure>
    <div className="qb-dh-results">{series.map(s => <p key={`${s.method}-${s.tunnel}`}>{names[s.method]} · Túnel {s.tunnel.toUpperCase()}: {s.points.at(-1)?.estimacion.toFixed(4)} <small>({s.points.at(-1)?.consultas} consultas)</small></p>)}</div>
    <p role="status" aria-live="polite">{message || config.chispa.inicio}</p>
    <p className="qb-dh-note">{isMock ? 'Modo mock: valores de ejemplo; no es una corrida real.' : series.length ? 'Esta es una corrida real. Los puntos no se suavizan.' : 'Los resultados aparecerán al consultar el modelo.'} En el experimento de 1000 corridas: QAE ≈95 %, Monte Carlo ≈77 % (experiments/qae). Una ronda puede fallar con cualquiera de los chips.</p>
    {completed.current.size === 2 && <p className="qb-dh-note">{config.chispa.comparacion} {config.chispa.ruido}</p>}
  </section>;
}
