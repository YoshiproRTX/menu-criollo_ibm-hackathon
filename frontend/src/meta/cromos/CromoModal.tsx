import React, { useState, useEffect } from 'react';
import { getXray, type Rareza } from '../../api';
import { getMinigameConfig } from '../../content/catalog';
import { useGameStore } from '../../state/store';

const ESTILOS_RAREZA: Record<
  Rareza,
  {
    etiqueta: string;
    borde: string;
    fondo: string;
    sombra: string;
    insignia: string;
  }
> = {
  comun: {
    etiqueta: '⚪ Común (00)',
    borde: '3px solid #94a3b8',
    fondo: 'linear-gradient(145deg, #ffffff, #f1f5f9)',
    sombra: '0 16px 40px rgba(15, 23, 42, 0.25)',
    insignia: '#64748b',
  },
  rara: {
    etiqueta: '🔵 Rara (01)',
    borde: '3px solid #38bdf8',
    fondo: 'linear-gradient(145deg, #f0f9ff, #e0f2fe)',
    sombra: '0 16px 48px rgba(56, 189, 248, 0.45)',
    insignia: '#0284c7',
  },
  holografica: {
    etiqueta: '🌈 Holográfica (10)',
    borde: '3px solid #e879f9',
    fondo: 'linear-gradient(135deg, #fdf4ff 0%, #e0f2fe 50%, #fef3c7 100%)',
    sombra: '0 18px 56px rgba(232, 121, 249, 0.55)',
    insignia: '#a21caf',
  },
  legendaria: {
    etiqueta: '🌟 Legendaria (11)',
    borde: '3px solid #fbbf24',
    fondo: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 60%, #fde68a 100%)',
    sombra: '0 20px 64px rgba(251, 191, 36, 0.65)',
    insignia: '#b45309',
  },
};

