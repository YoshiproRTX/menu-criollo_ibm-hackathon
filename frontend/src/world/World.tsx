import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Html, OrbitControls, RoundedBox } from '@react-three/drei';
import type * as THREE from 'three';
import { hasMinigame } from '../content/catalog';
import { useGameStore } from '../state/store';
import { buildOutcomeSteps } from './outcome';

const RobotQAnacleto: React.FC<{
  position: [number, number, number];
  carita: '(^‿^)' | 'O_o' | '@_@';
  enDesastre: boolean;
}> = ({ position, carita, enDesastre }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.y =
      position[1] +
      (enDesastre ? Math.abs(Math.sin(t * 12)) * 0.45 : Math.sin(t * 3) * 0.05);
    groupRef.current.rotation.y = enDesastre
      ? t * 6
      : Math.sin(t * 1.5) * 0.15;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Torso satinado */}
      <RoundedBox args={[0.7, 0.9, 0.5]} radius={0.12} position={[0, 0.65, 0]}>
        <meshStandardMaterial color="#DEE7ED" />
      </RoundedBox>
      {/* Placa pecho azul pastel */}
      <RoundedBox args={[0.5, 0.45, 0.54]} radius={0.06} position={[0, 0.7, 0]}>
        <meshStandardMaterial color="#B9D8F2" />
      </RoundedBox>
      {/* Cabeza con pantalla LED */}
      <RoundedBox args={[0.62, 0.48, 0.48]} radius={0.1} position={[0, 1.4, 0]}>
        <meshStandardMaterial color="#DEE7ED" />
      </RoundedBox>
      <RoundedBox args={[0.5, 0.34, 0.5]} radius={0.06} position={[0, 1.4, 0.02]}>
        <meshStandardMaterial color="#0b1030" />
      </RoundedBox>
      {/* Antena cian */}
      <mesh position={[0, 1.78, 0]}>
        <sphereGeometry args={[0.09, 16, 16]} />
        <meshStandardMaterial
          color={enDesastre ? '#f43f5e' : '#78DDD9'}
          emissive={enDesastre ? '#f43f5e' : '#78DDD9'}
          emissiveIntensity={0.6}
        />
      </mesh>
      {/* Guantes amarillos */}
      <mesh position={[-0.5, 0.65, 0.15]}>
        <sphereGeometry args={[0.14, 14, 14]} />
        <meshStandardMaterial color="#ffd166" />
      </mesh>
      <mesh position={[0.5, 0.65, 0.15]}>
        <sphereGeometry args={[0.14, 14, 14]} />
        <meshStandardMaterial color="#ffd166" />
      </mesh>
      {/* Cara LED flotante */}
      <Html position={[0, 1.42, 0.3]} center zIndexRange={[10, 0]}>
        <div
          style={{
            background: '#0b1030',
            color: enDesastre ? '#fb7185' : '#78DDD9',
            padding: '2px 7px',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 900,
            fontFamily: 'monospace',
            border: '1px solid #78DDD9',
            whiteSpace: 'nowrap',
          }}
        >
          {carita}
        </div>
      </Html>
    </group>
  );
};

