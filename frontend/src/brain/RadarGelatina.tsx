import React, { useEffect, useRef } from 'react';
import type {
  DecisionMapResponse,
  MinigameConfig,
  PredictionsResponse,
} from '../api/types';
import type { ModoCerebro } from '../state/store';
import type { ReglaLineal } from './linearRule';

interface RadarGelatinaProps {
  config: MinigameConfig;
  modo: ModoCerebro;
  regla: ReglaLineal;
  mapaActual: DecisionMapResponse | null;
  mapaAnterior: DecisionMapResponse | null;
  resultadoEjemplos: PredictionsResponse | null;
  onUpdateRuler: (parcial: Partial<ReglaLineal>) => void;
  duracionMs?: number;
}

const POLO_POSITIVO: [number, number, number] = [17, 151, 179]; // #1197b3 cian
const POLO_NEGATIVO: [number, number, number] = [217, 58, 144]; // #d93a90 magenta
const POLO_NEUTRO: [number, number, number] = [68, 71, 90]; // #44475a gris neutro

function colorDivergente(v: number): [number, number, number] {
  const t = Math.min(1, Math.max(0, v));
  const [a, b, u] =
    t < 0.5
      ? [POLO_NEGATIVO, POLO_NEUTRO, t / 0.5]
      : [POLO_NEUTRO, POLO_POSITIVO, (t - 0.5) / 0.5];
  return [
    Math.round(a[0] + (b[0] - a[0]) * u),
    Math.round(a[1] + (b[1] - a[1]) * u),
    Math.round(a[2] + (b[2] - a[2]) * u),
  ];
}

const easeOutBack = (t: number): number =>
  1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);

