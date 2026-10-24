import React, { useEffect, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, OrbitControls } from '@react-three/drei';
import { hasMinigame } from '../content/catalog';
import { useGameStore } from '../state/store';
import { CasaDiorama } from './models/CasaDiorama';
import { ParqueDiorama } from './models/ParqueDiorama';
import { RobotQAnacleto } from './models/RobotQAnacleto';
import { RobotQBoby } from './models/RobotQBoby';
import { buildOutcomeSteps } from './outcome';

const StationBadge: React.FC<{
  position: [number, number, number];
  titulo: string;
  activo: boolean;
  onClick: () => void;
}> = ({ position, titulo, activo, onClick }) => (
  <Html position={position} center zIndexRange={[10, 0]}>
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '6px 12px',
        borderRadius: 999,
        border: activo ? '2px solid #0284c7' : '1.5px solid #243B53',
        background: activo ? '#B9D8F2' : 'rgba(255, 255, 255, 0.94)',
        color: '#243B53',
        fontWeight: 800,
        fontSize: 12,
        whiteSpace: 'nowrap',
        boxShadow: activo
          ? '0 6px 18px rgba(2, 132, 199, 0.35)'
          : '0 4px 12px rgba(0, 0, 0, 0.15)',
        cursor: 'pointer',
        transform: activo ? 'scale(1.05)' : 'none',
        transition: 'all 0.2s ease',
      }}
    >
      {activo ? '📍 ' : ''}
      {titulo}
    </button>
  </Html>
);

