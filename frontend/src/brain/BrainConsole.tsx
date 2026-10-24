import React, { useState, useEffect } from 'react';
import type { Ficha, FichaId } from '../api/types';
import { useGameStore } from '../state/store';
import { PerillaEscala } from './PerillaEscala';
import { RadarGelatina } from './RadarGelatina';
import { playClackSound, playRejectSound } from './sound';

interface InfoFichaCatalogo {
  id: FichaId;
  nombre: string;
  compuerta: string;
  icono: string;
  color: string;
  descripcion: string;
}

const CATALOGO_FICHAS: Record<string, InfoFichaCatalogo> = {
  giro_y: {
    id: 'giro_y',
    nombre: 'Giro-Sensor Y',
    compuerta: 'RY(escala·x)',
    icono: '🎛️',
    color: '#2dd4bf',
    descripcion: 'Rota el qubit según el valor del sensor de ese cable.',
  },
  giro_z: {
    id: 'giro_z',
    nombre: 'Giro-Sensor Z',
    compuerta: 'RZ(escala·x)',
    icono: '🧭',
    color: '#38bdf8',
    descripcion: 'Gira la fase del qubit según el sensor.',
  },
  prisma: {
    id: 'prisma',
    nombre: 'Prisma',
    compuerta: 'H',
    icono: '🌀',
    color: '#a78bfa',
    descripcion: 'Moneda cuántica: prepara superposición o hace interferir fases.',
  },
  cable_gemelo: {
    id: 'cable_gemelo',
    nombre: 'Cable Gemelo',
    compuerta: 'CX',
    icono: '⚡',
    color: '#f472b6',
    descripcion: 'Conecta ambos cables para combinar los dos sensores.',
  },
};

