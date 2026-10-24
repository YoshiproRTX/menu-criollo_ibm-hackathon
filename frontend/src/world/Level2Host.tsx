import React, { Suspense, useMemo, useState } from 'react';
import {
  isMockMode,
  postEstimates,
  postTrain,
  type EstimatesResponse,
  type Ficha,
  type MinigameConfig,
  type PantallaNivel2Props,
  type TrainResponse,
} from '../api';

// Descubre dinámicamente las pantallas de Giovanni (G05 y G08) sin invadir su carpeta
const level2Modules = import.meta.glob('../minigames/*/index.tsx') as Record<
  string,
  () => Promise<{ default: React.ComponentType<PantallaNivel2Props> }>
>;

function findExternalScreen(
  id: string
): React.LazyExoticComponent<React.ComponentType<PantallaNivel2Props>> | null {
  for (const [path, loader] of Object.entries(level2Modules)) {
    if (
      path.includes(`/${id}/index.tsx`) ||
      path.includes(`\\${id}\\index.tsx`)
    ) {
      return React.lazy(loader);
    }
  }
  return null;
}

export const Level2Host: React.FC<{
  config: MinigameConfig;
  onWin: (circuito?: { fichas: Ficha[] }) => void;
  onDisaster: (desastreId: string) => void;
  chispaSay: (texto: string) => void;
}> = ({ config, onWin, onDisaster, chispaSay }) => {
  const ExternalComponent = useMemo(
    () => findExternalScreen(config.id),
    [config.id]
  );

  const [estA, setEstA] = useState<EstimatesResponse | null>(null);
  const [estB, setEstB] = useState<EstimatesResponse | null>(null);
  const [trainRes, setTrainRes] = useState<TrainResponse | null>(null);
  const [metodo, setMetodo] = useState<'monte_carlo' | 'qae'>('qae');

  if (ExternalComponent) {
    return (
      <div
        style={{
          position: 'fixed',
          top: 76,
          right: 18,
          zIndex: 35,
          width: 'min(840px, 95vw)',
          maxHeight: 'calc(100vh - 155px)',
          overflowY: 'auto',
          userSelect: 'auto',
        }}
      >
        <Suspense
          fallback={
            <div
              style={{
                background: '#fff',
                padding: 18,
                borderRadius: 18,
                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
              }}
            >
              Cargando estación de Q-Boby...
            </div>
          }
        >
          <ExternalComponent
            config={config}
            onWin={onWin}
            onDisaster={onDisaster}
            chispaSay={chispaSay}
          />
        </Suspense>
      </div>
    );
  }

  // Host de respaldo en modo mock mientras G05 / G08 no estén aún en el árbol
  const handleRunEstimates = async (m: 'monte_carlo' | 'qae') => {
    setMetodo(m);
    const [resA, resB] = await Promise.all([
      postEstimates(config.id, {
        metodo: m,
        tunel: 'a',
        presupuesto: 90,
        semilla: 7,
      }),
      postEstimates(config.id, {
        metodo: m,
        tunel: 'b',
        presupuesto: 90,
        semilla: 7,
      }),
    ]);
    setEstA(resA);
    setEstB(resB);
    if (resB.estimacion > resA.estimacion) {
      chispaSay(config.chispa.victoria);
      onWin({ fichas: [] });
    } else {
      chispaSay(config.chispa.primer_fallo);
      onDisaster('rana');
    }
  };

  const handleRunTrain = async () => {
    const res = await postTrain(config.id, {
      theta_inicial: [0.3, -0.4],
      iteraciones: 15,
      tasa: 1.0,
    });
    setTrainRes(res);
    const ultimo = res.historial[res.historial.length - 1];
    if (ultimo && ultimo.perdida < 0.05) {
      onWin({
        fichas: [
          { ficha: 'perilla_dorada', cable: 0, pos: 0, theta: ultimo.theta[0] },
          { ficha: 'perilla_dorada', cable: 1, pos: 0, theta: ultimo.theta[1] },
        ],
      });
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 82,
        right: 18,
        zIndex: 35,
        width: 'min(430px, 92vw)',
        background: 'rgba(255, 255, 255, 0.95)',
        border: '2px solid var(--color-azul-pastel)',
        borderRadius: 20,
        padding: 16,
        boxShadow: '0 14px 36px rgba(36, 59, 83, 0.18)',
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 800,
          color: '#0284c7',
          textTransform: 'uppercase',
        }}
      >
        🐶 Estación Nivel 2 · {config.id}
      </div>
      <h3 style={{ margin: '4px 0 8px', fontSize: 17 }}>{config.titulo}</h3>

      {config.tipo === 'doble-hueso' ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 13 }}>
            Batería de olfateo: <strong>{config.bateria ?? 180} consultas</strong>{' '}
            (90 por túnel). Túnel A (p=0.30) vs Túnel B ⭐ (p=0.36).
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => void handleRunEstimates('monte_carlo')}
              style={{
                padding: '8px 12px',
                borderRadius: 999,
                border: '1px solid #f4a261',
                background:
                  metodo === 'monte_carlo' ? '#ffd166' : 'var(--color-blanco-calido)',
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              📏 Olfatear con Monte Carlo
            </button>
            <button
              type="button"
              onClick={() => void handleRunEstimates('qae')}
              style={{
                padding: '8px 12px',
                borderRadius: 999,
                border: '1px solid #0284c7',
                background: metodo === 'qae' ? '#78ddd9' : 'var(--color-blanco-calido)',
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              ⚛️ Olfatear con QAE (Grover)
            </button>
          </div>
          {estA && estB && (
            <div
              style={{
                background: '#0b1030',
                color: '#eef0ff',
                padding: 10,
                borderRadius: 12,
                fontSize: 12,
              }}
            >
              <div>
                Método: <strong>{estA.metodo.toUpperCase()}</strong> ({estA.consultas_usadas + estB.consultas_usadas} consultas)
              </div>
              <div>
                Túnel A estimado: {(estA.estimacion * 100).toFixed(1)}% (error{' '}
                {(
                  (estA.trayectoria[estA.trayectoria.length - 1]?.error ?? 0) *
                  100
                ).toFixed(1)}
                %)
              </div>
              <div>
                Túnel B estimado: {(estB.estimacion * 100).toFixed(1)}% (error{' '}
                {(
                  (estB.trayectoria[estB.trayectoria.length - 1]?.error ?? 0) *
                  100
                ).toFixed(1)}
                %)
              </div>
            </div>
          )}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ fontSize: 13 }}>
            Entrena las dos Perillas Doradas (θ₁, θ₂) con la regla de
            parameter-shift.
          </div>
          <button
            type="button"
            onClick={() => void handleRunTrain()}
            style={{
              padding: '8px 14px',
              borderRadius: 999,
              border: 'none',
              background: '#78ddd9',
              fontWeight: 800,
              fontSize: 13,
            }}
          >
            🎺 Silbato Auto-Entrenar (Parameter-Shift)
          </button>
          {trainRes && (
            <div style={{ fontSize: 12 }}>
              Pérdida final:{' '}
              <strong>
                {trainRes.historial[trainRes.historial.length - 1]?.perdida}
              </strong>
            </div>
          )}
        </div>
      )}

      {isMockMode() && (
        <div
          style={{
            marginTop: 12,
            paddingTop: 10,
            borderTop: '1px dashed var(--color-azul-grisaceo)',
            display: 'flex',
            gap: 8,
            flexWrap: 'wrap',
          }}
        >
          <button
            type="button"
            onClick={() => onWin({ fichas: [] })}
            style={{
              padding: '5px 10px',
              borderRadius: 999,
              border: '1px solid #0284c7',
              background: '#e0f2fe',
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            ✨ Simular victoria
          </button>
          <button
            type="button"
            onClick={() =>
              onDisaster(config.desastres?.[0]?.id ?? 'rana')
            }
            style={{
              padding: '5px 10px',
              borderRadius: 999,
              border: '1px solid #e11d48',
              background: '#ffe4e6',
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            💥 Simular desastre
          </button>
        </div>
      )}
    </div>
  );
};
