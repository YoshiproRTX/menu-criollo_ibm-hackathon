import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox, useTexture } from '@react-three/drei';
import * as THREE from 'three';

export interface RobotQAnacletoProps {
  position: [number, number, number];
  carita?: '(^‿^)' | 'O_o' | '@_@';
  enDesastre?: boolean;
  scale?: number;
}

const FaceMesh: React.FC<{ enDesastre: boolean }> = ({ enDesastre }) => {
  const normalTexture = useTexture('/assets/images/qanacleto_face.png');
  const dizzyTexture = useTexture('/assets/images/qanacleto_face_dizzy.png');

  const activeTexture = enDesastre ? dizzyTexture : normalTexture;

  return (
    <mesh position={[0, 0, 0.28]} rotation={[0, 0, 0]}>
      {/* Curved visor plane matching the concept art */}
      <planeGeometry args={[0.48, 0.36]} />
      <meshBasicMaterial
        map={activeTexture}
        transparent
        toneMapped={false}
      />
    </mesh>
  );
};

export const RobotQAnacleto: React.FC<RobotQAnacletoProps> = ({
  position,
  enDesastre = false,
  scale = 1.0,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const rightArmRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Flotación suave / respiración
    if (enDesastre) {
      groupRef.current.position.y = position[1] + Math.abs(Math.sin(t * 14)) * 0.35;
      groupRef.current.rotation.y = t * 7;
      if (headRef.current) {
        headRef.current.rotation.z = Math.sin(t * 16) * 0.2;
      }
    } else {
      groupRef.current.position.y = position[1] + Math.sin(t * 3.2) * 0.06;
      groupRef.current.rotation.y = Math.sin(t * 1.5) * 0.12;
      if (headRef.current) {
        headRef.current.rotation.y = Math.sin(t * 2.5) * 0.08;
        headRef.current.rotation.z = Math.sin(t * 1.8) * 0.04;
      }
      if (leftArmRef.current) {
        leftArmRef.current.rotation.x = Math.sin(t * 3.2) * 0.15;
      }
      if (rightArmRef.current) {
        rightArmRef.current.rotation.x = -Math.sin(t * 3.2) * 0.15;
      }
    }
  });

  const cyanNeon = enDesastre ? '#f43f5e' : '#4EF5E4';
  const whiteMat = '#FFFFFF';
  const periwinkleMat = '#9BBEE0';

  return (
    <group ref={groupRef} position={position} scale={[scale, scale, scale]}>
      {/* Sombra de contacto */}
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.42, 24]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.22} />
      </mesh>

      {/* --- PIES Y PIERNAS GORDITAS --- */}
      {/* Pierna Izquierda */}
      <group position={[-0.2, 0.22, 0]}>
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.13, 0.15, 0.26, 16]} />
          <meshStandardMaterial color={whiteMat} roughness={0.3} />
        </mesh>
        {/* Anillo de luz en tobillo */}
        <mesh position={[0, 0.04, 0]}>
          <torusGeometry args={[0.145, 0.022, 12, 24]} />
          <meshStandardMaterial
            color={cyanNeon}
            emissive={cyanNeon}
            emissiveIntensity={1.8}
            toneMapped={false}
          />
        </mesh>
        {/* Suela celeste */}
        <mesh position={[0, 0.01, 0.02]}>
          <cylinderGeometry args={[0.15, 0.15, 0.06, 16]} />
          <meshStandardMaterial color={periwinkleMat} roughness={0.4} />
        </mesh>
      </group>

      {/* Pierna Derecha */}
      <group position={[0.2, 0.22, 0]}>
        <mesh position={[0, 0.12, 0]}>
          <cylinderGeometry args={[0.13, 0.15, 0.26, 16]} />
          <meshStandardMaterial color={whiteMat} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.04, 0]}>
          <torusGeometry args={[0.145, 0.022, 12, 24]} />
          <meshStandardMaterial
            color={cyanNeon}
            emissive={cyanNeon}
            emissiveIntensity={1.8}
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 0.01, 0.02]}>
          <cylinderGeometry args={[0.15, 0.15, 0.06, 16]} />
          <meshStandardMaterial color={periwinkleMat} roughness={0.4} />
        </mesh>
      </group>

      {/* --- CUERPO GORDITO (TORSO) --- */}
      <group position={[0, 0.68, 0]}>
        {/* Panza blanca redondeada */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.38, 24, 24]} />
          <meshStandardMaterial color={whiteMat} roughness={0.25} />
        </mesh>

        {/* Peto / Placa de pecho celeste con cuello ('Q-BOT') */}
        <mesh position={[0, 0.06, 0.08]}>
          <sphereGeometry args={[0.35, 24, 24]} />
          <meshStandardMaterial color={periwinkleMat} roughness={0.35} />
        </mesh>

        {/* Mochila trasera tecnológica con rejillas y puertos */}
        <group position={[0, 0.08, -0.32]}>
          <RoundedBox args={[0.34, 0.38, 0.16]} radius={0.04} smoothness={4}>
            <meshStandardMaterial color={periwinkleMat} roughness={0.4} />
          </RoundedBox>
          {/* Rejillas horizontales */}
          {[-0.06, 0, 0.06].map((yOffset, i) => (
            <mesh key={i} position={[0, yOffset, -0.085]}>
              <boxGeometry args={[0.22, 0.018, 0.01]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          ))}
          {/* Puerto USB / Jack */}
          <mesh position={[0, -0.11, -0.085]}>
            <boxGeometry args={[0.07, 0.03, 0.01]} />
            <meshStandardMaterial color="#0b1030" />
          </mesh>
        </group>
      </group>

      {/* --- BRAZOS Y MANOS CON DEDOS --- */}
      {/* Brazo Izquierdo */}
      <group ref={leftArmRef} position={[-0.42, 0.72, 0]}>
        <mesh position={[-0.08, -0.12, 0]} rotation={[0, 0, 0.3]}>
          <capsuleGeometry args={[0.09, 0.18, 12, 16]} />
          <meshStandardMaterial color={whiteMat} roughness={0.3} />
        </mesh>
        {/* Anillo de muñeca luminoso */}
        <mesh position={[-0.15, -0.25, 0]}>
          <torusGeometry args={[0.095, 0.02, 12, 20]} />
          <meshStandardMaterial
            color={cyanNeon}
            emissive={cyanNeon}
            emissiveIntensity={1.8}
            toneMapped={false}
          />
        </mesh>
        {/* Mano con palma celeste */}
        <mesh position={[-0.18, -0.32, 0]}>
          <sphereGeometry args={[0.09, 14, 14]} />
          <meshStandardMaterial color={periwinkleMat} roughness={0.3} />
        </mesh>
      </group>

      {/* Brazo Derecho */}
      <group ref={rightArmRef} position={[0.42, 0.72, 0]}>
        <mesh position={[0.08, -0.12, 0]} rotation={[0, 0, -0.3]}>
          <capsuleGeometry args={[0.09, 0.18, 12, 16]} />
          <meshStandardMaterial color={whiteMat} roughness={0.3} />
        </mesh>
        {/* Anillo de muñeca luminoso */}
        <mesh position={[0.15, -0.25, 0]}>
          <torusGeometry args={[0.095, 0.02, 12, 20]} />
          <meshStandardMaterial
            color={cyanNeon}
            emissive={cyanNeon}
            emissiveIntensity={1.8}
            toneMapped={false}
          />
        </mesh>
        {/* Mano con palma celeste */}
        <mesh position={[0.18, -0.32, 0]}>
          <sphereGeometry args={[0.09, 14, 14]} />
          <meshStandardMaterial color={periwinkleMat} roughness={0.3} />
        </mesh>
      </group>

      {/* --- CABEZA DE CASCO REDONDEADO Y VISOR --- */}
      <group ref={headRef} position={[0, 1.25, 0]}>
        {/* Casco blanco exterior redondeado */}
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[0.42, 32, 32]} />
          <meshStandardMaterial color={whiteMat} roughness={0.2} metalness={0.05} />
        </mesh>

        {/* Marco visor negro */}
        <RoundedBox
          args={[0.56, 0.44, 0.15]}
          radius={0.08}
          smoothness={4}
          position={[0, 0, 0.22]}
        >
          <meshStandardMaterial color="#0A0E1A" roughness={0.15} />
        </RoundedBox>

        {/* Pantalla frontal con la cara oficial del model sheet */}
        <React.Suspense
          fallback={
            <mesh position={[0, 0, 0.29]}>
              <planeGeometry args={[0.46, 0.34]} />
              <meshBasicMaterial color="#000000" />
            </mesh>
          }
        >
          <FaceMesh enDesastre={enDesastre} />
        </React.Suspense>

        {/* Orejeras circulares tipo auriculares en los lados */}
        {[-0.43, 0.43].map((xSide, i) => (
          <group key={i} position={[xSide, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <mesh>
              <cylinderGeometry args={[0.16, 0.16, 0.08, 24]} />
              <meshStandardMaterial color={whiteMat} roughness={0.25} />
            </mesh>
            {/* Anillo de luz en la orejera */}
            <mesh position={[0, 0.042, 0]} rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[0.12, 0.02, 14, 24]} />
              <meshStandardMaterial
                color={cyanNeon}
                emissive={cyanNeon}
                emissiveIntensity={1.8}
                toneMapped={false}
              />
            </mesh>
          </group>
        ))}

        {/* Antena en la parte superior del casco */}
        <group position={[0, 0.42, 0]}>
          {/* Tallo */}
          <mesh position={[0, 0.08, 0]} rotation={[0.1, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.025, 0.16, 12]} />
            <meshStandardMaterial color={whiteMat} roughness={0.3} />
          </mesh>
          {/* Esfera luminosa cyan en la punta */}
          <mesh position={[0, 0.18, 0.015]}>
            <sphereGeometry args={[0.07, 18, 18]} />
            <meshStandardMaterial
              color={cyanNeon}
              emissive={cyanNeon}
              emissiveIntensity={2.2}
              toneMapped={false}
            />
          </mesh>
        </group>
      </group>
    </group>
  );
};
