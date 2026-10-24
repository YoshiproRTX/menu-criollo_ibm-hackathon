import React, { useState } from 'react';
import {
  getMinigameConfig,
  MINIGAME_ORDER,
} from '../../content/catalog';
import { useGameStore } from '../../state/store';

export const AlbumModal: React.FC = () => {
  const {
    albumAbierto,
    setAlbumAbierto,
    cromosGuardados,
    desastresVistos,
    loadMinigame,
  } = useGameStore();

  const [pestana, setPestana] = useState<'cromos' | 'desastres'>('cromos');

  if (!albumAbierto) return null;

  const listaDesastres = Object.values(desastresVistos);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 75,
        background: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          width: 'min(760px, 95vw)',
          maxHeight: '88vh',
          overflowY: 'auto',
          background: 'var(--color-blanco-calido)',
          color: 'var(--color-azul-tinta)',
          borderRadius: 24,
          border: '2px solid var(--color-azul-pastel)',
          boxShadow: '0 24px 64px rgba(0, 0, 0, 0.45)',
          padding: '20px 24px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--color-azul-grisaceo)',
            paddingBottom: 12,
            marginBottom: 16,
          }}
        >
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <h2 style={{ margin: 0, fontSize: 20 }}>
              📖 Álbum de Villa Qubit
            </h2>
            <div
              style={{
                display: 'flex',
                background: 'var(--color-azul-grisaceo)',
                padding: 3,
                borderRadius: 999,
              }}
            >
              <button
                type="button"
                onClick={() => setPestana('cromos')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  border: 'none',
                  fontWeight: 700,
                  fontSize: 13,
                  background:
                    pestana === 'cromos'
                      ? 'var(--color-azul-tinta)'
                      : 'transparent',
                  color:
                    pestana === 'cromos' ? '#fff' : 'var(--color-azul-tinta)',
                }}
              >
                🏆 Cromos ({Object.keys(cromosGuardados).length}/
                {MINIGAME_ORDER.length})
              </button>
              <button
                type="button"
                onClick={() => setPestana('desastres')}
                style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  border: 'none',
                  fontWeight: 700,
                  fontSize: 13,
                  background:
                    pestana === 'desastres'
                      ? 'var(--color-azul-tinta)'
                      : 'transparent',
                  color:
                    pestana === 'desastres'
                      ? '#fff'
                      : 'var(--color-azul-tinta)',
                }}
              >
                💥 Desastres ({listaDesastres.length})
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAlbumAbierto(false)}
            style={{
              background: 'var(--color-azul-grisaceo)',
              border: 'none',
              borderRadius: 999,
              padding: '6px 12px',
              fontWeight: 700,
            }}
          >
            ✕ Cerrar
          </button>
        </div>

        {pestana === 'cromos' ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(210px, 1fr))',
              gap: 14,
            }}
          >
            {MINIGAME_ORDER.map((id) => {
              const cfg = getMinigameConfig(id);
              const obtenido = cromosGuardados[id];
              return (
                <div
                  key={id}
                  style={{
                    borderRadius: 16,
                    padding: 14,
                    border: obtenido
                      ? '2px solid #0284c7'
                      : '2px dashed var(--color-azul-grisaceo)',
                    background: obtenido ? '#ffffff' : 'rgba(222, 231, 237, 0.4)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 11,
                        fontWeight: 700,
                        marginBottom: 4,
                      }}
                    >
                      <span>{cfg?.titulo ?? id}</span>
                      {obtenido && (
                        <span
                          style={{
                            color: '#0284c7',
                            textTransform: 'uppercase',
                          }}
                        >
                          ★ {obtenido.rareza}
                        </span>
                      )}
                    </div>
                    {obtenido && cfg ? (
                      <>
                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: 15,
                            marginBottom: 4,
                          }}
                        >
                          {cfg.cromo.titulo}
                        </div>
                        <div style={{ fontSize: 12, opacity: 0.85 }}>
                          {cfg.cromo.lineas[0]}
                        </div>
                      </>
                    ) : (
                      <div
                        style={{
                          padding: '16px 0',
                          textAlign: 'center',
                          fontSize: 13,
                          opacity: 0.6,
                        }}
                      >
                        🔒 Silueta misteriosa
                      </div>
                    )}
                  </div>

                  {cfg && (
                    <button
                      type="button"
                      onClick={() => {
                        setAlbumAbierto(false);
                        loadMinigame(id);
                      }}
                      style={{
                        padding: '6px 10px',
                        borderRadius: 999,
                        border: '1px solid var(--color-azul-pastel)',
                        background: 'var(--color-azul-pastel)',
                        color: 'var(--color-azul-tinta)',
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      Ir a estación ➔
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        ) : listaDesastres.length === 0 ? (
          <div
            style={{
              padding: 36,
              textAlign: 'center',
              fontSize: 14,
              opacity: 0.75,
            }}
          >
            Aún no has provocado ningún desastre cómico. ¡Pulsa «¡Hazlo!» con el
            chip simple para coleccionar el primero!
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
              gap: 12,
            }}
          >
            {listaDesastres.map((d) => (
              <div
                key={d.id}
                style={{
                  background: '#fff',
                  border: '2px solid var(--color-melocoton-suave)',
                  borderRadius: 16,
                  padding: 14,
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: '#c2410c',
                    textTransform: 'uppercase',
                    marginBottom: 4,
                  }}
                >
                  💥 {d.minijuegoId} · {d.id}
                </div>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{d.texto}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
