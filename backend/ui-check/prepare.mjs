// Copias desechables para validar sin crear ni modificar archivos de D01.
import { cp, mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const here = path.dirname(fileURLToPath(import.meta.url));
const repo = path.resolve(here, '../..');
const target = path.join(here, '.generated');
await mkdir(path.join(target, 'src/api'), { recursive: true });
for (const game of ['doble-hueso', 'trucos']) {
  await cp(path.join(repo, `frontend/src/minigames/${game}`), path.join(target, `src/minigames/${game}`), { recursive: true });
  await mkdir(path.join(target, 'content'), { recursive: true });
  await cp(path.join(repo, `content/minigames/${game}.json`), path.join(target, `content/${game}.json`));
}
await cp(path.join(here, 'client.ts'), path.join(target, 'src/api/client.ts'));
await cp(path.join(here, 'preview.tsx'), path.join(target, 'src/preview.tsx'));
await cp(path.join(here, 'render.test.tsx'), path.join(target, 'render.test.tsx'));
await cp(path.join(here, 'live.test.ts'), path.join(target, 'live.test.ts'));
await writeFile(path.join(target, 'index.html'), '<!doctype html><html lang="es"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Giovanni · Validación de minijuegos</title></head><body style="margin:0;background:#DEE7ED"><div id="root"></div><script type="module" src="/src/preview.tsx"></script></body></html>');
await writeFile(path.join(target, 'vite.config.ts'), `import { defineConfig } from 'vite';\nexport default defineConfig({ esbuild: { jsx: 'automatic' }, server: { proxy: { '/api': 'http://127.0.0.1:8000' } } });\n`);
