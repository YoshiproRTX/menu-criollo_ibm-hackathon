# Backend local — G01–G09

Requiere Python 3.11 o superior y uv. Desde `backend/`:

```sh
uv sync --locked
uv run uvicorn app.main:app --port 8000
```

`GET http://localhost:8000/api/health` devuelve `ok` y la versión del paquete
Qiskit importado. La documentación OpenAPI está en `/docs`.

## Pruebas

```sh
uv run pytest
```

Se comprueban health, contenido, predicciones reales, validación 422, mapas,
Rayos-X reconstruible, sorteos Born, convergencia de Trucos y lecciones de los
seis minijuegos de clasificación. Incluye dos pruebas estadísticas de QAE
marcadas `slow` (50 y 200 semillas). Para omitirlas: `uv run pytest -m "not slow"`.

## API implementada

Los seis recursos POST bajo `/api/minigames/{id}/` responden `404` con `detail`
en español si falta el minijuego. Las solicitudes inválidas devuelven 422 con
`detail` en español. Los resultados incluyen versión real de Qiskit, simulador
y duración de cálculo en milisegundos.

- `predictions`: clasificación por lectura fija; para Trucos añade `perdida`.
- `decision-map`: centros de celda, rango del JSON, resolución 1–64; usa
  evolución Statevector con operadores Qiskit reutilizados para reducir latencia.
- `xray`: diagrama y código autocontenido equivalente, sobre el objeto estrella.
- `rarity-draws`: medición real de un shot, `semilla` opcional; despacha por tipo.
- `estimates`: solo Doble Hueso. Sampler real, MLAE o Monte Carlo sobre el mismo
  oráculo; presupuesto máximo por llamada igual a la batería. La pantalla divide
  180 consultas entre ambos túneles. Para QAE se conserva k=0 y se trunca el
  esquema si no cabe: `consultas_usadas` puede ser menor que el presupuesto.
- `train`: solo Trucos, 1–100 iteraciones y tasa >0 hasta 2; parameter-shift con
  regla de la cadena. Los ángulos se envuelven en [-π, π] tras cada actualización.

`app/content.py` busca los JSON en `content/minigames/` relativo al repositorio,
los conserva en una caché en memoria y devuelve copias para evitar modificaciones
accidentales. Reiniciar el backend al cambiar archivos de contenido ya cargados.
Los ocho JSON del producto se regeneran con
`uv run python scripts/export_content.py`; las semillas y el orden de consumo
reproducen los experimentos del equipo. Los tests comparan directamente las
nubes exportadas con `experiments/verificar_minijuegos.py`. No cambiar los
datasets sin volver a comprobar sus lecciones.

Trucos fija el mapeo binario: silbato/mano iguales → sentarse; diferentes → girar.
Para órdenes binarias, el entrenamiento calcula una vez el operador Qiskit del
ansatz y obtiene cada salida de su columna correspondiente, verificada contra
los circuitos completos. No reemplaza la simulación por una curva analítica.
Las semillas de Doble Hueso se separan por túnel; un Generator compartido entre
PUBs evita correlaciones artificiales entre potencias. Las trayectorias conservan
sus valores completos, sin redondear ni suavizar.

Los ocho JSON de `content/contract/` son respuestas **sintéticas** destinadas a
los mocks del frontend. Todos incluyen `meta.simulador: "mock"` y `meta.ms: 0`;
esos números no son mediciones. `xray`, `rarity-draws` y `error-422` también
incluyen ese `meta` aditivo por instrucción de G01. El mapa tiene 1024 valores
fila por fila y un degradado en el sensor 0. Los ejemplos de estimación y
entrenamiento solo fijan la forma del contrato, no sus algoritmos.

## Pantallas del carril Giovanni

Código en `frontend/src/minigames/doble-hueso/` y `trucos/`. Las dos exportan
un componente por defecto con las props acordadas e importan el cliente de D01.
El cliente y montaje de Daniel no existen aún en este checkout. El banco aislado
[ui-check/](ui-check/README.md) permite validar TypeScript, compilación, render
estático, lógica y animaciones con API real sin crear archivos ajenos a este
carril. Su adaptador HTTP es solo de pruebas. La integración final y la revisión
visual a 1280×720 permanecen pendientes.
