import React, { useEffect, useState } from 'react';
import { getHealth, type HealthResponse } from '../api';
import {
  getMinigameConfig,
  getOrderedAvailableMinigameIds,
} from '../content/catalog';
import { useGameStore } from '../state/store';
import { Level2Host } from './Level2Host';

export const Hud: React.FC = () => {
  const {
    escena,
    minijuegoId,
    config,
    modo,
    ultimoResultado,
    nuevoDesastre,
    clearNuevoDesastre,
    setConsolaAbierta,
    setAlbumAbierto,
    loadMinigame,
    setScene,
    runTask,
    win,
    registerDisaster,
    chispaSay,
    cromosGuardados,
    desastresVistos,
  } = useGameStore();

  const [health, setHealth] = useState<HealthResponse>({
    ok: true,
    qiskit: '...',
  });
  const [mostrarNota, setMostrarNota] = useState(true);

  useEffect(() => {
    getHealth().then(setHealth);
  }, []);

  // Nota adhesiva de ~1.5s al cargar un minijuego (no bloquea)
  useEffect(() => {
    setMostrarNota(true);
    const timer = setTimeout(() => setMostrarNota(false), 2000);
    return () => clearTimeout(timer);
  }, [minijuegoId]);

  const disponibles = getOrderedAvailableMinigameIds();
  const estrellas = '⭐'.repeat(Math.max(1, Math.min(3, config.dificultad || 1)));
  const esClasificacion = (config.tipo ?? 'clasificacion') === 'clasificacion';
  const nombreRobot = escena === 'parque' ? 'Q-Boby' : 'Q-Anacleto';

  const listaObjetosNota = Object.entries(config.objetos ?? {}).slice(0, 3);

  return (
    <>
      {/* Barra superior del HUD */}
      <header
        style={{
          position: 'fixed',
          top: 12,
          left: 14,
          right: 14,
          zIndex: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
          flexWrap: 'wrap',
          pointerEvents: 'none',
        }}
      >
        {/* Bloque izquierdo: Selector de escenario y estaciones disponibles */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
            background: 'rgba(255, 255, 255, 0.92)',
            padding: '8px 12px',
            borderRadius: 18,
            border: '2px solid var(--color-azul-pastel)',
            boxShadow: '0 8px 24px rgba(36, 59, 83, 0.1)',
            pointerEvents: 'auto',
          }}
        >
          <button
            type="button"
            onClick={() => setScene('casa')}
            style={{
              padding: '6px 12px',
              borderRadius: 999,
              border: 'none',
              fontWeight: 800,
              fontSize: 12.5,
              background:
                escena === 'casa' ? 'var(--color-azul-tinta)' : 'transparent',
              color: escena === 'casa' ? '#fff' : 'var(--color-azul-tinta)',
            }}
          >
            🏠 Casa (Nivel 1)
          </button>
          <button
            type="button"
            onClick={() => setScene('parque')}
            style={{
              padding: '6px 12px',
              borderRadius: 999,
              border: 'none',
              fontWeight: 800,
              fontSize: 12.5,
              background:
                escena === 'parque' ? 'var(--color-azul-tinta)' : 'transparent',
              color: escena === 'parque' ? '#fff' : 'var(--color-azul-tinta)',
            }}
          >
            🌳 Parque (Nivel 2)
          </button>

          <span style={{ opacity: 0.3 }}>|</span>

          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {disponibles.map((id) => {
              const cfg = getMinigameConfig(id);
              if (!cfg) return null;
              const activo = id === minijuegoId;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => loadMinigame(id)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 999,
                    border: activo
                      ? '2px solid #0284c7'
                      : '1px solid var(--color-azul-grisaceo)',
                    background: activo
                      ? 'var(--color-azul-pastel)'
                      : 'var(--color-blanco-calido)',
                    color: 'var(--color-azul-tinta)',
                    fontSize: 11.5,
                    fontWeight: activo ? 800 : 600,
                  }}
                >
                  {cfg.id}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bloque derecho: Info de minijuego, Acierto, Abrir Cerebro y Álbum */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
            background: 'rgba(255, 255, 255, 0.92)',
            padding: '8px 14px',
            borderRadius: 18,
            border: '2px solid var(--color-azul-pastel)',
            boxShadow: '0 8px 24px rgba(36, 59, 83, 0.1)',
            pointerEvents: 'auto',
          }}
        >
          <div>
            <div style={{ fontSize: 13, fontWeight: 800 }}>
              {config.titulo}{' '}
              <span title="Dificultad fija informativa">{estrellas}</span>
            </div>
            <div style={{ fontSize: 11.5, opacity: 0.85 }}>
              Chip:{' '}
              <strong>
                {modo === 'simple' ? '📏 Simple' : '⚛️ Cuántico'}
              </strong>{' '}
              · Último acierto:{' '}
              <strong>
                {ultimoResultado
                  ? `${Math.round(ultimoResultado.acierto * 100)}%`
                  : '—'}
              </strong>
            </div>
          </div>

          {esClasificacion && (
            <button
              type="button"
              onClick={() => setConsolaAbierta(true)}
              style={{
                padding: '8px 14px',
                borderRadius: 999,
                border: '2px solid #0b1030',
                background: 'linear-gradient(135deg, #78DDD9, #B9D8F2)',
                color: '#0b1030',
                fontWeight: 800,
                fontSize: 13,
              }}
            >
              🧠 Abrir Cerebro
            </button>
          )}

          <button
            type="button"
            onClick={() => setAlbumAbierto(true)}
            style={{
              padding: '8px 14px',
              borderRadius: 999,
              border: '1px solid var(--color-azul-tinta)',
              background: 'var(--color-blanco-calido)',
              color: 'var(--color-azul-tinta)',
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            📖 Álbum ({Object.keys(cromosGuardados).length}🏆 ·{' '}
            {Object.keys(desastresVistos).length}💥)
          </button>
        </div>
      </header>

      {/* Nota adhesiva ilustrada (~1.5s al cargar un minijuego, no bloquea) */}
      {mostrarNota && listaObjetosNota.length > 0 && (
        <div
          style={{
            position: 'fixed',
            top: 84,
            left: 20,
            zIndex: 25,
            background: '#fef9c3',
            border: '2px solid #facc15',
            borderRadius: 14,
            padding: '10px 16px',
            boxShadow: '0 10px 24px rgba(0,0,0,0.12)',
            transform: 'rotate(-1.5deg)',
            pointerEvents: 'none',
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: '#854d0e',
              textTransform: 'uppercase',
              marginBottom: 4,
            }}
          >
            📌 Nota adhesiva · Regla de hoy
          </div>
          {listaObjetosNota.map(([nombre, obj]) => (
            <div
              key={nombre}
              style={{ fontSize: 13.5, fontWeight: 700, color: '#422006' }}
            >
              {obj.emoji} {nombre} ➔{' '}
              <span style={{ textTransform: 'uppercase' }}>{obj.accion}</span>
            </div>
          ))}
        </div>
      )}

      {/* Aviso de "¡Nuevo desastre!" y cartel cómico del último fallo */}
      {nuevoDesastre && (
        <div
          role="status"
          onClick={clearNuevoDesastre}
          style={{
            position: 'fixed',
            top: 86,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 45,
            maxWidth: 'min(520px, 92vw)',
            background: '#fff1f2',
            border: '3px solid #f43f5e',
            borderRadius: 20,
            padding: '12px 20px',
            boxShadow: '0 16px 40px rgba(244, 63, 94, 0.28)',
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          <div
            style={{
              fontSize: 12,
              fontWeight: 900,
              color: '#e11d48',
              textTransform: 'uppercase',
              letterSpacing: 0.8,
            }}
          >
            💥 ¡Nuevo desastre desbloqueado en el álbum!
          </div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 700,
              color: 'var(--color-azul-tinta)',
              marginTop: 4,
            }}
          >
            {nuevoDesastre.texto}
          </div>
        </div>
      )}

      {/* Montaje de pantallas propias del Nivel 2 (2.2 Doble Hueso y 2.1 Trucos) */}
      {!esClasificacion && (
        <Level2Host
          config={config}
          onWin={(circuito) => {
            void win(circuito);
          }}
          onDisaster={(desastreId) => {
            registerDisaster(desastreId);
          }}
          chispaSay={(texto) => {
            chispaSay(texto);
          }}
        />
      )}

      {/* Botón principal de ejecución en la esquina inferior derecha */}
      <div
        style={{
          position: 'fixed',
          bottom: 18,
          right: 18,
          zIndex: 35,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 8,
        }}
      >
        {esClasificacion && (
          <button
            type="button"
            onClick={() => void runTask()}
            style={{
              padding: '14px 24px',
              borderRadius: 999,
              border: '3px solid var(--color-azul-tinta)',
              background: 'linear-gradient(135deg, #ffd166, #f2b79e)',
              color: 'var(--color-azul-tinta)',
              fontWeight: 900,
              fontSize: 16,
              boxShadow: '0 10px 28px rgba(36, 59, 83, 0.22)',
            }}
          >
            ▶ ¡Hazlo, {nombreRobot}!
          </button>
        )}

        <div
          style={{
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '4px 12px',
            borderRadius: 999,
            fontSize: 11.5,
            fontWeight: 700,
            border: '1px solid var(--color-azul-grisaceo)',
          }}
        >
          ⚛️ Qiskit: {health.qiskit}
        </div>
      </div>
    </>
  );
};