export const BrainConsole: React.FC = () => {
  const {
    consolaAbierta,
    setConsolaAbierta,
    config,
    modo,
    setMode,
    regla,
    updateRuler,
    circuito,
    placeFicha,
    removeFicha,
    setEscala,
    resultadoEjemplos,
    mapaActual,
    mapaAnterior,
    primeraFichaVista,
    error,
    clearError,
    tormentaActiva,
    clearTormenta,
    runTask,
  } = useGameStore();

  const [fichaSeleccionada, setFichaSeleccionada] = useState<FichaId | null>(
    null
  );
  const [ultimoClackKey, setUltimoClackKey] = useState<string | null>(null);
  const [shakeError, setShakeError] = useState(false);

  const permitidas = config.fichas_permitidas ?? ['giro_y', 'cable_gemelo', 'prisma'];

  useEffect(() => {
    if (permitidas.length > 0 && (!fichaSeleccionada || !permitidas.includes(fichaSeleccionada))) {
      setFichaSeleccionada(permitidas[0]);
    }
  }, [config.id, permitidas, fichaSeleccionada]);

  useEffect(() => {
    if (error) {
      playRejectSound();
      setShakeError(true);
      const t = setTimeout(() => setShakeError(false), 450);
      return () => clearTimeout(t);
    }
  }, [error]);

  if (!consolaAbierta) return null;

  const ranuras = config.ranuras ?? 4;
  const [minR, maxR] = config.rango ?? [0, 1];
  const accionPos = config.lectura?.accion ?? 'lavar';
  const accionNeg = config.lectura?.otra ?? 'basura';

  const buscarFichaEn = (cable: number, pos: number): Ficha | undefined => {
    return circuito.fichas.find(
      (f) =>
        f.pos === pos &&
        (f.cable === cable || f.ficha === 'cable_gemelo')
    );
  };

  const handleColocarEnRanura = async (cable: number, pos: number, fichaOverride?: FichaId) => {
    clearError();
    clearTormenta();

    const existente = buscarFichaEn(cable, pos);
    if (existente) {
      await removeFicha(cable, pos);
      return;
    }

    const fichaAUsar = fichaOverride ?? fichaSeleccionada ?? permitidas[0];
    if (!fichaAUsar) return;

    const nueva: Ficha = {
      ficha: fichaAUsar,
      cable,
      pos,
    };

    const prevLen = useGameStore.getState().circuito.fichas.length;
    await placeFicha(nueva);
    const nextLen = useGameStore.getState().circuito.fichas.length;
    if (nextLen > prevLen) {
      playClackSound();
      setUltimoClackKey(`${cable}:${pos}:${Date.now()}`);
    }
  };

  const handleProbarOtraVez = async () => {
    setConsolaAbierta(false);
    await runTask();
  };

  const aciertosEj =
    resultadoEjemplos?.predicciones.filter((p) => p.correcto).length ?? 0;
  const totalEj =
    resultadoEjemplos?.predicciones.length ?? config.ejemplos?.length ?? 0;
  const meta = mapaActual?.meta ?? resultadoEjemplos?.meta;

  // Cálculo decorativo de la Barra de Estática para D08 (2.4 Gran Copa)
  const limiteFichas = config.limite_fichas;
  const nFichas = circuito.fichas.length;
  const nCx = circuito.fichas.filter((f) => f.ficha === 'cable_gemelo').length;
  const nivelEstatica = limiteFichas
    ? Math.min(100, Math.round(((nFichas + nCx * 0.5) / limiteFichas) * 100))
    : 0;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        background: 'rgba(11, 16, 48, 0.68)',
        backdropFilter: 'blur(6px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          width: 'min(960px, 96vw)',
          maxHeight: '93vh',
          overflowY: 'auto',
          background: 'var(--consola-panel)',
          color: 'var(--consola-tinta)',
          borderRadius: 24,
          border: '2px solid rgba(120, 221, 217, 0.45)',
          boxShadow: '0 24px 70px rgba(0, 0, 0, 0.65)',
          padding: '18px 22px',
          animation: tormentaActiva
            ? 'storm-shake 0.5s ease-in-out'
            : shakeError
              ? 'shake-reject 0.4s ease-in-out'
              : undefined,
        }}
      >
        {/* Cabecera estilo consola Game Boy translúcida */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            flexWrap: 'wrap',
            borderBottom: '1px solid rgba(255,255,255,0.1)',
            paddingBottom: 12,
            marginBottom: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img
              src="/assets/images/qanacleto_avatar.png"
              alt="Q-Anacleto"
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                objectFit: 'cover',
                border: '2px solid #78ddd9',
                boxShadow: '0 0 14px rgba(120, 221, 217, 0.45)',
                background: '#0b1030',
              }}
            />
            <div>
              <div
                style={{
                  fontSize: 11,
                  textTransform: 'uppercase',
                  letterSpacing: 1.2,
                  color: '#78ddd9',
                  fontWeight: 700,
                }}
              >
                ⚛️ Taller de Mentes Cuánticas · Cerebro de Q-Anacleto
              </div>
              <h2 style={{ margin: '2px 0 0', fontSize: 20 }}>
                {config.titulo}
              </h2>
            </div>
          </div>

          {/* Interruptor gigante Simple / Cuántico */}
          <div
            role="group"
            aria-label="Selector de chip del cerebro"
            style={{
              display: 'flex',
              background: '#0b1030',
              padding: 4,
              borderRadius: 999,
              border: '1px solid rgba(120, 221, 217, 0.35)',
              gap: 4,
            }}
          >
            <button
              type="button"
              onClick={() => setMode('simple')}
              style={{
                padding: '8px 16px',
                borderRadius: 999,
                border: 'none',
                fontWeight: 700,
                fontSize: 13,
                background:
                  modo === 'simple'
                    ? 'linear-gradient(135deg, #ffd166, #f4a261)'
                    : 'transparent',
                color: modo === 'simple' ? '#0b1030' : 'var(--consola-tinta-2)',
              }}
            >
              📏 Chip Simple (Recta)
            </button>
            <button
              type="button"
              onClick={() => setMode('cuantico')}
              style={{
                padding: '8px 16px',
                borderRadius: 999,
                border: 'none',
                fontWeight: 700,
                fontSize: 13,
                background:
                  modo === 'cuantico'
                    ? 'linear-gradient(135deg, #78ddd9, #38bdf8)'
                    : 'transparent',
                color:
                  modo === 'cuantico' ? '#0b1030' : 'var(--consola-tinta-2)',
              }}
            >
              ⚛️ Chip Cuántico (Qiskit)
            </button>
          </div>

          <button
            type="button"
            onClick={() => setConsolaAbierta(false)}
            aria-label="Cerrar consola"
            style={{
              background: 'rgba(255,255,255,0.1)',
              color: '#fff',
              border: 'none',
              borderRadius: 999,
              padding: '6px 12px',
              fontWeight: 600,
            }}
          >
            ✕ Cerrar
          </button>
        </div>

        {/* Cuerpo en 2 columnas: Radar 2D + Panel del Chip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(270px, 330px) 1fr',
            gap: 20,
            alignItems: 'start',
          }}
        >
          {/* Columna izquierda: Radar 2D */}
          <div
            style={{
              background: '#0b1030',
              padding: 14,
              borderRadius: 18,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 8,
              }}
            >
              <span>Radar de Ejemplos</span>
              <span style={{ color: '#78ddd9' }}>
                {aciertosEj}/{totalEj} bien (
                {Math.round((resultadoEjemplos?.acierto ?? 0) * 100)}%)
              </span>
            </div>

            <RadarGelatina
              config={config}
              modo={modo}
              regla={regla}
              mapaActual={mapaActual}
              mapaAnterior={mapaAnterior}
              resultadoEjemplos={resultadoEjemplos}
              onUpdateRuler={updateRuler}
            />

            <div
              style={{
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
                fontSize: 12,
                color: 'var(--consola-tinta-2)',
                marginTop: 10,
                justifyContent: 'center',
              }}
            >
              <span>
                <strong style={{ color: '#38bdf8' }}>●</strong> {accionPos}
              </span>
              <span>
                <strong style={{ color: '#f472b6' }}>✕</strong> {accionNeg}
              </span>
              <span>😄 bien · 😱 fallo</span>
            </div>

            {meta && (
              <div
                style={{
                  marginTop: 8,
                  fontSize: 11,
                  color: '#8088b8',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                Qiskit {meta.qiskit} · {meta.simulador} · {meta.ms} ms
              </div>
            )}
          </div>

          {/* Columna derecha: Controles del Chip Simple o Chip Cuántico */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {error && (
              <div
                role="alert"
                style={{
                  background: tormentaActiva
                    ? 'linear-gradient(135deg, #6b21a8, #be185d)'
                    : 'rgba(225, 29, 72, 0.22)',
                  border: '1px solid #f43f5e',
                  color: '#ffe4e6',
                  padding: '10px 14px',
                  borderRadius: 12,
                  fontSize: 13,
                  fontWeight: 600,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>
                  {tormentaActiva ? '🌩️ ' : '⚠️ '}
                  {error}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    clearError();
                    clearTormenta();
                  }}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 700,
                  }}
                >
                  ✕
                </button>
              </div>
            )}

            {modo === 'simple' ? (
              <div
                style={{
                  background: '#0b1030',
                  padding: 16,
                  borderRadius: 18,
                  border: '1px solid rgba(255, 209, 102, 0.35)',
                }}
              >
                <h3 style={{ margin: '0 0 6px', fontSize: 16, color: '#ffd166' }}>
                  📏 Regla de Plástico (Clasificador Lineal)
                </h3>
                <p
                  style={{
                    margin: '0 0 14px',
                    fontSize: 13,
                    color: 'var(--consola-tinta-2)',
                  }}
                >
                  Arrastra o gira la regla directamente sobre el radar, o ajusta
                  los controles de abajo para intentar separar los ejemplos con
                  una línea recta.
                </p>

                <div style={{ display: 'grid', gap: 12 }}>
                  <label
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      fontSize: 13,
                    }}
                  >
                    <span>
                      Ángulo de la regla:{' '}
                      <strong>
                        {Math.round((regla.angulo * 180) / Math.PI)}°
                      </strong>
                    </span>
                    <input
                      type="range"
                      min={0}
                      max={6.283}
                      step={0.05}
                      value={regla.angulo}
                      onChange={(e) =>
                        updateRuler({ angulo: Number(e.target.value) })
                      }
                      style={{ accentColor: '#ffd166' }}
                    />
                  </label>

                  <label
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 4,
                      fontSize: 13,
                    }}
                  >
                    <span>
                      Desplazamiento:{' '}
                      <strong>{regla.desplazamiento.toFixed(2)}</strong>
                    </span>
                    <input
                      type="range"
                      min={minR - 0.8}
                      max={maxR + 0.8}
                      step={0.02}
                      value={regla.desplazamiento}
                      onChange={(e) =>
                        updateRuler({ desplazamiento: Number(e.target.value) })
                      }
                      style={{ accentColor: '#ffd166' }}
                    />
                  </label>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: '#0b1030',
                  padding: 16,
                  borderRadius: 18,
                  border: '1px solid rgba(120, 221, 217, 0.35)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 14,
                }}
              >
                {/* Barra de límite de fichas y estática NISQ (D08) */}
                {limiteFichas !== undefined && (
                  <div
                    style={{
                      background: 'rgba(139, 92, 246, 0.14)',
                      border: '1px solid rgba(167, 139, 250, 0.45)',
                      borderRadius: 12,
                      padding: '8px 12px',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 12,
                        fontWeight: 700,
                        marginBottom: 4,
                      }}
                    >
                      <span>
                        ⚡ Fichas usadas: {nFichas} / {limiteFichas}
                      </span>
                      <span style={{ color: '#c4b5fd' }}>
                        🌩️ Barra de Estática: {nivelEstatica}%
                      </span>
                    </div>
                    <div
                      style={{
                        height: 8,
                        background: '#1e1b4b',
                        borderRadius: 999,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          width: `${nivelEstatica}%`,
                          height: '100%',
                          background:
                            'linear-gradient(90deg, #8b5cf6, #ec4899, #f43f5e)',
                          transition: 'width 0.25s ease',
                        }}
                      />
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color: 'var(--consola-tinta-2)',
                        marginTop: 4,
                      }}
                    >
                      La estática es decorativa; mientras no pases el límite, el
                      robot decide siempre con el circuito real sin ruido.
                    </div>
                  </div>
                )}

                {/* Bandeja de fichas permitidas */}
                <div>
                  <div
                    style={{
                      fontSize: 12,
                      color: 'var(--consola-tinta-2)',
                      marginBottom: 6,
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span>
                      1. Elige o arrastra una ficha magnética a los cables:
                    </span>
                    {circuito.fichas.length > 0 && (
                      <button
                        type="button"
                        onClick={async () => {
                          for (const f of [...circuito.fichas]) {
                            await removeFicha(f.cable, f.pos);
                          }
                        }}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#f472b6',
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        🗑️ Vaciar cables
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {permitidas.map((fId) => {
                      const info = CATALOGO_FICHAS[fId];
                      if (!info) return null;
                      const activa = fichaSeleccionada === fId;
                      return (
                        <button
                          key={fId}
                          type="button"
                          draggable
                          onDragStart={(e) => {
                            e.dataTransfer.setData('text/plain', fId);
                            setFichaSeleccionada(fId);
                          }}
                          onClick={() => setFichaSeleccionada(fId)}
                          title={info.descripcion}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            padding: '8px 12px',
                            borderRadius: 12,
                            border: activa
                              ? `2px solid ${info.color}`
                              : '2px solid rgba(255,255,255,0.14)',
                            background: activa
                              ? 'rgba(120, 221, 217, 0.16)'
                              : '#141a3a',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: 13,
                          }}
                        >
                          <span style={{ fontSize: 17 }}>{info.icono}</span>
                          <div style={{ textAlign: 'left' }}>
                            <div>{info.nombre}</div>
                            <div
                              style={{
                                fontSize: 10,
                                color: info.color,
                                fontWeight: 600,
                              }}
                            >
                              {info.compuerta}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Tablero de 2 cables cuánticos (q0 y q1) */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 12,
                    padding: '10px 4px',
                  }}
                >
                  {[0, 1].map((cableIdx) => {
                    const nombreSensor =
                      config.sensores?.[cableIdx] ?? `Sensor ${cableIdx}`;
                    return (
                      <div
                        key={cableIdx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: `125px repeat(${ranuras}, minmax(74px, 1fr))`,
                          alignItems: 'center',
                          gap: 8,
                          position: 'relative',
                        }}
                      >
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 700,
                            color: '#78ddd9',
                            background: 'rgba(120, 221, 217, 0.1)',
                            padding: '6px 8px',
                            borderRadius: 8,
                          }}
                        >
                          <div>Cable q{cableIdx}</div>
                          <div
                            style={{
                              fontSize: 11,
                              color: 'var(--consola-tinta-2)',
                              fontWeight: 500,
                            }}
                          >
                            {nombreSensor}
                          </div>
                        </div>

                        {Array.from({ length: ranuras }, (_, posIdx) => {
                          const fichaColocada = buscarFichaEn(cableIdx, posIdx);
                          const info = fichaColocada
                            ? CATALOGO_FICHAS[fichaColocada.ficha]
                            : undefined;
                          const esGuia =
                            !primeraFichaVista &&
                            circuito.fichas.length === 0 &&
                            posIdx === 0 &&
                            cableIdx === 1;
                          const esClack =
                            ultimoClackKey?.startsWith(`${cableIdx}:${posIdx}:`) ??
                            false;

                          const tienePerilla =
                            Boolean(config.perilla_escala) &&
                            fichaColocada &&
                            (fichaColocada.ficha === 'giro_y' ||
                              fichaColocada.ficha === 'giro_z') &&
                            fichaColocada.cable === cableIdx;

                          return (
                            <div
                              key={posIdx}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => {
                                e.preventDefault();
                                const dropped = e.dataTransfer.getData(
                                  'text/plain'
                                ) as FichaId;
                                void handleColocarEnRanura(
                                  cableIdx,
                                  posIdx,
                                  dropped || undefined
                                );
                              }}
                              onClick={() =>
                                void handleColocarEnRanura(cableIdx, posIdx)
                              }
                              aria-label={`Ranura cable ${cableIdx} posición ${posIdx}`}
                              style={{
                                minHeight: config.perilla_escala ? 96 : 64,
                                borderRadius: 12,
                                border: fichaColocada
                                  ? `2px solid ${info?.color ?? '#78ddd9'}`
                                  : esGuia
                                    ? '2px dashed #ffd166'
                                    : '2px dashed rgba(185, 191, 230, 0.3)',
                                background: fichaColocada
                                  ? 'rgba(20, 26, 58, 0.95)'
                                  : esGuia
                                    ? 'rgba(255, 209, 102, 0.12)'
                                    : 'rgba(255, 255, 255, 0.03)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: 6,
                                cursor: 'pointer',
                                position: 'relative',
                                animation: esClack
                                  ? 'spark-flash 0.45s ease-out'
                                  : esGuia
                                    ? 'pulse-ring 1.6s infinite'
                                    : undefined,
                              }}
                            >
                              {fichaColocada ? (
                                <>
                                  <span style={{ fontSize: 18 }}>
                                    {info?.icono ?? '⚛️'}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: 11,
                                      fontWeight: 700,
                                      textAlign: 'center',
                                      lineHeight: 1.15,
                                    }}
                                  >
                                    {fichaColocada.ficha === 'cable_gemelo'
                                      ? fichaColocada.cable === cableIdx
                                        ? '⚡ Control CX'
                                        : '⚡ Destino CX'
                                      : info?.nombre}
                                  </span>
                                  {tienePerilla && config.perilla_escala && (
                                    <PerillaEscala
                                      cable={cableIdx}
                                      pos={posIdx}
                                      valorInicial={
                                        fichaColocada.escala ??
                                        config.codificacion?.escala ??
                                        1.5
                                      }
                                      config={config.perilla_escala}
                                      onCommit={(c, p, esc) => {
                                        void setEscala(c, p, esc);
                                      }}
                                    />
                                  )}
                                </>
                              ) : esGuia ? (
                                <span
                                  style={{
                                    fontSize: 11,
                                    color: '#ffd166',
                                    fontWeight: 700,
                                    textAlign: 'center',
                                  }}
                                >
                                  ✨ Pon Giro-Sensor aquí
                                </span>
                              ) : (
                                <span
                                  style={{
                                    fontSize: 11,
                                    color: 'rgba(185,191,230,0.45)',
                                  }}
                                >
                                  + Ranura {posIdx + 1}
                                </span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </div>

                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--consola-tinta-2)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                  }}
                >
                  <span>
                    💡 Haz clic en una ranura vacía para encajar la ficha, o en
                    una ficha colocada para quitarla.
                  </span>
                  <span>
                    Lectura del robot: qubit{' '}
                    {config.lectura?.qubits.join(',')} = &quot;
                    {config.lectura?.resultado}&quot; ➔{' '}
                    <strong>{accionPos}</strong>
                  </span>
                </div>
              </div>
            )}

            {/* Botón principal de acción */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 12,
                marginTop: 4,
              }}
            >
              <button
                type="button"
                onClick={() => void handleProbarOtraVez()}
                style={{
                  padding: '12px 24px',
                  borderRadius: 999,
                  border: 'none',
                  background: 'linear-gradient(135deg, #2dd4bf, #0ea5e9)',
                  color: '#0b1030',
                  fontWeight: 800,
                  fontSize: 15,
                  boxShadow: '0 8px 24px rgba(45, 212, 191, 0.35)',
                }}
              >
                ▶ ¡Prueba otra vez en la cinta!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
