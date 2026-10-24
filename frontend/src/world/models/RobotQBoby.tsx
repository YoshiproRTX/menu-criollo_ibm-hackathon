import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, useTexture } from '@react-three/drei';
import * as THREE from 'three';

export interface RobotQBobyProps {
  position: [number, number, number];
  estado?: 'normal' | 'feliz' | 'rana' | 'dormido';
  scale?: number;
}

const BobyScreenMesh: React.FC<{
  estado: 'normal' | 'feliz' | 'rana' | 'dormido';
}> = ({ estado }) => {
  const normalFace = useTexture('/assets/images/qboby_face.png');
  const sleepyFace = useTexture('/assets/images/qboby_face_sleepy.png');
  const dizzyFace = useTexture('/assets/images/qboby_face_dizzy.png');

  const activeFace =
    estado === 'dormido'
      ? sleepyFace
      : estado === 'rana'
        ? dizzyFace
        : normalFace;

  return (
    <mesh position={[0, 0, 0.28]} rotation={[0, 0, 0]}>
      <planeGeometry args={[0.52, 0.46]} />
      <meshBasicMaterial map={activeFace} transparent toneMapped={false} />
    </mesh>
  );
};

export const RobotQBoby: React.FC<RobotQBobyProps> = ({
  position,
  estado = 'normal',
  scale = 1.0,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const tailRef = useRef<THREE.Group>(null);
  const leftEarRef = useRef<THREE.Group>(null);
  const rightEarRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Animación de cuerpo (saltitos felices o respiración relajada)
    if (estado === 'feliz') {
      groupRef.current.position.y = position[1] + Math.abs(Math.sin(t * 9)) * 0.28;
      if (tailRef.current) {
        tailRef.current.rotation.y = Math.sin(t * 22) * 0.65;
        tailRef.current.rotation.z = 0.2 + Math.abs(Math.sin(t * 18)) * 0.3;
      }
      if (headRef.current) {
        headRef.current.rotation.x = Math.sin(t * 9) * 0.12;
      }
    } else if (estado === 'dormido') {
      groupRef.current.position.y = position[1] + Math.sin(t * 1.5) * 0.015;
      if (tailRef.current) {
        tailRef.current.rotation.y = 0;
        tailRef.current.rotation.z = -0.1;
      }
    } else {
      groupRef.current.position.y = position[1] + Math.sin(t * 2.8) * 0.035;
      if (tailRef.current) {
        tailRef.current.rotation.y = Math.sin(t * 8) * 0.45;
      }
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 2.2) * 0.08;
      }
      if (leftEarRef.current && rightEarRef.current) {
        leftEarRef.current.rotation.z = -0.15 + Math.sin(t * 2.8) * 0.06;
        rightEarRef.current.rotation.z = 0.15 - Math.sin(t * 2.8) * 0.06;
      }
    }
  });

  const bodyWhite = '#ECEFF1';
  const bodyGrey = '#CFD8DC';
  const jointDark = '#546E7A';
  const earGrey = '#90A4AE';
  const cyanGlow = '#4EF5E4';
  const blueGlow = '#38bdf8';

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Sombra de contacto */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[1.2, 0.8, 1]}>
        <circleGeometry args={[0.42, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.24} />
      </mesh>

      {/* --- CUERPO METÁLICO (CORGI ROBÓTICO) --- */}
      <group position={[0, 0.45, 0]}>
        {/* Torso cilíndrico redondeado */}
        <RoundedBox args={[0.62, 0.46, 0.72]} radius={0.16} smoothness={4} position={[0, 0, 0]}>
          <meshStandardMaterial color={bodyWhite} roughness={0.25} metalness={0.1} />
        </RoundedBox>

        {/* Pecho curvo */}
        <mesh position={[0, -0.02, 0.28]}>
          <sphereGeometry args={[0.26, 18, 18]} />
          <meshStandardMaterial color={bodyGrey} roughness={0.3} />
        </mesh>

        {/* Lomo / Placa trasera */}
        <mesh position={[0, 0.2, -0.05]}>
          <boxGeometry args={[0.42, 0.06, 0.54]} />
          <meshStandardMaterial color={bodyGrey} roughness={0.35} />
        </mesh>
      </group>

      {/* --- 4 PATITAS ARTICULADAS CON SERVOS --- */}
      {[
        { x: -0.26, z: 0.24, label: 'delantera-izq' },
        { x: 0.26, z: 0.24, label: 'delantera-der' },
        { x: -0.26, z: -0.24, label: 'trasera-izq' },
        { x: 0.26, z: -0.24, label: 'trasera-der' },
      ].map((leg, i) => (
        <group key={i} position={[leg.x, 0.22, leg.z]}>
          {/* Servo circular en articulación superior */}
          <mesh position={[leg.x > 0 ? 0.04 : -0.04, 0.12, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.09, 0.09, 0.06, 16]} />
            <meshStandardMaterial color={jointDark} metalness={0.5} roughness={0.4} />
          </mesh>
          {/* Pata */}
          <mesh position={[0, 0.02, 0]}>
            <cylinderGeometry args={[0.075, 0.085, 0.24, 16]} />
            <meshStandardMaterial color={bodyWhite} roughness={0.3} />
          </mesh>
          {/* Garra / Huella suave */}
          <mesh position={[0, -0.09, 0.02]}>
            <sphereGeometry args={[0.095, 14, 14]} />
            <meshStandardMaterial color={bodyGrey} roughness={0.4} />
          </mesh>
        </group>
      ))}

      {/* --- COLA CIBERNÉTICA CON TIRA NEÓN CIAN --- */}
      <group ref={tailRef} position={[0, 0.58, -0.38]}>
        <mesh position={[0, 0.14, -0.08]} rotation={[-0.45, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.07, 0.28, 14]} />
          <meshStandardMaterial color={bodyWhite} roughness={0.3} />
        </mesh>
        {/* Punta estilizada */}
        <mesh position={[0, 0.28, -0.15]}>
          <coneGeometry args={[0.04, 0.1, 14]} />
          <meshStandardMaterial color={bodyGrey} roughness={0.3} />
        </mesh>
        {/* Tira luminosa neón en el lomo de la cola */}
        <mesh position={[0, 0.16, -0.05]} rotation={[-0.45, 0, 0]}>
          <boxGeometry args={[0.018, 0.24, 0.03]} />
          <meshStandardMaterial
            color={cyanGlow}
            emissive={cyanGlow}
            emissiveIntensity={2.0}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* --- CABEZA DE MONITOR CON PANTALLA CRT --- */}
      <group ref={headRef} position={[0, 0.82, 0.32]}>
        {/* Carcasa del monitor redondeada */}
        <RoundedBox args={[0.62, 0.54, 0.52]} radius={0.14} smoothness={4} position={[0, 0, 0]}>
          <meshStandardMaterial color={bodyWhite} roughness={0.2} metalness={0.08} />
        </RoundedBox>

        {/* Marco de pantalla oscuro */}
        <RoundedBox args={[0.54, 0.46, 0.08]} radius={0.08} smoothness={4} position={[0, 0, 0.24]}>
          <meshStandardMaterial color="#1A202C" roughness={0.2} />
        </RoundedBox>

        {/* Pantalla con iconos de píxeles reales del model sheet */}
        <React.Suspense
          fallback={
            <mesh position={[0, 0, 0.285]}>
              <planeGeometry args={[0.5, 0.42]} />
              <meshBasicMaterial color="#111827" />
            </mesh>
          }
        >
          <BobyScreenMesh estado={estado} />
        </React.Suspense>

        {/* Orejitas caídas suaves a los lados */}
        <group ref={leftEarRef} position={[-0.34, 0.16, 0.02]} rotation={[0.1, 0, -0.2]}>
          <RoundedBox args={[0.12, 0.34, 0.18]} radius={0.05} smoothness={4}>
            <meshStandardMaterial color={earGrey} roughness={0.5} />
          </RoundedBox>
        </group>
        <group ref={rightEarRef} position={[0.34, 0.16, 0.02]} rotation={[0.1, 0, 0.2]}>
          <RoundedBox args={[0.12, 0.34, 0.18]} radius={0.05} smoothness={4}>
            <meshStandardMaterial color={earGrey} roughness={0.5} />
          </RoundedBox>
        </group>

        {/* Antena inclinada con punta luminosa azul */}
        <group position={[0, 0.28, -0.06]} rotation={[-0.4, 0, 0]}>
          {/* Mástil */}
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.016, 0.02, 0.16, 12]} />
            <meshStandardMaterial color={jointDark} metalness={0.6} roughness={0.3} />
          </mesh>
          {/* Cápsula luminosa azul */}
          <mesh position={[0, 0.18, 0]}>
            <capsuleGeometry args={[0.035, 0.06, 8, 12]} />
            <meshStandardMaterial
              color={blueGlow}
              emissive={blueGlow}
              emissiveIntensity={2.2}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};