export const RadarGelatina: React.FC<RadarGelatinaProps> = ({
  config,
  modo,
  regla,
  mapaActual,
  mapaAnterior,
  resultadoEjemplos,
  onUpdateRuler,
  duracionMs = 400,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animStartRef = useRef<number>(-1);
  const lastMapaRef = useRef<number[] | null>(null);
  const dragModeRef = useRef<'none' | 'translate' | 'rotate'>('none');

  useEffect(() => {
    if (mapaActual?.valores && mapaActual.valores !== lastMapaRef.current) {
      lastMapaRef.current = mapaActual.valores;
      animStartRef.current = performance.now();
    }
  }, [mapaActual]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const res = mapaActual?.resolucion ?? 32;
    const offscreen = document.createElement('canvas');
    offscreen.width = res;
    offscreen.height = res;
    const offCtx = offscreen.getContext('2d')!;
    const imgData = offCtx.createImageData(res, res);
    const actualBuf = new Float32Array(res * res);

    let rafId = 0;

    const [minR, maxR] = config.rango ?? [0, 1];
    const spanR = Math.max(1e-6, maxR - minR);

    const margen = (L: number) => 0.075 * L;
    const aPantalla = (x: number, y: number, L: number): [number, number] => {
      const m = margen(L);
      const lado = L - 2 * m;
      const u = (x - minR) / spanR;
      const v = (y - minR) / spanR;
      return [
        m + ((u * (res - 1) + 0.5) / res) * lado,
        m + (1 - (v * (res - 1) + 0.5) / res) * lado,
      ];
    };

    const renderFrame = (ahora: number) => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const cssSize = canvas.clientWidth || 300;
      const L = Math.round(cssSize * dpr);
      if (canvas.width !== L || canvas.height !== L) {
        canvas.width = L;
        canvas.height = L;
      }

      const m = margen(L);
      const lado = L - 2 * m;

      ctx.fillStyle = '#0e1433';
      ctx.fillRect(0, 0, L, L);

      if (modo === 'simple') {
        // Dibujar mapa de la regla lineal en la grilla res x res
        const nx = Math.cos(regla.angulo);
        const ny = Math.sin(regla.angulo);
        for (let f = 0; f < res; f++) {
          const y = minR + (f / (res - 1)) * spanR;
          for (let c = 0; c < res; c++) {
            const x = minR + (c / (res - 1)) * spanR;
            const score = nx * x + ny * y - regla.desplazamiento;
            const p = 1 / (1 + Math.exp(-10 * score));
            const [r, g, b] = colorDivergente(p);
            const idx = ((res - 1 - f) * res + c) * 4;
            imgData.data[idx] = r;
            imgData.data[idx + 1] = g;
            imgData.data[idx + 2] = b;
            imgData.data[idx + 3] = 255;
          }
        }
        offCtx.putImageData(imgData, 0, 0);
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(offscreen, 0, 0, res, res, m, m, lado, lado);

        // Dibujar la regla de plástico rígida y sus manijas
        const cx = minR + 0.5 * spanR;
        const cy = minR + 0.5 * spanR;
        // Punto más cercano sobre la recta n·x = d al centro
        const distCentro = nx * cx + ny * cy - regla.desplazamiento;
        const px0 = cx - distCentro * nx;
        const py0 = cy - distCentro * ny;
        const tx = -ny;
        const ty = nx;

        const [sx0, sy0] = aPantalla(px0 - tx * spanR * 1.5, py0 - ty * spanR * 1.5, L);
        const [sx1, sy1] = aPantalla(px0 + tx * spanR * 1.5, py0 + ty * spanR * 1.5, L);
        const [scx, scy] = aPantalla(px0, py0, L);
        const [srx, sry] = aPantalla(
          px0 + tx * spanR * 0.28,
          py0 + ty * spanR * 0.28,
          L
        );

        ctx.save();
        ctx.beginPath();
        ctx.rect(m, m, lado, lado);
        ctx.clip();

        // Cuerpo translúcido de la regla de plástico
        ctx.strokeStyle = 'rgba(255, 238, 153, 0.92)';
        ctx.lineWidth = Math.max(4, L * 0.016);
        ctx.beginPath();
        ctx.moveTo(sx0, sy0);
        ctx.lineTo(sx1, sy1);
        ctx.stroke();

        // Manija central (desplazar)
        ctx.fillStyle = '#ffd166';
        ctx.strokeStyle = '#0b1030';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(scx, scy, Math.max(8, L * 0.03), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Manija lateral (girar)
        ctx.fillStyle = '#78ddd9';
        ctx.beginPath();
        ctx.arc(srx, sry, Math.max(7, L * 0.025), 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.restore();
      } else {
        // Modo cuántico: interpolación gelatina de mapaAnterior -> mapaActual
        const nuevo =
          mapaActual?.valores ?? new Array(res * res).fill(0.5);
        const anterior = mapaAnterior?.valores ?? nuevo;
        const inicio = animStartRef.current;
        const t =
          inicio < 0
            ? 1
            : Math.min(1, Math.max(0, (ahora - inicio) / duracionMs));
        const mezcla = easeOutBack(t);

        for (let k = 0; k < actualBuf.length; k++) {
          const a = anterior[k] ?? 0.5;
          const n = nuevo[k] ?? 0.5;
          actualBuf[k] = a + (n - a) * mezcla;
        }

        for (let f = 0; f < res; f++) {
          for (let c = 0; c < res; c++) {
            const [r, g, b] = colorDivergente(actualBuf[f * res + c]);
            const p = ((res - 1 - f) * res + c) * 4;
            imgData.data[p] = r;
            imgData.data[p + 1] = g;
            imgData.data[p + 2] = b;
            imgData.data[p + 3] = 255;
          }
        }
        offCtx.putImageData(imgData, 0, 0);

        const franjas = 48;
        const alto = lado / franjas;
        const amp = t < 1 ? 0.03 * L * Math.exp(-4 * t) : 0;
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        for (let s = 0; s < franjas; s++) {
          const dx = amp * Math.sin(2 * Math.PI * 2.5 * t + s * 0.35);
          ctx.drawImage(
            offscreen,
            0,
            (s / franjas) * res,
            res,
            res / franjas,
            m + dx,
            m + s * alto,
            lado,
            alto + 1
          );
        }
      }

      // Dibujar ejemplos con forma secundaria (● positivo, ✕ negativo), emoji, carita 😄/😱 y aro parpadeante
      const predMap = new Map(
        (resultadoEjemplos?.predicciones ?? []).map((p) => [p.id, p])
      );
      const accionPos = config.lectura?.accion ?? 'lavar';
      const ejemplos = config.ejemplos ?? [];
      const pulse = 0.5 + 0.5 * Math.sin(ahora * 0.009);

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      for (const ej of ejemplos) {
        const [px, py] = aPantalla(ej.x[0], ej.x[1], L);
        const objCfg = config.objetos?.[ej.objeto];
        const esPositivo = (objCfg?.accion ?? accionPos) === accionPos;
        const pred = predMap.get(ej.id);
        const bien = pred ? pred.correcto : true;
        const rr = Math.max(6, L * 0.022);

        // Aro parpadeante sobre los ejemplos mal clasificados
        if (!bien) {
          ctx.save();
          ctx.strokeStyle = `rgba(255, 190, 92, ${0.45 + 0.5 * pulse})`;
          ctx.lineWidth = Math.max(2.5, L * 0.008);
          ctx.beginPath();
          ctx.arc(px, py, rr * (1.65 + 0.35 * pulse), 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }

        // Forma secundaria (● o ✕) para accesibilidad cromática
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = Math.max(2, L * 0.006);
        ctx.beginPath();
        if (esPositivo) {
          ctx.arc(px, py, rr, 0, Math.PI * 2);
        } else {
          ctx.moveTo(px - rr, py - rr);
          ctx.lineTo(px + rr, py + rr);
          ctx.moveTo(px + rr, py - rr);
          ctx.lineTo(px - rr, py + rr);
        }
        ctx.stroke();

        // Emoji del objeto y carita 😄/😱
        ctx.font = `${Math.round(L * 0.044)}px system-ui, sans-serif`;
        ctx.fillText(objCfg?.emoji ?? '🔹', px, py);
        ctx.font = `${Math.round(L * 0.038)}px system-ui, sans-serif`;
        const offsetX = (ej.x[0] > (minR + maxR) / 2 ? -1 : 1) * rr * 2.1;
        const offsetY = (ej.x[1] > (minR + maxR) / 2 ? 1 : -1) * rr * 2.1;
        ctx.fillText(bien ? '😄' : '😱', px + offsetX, py + offsetY);
      }

      // Etiquetas de ejes de sensores
      const s0 = config.sensores?.[0] ?? 'sensor 0';
      const s1 = config.sensores?.[1] ?? 'sensor 1';
      ctx.fillStyle = '#b9bfe6';
      ctx.font = `600 ${Math.max(10, Math.round(L * 0.032))}px system-ui, sans-serif`;
      ctx.fillText(`${s0} →`, L / 2, L - m * 0.38);
      ctx.save();
      ctx.translate(m * 0.38, L / 2);
      ctx.rotate(-Math.PI / 2);
      ctx.fillText(`${s1} →`, 0, 0);
      ctx.restore();

      rafId = requestAnimationFrame(renderFrame);
    };

    rafId = requestAnimationFrame(renderFrame);
    return () => cancelAnimationFrame(rafId);
  }, [config, modo, regla, mapaActual, mapaAnterior, resultadoEjemplos, duracionMs]);

  // Interacción con la regla en el canvas (arrastrar para desplazar o girar)
  const pointerToSensor = (e: React.PointerEvent<HTMLCanvasElement>): [number, number] => {
    const rect = e.currentTarget.getBoundingClientRect();
    const u = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    const v = Math.min(1, Math.max(0, 1 - (e.clientY - rect.top) / rect.height));
    const [minR, maxR] = config.rango ?? [0, 1];
    return [minR + u * (maxR - minR), minR + v * (maxR - minR)];
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (modo !== 'simple') return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const [x, y] = pointerToSensor(e);
    const [minR, maxR] = config.rango ?? [0, 1];
    const cx = (minR + maxR) / 2;
    const cy = (minR + maxR) / 2;
    const distFromCenter = Math.hypot(x - cx, y - cy);
    dragModeRef.current =
      distFromCenter > (maxR - minR) * 0.22 ? 'rotate' : 'translate';
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (modo !== 'simple' || dragModeRef.current === 'none') return;
    const [x, y] = pointerToSensor(e);
    const [minR, maxR] = config.rango ?? [0, 1];
    const cx = (minR + maxR) / 2;
    const cy = (minR + maxR) / 2;

    if (dragModeRef.current === 'rotate') {
      const ang = Math.atan2(y - cy, x - cx);
      onUpdateRuler({ angulo: (ang + Math.PI * 2) % (Math.PI * 2) });
    } else {
      const nx = Math.cos(regla.angulo);
      const ny = Math.sin(regla.angulo);
      onUpdateRuler({ desplazamiento: Number((nx * x + ny * y).toFixed(3)) });
    }
  };

  const handlePointerUp = () => {
    dragModeRef.current = 'none';
  };

  return (
    <canvas
      ref={canvasRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      aria-label="Radar 2D de sensores y mapa de decisión"
      style={{
        width: '100%',
        maxWidth: 320,
        aspectRatio: '1 / 1',
        display: 'block',
        borderRadius: 14,
        border: '1px solid rgba(120, 221, 217, 0.35)',
        cursor: modo === 'simple' ? 'grab' : 'default',
        touchAction: 'none',
      }}
    />
  );
};
