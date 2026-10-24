import { expect, it } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import DobleHueso from './src/minigames/doble-hueso';
import Trucos from './src/minigames/trucos';
import doble from './content/doble-hueso.json';
import trucos from './content/trucos.json';

const props = { onWin: () => {}, onDisaster: () => {}, chispaSay: () => {} };
it('expone controles etiquetados y una gráfica accesible para Doble Hueso', () => {
  const html = renderToStaticMarkup(<DobleHueso config={doble} {...props} />);
  expect(html).toContain('aria-label="Chip del robot"');
  expect(html).toContain('aria-label="Error de estimación frente a consultas por túnel"');
  expect(html).toContain('180 / 180 consultas');
});
it('Trucos no inventa una pérdida antes de recibir inferencia', () => {
  const html = renderToStaticMarkup(<Trucos config={trucos} {...props} />);
  expect(html).toContain('Leyendo el modelo');
  expect(html).toContain('Perilla Dorada 1');
  expect(html).toContain('Perilla Dorada 2');
  expect(html).toContain('disabled=""');
});