export const CromoModal: React.FC = () => {
  const {
    cromoRevelado,
    config,
    circuito,
    xray,
    xrayAbierto,
    openXray,
    closeXray,
    closeCromoModal,
    nextMinigame,
  } = useGameStore();

  const [xrayDisponible, setXrayDisponible] = useState(true);
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    setXrayDisponible(true);
    setCopiado(false);
  }, [cromoRevelado?.minijuegoId]);

  if (!cromoRevelado) return null;

  const cfgCromo =
    getMinigameConfig(cromoRevelado.minijuegoId)?.cromo ?? config.cromo;
  const estilo = ESTILOS_RAREZA[cromoRevelado.rareza] ?? ESTILOS_RAREZA.comun;
  const probs = cromoRevelado.probabilidades;

  const handleVerRayosX = async () => {
    try {
      const res = await getXray(cromoRevelado.minijuegoId, circuito);
      if (res && res.codigo) {
        await openXray();
      } else {
        setXrayDisponible(false);
      }
    } catch {
      setXrayDisponible(false);
    }
  };

  const handleCopiar = async () => {
    if (!xray?.codigo) return;
    try {
      await navigator.clipboard.writeText(xray.codigo);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 1800);
    } catch {
      // Ignorar si clipboard no está disponible
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 80,
        background: 'rgba(15, 23, 42, 0.72)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          width: 'min(540px, 95vw)',
          maxHeight: '92vh',
          overflowY: 'auto',
          borderRadius: 24,
          border: estilo.borde,
          background: estilo.fondo,
          boxShadow: estilo.sombra,
          color: 'var(--color-azul-tinta)',
          padding: '22px 24px',
          animation: 'card-flip-in 0.55s cubic-bezier(0.22, 1, 0.36, 1)',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 10,
          }}
        >
          <span
            style={{
              background: estilo.insignia,
              color: '#fff',
              padding: '4px 12px',
              borderRadius: 999,
              fontSize: 12,
              fontWeight: 800,
            }}
          >
            {estilo.etiqueta}
          </span>
          <span style={{ fontSize: 12, fontWeight: 700, opacity: 0.75 }}>
            ✨ ¡Cromo Desbloqueado!
          </span>
        </div>

        <div
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: '#0369a1',
            textTransform: 'uppercase',
            letterSpacing: 0.6,
          }}
        >
          {cfgCromo.concepto}
        </div>
        <h2 style={{ margin: '4px 0 12px', fontSize: 24 }}>
          🏆 {cfgCromo.titulo}
        </h2>

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.78)',
            borderRadius: 16,
            padding: '12px 16px',
            border: '1px solid rgba(36, 59, 83, 0.12)',
            marginBottom: 14,
          }}
        >
          {cfgCromo.lineas.map((linea, idx) => (
            <p
              key={idx}
              style={{
                margin: idx === 0 ? 0 : '8px 0 0',
                fontSize: 14,
                lineHeight: 1.45,
                fontWeight: 500,
              }}
            >
              • {linea}
            </p>
          ))}
        </div>

        {/* Distribución de probabilidades de rareza (Regla de Born) */}
        <div
          style={{
            background: 'rgba(36, 59, 83, 0.06)',
            borderRadius: 14,
            padding: '10px 14px',
            marginBottom: 16,
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              marginBottom: 8,
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>🎲 Distribución de Born (1 shot real):</span>
            <span style={{ fontWeight: 600, opacity: 0.8 }}>
              Salió de 1 medición real del circuito ganador
            </span>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: 8,
            }}
          >
            {(
              [
                ['comun', '00 Común', probs.comun],
                ['rara', '01 Rara', probs.rara],
                ['holografica', '10 Holo', probs.holografica],
                ['legendaria', '11 Leg.', probs.legendaria],
              ] as Array<[Rareza, string, number]>
            ).map(([key, label, val]) => {
              const pct = Math.round((val ?? 0) * 100);
              const esGanadora = cromoRevelado.rareza === key;
              return (
                <div
                  key={key}
                  style={{
                    background: esGanadora
                      ? 'rgba(14, 165, 233, 0.18)'
                      : 'rgba(255,255,255,0.65)',
                    border: esGanadora
                      ? '2px solid #0284c7'
                      : '1px solid rgba(36,59,83,0.12)',
                    borderRadius: 10,
                    padding: '6px 8px',
                    fontSize: 11,
                  }}
                >
                  <div style={{ fontWeight: 700 }}>{label}</div>
                  <div
                    style={{
                      height: 6,
                      background: '#cbd5e1',
                      borderRadius: 999,
                      margin: '4px 0',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: '#0284c7',
                      }}
                    />
                  </div>
                  <div style={{ fontWeight: 700 }}>{pct}%</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Panel de Rayos-X Qiskit si está abierto */}
        {xrayAbierto && xray && (
          <div
            style={{
              background: '#0b1030',
              color: '#eef0ff',
              borderRadius: 14,
              padding: 14,
              marginBottom: 16,
              fontSize: 12,
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
              }}
            >
              <strong style={{ color: '#78ddd9' }}>
                🔬 Rayos-X Qiskit (Circuito y Código Real)
              </strong>
              <div style={{ display: 'flex', gap: 6 }}>
                <button
                  type="button"
                  onClick={() => void handleCopiar()}
                  style={{
                    background: '#1e293b',
                    color: '#78ddd9',
                    border: '1px solid #38bdf8',
                    borderRadius: 8,
                    padding: '3px 8px',
                    fontSize: 11,
                    fontWeight: 600,
                  }}
                >
                  {copiado ? '✓ Copiado' : '📋 Copiar código'}
                </button>
                <button
                  type="button"
                  onClick={closeXray}
                  style={{
                    background: 'transparent',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 700,
                  }}
                >
                  ✕
                </button>
              </div>
            </div>
            <pre
              style={{
                background: '#141a3a',
                padding: 10,
                borderRadius: 8,
                overflowX: 'auto',
                margin: '0 0 8px',
                fontFamily: 'Consolas, monospace',
              }}
            >
              {xray.diagrama}
            </pre>
            <pre
              style={{
                background: '#141a3a',
                padding: 10,
                borderRadius: 8,
                overflowX: 'auto',
                margin: 0,
                fontFamily: 'Consolas, monospace',
                color: '#78ddd9',
              }}
            >
              {xray.codigo}
            </pre>
          </div>
        )}

        {/* Botones de acción del cromo */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 10,
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', gap: 8 }}>
            {xrayDisponible && (
              <button
                type="button"
                onClick={() => void handleVerRayosX()}
                style={{
                  padding: '10px 16px',
                  borderRadius: 999,
                  border: '2px solid var(--color-azul-tinta)',
                  background: '#fff',
                  color: 'var(--color-azul-tinta)',
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                🔬 Rayos-X Qiskit
              </button>
            )}
            <button
              type="button"
              onClick={closeCromoModal}
              style={{
                padding: '10px 14px',
                borderRadius: 999,
                border: '1px solid rgba(36,59,83,0.25)',
                background: 'rgba(255,255,255,0.7)',
                color: 'var(--color-azul-tinta)',
                fontWeight: 600,
                fontSize: 13,
              }}
            >
              Seguir aquí
            </button>
          </div>

          <button
            type="button"
            onClick={() => nextMinigame()}
            style={{
              padding: '10px 22px',
              borderRadius: 999,
              border: 'none',
              background: 'var(--color-azul-tinta)',
              color: '#fff',
              fontWeight: 800,
              fontSize: 14,
              boxShadow: '0 6px 18px rgba(36, 59, 83, 0.3)',
            }}
          >
            Continuar ➔
          </button>
        </div>
      </div>
    </div>
  );
};
