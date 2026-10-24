# Banco de pruebas de Giovanni

D01 todavía no existe en este checkout. Este proyecto aislado valida las dos
carpetas de componentes sin modificar el frontend de Daniel. No es el esqueleto
del juego ni sustituye D01. Solo usa React, TypeScript, Vite y Vitest del stack.

```sh
npm ci
npm run test
npm run check
npm run build
```

Para probar con el backend real, arrancarlo en 8000 y ejecutar aquí `npm run dev`;
abrir http://127.0.0.1:5174/?semilla=7. `prepare.mjs` genera copias desechables en
`.generated/`, con un adaptador HTTP exclusivo de validación. No se copian al
frontend ni se modifican archivos del carril Daniel.

Con el backend encendido, ejecutar las dos pruebas HTTP de animación con
`QB_LIVE=1 npm run test` (PowerShell: `$env:QB_LIVE='1'`, luego `npm.cmd run test`).
Comprueban que cada punto mostrado es el recibido por API y que las fichas
finales de Trucos consiguen acierto 1.0. Sin esa variable se omiten esas dos
pruebas; el resto no requiere servidor. Esto no sustituye la revisión visual.

Los componentes importan `../../api/client`, tal como prevé D01. Firmas usadas:

- `postEstimates(id, { metodo, tunel, presupuesto?, semilla? })`.
- `getPredictions(id, { fichas }, conjunto)`.
- `postTrain(id, { theta_inicial, iteraciones, tasa })`.

Cuando llegue D01, comprobar estas firmas contra su cliente real y ejecutar
los tests dentro del frontend. El montaje en el parque corresponde a D06.
