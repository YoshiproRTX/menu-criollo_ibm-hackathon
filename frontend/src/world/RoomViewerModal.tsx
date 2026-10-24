import React, { useState } from 'react';

export interface ConceptArtGalleryItem {
  id: string;
  titulo: string;
  categoria: 'entorno' | 'personaje';
  descripcion: string;
  src: string;
}

export const CONCEPT_ARTS: ConceptArtGalleryItem[] = [
  {
    id: 'casa',
    titulo: 'Casa Completa (Diorama Isométrico)',
    categoria: 'entorno',
    descripcion:
      'Corte arquitectónico de la casa con la Sala de Pelusa, la Cocina del Chef, la Lavandería y los dormitorios superiores.',
    src: '/assets/images/casa_isometrica.jpg',
  },
  {
    id: 'sala',
    titulo: 'Sala de Estar (Operación Pelusa)',
    categoria: 'entorno',
    descripcion:
      'Detalle acogedor de la sala: sofá verde menta con cojines geométricos, alfombra persa, mesa baja y plantas.',
    src: '/assets/images/sala_cozy.jpg',
  },
  {
    id: 'cocina',
    titulo: 'Cocina & Comedor (Fregadero y Chef)',
    categoria: 'entorno',
    descripcion:
      'Comedor de madera noble, vigas rústicas, ventanal arqueado con luz dorada y cocina contigua.',
    src: '/assets/images/comedor_cocina.jpg',
  },
  {
    id: 'lavanderia',
    titulo: 'Lavandería en Remolino',
    categoria: 'entorno',
    descripcion:
      'Lavadoras frontales, estantes repletos de detergentes de colores, cesta de ropa y tendedero con ropa colgada.',
    src: '/assets/images/lavanderia_cozy.jpg',
  },
  {
    id: 'qanacleto',
    titulo: 'Q-Anacleto (Hoja de Modelo Oficial)',
    categoria: 'personaje',
    descripcion:
      'Vistas 0°, 3/4, 90°, 180° y cenital del robot asistente: casco redondeado, visor LED cian, peto celeste y mochila.',
    src: '/assets/images/qanacleto_model_sheet.jpg',
  },
  {
    id: 'qboby',
    titulo: 'Q-Boby (Hoja de Modelo Cyber-Corgi)',
    categoria: 'personaje',
    descripcion:
      'Corgi robótico con pantalla CRT de formas geométricas de neón, orejitas caídas, antena azul y cola con tira luminosa.',
    src: '/assets/images/qboby_model_sheet.jpg',
  },
];

export const RoomViewerModal: React.FC<{
  abierto: boolean;
  onCerrar: () => void;
  initialId?: string;
}> = ({ abierto, onCerrar, initialId = 'casa' }) => {
  const [activoId, setActivoId] = useState<string>(initialId);

  if (!abierto) return null;

  const item = CONCEPT_ARTS.find((c) => c.id === activoId) ?? CONCEPT_ARTS[0];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 85,
        background: 'rgba(11, 16, 48, 0.82)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          width: 'min(980px, 96vw)',
          maxHeight: '92vh',
          overflowY: 'auto',
          background: '#ffffff',
          color: '#1e293b',
          borderRadius: 24,
          boxShadow: '0 25px 70px rgba(0, 0, 0, 0.55)',
          border: '2px solid #b9d8f2',
          padding: 22,
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}
      >
        {/* Cabecera del visor */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #e2e8f0',
            paddingBottom: 12,
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 800,
                color: '#0284c7',
                textTransform: 'uppercase',
                letterSpacing: 0.8,
              }}
            >
              🎨 Galería de Diseños Originales · Carpeta Imágenes
            </div>
            <h2 style={{ margin: '2px 0 0', fontSize: 20 }}>{item.titulo}</h2>
          </div>

          <button
            type="button"
            onClick={onCerrar}
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: 999,
              padding: '6px 14px',
              fontWeight: 700,
              fontSize: 13,
            }}
          >
            ✕ Cerrar
          </button>
        </div>

        {/* Pestañas de selección de diseño */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {CONCEPT_ARTS.map((art) => {
            const esActivo = art.id === activoId;
            return (
              <button
                key={art.id}
                type="button"
                onClick={() => setActivoId(art.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 999,
                  border: esActivo ? '2px solid #0284c7' : '1px solid #cbd5e1',
                  background: esActivo ? '#e0f2fe' : '#ffffff',
                  color: esActivo ? '#0284c7' : '#475569',
                  fontWeight: esActivo ? 800 : 600,
                  fontSize: 12.5,
                }}
              >
                {art.categoria === 'personaje' ? '🤖 ' : '🏡 '}
                {art.titulo.split('(')[0].trim()}
              </button>
            );
          })}
        </div>

        {/* Imagen en alta resolución y descripción */}
        <div
          style={{
            position: 'relative',
            borderRadius: 16,
            overflow: 'hidden',
            background: '#0f172a',
            border: '1px solid #cbd5e1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 400,
            maxHeight: '62vh',
          }}
        >
          <img
            src={item.src}
            alt={item.titulo}
            style={{
              width: '100%',
              height: '100%',
              maxHeight: '60vh',
              objectFit: 'contain',
            }}
          />
        </div>

        <div
          style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: 14,
            padding: '10px 16px',
            fontSize: 13,
            color: '#334155',
            lineHeight: 1.45,
          }}
        >
          {item.descripcion}
        </div>
      </div>
    </div>
  );
};