export const World: React.FC = () => {
  const {
    escena,
    minijuegoId,
    config,
    ultimoResultado,
    estado,
    nuevoDesastre,
    loadMinigame,
    setScene,
  } = useGameStore();

  const steps = useMemo(
    () => buildOutcomeSteps(config, ultimoResultado),
    [config, ultimoResultado]
  );
  const visibleSteps = steps.slice(0, 8);

  const [activeIdx, setActiveIdx] = useState<number>(-1);

  useEffect(() => {
    if (!ultimoResultado || visibleSteps.length === 0) {
      setActiveIdx(-1);
      return;
    }
    setActiveIdx(0);
    const interval = setInterval(() => {
      setActiveIdx((prev) => {
        if (prev + 1 >= visibleSteps.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 280);
    return () => clearInterval(interval);
  }, [ultimoResultado, visibleSteps.length]);

  const algunFallo =
    ultimoResultado?.predicciones.some((p) => !p.correcto) ?? false;

  const estadoBoby: 'normal' | 'feliz' | 'rana' | 'dormido' =
    estado === 'ganado'
      ? 'feliz'
      : nuevoDesastre?.id === 'barro'
        ? 'dormido'
        : nuevoDesastre
          ? 'rana'
          : 'normal';

  // Posición dinámica de Q-Anacleto dentro de la casa según la habitación
  const posRobotCasa: [number, number, number] =
    minijuegoId === 'pelusa'
      ? [-3.3, 0.3, 2.1] // Sala junto al sofá lila
      : minijuegoId === 'fregadero'
        ? [2.2, 0.3, 0.3] // Cocina frente al fregadero
        : minijuegoId === 'chef'
          ? [3.8, 0.3, 0.3] // Cocina junto a los fogones
          : minijuegoId === 'lavanderia'
            ? [4.9, 0.3, -2.6] // Lavandería junto a las lavadoras
            : [-1.2, 0.3, 1.2]; // Hall central

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        orthographic
        camera={{ zoom: 48, position: [14, 13, 14], near: -100, far: 100 }}
        style={{ background: '#FAF8F2' }}
      >
        {/* Iluminación solar cálida idéntica al render isométrico 3D */}
        <ambientLight intensity={0.95} color="#fff8e7" />
        <directionalLight
          position={[12, 22, 10]}
          intensity={1.2}
          color="#fffdf5"
          castShadow
        />
        <directionalLight
          position={[-10, 15, -10]}
          intensity={0.4}
          color="#93c5fd"
        />

        <OrbitControls
          enablePan={false}
          minZoom={32}
          maxZoom={75}
          maxPolarAngle={Math.PI / 2.3}
          minPolarAngle={Math.PI / 6}
        />

        {escena === 'casa' ? (
          <group>
            {/* Diorama completo de la casa con todas las habitaciones de casa_isometrica.jpg */}
            <CasaDiorama />

            {/* Estación 1.1: Sala de estar (Pelusa Rebelde) */}
            <StationBadge
              position={[-3.3, 1.8, 2.1]}
              titulo="1.1 Sala: Pelusa Rebelde"
              activo={minijuegoId === 'pelusa'}
              onClick={() => loadMinigame('pelusa')}
            />

            {/* Estación 1.2: Cocina (Fregadero Cuántico) */}
            <StationBadge
              position={[2.0, 1.9, -0.6]}
              titulo="1.2 Cocina: Fregadero"
              activo={minijuegoId === 'fregadero'}
              onClick={() => loadMinigame('fregadero')}
            />

            {/* Estación 1.3: Cocina (Chef Catástrofe) */}
            {hasMinigame('chef') && (
              <StationBadge
                position={[4.0, 1.9, 0.3]}
                titulo="1.3 Cocina: Chef Catástrofe"
                activo={minijuegoId === 'chef'}
                onClick={() => loadMinigame('chef')}
              />
            )}

            {/* Estación 1.4: Lavandería en Remolino */}
            {hasMinigame('lavanderia') && (
              <StationBadge
                position={[5.0, 1.9, -2.6]}
                titulo="1.4 Lavandería en Remolino"
                activo={minijuegoId === 'lavanderia'}
                onClick={() => loadMinigame('lavanderia')}
              />
            )}

            {/* Puerta de salida al Parque de Q-Boby */}
            <StationBadge
              position={[0.4, 1.8, 5.2]}
              titulo="🌳 Salir al Parque de Q-Boby ➔"
              activo={false}
              onClick={() => setScene('parque')}
            />

            {/* Robot Q-Anacleto (Modelo oficial con pantalla LED cian y mochila) */}
            <RobotQAnacleto
              position={posRobotCasa}
              enDesastre={algunFallo}
              scale={1.15}
            />
          </group>
        ) : (
          <group>
            {/* Diorama completo del parque para Q-Boby (Nivel 2) */}
            <ParqueDiorama />

            {/* Estación 2.2: El Misterio del Doble Hueso (QAE) */}
            <StationBadge
              position={[-3.2, 1.8, -1.8]}
              titulo="2.2 ⭐ Doble Hueso (QAE)"
              activo={minijuegoId === 'doble-hueso'}
              onClick={() => loadMinigame('doble-hueso')}
            />

            {/* Estación 2.1: Escuela de Trucos */}
            {hasMinigame('trucos') && (
              <StationBadge
                position={[-3.4, 1.6, 2.2]}
                titulo="2.1 Trucos (Parameter-Shift)"
                activo={minijuegoId === 'trucos'}
                onClick={() => loadMinigame('trucos')}
              />
            )}

            {/* Estación 2.3: Pista Láser-Musical */}
            {hasMinigame('pista') && (
              <StationBadge
                position={[3.2, 1.6, -1.8]}
                titulo="2.3 Pista Láser-Musical"
                activo={minijuegoId === 'pista'}
                onClick={() => loadMinigame('pista')}
              />
            )}

            {/* Estación 2.4: La Gran Copa del Parque */}
            {hasMinigame('copa') && (
              <StationBadge
                position={[3.3, 1.7, 2.2]}
                titulo="2.4 ⭐⭐⭐ Gran Copa Canina"
                activo={minijuegoId === 'copa'}
                onClick={() => loadMinigame('copa')}
              />
            )}

            {/* Salida de regreso a la Casa */}
            <StationBadge
              position={[0, 1.4, 4.8]}
              titulo="🏠 Regresar a la Casa de Q-Anacleto ➔"
              activo={false}
              onClick={() => setScene('casa')}
            />

            {/* Robot Q-Boby (Cyber-corgi oficial con pantalla CRT pixel y cola neón) */}
            <RobotQBoby
              position={[0, 0.22, 0.2]}
              estado={estadoBoby}
              scale={1.25}
            />
          </group>
        )}

        {/* Cinta de objetos de prueba y predicciones animadas */}
        {visibleSteps.length > 0 && (
          <group position={[0, 0.75, 3.2]}>
            {visibleSteps.map((step, idx) => {
              const xPos = (idx - (visibleSteps.length - 1) / 2) * 1.15;
              const mostrado = ultimoResultado && idx <= activeIdx;
              return (
                <Html
                  key={step.id}
                  position={[xPos, 0, 0]}
                  center
                  zIndexRange={[10, 0]}
                >
                  <div
                    style={{
                      background: mostrado
                        ? step.correcto
                          ? '#dcfce7'
                          : '#ffe4e6'
                        : 'rgba(255,255,255,0.95)',
                      border: mostrado
                        ? step.correcto
                          ? '2px solid #16a34a'
                          : '2px solid #e11d48'
                        : '1.5px solid #94a3b8',
                      borderRadius: 12,
                      padding: '4px 8px',
                      textAlign: 'center',
                      minWidth: 64,
                      boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                      transform:
                        mostrado && !step.correcto
                          ? 'rotate(-8deg) scale(1.08)'
                          : 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <div style={{ fontSize: 18 }}>{step.emoji}</div>
                    <div
                      style={{
                        fontSize: 10,
                        fontWeight: 800,
                        textTransform: 'uppercase',
                        color: '#243B53',
                      }}
                    >
                      {mostrado ? (
                        <>
                          {step.prediccion} {step.correcto ? '✓' : '💥'}
                        </>
                      ) : (
                        step.objeto
                      )}
                    </div>
                  </div>
                </Html>
              );
            })}
          </group>
        )}
      </Canvas>
    </div>
  );
};
