import React, { useState, useRef } from 'react';
import type { PerillaEscalaConfig } from '../api/types';

interface PerillaEscalaProps {
  cable: number;
  pos: number;
  valorInicial: number;
  config: PerillaEscalaConfig;
  onCommit: (cable: number, pos: number, nuevaEscala: number) => void;
}

export const PerillaEscala: React.FC<PerillaEscalaProps> = ({
  cable,
  pos,
  valorInicial,
  config,
  onCommit,
}) => {
  const [valor, setValor] = useState<number>(valorInicial);
  const draggingRef = useRef<{ startY: number; startVal: number } | null>(null);

  const clampStep = (v: number): number => {
    const clamped = Math.min(config.max, Math.max(config.min, v));
    const steps = Math.round((clamped - config.min) / config.paso);
    return Number((config.min + steps * config.paso).toFixed(2));
  };

  const frac = (valor - config.min) / Math.max(0.001, config.max - config.min);
  const angleDeg = -135 + frac * 270;

  const handlePointerDown = (e: React.PointerEvent) => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    draggingRef.current = { startY: e.clientY, startVal: valor };
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    e.stopPropagation();
    const dy = draggingRef.current.startY - e.clientY;
    const span = config.max - config.min;
    const next = clampStep(draggingRef.current.startVal + (dy / 90) * span);
    setValor(next);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!draggingRef.current) return;
    e.stopPropagation();
    draggingRef.current = null;
    onCommit(cable, pos, valor);
  };

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 3,
        marginTop: 4,
        padding: '4px 6px',
        borderRadius: 8,
        background: 'rgba(11, 16, 48, 0.72)',
        border: '1px solid rgba(120, 221, 217, 0.45)',
      }}
      title="Arrastra verticalmente o usa la barra para girar la Perilla de Escala"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <div
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          style={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            background:
              'radial-gradient(circle at 35% 30%, #ffe699, #d49b27 75%, #8a5a00)',
            border: '2px solid #fff3c4',
            position: 'relative',
            cursor: 'ns-resize',
            boxShadow: '0 2px 6px rgba(0,0,0,0.45)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: 3,
              height: 11,
              background: '#0b1030',
              borderRadius: 2,
              transformOrigin: '50% 100%',
              transform: `translate(-50%, -100%) rotate(${angleDeg}deg)`,
            }}
          />
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: '#ffe699',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {valor.toFixed(2)} rad
        </span>
      </div>
      <input
        type="range"
        min={config.min}
        max={config.max}
        step={config.paso}
        value={valor}
        aria-label={`Perilla de escala cable ${cable}`}
        onChange={(e) => setValor(clampStep(Number(e.target.value)))}
        onMouseUp={() => onCommit(cable, pos, valor)}
        onTouchEnd={() => onCommit(cable, pos, valor)}
        onKeyUp={() => onCommit(cable, pos, valor)}
        style={{ width: 78, accentColor: '#ffd166', cursor: 'pointer' }}
      />
    </div>
  );
};
