import React from 'react';
import { useGameStore } from '../../state/store';

export const ChispaBubble: React.FC = () => {
  const chispa = useGameStore((s) => s.chispa);

  if (!chispa) return null;

  return (
    <div
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: 18,
        left: 18,
        zIndex: 40,
        maxWidth: 'min(440px, calc(100vw - 180px))',
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        background: 'rgba(255, 255, 255, 0.94)',
        border: '2px solid var(--color-azul-pastel)',
        borderRadius: 20,
        padding: '10px 16px',
        boxShadow: '0 10px 28px rgba(36, 59, 83, 0.14)',
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #B9D8F2, #78DDD9)',
          border: '2px solid var(--color-azul-tinta)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
          flexShrink: 0,
        }}
        title="Chispa — Luciérnaga-dron guía"
      >
        🧚‍♀️
      </div>
      <div>
        <div
          style={{
            fontSize: 11,
            fontWeight: 800,
            color: '#0284c7',
            textTransform: 'uppercase',
            letterSpacing: 0.5,
          }}
        >
          Chispa · Guía Cuántica
        </div>
        <div
          style={{
            fontSize: 13.5,
            fontWeight: 600,
            color: 'var(--color-azul-tinta)',
            lineHeight: 1.35,
          }}
        >
          {chispa}
        </div>
      </div>
    </div>
  );
};