const RobotQBoby: React.FC<{
  position: [number, number, number];
  estado: 'normal' | 'feliz' | 'rana' | 'dormido';
}> = ({ position, estado }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    groupRef.current.position.y =
      position[1] +
      (estado === 'feliz'
        ? Math.abs(Math.sin(t * 8)) * 0.35
        : Math.sin(t * 2.5) * 0.04);
  });

  const cara =
    estado === 'feliz'
      ? '🐶 (^ᴥ^)'
      : estado === 'rana'
        ? '🐸 (@ᴥ@)'
        : estado === 'dormido'
          ? '💤 (-ᴥ-)'
          : '🐶 (•ᴥ•)';

  return (
    <group ref={groupRef} position={position}>
      {/* Cuerpo corgi metálico */}
      <RoundedBox args={[0.85, 0.48, 0.48]} radius={0.14} position={[0, 0.42, 0]}>
        <meshStandardMaterial color="#DEE7ED" />
      </RoundedBox>
      {/* Cabeza */}
      <RoundedBox args={[0.52, 0.46, 0.46]} radius={0.12} position={[0.38, 0.78, 0]}>
        <meshStandardMaterial color="#B9D8F2" />
      </RoundedBox>
      {/* Orejas magnéticas flotantes */}
      <RoundedBox
        args={[0.14, 0.28, 0.18]}
        radius={0.05}
        position={[0.38, 1.12, 0.24]}
        rotation={[0.2, 0, estado === 'rana' ? 0.5 : -0.15]}
      >
        <meshStandardMaterial color="#243B53" />
      </RoundedBox>
      <RoundedBox
        args={[0.14, 0.28, 0.18]}
        radius={0.05}
        position={[0.38, 1.12, -0.24]}
        rotation={[-0.2, 0, estado === 'rana' ? -0.4 : 0.15]}
      >
        <meshStandardMaterial color="#243B53" />
      </RoundedBox>
      {/* Cola-antena luminosa */}
      <mesh position={[-0.5, 0.75, 0]}>
        <sphereGeometry args={[0.11, 14, 14]} />
        <meshStandardMaterial
          color={estado === 'feliz' ? '#ffd166' : '#78DDD9'}
          emissive={estado === 'feliz' ? '#ffd166' : '#78DDD9'}
          emissiveIntensity={0.7}
        />
      </mesh>
      <Html position={[0.42, 1.28, 0]} center zIndexRange={[10, 0]}>
        <div
          style={{
            background: '#0b1030',
            color: '#78DDD9',
            padding: '2px 8px',
            borderRadius: 8,
            fontSize: 12,
            fontWeight: 800,
            border: '1px solid #78DDD9',
            whiteSpace: 'nowrap',
          }}
        >
          {cara}
        </div>
      </Html>
    </group>
  );
};

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
        padding: '5px 11px',
        borderRadius: 999,
        border: activo ? '2px solid #0284c7' : '1.5px solid #243B53',
        background: activo ? '#B9D8F2' : 'rgba(255,255,255,0.92)',
        color: '#243B53',
        fontWeight: 800,
        fontSize: 11.5,
        whiteSpace: 'nowrap',
        boxShadow: '0 4px 12px rgba(0,0,0,0.12)',
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

  // Anima playOutcome recorriendo las predicciones (~300 ms por objeto)
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
  const caritaAnacleto: '(^‿^)' | 'O_o' | '@_@' =
    estado === 'ganado'
      ? '(^‿^)'
      : algunFallo
        ? '@_@'
        : 'O_o';

  const estadoBoby: 'normal' | 'feliz' | 'rana' | 'dormido' =
    estado === 'ganado'
      ? 'feliz'
      : nuevoDesastre?.id === 'barro'
        ? 'dormido'
        : nuevoDesastre
          ? 'rana'
          : 'normal';

  const posRobotCasa: [number, number, number] =
    minijuegoId === 'pelusa'
      ? [-2.8, 0.2, 1.8]
      : minijuegoId === 'lavanderia'
        ? [-3.0, 0.2, -2.0]
        : [1.8, 0.2, -0.8];

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        orthographic
        camera={{ zoom: 56, position: [12, 11, 12], near: -100, far: 100 }}
        style={{ background: 'var(--color-blanco-calido)' }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 18, 8]} intensity={0.95} />
        <OrbitControls
          enablePan={false}
          minZoom={38}
          maxZoom={85}
          maxPolarAngle={Math.PI / 2.3}
          minPolarAngle={Math.PI / 6}
        />

        {escena === 'casa' ? (
          <group>
            {/* Base general de la casa isométrica */}
            <RoundedBox
              args={[11.5, 0.35, 9.5]}
              radius={0.1}
              position={[0, -0.2, 0]}
            >
              <meshStandardMaterial color="#e6dec8" />
            </RoundedBox>

            {/* 1. SALA (1.1 Pelusa Rebelde) */}
            <group position={[-3.0, 0, 2.0]}>
              <RoundedBox args={[4.6, 0.16, 4.0]} radius={0.05} position={[0, 0, 0]}>
                <meshStandardMaterial color="#f3ead8" />
              </RoundedBox>
              {/* Alfombra cálida */}
              <RoundedBox args={[2.6, 0.06, 2.0]} radius={0.03} position={[0, 0.1, 0]}>
                <meshStandardMaterial color="#F2B79E" />
              </RoundedBox>
              {/* Sofá verde salvia */}
              <RoundedBox
                args={[2.2, 0.65, 0.85]}
                radius={0.12}
                position={[0, 0.4, -1.2]}
              >
                <meshStandardMaterial color="#B8CDBB" />
              </RoundedBox>
              <StationBadge
                position={[0, 1.45, 0]}
                titulo="1.1 Sala: Pelusa Rebelde"
                activo={minijuegoId === 'pelusa'}
                onClick={() => loadMinigame('pelusa')}
              />
            </group>

            {/* 2. COCINA (1.2 Fregadero y 1.3 Chef) */}
            <group position={[2.6, 0, -1.6]}>
              <RoundedBox args={[5.2, 0.16, 4.6]} radius={0.05} position={[0, 0, 0]}>
                <meshStandardMaterial color="#FAF8F2" />
              </RoundedBox>
              {/* Alacenas y fregadero azul pastel */}
              <RoundedBox
                args={[4.2, 1.1, 0.9]}
                radius={0.08}
                position={[0, 0.6, -1.6]}
              >
                <meshStandardMaterial color="#B9D8F2" />
              </RoundedBox>
              {/* Isla / Cinta transportadora */}
              <RoundedBox
                args={[3.8, 0.55, 1.1]}
                radius={0.08}
                position={[0, 0.35, 0.5]}
              >
                <meshStandardMaterial color="#DEE7ED" />
              </RoundedBox>
              <StationBadge
                position={[-1.1, 1.65, -1.2]}
                titulo="1.2 Cocina: Fregadero"
                activo={minijuegoId === 'fregadero'}
                onClick={() => loadMinigame('fregadero')}
              />
              {hasMinigame('chef') && (
                <StationBadge
                  position={[1.3, 1.65, -1.2]}
                  titulo="1.3 Cocina: Chef Catástrofe"
                  activo={minijuegoId === 'chef'}
                  onClick={() => loadMinigame('chef')}
                />
              )}
            </group>

            {/* 3. LAVANDERÍA (1.4 Lavandería en Remolino) */}
            <group position={[-3.2, 0, -2.4]}>
              <RoundedBox args={[3.8, 0.16, 3.4]} radius={0.05} position={[0, 0, 0]}>
                <meshStandardMaterial color="#DEE7ED" />
              </RoundedBox>
              {/* Lavadora */}
              <RoundedBox
                args={[1.1, 1.25, 1.0]}
                radius={0.1}
                position={[-0.8, 0.7, -0.8]}
              >
                <meshStandardMaterial color="#ffffff" />
              </RoundedBox>
              <mesh position={[-0.8, 0.7, -0.28]}>
                <cylinderGeometry args={[0.34, 0.34, 0.08, 24]} />
                <meshStandardMaterial color="#78DDD9" />
              </mesh>
              {hasMinigame('lavanderia') && (
                <StationBadge
                  position={[-0.5, 1.75, -0.6]}
                  titulo="1.4 Lavandería en Remolino"
                  activo={minijuegoId === 'lavanderia'}
                  onClick={() => loadMinigame('lavanderia')}
                />
              )}
            </group>

            {/* 4. BAÑO Y HABITACIÓN (decorativos para completar la casa) */}
            <group position={[2.8, 0, 2.4]}>
              <RoundedBox args={[3.4, 0.16, 2.8]} radius={0.05} position={[0, 0, 0]}>
                <meshStandardMaterial color="#e0f2fe" />
              </RoundedBox>
              {/* Bañera */}
              <RoundedBox args={[1.5, 0.5, 0.85]} radius={0.14} position={[0.4, 0.32, 0.3]}>
                <meshStandardMaterial color="#ffffff" />
              </RoundedBox>
              <Html position={[0.4, 1.0, 0.3]} center zIndexRange={[10, 0]}>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    background: 'rgba(255,255,255,0.75)',
                    padding: '2px 7px',
                    borderRadius: 999,
                  }}
                >
                  🛁 Baño
                </span>
              </Html>
            </group>

            <group position={[-0.2, 0, -2.8]}>
              <RoundedBox args={[2.2, 0.45, 1.6]} radius={0.1} position={[0, 0.3, 0]}>
                <meshStandardMaterial color="#F2B79E" />
              </RoundedBox>
              <Html position={[0, 0.95, 0]} center zIndexRange={[10, 0]}>
                <span
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    background: 'rgba(255,255,255,0.75)',
                    padding: '2px 7px',
                    borderRadius: 999,
                  }}
                >
                  🛏️ Habitación
                </span>
              </Html>
            </group>

            {/* Puerta al Jardín / Parque (Nivel 2) */}
            <StationBadge
              position={[4.6, 1.2, 2.6]}
              titulo="🌳 Salida al Parque (Q-Boby) ➔"
              activo={false}
              onClick={() => setScene('parque')}
            />

            {/* Q-Anacleto */}
            <RobotQAnacleto
              position={posRobotCasa}
              carita={caritaAnacleto}
              enDesastre={algunFallo}
            />
          </group>
        ) : (
          /* ESCENA PARQUE (Nivel 2 — Q-Boby) */
          <group>
            {/* Césped del parque */}
            <RoundedBox
              args={[11.5, 0.35, 9.5]}
              radius={0.12}
              position={[0, -0.2, 0]}
            >
              <meshStandardMaterial color="#B8CDBB" />
            </RoundedBox>

            {/* Dos túneles para 2.2 Doble Hueso */}
            <group position={[-2.2, 0, -1.6]}>
              <mesh position={[-1.1, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.65, 0.65, 1.4, 20, 1, false, 0, Math.PI]} />
                <meshStandardMaterial color="#F2B79E" />
              </mesh>
              <mesh position={[1.1, 0.55, 0]} rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.65, 0.65, 1.4, 20, 1, false, 0, Math.PI]} />
                <meshStandardMaterial color="#78DDD9" />
              </mesh>
              <StationBadge
                position={[0, 1.65, 0]}
                titulo="2.2 ⭐ Doble Hueso (QAE)"
                activo={minijuegoId === 'doble-hueso'}
                onClick={() => loadMinigame('doble-hueso')}
              />
            </group>

            {/* Estación 2.1 Trucos */}
            {hasMinigame('trucos') && (
              <group position={[-2.8, 0, 2.0]}>
                <RoundedBox args={[2.2, 0.2, 2.2]} radius={0.08} position={[0, 0.1, 0]}>
                  <meshStandardMaterial color="#B9D8F2" />
                </RoundedBox>
                <StationBadge
                  position={[0, 1.1, 0]}
                  titulo="2.1 Trucos (Parameter-Shift)"
                  activo={minijuegoId === 'trucos'}
                  onClick={() => loadMinigame('trucos')}
                />
              </group>
            )}

            {/* Estación 2.3 Pista Láser-Musical */}
            {hasMinigame('pista') && (
              <group position={[2.6, 0, -1.5]}>
                <RoundedBox args={[2.6, 0.18, 2.6]} radius={0.06} position={[0, 0.1, 0]}>
                  <meshStandardMaterial color="#0b1030" />
                </RoundedBox>
                <StationBadge
                  position={[0, 1.2, 0]}
                  titulo="2.3 Pista Láser-Musical"
                  activo={minijuegoId === 'pista'}
                  onClick={() => loadMinigame('pista')}
                />
              </group>
            )}

            {/* Estación 2.4 Gran Copa Canina */}
            {hasMinigame('copa') && (
              <group position={[2.6, 0, 2.0]}>
                <RoundedBox args={[2.8, 0.22, 2.4]} radius={0.08} position={[0, 0.1, 0]}>
                  <meshStandardMaterial color="#ffd166" />
                </RoundedBox>
                <StationBadge
                  position={[0, 1.25, 0]}
                  titulo="2.4 ⭐⭐⭐ Gran Copa Canina"
                  activo={minijuegoId === 'copa'}
                  onClick={() => loadMinigame('copa')}
                />
              </group>
            )}

            {/* Árboles y banco del parque */}
            {[
              [-4.5, -3.2],
              [4.4, -3.4],
              [-4.6, 3.2],
            ].map(([tx, tz], idx) => (
              <group key={idx} position={[tx, 0, tz]}>
                <mesh position={[0, 0.45, 0]}>
                  <cylinderGeometry args={[0.16, 0.2, 0.9, 12]} />
                  <meshStandardMaterial color="#8d6e63" />
                </mesh>
                <mesh position={[0, 1.2, 0]}>
                  <sphereGeometry args={[0.65, 16, 16]} />
                  <meshStandardMaterial color="#81c784" />
                </mesh>
              </group>
            ))}

            {/* Q-Boby en el centro del parque */}
            <RobotQBoby position={[0, 0.1, 0.4]} estado={estadoBoby} />
          </group>
        )}

        {/* Cinta de objetos de prueba y predicciones en vivo */}
        {visibleSteps.length > 0 && (
          <group position={[0, 0.75, 2.8]}>
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
                        : 'rgba(255,255,255,0.92)',
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
