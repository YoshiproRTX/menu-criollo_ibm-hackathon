import React from 'react';
import { RoundedBox } from '@react-three/drei';

export interface CasaDioramaProps {
  onSelectStation?: (stationId: string) => void;
  activeStationId?: string;
}

export const CasaDiorama: React.FC<CasaDioramaProps> = () => {
  // Paleta de materiales extraída exactamente de la imagen casa_isometrica.jpg
  const grassGreen = '#6da34d';
  const soilTop = '#5c4033';
  const soilBottom = '#3b261d';
  const woodFloor = '#cf9d69';
  const interiorWallBeige = '#f6f0e2';
  const trimWood = '#8c5e3c';
  const sofaLilac = '#aa96da';
  const sofaPillowYellow = '#fbd46d';
  const sofaPillowOrange = '#ff7b54';
  const rugSala = '#c86b85';
  const rugDining = '#e8ded2';
  const woodTable = '#96613d';
  const chairWood = '#a26d46';
  const kitchenYellow = '#fab839';
  const kitchenTeal = '#43978d';
  const fridgeWhite = '#f4f6f8';
  const laundryMint = '#88c999';
  const washerWhite = '#ffffff';
  const bedroomPurple = '#c4bbf0';
  const bedStripedPink = '#f38181';
  const bedStripedYellow = '#fce38a';
  const bedStripedTeal = '#95e1d3';
  const bathroomBlue = '#9cd0e8';
  const bathTubWhite = '#ffffff';
  const plantGreen = '#388e3c';
  const potTerracotta = '#b25022';
  const concreteGrey = '#d5dbdb';

  return (
    <group>
      {/* ========================================================
          1. BASE DIORAMA FLOTANTE CON CAPAS DE TIERRA Y CÉSPED
         ======================================================== */}
      {/* Capa inferior de tierra oscura */}
      <RoundedBox args={[14.2, 0.45, 12.2]} radius={0.16} smoothness={4} position={[0, -0.45, 0]}>
        <meshStandardMaterial color={soilBottom} roughness={0.9} />
      </RoundedBox>
      {/* Capa media de tierra fértil */}
      <RoundedBox args={[14.1, 0.35, 12.1]} radius={0.14} smoothness={4} position={[0, -0.15, 0]}>
        <meshStandardMaterial color={soilTop} roughness={0.85} />
      </RoundedBox>
      {/* Capa superior de césped recortado */}
      <RoundedBox args={[14.0, 0.25, 12.0]} radius={0.12} smoothness={4} position={[0, 0.05, 0]}>
        <meshStandardMaterial color={grassGreen} roughness={0.7} />
      </RoundedBox>

      {/* Caminito exterior de losas de hormigón hacia la puerta principal */}
      <group position={[0.4, 0.18, 5.0]}>
        {/* Acera frontal */}
        <RoundedBox args={[1.5, 0.04, 1.8]} radius={0.03} position={[0, 0, 0]}>
          <meshStandardMaterial color={concreteGrey} roughness={0.5} />
        </RoundedBox>
        {/* Escalón de entrada */}
        <RoundedBox args={[1.6, 0.1, 0.7]} radius={0.02} position={[0, 0.06, -0.8]}>
          <meshStandardMaterial color={concreteGrey} roughness={0.4} />
        </RoundedBox>
      </group>

      {/* Huerto frontal con bancales de verduras y arbustos (idéntico a la imagen) */}
      <group position={[-2.2, 0.18, 4.8]}>
        {/* Marco de madera del huerto */}
        <RoundedBox args={[2.8, 0.12, 1.4]} radius={0.04} position={[0, 0, 0]}>
          <meshStandardMaterial color={trimWood} roughness={0.6} />
        </RoundedBox>
        {/* Tierra de cultivo */}
        <mesh position={[0, 0.06, 0]}>
          <boxGeometry args={[2.6, 0.04, 1.2]} />
          <meshStandardMaterial color={soilBottom} />
        </mesh>
        {/* Filas de lechugas y hortalizas verdes */}
        {[-0.8, -0.4, 0, 0.4, 0.8].map((xOffset, idx) => (
          <group key={idx} position={[xOffset, 0.14, 0]}>
            <mesh position={[0, 0, -0.3]}>
              <sphereGeometry args={[0.09, 10, 10]} />
              <meshStandardMaterial color={plantGreen} />
            </mesh>
            <mesh position={[0, 0, 0.1]}>
              <sphereGeometry args={[0.1, 10, 10]} />
              <meshStandardMaterial color="#4caf50" />
            </mesh>
            <mesh position={[0, 0, 0.35]}>
              <sphereGeometry args={[0.08, 10, 10]} />
              <meshStandardMaterial color="#66bb6a" />
            </mesh>
          </group>
        ))}
      </group>

      {/* Arbustos decorativos redondos en la entrada */}
      {[
        [1.6, 4.8],
        [2.3, 4.9],
        [-3.8, 4.6],
        [4.2, 4.5],
      ].map(([bx, bz], i) => (
        <mesh key={i} position={[bx, 0.35, bz]}>
          <sphereGeometry args={[0.26 + (i % 2) * 0.06, 14, 14]} />
          <meshStandardMaterial color="#2e7d32" roughness={0.8} />
        </mesh>
      ))}

      {/* ========================================================
          2. PLANTA BAJA: SUELO DE MADERA Y MUROS PERIMETRALES
         ======================================================== */}
      {/* Suelo general de parqué de roble cálido */}
      <RoundedBox args={[11.8, 0.14, 9.6]} radius={0.05} position={[0, 0.22, 0]}>
        <meshStandardMaterial color={woodFloor} roughness={0.4} />
      </RoundedBox>

      {/* Muros exteriores cortados en isométrico con zócalo */}
      {/* Muro Trasero Exterior */}
      <mesh position={[0, 1.4, -4.75]}>
        <boxGeometry args={[11.6, 2.2, 0.18]} />
        <meshStandardMaterial color={interiorWallBeige} roughness={0.5} />
      </mesh>
      {/* Muro Izquierdo Exterior */}
      <mesh position={[-5.85, 1.4, 0]}>
        <boxGeometry args={[0.18, 2.2, 9.5]} />
        <meshStandardMaterial color={interiorWallBeige} roughness={0.5} />
      </mesh>
      {/* Muro Frontal Exterior bajo (Cutaway para ver el interior) */}
      <mesh position={[-2.8, 0.6, 4.75]}>
        <boxGeometry args={[5.8, 0.7, 0.18]} />
        <meshStandardMaterial color={interiorWallBeige} roughness={0.5} />
      </mesh>
      <mesh position={[3.2, 0.6, 4.75]}>
        <boxGeometry args={[4.8, 0.7, 0.18]} />
        <meshStandardMaterial color={interiorWallBeige} roughness={0.5} />
      </mesh>

      {/* Marco y Puerta de Entrada */}
      <group position={[0.4, 1.0, 4.75]}>
        <RoundedBox args={[1.1, 1.6, 0.14]} radius={0.04}>
          <meshStandardMaterial color={trimWood} roughness={0.4} />
        </RoundedBox>
        {/* Hoja de la puerta de madera con cuarterones */}
        <mesh position={[0, 0, 0.04]}>
          <boxGeometry args={[0.85, 1.45, 0.04]} />
          <meshStandardMaterial color="#b08968" roughness={0.3} />
        </mesh>
        <mesh position={[0.3, 0, 0.07]}>
          <sphereGeometry args={[0.035, 12, 12]} />
          <meshStandardMaterial color="#fcd34d" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* ========================================================
          3. SALA DE ESTAR (LIVING ROOM) — 1.1 PELUSA REBELDE
         ======================================================== */}
      <group position={[-3.3, 0.3, 2.1]}>
        {/* Alfombra persa lila/estampada de la sala */}
        <RoundedBox args={[3.2, 0.02, 2.6]} radius={0.05} position={[0, 0.01, 0]}>
          <meshStandardMaterial color={rugSala} roughness={0.65} />
        </RoundedBox>

        {/* Sofá grande cómodo lila de 3 plazas con cojines */}
        <group position={[0, 0.42, -0.9]}>
          {/* Base y asiento */}
          <RoundedBox args={[2.5, 0.32, 0.85]} radius={0.08} position={[0, 0, 0]}>
            <meshStandardMaterial color={sofaLilac} roughness={0.4} />
          </RoundedBox>
          {/* Respaldo acolchado */}
          <RoundedBox args={[2.5, 0.52, 0.28]} radius={0.08} position={[0, 0.38, -0.28]}>
            <meshStandardMaterial color={sofaLilac} roughness={0.4} />
          </RoundedBox>
          {/* Brazos redondeados */}
          <RoundedBox args={[0.26, 0.42, 0.88]} radius={0.06} position={[-1.22, 0.15, 0]}>
            <meshStandardMaterial color={sofaLilac} roughness={0.4} />
          </RoundedBox>
          <RoundedBox args={[0.26, 0.42, 0.88]} radius={0.06} position={[1.22, 0.15, 0]}>
            <meshStandardMaterial color={sofaLilac} roughness={0.4} />
          </RoundedBox>
          {/* Cojines decorativos (amarillo y naranja) */}
          <RoundedBox args={[0.38, 0.38, 0.16]} radius={0.05} position={[-0.55, 0.3, -0.1]} rotation={[0.1, 0.2, 0.1]}>
            <meshStandardMaterial color={sofaPillowYellow} />
          </RoundedBox>
          <RoundedBox args={[0.36, 0.36, 0.16]} radius={0.05} position={[0.55, 0.3, -0.1]} rotation={[0.1, -0.2, -0.1]}>
            <meshStandardMaterial color={sofaPillowOrange} />
          </RoundedBox>
        </group>

        {/* Dos sillones individuales a juego */}
        <group position={[-1.5, 0.38, 0.2]} rotation={[0, 0.8, 0]}>
          <RoundedBox args={[0.85, 0.3, 0.8]} radius={0.06} position={[0, 0, 0]}>
            <meshStandardMaterial color={sofaLilac} />
          </RoundedBox>
          <RoundedBox args={[0.85, 0.45, 0.22]} radius={0.06} position={[0, 0.32, -0.28]}>
            <meshStandardMaterial color={sofaLilac} />
          </RoundedBox>
        </group>
        <group position={[1.5, 0.38, 0.2]} rotation={[0, -0.8, 0]}>
          <RoundedBox args={[0.85, 0.3, 0.8]} radius={0.06} position={[0, 0, 0]}>
            <meshStandardMaterial color={sofaLilac} />
          </RoundedBox>
          <RoundedBox args={[0.85, 0.45, 0.22]} radius={0.06} position={[0, 0.32, -0.28]}>
            <meshStandardMaterial color={sofaLilac} />
          </RoundedBox>
        </group>

        {/* Mesa de centro de madera con libros */}
        <group position={[0, 0.18, 0.1]}>
          <RoundedBox args={[1.3, 0.2, 0.75]} radius={0.04}>
            <meshStandardMaterial color={woodTable} roughness={0.4} />
          </RoundedBox>
          {/* Libros en la mesa */}
          <mesh position={[-0.2, 0.13, 0]}>
            <boxGeometry args={[0.26, 0.05, 0.18]} />
            <meshStandardMaterial color="#3b82f6" />
          </mesh>
          <mesh position={[0.2, 0.13, 0.05]}>
            <boxGeometry args={[0.24, 0.04, 0.16]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
        </group>

        {/* Mueble de TV bajo y Pantalla Plana en el muro izquierdo */}
        <group position={[-2.3, 0.35, 1.8]} rotation={[0, Math.PI / 2, 0]}>
          <RoundedBox args={[1.6, 0.4, 0.45]} radius={0.04}>
            <meshStandardMaterial color={woodTable} />
          </RoundedBox>
          {/* TV de plasma */}
          <mesh position={[0, 0.48, 0]}>
            <boxGeometry args={[1.3, 0.7, 0.05]} />
            <meshStandardMaterial color="#111827" roughness={0.1} />
          </mesh>
          <mesh position={[0, 0.24, 0]}>
            <boxGeometry args={[0.28, 0.05, 0.18]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
        </group>

        {/* Planta de interior grande en maceta de terracota */}
        <group position={[-2.2, 0.35, -1.5]}>
          <mesh position={[0, 0.2, 0]}>
            <cylinderGeometry args={[0.22, 0.16, 0.4, 16]} />
            <meshStandardMaterial color={potTerracotta} roughness={0.8} />
          </mesh>
          <mesh position={[0, 0.65, 0]}>
            <sphereGeometry args={[0.38, 14, 14]} />
            <meshStandardMaterial color={plantGreen} />
          </mesh>
        </group>

        {/* Librería rinconera con libros de colores */}
        <group position={[-2.2, 0.9, -0.5]} rotation={[0, Math.PI / 2, 0]}>
          <RoundedBox args={[1.1, 1.4, 0.35]} radius={0.04}>
            <meshStandardMaterial color={woodTable} />
          </RoundedBox>
          {/* Filas de libros de colores */}
          {[-0.38, 0.05, 0.45].map((yShelf, i) => (
            <mesh key={i} position={[0, yShelf, 0.04]}>
              <boxGeometry args={[0.92, 0.24, 0.22]} />
              <meshStandardMaterial color={i === 0 ? '#10b981' : i === 1 ? '#6366f1' : '#f59e0b'} />
            </mesh>
          ))}
        </group>
      </group>

      {/* ========================================================
          4. COMEDOR CENTRAL (DINING ROOM)
         ======================================================== */}
      <group position={[1.4, 0.3, 2.6]}>
        {/* Alfombra del comedor */}
        <RoundedBox args={[2.8, 0.02, 2.2]} radius={0.06} position={[0, 0.01, 0]}>
          <meshStandardMaterial color={rugDining} roughness={0.7} />
        </RoundedBox>

        {/* Mesa de comedor rectangular de madera noble */}
        <group position={[0, 0.48, 0]}>
          <RoundedBox args={[2.0, 0.1, 1.1]} radius={0.03}>
            <meshStandardMaterial color={woodTable} roughness={0.4} />
          </RoundedBox>
          {/* Patas de la mesa */}
          {[-0.85, 0.85].map((xP, i) =>
            [-0.42, 0.42].map((zP, j) => (
              <mesh key={`${i}-${j}`} position={[xP, -0.22, zP]}>
                <cylinderGeometry args={[0.045, 0.045, 0.44, 12]} />
                <meshStandardMaterial color={woodTable} />
              </mesh>
            ))
          )}
          {/* Centro floral con flores amarillas */}
          <mesh position={[0, 0.12, 0]}>
            <cylinderGeometry args={[0.1, 0.07, 0.18, 14]} />
            <meshStandardMaterial color="#ffffff" roughness={0.2} />
          </mesh>
          <mesh position={[0, 0.25, 0]}>
            <sphereGeometry args={[0.14, 12, 12]} />
            <meshStandardMaterial color="#facc15" />
          </mesh>
        </group>

        {/* 6 Sillas de madera alrededor de la mesa con cojines */}
        {[-0.6, 0, 0.6].map((xSeat, idx) => (
          <React.Fragment key={idx}>
            {/* Silla lado superior */}
            <group position={[xSeat, 0.3, -0.68]} rotation={[0, 0, 0]}>
              <RoundedBox args={[0.38, 0.05, 0.38]} radius={0.02} position={[0, 0, 0]}>
                <meshStandardMaterial color={chairWood} />
              </RoundedBox>
              <RoundedBox args={[0.36, 0.38, 0.04]} radius={0.02} position={[0, 0.22, -0.16]}>
                <meshStandardMaterial color={chairWood} />
              </RoundedBox>
            </group>
            {/* Silla lado inferior */}
            <group position={[xSeat, 0.3, 0.68]} rotation={[0, Math.PI, 0]}>
              <RoundedBox args={[0.38, 0.05, 0.38]} radius={0.02} position={[0, 0, 0]}>
                <meshStandardMaterial color={chairWood} />
              </RoundedBox>
              <RoundedBox args={[0.36, 0.38, 0.04]} radius={0.02} position={[0, 0.22, -0.16]}>
                <meshStandardMaterial color={chairWood} />
              </RoundedBox>
            </group>
          </React.Fragment>
        ))}
      </group>

      {/* ========================================================
          5. COCINA (KITCHEN) — 1.2 FREGADERO Y 1.3 CHEF CATÁSTROFE
         ======================================================== */}
      <group position={[3.2, 0.3, 0.2]}>
        {/* Muebles bajos en L amarillos con encimera blanca */}
        <group position={[0, 0.45, 0]}>
          <RoundedBox args={[2.4, 0.8, 0.75]} radius={0.04} position={[0, 0, 0]}>
            <meshStandardMaterial color={kitchenYellow} roughness={0.3} />
          </RoundedBox>
          <RoundedBox args={[0.75, 0.8, 1.6]} radius={0.04} position={[0.82, 0, 0.9]}>
            <meshStandardMaterial color={kitchenYellow} roughness={0.3} />
          </RoundedBox>
          {/* Encimera blanca brillante */}
          <RoundedBox args={[2.46, 0.08, 0.78]} radius={0.02} position={[0, 0.42, 0]}>
            <meshStandardMaterial color="#ffffff" roughness={0.15} />
          </RoundedBox>
          <RoundedBox args={[0.78, 0.08, 1.64]} radius={0.02} position={[0.82, 0.42, 0.9]}>
            <meshStandardMaterial color="#ffffff" roughness={0.15} />
          </RoundedBox>

          {/* Fregadero de acero inoxidable con grifo curvo */}
          <mesh position={[-0.4, 0.44, 0]}>
            <boxGeometry args={[0.65, 0.06, 0.42]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh position={[-0.4, 0.62, -0.15]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.22, 12]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.1} />
          </mesh>
        </group>

        {/* Cocina con horno y 4 fogones */}
        <group position={[1.4, 0.45, -0.1]}>
          <RoundedBox args={[0.9, 0.82, 0.75]} radius={0.04}>
            <meshStandardMaterial color="#ffffff" roughness={0.25} />
          </RoundedBox>
          {/* Ventana de cristal del horno */}
          <mesh position={[0, -0.08, 0.38]}>
            <boxGeometry args={[0.65, 0.4, 0.02]} />
            <meshStandardMaterial color="#0f172a" roughness={0.1} />
          </mesh>
          {/* 4 Fogones circulares negros */}
          {[-0.2, 0.2].map((fx, i) =>
            [-0.15, 0.15].map((fz, j) => (
              <mesh key={`${i}-${j}`} position={[fx, 0.43, fz]}>
                <cylinderGeometry args={[0.09, 0.09, 0.02, 16]} />
                <meshStandardMaterial color="#1e293b" />
              </mesh>
            ))
          )}
          {/* Campana extractora de acero sobre el horno */}
          <group position={[0, 1.25, 0]}>
            <RoundedBox args={[0.92, 0.22, 0.65]} radius={0.03}>
              <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
            </RoundedBox>
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.15, 0.15, 0.5, 16]} />
              <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
            </mesh>
          </group>
        </group>

        {/* Armarios altos turquesas en la pared */}
        <group position={[0, 1.6, -0.4]}>
          <RoundedBox args={[2.2, 0.65, 0.38]} radius={0.04}>
            <meshStandardMaterial color={kitchenTeal} roughness={0.35} />
          </RoundedBox>
        </group>

        {/* Gran Frigorífico blanco de 2 puertas con imanes de colores */}
        <group position={[-1.6, 0.95, -0.2]}>
          <RoundedBox args={[0.95, 1.8, 0.75]} radius={0.06}>
            <meshStandardMaterial color={fridgeWhite} roughness={0.2} metalness={0.05} />
          </RoundedBox>
          {/* Línea de división de puertas */}
          <mesh position={[0, 0.1, 0.38]}>
            <boxGeometry args={[0.92, 0.02, 0.01]} />
            <meshStandardMaterial color="#94a3b8" />
          </mesh>
          {/* Tiradores plateados */}
          <mesh position={[0.4, 0.4, 0.4]}>
            <cylinderGeometry args={[0.02, 0.02, 0.4, 12]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} />
          </mesh>
          <mesh position={[0.4, -0.25, 0.4]}>
            <cylinderGeometry args={[0.02, 0.02, 0.4, 12]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} />
          </mesh>
          {/* Imanes de colores en la puerta */}
          <mesh position={[-0.2, 0.5, 0.39]}>
            <boxGeometry args={[0.1, 0.1, 0.02]} />
            <meshStandardMaterial color="#ef4444" />
          </mesh>
          <mesh position={[0.1, 0.6, 0.39]}>
            <boxGeometry args={[0.12, 0.08, 0.02]} />
            <meshStandardMaterial color="#3b82f6" />
          </mesh>
          <mesh position={[-0.1, 0.3, 0.39]}>
            <boxGeometry args={[0.09, 0.09, 0.02]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
        </group>

        {/* Cubo de basura a pedal plateado al lado del frigorífico */}
        <group position={[-2.3, 0.3, 0]}>
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.18, 0.16, 0.55, 18]} />
            <meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} />
          </mesh>
        </group>
      </group>

      {/* ========================================================
          6. LAVANDERÍA (LAUNDRY ROOM) — 1.4 LAVANDERÍA EN REMOLINO
         ======================================================== */}
      <group position={[4.9, 0.3, -2.6]}>
        {/* Suelo alicatado de lavandería */}
        <RoundedBox args={[1.9, 0.02, 3.2]} radius={0.04} position={[0, 0.01, 0]}>
          <meshStandardMaterial color="#bcaaa4" roughness={0.6} />
        </RoundedBox>

        {/* Dos lavadoras / secadoras blancas con ojo de buey circular */}
        {[-0.6, 0.5].map((zW, idx) => (
          <group key={idx} position={[0, 0.5, zW]}>
            <RoundedBox args={[0.85, 0.95, 0.85]} radius={0.06}>
              <meshStandardMaterial color={washerWhite} roughness={0.25} />
            </RoundedBox>
            {/* Ojo de buey frontal circular con cristal azulado */}
            <mesh position={[-0.43, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
              <torusGeometry args={[0.26, 0.05, 16, 32]} />
              <meshStandardMaterial color="#64748b" metalness={0.7} />
            </mesh>
            <mesh position={[-0.44, -0.05, 0]} rotation={[0, 0, Math.PI / 2]}>
              <circleGeometry args={[0.24, 24]} />
              <meshStandardMaterial color="#38bdf8" roughness={0.1} transparent opacity={0.7} />
            </mesh>
            {/* Panel de mandos y pantalla superior */}
            <mesh position={[-0.43, 0.35, 0]} rotation={[0, 0, Math.PI / 2]}>
              <boxGeometry args={[0.14, 0.02, 0.65]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
          </group>
        ))}

        {/* Cesto de ropa con prendas de colores asomando */}
        <group position={[-0.1, 0.22, 1.2]}>
          <mesh>
            <cylinderGeometry args={[0.3, 0.24, 0.44, 18]} />
            <meshStandardMaterial color="#cbd5e1" roughness={0.5} />
          </mesh>
          <mesh position={[0, 0.2, 0]}>
            <sphereGeometry args={[0.28, 14, 14]} />
            <meshStandardMaterial color="#ec4899" />
          </mesh>
          <mesh position={[0.1, 0.23, 0]}>
            <sphereGeometry args={[0.2, 12, 12]} />
            <meshStandardMaterial color="#3b82f6" />
          </mesh>
        </group>

        {/* Estante con botellas de detergente de colores vivos */}
        <group position={[0, 1.45, -0.2]} rotation={[0, Math.PI / 2, 0]}>
          <RoundedBox args={[1.8, 0.05, 0.26]} radius={0.02}>
            <meshStandardMaterial color={trimWood} />
          </RoundedBox>
          {[-0.6, -0.2, 0.2, 0.6].map((bx, i) => (
            <mesh key={i} position={[bx, 0.18, 0]}>
              <cylinderGeometry args={[0.07, 0.08, 0.32, 12]} />
              <meshStandardMaterial
                color={i === 0 ? '#10b981' : i === 1 ? '#ec4899' : i === 2 ? '#3b82f6' : '#f59e0b'}
                roughness={0.3}
              />
            </mesh>
          ))}
        </group>
      </group>

      {/* ========================================================
          7. ESCALERA CENTRAL DE MADERA CON BARANDILLA
         ======================================================== */}
      <group position={[-0.1, 0.3, -1.0]}>
        {/* Escalones que suben hacia el piso superior */}
        {Array.from({ length: 9 }).map((_, stepIdx) => (
          <group key={stepIdx} position={[0, stepIdx * 0.22, stepIdx * -0.28]}>
            <RoundedBox args={[1.2, 0.08, 0.32]} radius={0.02}>
              <meshStandardMaterial color={trimWood} roughness={0.4} />
            </RoundedBox>
            {/* Barrote vertical */}
            <mesh position={[-0.55, 0.32, 0]}>
              <cylinderGeometry args={[0.025, 0.025, 0.6, 10]} />
              <meshStandardMaterial color={woodTable} />
            </mesh>
          </group>
        ))}
        {/* Pasamanos continuo inclinado */}
        <mesh position={[-0.55, 1.35, -1.15]} rotation={[0.66, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 3.2, 12]} />
          <meshStandardMaterial color={woodTable} roughness={0.3} />
        </mesh>
      </group>

      {/* ========================================================
          8. PLANTA SUPERIOR (MEZZANINE, BAÑO Y DORMITORIO)
         ======================================================== */}
      <group position={[0, 2.3, -2.5]}>
        {/* Suelo del piso superior */}
        <RoundedBox args={[10.6, 0.12, 4.4]} radius={0.04} position={[0, 0, 0]}>
          <meshStandardMaterial color={woodFloor} roughness={0.4} />
        </RoundedBox>

        {/* --- BAÑO (UPSTAIRS IZQUIERDA) --- */}
        <group position={[-3.2, 0.1, 0]}>
          {/* Paredes de azulejos azul claro */}
          <mesh position={[0, 0.9, -2.1]}>
            <boxGeometry args={[3.8, 1.8, 0.12]} />
            <meshStandardMaterial color={bathroomBlue} roughness={0.3} />
          </mesh>
          <mesh position={[-1.9, 0.9, 0]}>
            <boxGeometry args={[0.12, 1.8, 4.2]} />
            <meshStandardMaterial color={bathroomBlue} roughness={0.3} />
          </mesh>

          {/* Bañera blanca con grifería */}
          <group position={[-0.7, 0.3, -1.2]}>
            <RoundedBox args={[1.8, 0.55, 0.9]} radius={0.12}>
              <meshStandardMaterial color={bathTubWhite} roughness={0.15} />
            </RoundedBox>
            <mesh position={[0.7, 0.38, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.2, 10]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} />
            </mesh>
          </group>

          {/* Inodoro blanco con cisterna */}
          <group position={[1.2, 0.28, -1.4]}>
            <RoundedBox args={[0.46, 0.44, 0.65]} radius={0.08} position={[0, 0, 0]}>
              <meshStandardMaterial color={bathTubWhite} roughness={0.15} />
            </RoundedBox>
            <RoundedBox args={[0.46, 0.5, 0.25]} radius={0.05} position={[0, 0.4, -0.2]}>
              <meshStandardMaterial color={bathTubWhite} roughness={0.15} />
            </RoundedBox>
          </group>

          {/* Lavabo con espejo */}
          <group position={[-0.6, 0.45, 1.2]}>
            <RoundedBox args={[0.75, 0.8, 0.5]} radius={0.06}>
              <meshStandardMaterial color={bathTubWhite} roughness={0.2} />
            </RoundedBox>
            <mesh position={[0, 0.85, -0.2]}>
              <boxGeometry args={[0.55, 0.7, 0.02]} />
              <meshStandardMaterial color="#e0f2fe" metalness={0.9} roughness={0.05} />
            </mesh>
          </group>
        </group>

        {/* --- DORMITORIO / HABITACIÓN (UPSTAIRS DERECHA) --- */}
        <group position={[2.6, 0.1, 0]}>
          {/* Paredes color lila suave */}
          <mesh position={[0, 0.9, -2.1]}>
            <boxGeometry args={[4.8, 1.8, 0.12]} />
            <meshStandardMaterial color={bedroomPurple} roughness={0.5} />
          </mesh>

          {/* Cama grande de madera con edredón a rayas multicolor */}
          <group position={[0.4, 0.38, -0.8]}>
            {/* Estructura y cabecero de madera */}
            <RoundedBox args={[2.2, 0.35, 1.8]} radius={0.06}>
              <meshStandardMaterial color={woodTable} roughness={0.4} />
            </RoundedBox>
            <RoundedBox args={[2.2, 0.65, 0.14]} radius={0.06} position={[0, 0.42, -0.85]}>
              <meshStandardMaterial color={woodTable} roughness={0.4} />
            </RoundedBox>

            {/* Colcha con rayas de colores idéntica a la imagen */}
            <group position={[0, 0.22, 0.1]}>
              <RoundedBox args={[2.1, 0.16, 1.5]} radius={0.05}>
                <meshStandardMaterial color={bedStripedPink} />
              </RoundedBox>
              <mesh position={[0, 0.09, -0.2]}>
                <boxGeometry args={[2.08, 0.02, 0.3]} />
                <meshStandardMaterial color={bedStripedYellow} />
              </mesh>
              <mesh position={[0, 0.09, 0.2]}>
                <boxGeometry args={[2.08, 0.02, 0.3]} />
                <meshStandardMaterial color={bedStripedTeal} />
              </mesh>
            </group>

            {/* Almohadas blancas mullidas */}
            <RoundedBox args={[0.7, 0.14, 0.4]} radius={0.06} position={[-0.55, 0.32, -0.55]}>
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </RoundedBox>
            <RoundedBox args={[0.7, 0.14, 0.4]} radius={0.06} position={[0.55, 0.32, -0.55]}>
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </RoundedBox>
          </group>

          {/* Gran armario ropero de madera */}
          <group position={[-1.7, 0.95, -1.0]}>
            <RoundedBox args={[0.9, 1.7, 0.6]} radius={0.04}>
              <meshStandardMaterial color={woodTable} roughness={0.4} />
            </RoundedBox>
          </group>

          {/* Escritorio de estudio con ordenador y silla */}
          <group position={[1.8, 0.4, 1.2]} rotation={[0, -Math.PI / 2, 0]}>
            <RoundedBox args={[1.3, 0.75, 0.65]} radius={0.04}>
              <meshStandardMaterial color={woodTable} />
            </RoundedBox>
            {/* Monitor de ordenador */}
            <mesh position={[0, 0.58, -0.1]}>
              <boxGeometry args={[0.55, 0.35, 0.03]} />
              <meshStandardMaterial color="#1e293b" />
            </mesh>
            {/* Silla de escritorio */}
            <mesh position={[0, 0.18, 0.55]}>
              <cylinderGeometry args={[0.22, 0.22, 0.35, 14]} />
              <meshStandardMaterial color="#0284c7" />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
};
