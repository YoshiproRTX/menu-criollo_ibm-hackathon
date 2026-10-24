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
                        {/* Miniatura visual del entorno y personaje */}
                        <div
                          style={{
                            height: 68,
                            borderRadius: 10,
                            overflow: 'hidden',
                            position: 'relative',
                            margin: '6px 0',
                            background: '#0b1030',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '0 8px',
                          }}
                        >
                          <img
                            src={
                              id === 'pelusa'
                                ? '/assets/images/sala_cozy.jpg'
                                : id === 'lavanderia'
                                  ? '/assets/images/lavanderia_cozy.jpg'
                                  : id === 'fregadero' || id === 'chef'
                                    ? '/assets/images/comedor_cocina.jpg'
                                    : '/assets/images/casa_isometrica.jpg'
                            }
                            alt="Entorno"
                            style={{
                              position: 'absolute',
                              inset: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              opacity: 0.5,
                            }}
                          />
                          <span
                            style={{
                              position: 'relative',
                              zIndex: 2,
                              color: '#fff',
                              fontSize: 10,
                              fontWeight: 800,
                            }}
                          >
                            {cfg.cromo.concepto}
                          </span>
                          <img
                            src={
                              ['doble-hueso', 'trucos', 'pista', 'copa'].includes(id)
                                ? '/assets/images/qboby_avatar.png'
                                : '/assets/images/qanacleto_avatar.png'
                            }
                            alt="Avatar"
                            style={{
                              position: 'relative',
                              zIndex: 2,
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              border: '1.5px solid #fff',
                            }}
                          />
                        </div>

                        <div
                          style={{
                            fontWeight: 800,
                            fontSize: 14,
                            marginBottom: 2,
                          }}
                        >
                          {cfg.cromo.titulo}
                        </div>
                        <div style={{ fontSize: 11.5, opacity: 0.85 }}>
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
