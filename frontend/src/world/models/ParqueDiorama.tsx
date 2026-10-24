import React from 'react';
import { RoundedBox } from '@react-three/drei';

export const ParqueDiorama: React.FC = () => {
  const grassPark = '#5a9e4b';
  const soilTop = '#5c4033';
  const soilBottom = '#3b261d';
  const pathStone = '#dfd3c3';
  const woodBench = '#8d5b4c';
  const treeBark = '#6d4c41';
  const foliageGreen1 = '#43a047';
  const foliageGreen2 = '#66bb6a';
  const tunnelAWood = '#ea580c';
  const tunnelBTeal = '#0d9488';
  const goldBone = '#fbbf24';

  return (
    <group>
      {/* ========================================================
          1. BASE DIORAMA DEL PARQUE (ISOMÉTRICO FLOTANTE)
         ======================================================== */}
      <RoundedBox args={[14.2, 0.45, 12.2]} radius={0.16} smoothness={4} position={[0, -0.45, 0]}>
        <meshStandardMaterial color={soilBottom} roughness={0.9} />
      </RoundedBox>
      <RoundedBox args={[14.1, 0.35, 12.1]} radius={0.14} smoothness={4} position={[0, -0.15, 0]}>
        <meshStandardMaterial color={soilTop} roughness={0.85} />
      </RoundedBox>
      <RoundedBox args={[14.0, 0.25, 12.0]} radius={0.12} smoothness={4} position={[0, 0.05, 0]}>
        <meshStandardMaterial color={grassPark} roughness={0.7} />
      </RoundedBox>

      {/* Senderos de adoquines que cruzan el parque */}
      <group position={[0, 0.18, 0]}>
        <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.8, 11.2]} />
          <meshStandardMaterial color={pathStone} roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.001, -0.2]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
          <planeGeometry args={[1.8, 12.5]} />
          <meshStandardMaterial color={pathStone} roughness={0.8} />
        </mesh>
      </group>

      {/* Árboles frondosos de parque de estilo cómic */}
      {[
        [-5.2, -4.2],
        [-5.0, 4.4],
        [5.2, -4.5],
        [5.4, 4.2],
        [-1.8, -4.8],
      ].map(([tx, tz], i) => (
        <group key={i} position={[tx, 0.18, tz]}>
          {/* Tronco */}
          <mesh position={[0, 0.7, 0]}>
            <cylinderGeometry args={[0.18, 0.26, 1.4, 12]} />
            <meshStandardMaterial color={treeBark} roughness={0.9} />
          </mesh>
          {/* Follaje esférico por niveles */}
          <mesh position={[0, 1.8, 0]}>
            <sphereGeometry args={[0.85, 16, 16]} />
            <meshStandardMaterial color={foliageGreen1} roughness={0.7} />
          </mesh>
          <mesh position={[0.2, 2.3, 0.1]}>
            <sphereGeometry args={[0.65, 14, 14]} />
            <meshStandardMaterial color={foliageGreen2} roughness={0.7} />
          </mesh>
        </group>
      ))}

      {/* Bancos de madera y farolas con luz cálida */}
      {[
        [-1.8, 1.6, 0.4],
        [1.8, -2.4, -0.4],
      ].map(([bx, bz, rot], i) => (
        <group key={i} position={[bx, 0.2, bz]} rotation={[0, rot, 0]}>
          {/* Banco */}
          <RoundedBox args={[1.2, 0.08, 0.38]} radius={0.02} position={[0, 0.26, 0]}>
            <meshStandardMaterial color={woodBench} />
          </RoundedBox>
          <RoundedBox args={[1.2, 0.35, 0.06]} radius={0.02} position={[0, 0.45, -0.16]}>
            <meshStandardMaterial color={woodBench} />
          </RoundedBox>
          {/* Patas del banco */}
          {[-0.5, 0.5].map((px, j) => (
            <mesh key={j} position={[px, 0.12, 0]}>
              <cylinderGeometry args={[0.03, 0.03, 0.24, 8]} />
              <meshStandardMaterial color="#374151" metalness={0.8} />
            </mesh>
          ))}
        </group>
      ))}

      {/* Farola de hierro forjado con farol encendido */}
      <group position={[1.4, 0.2, 1.2]}>
        <mesh position={[0, 1.0, 0]}>
          <cylinderGeometry args={[0.04, 0.06, 2.0, 10]} />
          <meshStandardMaterial color="#1f2937" metalness={0.7} />
        </mesh>
        {/* Farol */}
        <mesh position={[0, 2.05, 0]}>
          <boxGeometry args={[0.26, 0.32, 0.26]} />
          <meshStandardMaterial
            color="#fef08a"
            emissive="#fef08a"
            emissiveIntensity={1.4}
            toneMapped={false}
          />
        </mesh>
      </group>

      {/* ========================================================
          2. ESTACIÓN 2.2: EL MISTERIO DEL DOBLE HUESO (QAE)
         ======================================================== */}
      <group position={[-3.2, 0.2, -1.8]}>
        {/* Montículo de jardín excavado */}
        <RoundedBox args={[3.8, 0.25, 2.8]} radius={0.12} position={[0, 0.12, 0]}>
          <meshStandardMaterial color="#84a98c" roughness={0.65} />
        </RoundedBox>

        {/* Túnel A (Izquierda - Naranja) */}
        <group position={[-1.1, 0.45, 0]}>
          {/* Marco de madera arqueado */}
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.65, 0.65, 1.5, 24, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color={tunnelAWood} roughness={0.4} />
          </mesh>
          {/* Interior oscuro de la madriguera */}
          <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.55, 0.55, 1.4, 20, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#1c1917" />
          </mesh>
          {/* Cartel Túnel A */}
          <RoundedBox args={[0.55, 0.22, 0.05]} radius={0.02} position={[0, 0.72, 0.7]}>
            <meshStandardMaterial color="#fdba74" />
          </RoundedBox>
        </group>

        {/* Túnel B ⭐ (Derecha - Turquesa / Hueso Secreto) */}
        <group position={[1.1, 0.45, 0]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.65, 0.65, 1.5, 24, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color={tunnelBTeal} roughness={0.4} />
          </mesh>
          <mesh position={[0, 0, 0.05]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.55, 0.55, 1.4, 20, 1, false, 0, Math.PI]} />
            <meshStandardMaterial color="#1c1917" />
          </mesh>
          {/* Cartel Túnel B ⭐ */}
          <RoundedBox args={[0.55, 0.22, 0.05]} radius={0.02} position={[0, 0.72, 0.7]}>
            <meshStandardMaterial color="#5eead4" />
          </RoundedBox>
          {/* Hueso Dorado flotante en la entrada */}
          <group position={[0, 0.15, 0.2]} scale={[0.8, 0.8, 0.8]}>
            <mesh position={[0, 0, 0]}>
              <capsuleGeometry args={[0.06, 0.26, 8, 12]} />
              <meshStandardMaterial
                color={goldBone}
                emissive={goldBone}
                emissiveIntensity={1.2}
                toneMapped={false}
              />
            </mesh>
            <mesh position={[-0.07, 0.12, 0]}>
              <sphereGeometry args={[0.06, 10, 10]} />
              <meshStandardMaterial color={goldBone} emissive={goldBone} emissiveIntensity={1.2} />
            </mesh>
            <mesh position={[0.07, 0.12, 0]}>
              <sphereGeometry args={[0.06, 10, 10]} />
              <meshStandardMaterial color={goldBone} emissive={goldBone} emissiveIntensity={1.2} />
            </mesh>
          </group>
        </group>
      </group>

      {/* ========================================================
          3. ESTACIÓN 2.1: ESCUELA DE TRUCOS (PARAMETER-SHIFT)
         ======================================================== */}
      <group position={[-3.4, 0.2, 2.2]}>
        {/* Pista de agility con valla de saltos y podio */}
        <RoundedBox args={[3.2, 0.16, 2.4]} radius={0.08} position={[0, 0.08, 0]}>
          <meshStandardMaterial color="#fed7aa" roughness={0.6} />
        </RoundedBox>
        {/* Podio redondo de entrenamiento para Boby */}
        <mesh position={[-0.7, 0.25, 0]}>
          <cylinderGeometry args={[0.5, 0.58, 0.35, 20]} />
          <meshStandardMaterial color="#38bdf8" roughness={0.3} />
        </mesh>
        {/* Valla de salto roja y blanca */}
        <group position={[0.7, 0.3, 0]}>
          <mesh position={[-0.45, 0.2, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.45, 8]} />
            <meshStandardMaterial color="#f43f5e" />
          </mesh>
          <mesh position={[0.45, 0.2, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.45, 8]} />
            <meshStandardMaterial color="#f43f5e" />
          </mesh>
          <mesh position={[0, 0.32, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.025, 0.025, 0.9, 10]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
        </group>
      </group>

      {/* ========================================================
          4. ESTACIÓN 2.3: PISTA LÁSER-MUSICAL (INTERFERENCIA)
         ======================================================== */}
      <group position={[3.2, 0.2, -1.8]}>
        {/* Escenario de baile musical con baldosas iluminadas de neón */}
        <RoundedBox args={[3.0, 0.2, 3.0]} radius={0.08} position={[0, 0.1, 0]}>
          <meshStandardMaterial color="#0f172a" roughness={0.2} metalness={0.6} />
        </RoundedBox>
        {/* 4 Baldosas de fase cuántica: |++>, |+->, |-+>, |---> */}
        {[
          { x: -0.65, z: -0.65, col: '#38bdf8' },
          { x: 0.65, z: -0.65, col: '#f43f5e' },
          { x: -0.65, z: 0.65, col: '#a855f7' },
          { x: 0.65, z: 0.65, col: '#facc15' },
        ].map((tile, i) => (
          <mesh key={i} position={[tile.x, 0.21, tile.z]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.1, 1.1]} />
            <meshStandardMaterial
              color={tile.col}
              emissive={tile.col}
              emissiveIntensity={1.3}
              toneMapped={false}
            />
          </mesh>
        ))}
      </group>

      {/* ========================================================
          5. ESTACIÓN 2.4: LA GRAN COPA DEL PARQUE (NISQ / BAYES)
         ======================================================== */}
      <group position={[3.3, 0.2, 2.2]}>
        {/* Podio de campeonato con puestos 1, 2, 3 y Gran Trofeo */}
        <group position={[0, 0, 0]}>
          {/* Puesto 1 (Centro) */}
          <RoundedBox args={[0.9, 0.55, 0.9]} radius={0.04} position={[0, 0.28, 0]}>
            <meshStandardMaterial color="#f59e0b" roughness={0.3} />
          </RoundedBox>
          {/* Puesto 2 (Izquierda) */}
          <RoundedBox args={[0.75, 0.42, 0.75]} radius={0.04} position={[-0.85, 0.21, 0]}>
            <meshStandardMaterial color="#94a3b8" roughness={0.4} />
          </RoundedBox>
          {/* Puesto 3 (Derecha) */}
          <RoundedBox args={[0.75, 0.32, 0.75]} radius={0.04} position={[0.85, 0.16, 0]}>
            <meshStandardMaterial color="#b45309" roughness={0.5} />
          </RoundedBox>

          {/* Trofeo Copa Canina Dorada en el centro */}
          <group position={[0, 0.78, 0]}>
            <mesh position={[0, 0, 0]}>
              <cylinderGeometry args={[0.18, 0.08, 0.35, 16]} />
              <meshStandardMaterial
                color="#fcd34d"
                metalness={0.9}
                roughness={0.15}
                emissive="#fcd34d"
                emissiveIntensity={0.6}
              />
            </mesh>
            <mesh position={[0, 0.22, 0]}>
              <cylinderGeometry args={[0.22, 0.18, 0.12, 16]} />
              <meshStandardMaterial color="#fcd34d" metalness={0.9} roughness={0.15} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};
