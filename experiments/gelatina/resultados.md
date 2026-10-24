# Animación «gelatina» del mapa de decisión — resultados

Demo aislada y descartable: abrir `index.html` en el navegador (doble clic;
no necesita servidor). `exportar_mapas.py` genera `mapas.js` con los dos
mapas reales del 1.2, calculados con Qiskit 2.5.2: XOR sin Cable Gemelo (6/12
ejemplos bien) y con Cable Gemelo (12/12).

## Respuestas

| # | Pregunta | Respuesta |
| --- | --- | --- |
| Q1 | ¿Shader con `DataTexture` o canvas 2D? | **Canvas 2D.** La consola del cerebro es una capa React sobre el canvas 3D, así que el radar vive en el DOM. Un canvas 2D dentro de la consola evita un segundo contexto WebGL y no necesita dependencias. Mezclar 1024 valores por cuadro es trivial |
| Q2 | ¿Cómo se suaviza el escalado de 32×32? | El mapa se pinta en un `OffscreenCanvas` de 32×32 y se dibuja escalado con `imageSmoothingEnabled` en calidad alta (bilineal del navegador). No se ven cuadros |
| Q3 | ¿Temblor sin bajar de 60 fps? | Se dibuja en 48 franjas horizontales, cada una desplazada A·e^(−4t)·sin(2π·2.5t + 0.35·franja). Los valores se mezclan con un *ease-out-back* que rebasa un poco y vuelve. Costo medido: **0.5–0.7 ms por cuadro** en Edge sin GPU, muy por debajo de los 16.7 ms de 60 fps |

## El componente

`MapaGelatina` recibe `mapaAnterior`, `mapaNuevo` (los `valores` del endpoint
decision-map), `resolucion`, `duracion` (400 ms por defecto) y los
`ejemplos`. Cuando cambia `mapaNuevo`, el mapa que se está mostrando pasa a
ser el anterior y arranca la transición. El carril del cerebro lo alimenta
desde S6 (mapa actual y anterior).

- **Convención de `valores`:** `valores[fila * resolucion + columna]`. La
  columna es el sensor 0, de 0 a 1; la fila es el sensor 1, de 0 a 1, con la
  fila 0 abajo.
- **Colores:** divergente magenta (P = 0) → gris neutro (0.5) → cian (P = 1),
  validados para el fondo oscuro de la consola. El par queda en la franja de
  aviso para daltonismo (ΔE 6.4), así que los ejemplos llevan forma (● lavar,
  ✕ basura) y carita (😄/😱) además del color.
- **Qué es real y qué es decorativo:** los valores del mapa son reales. La
  interpolación y el temblor son decorativos. En la demo las caritas salen
  del mapa interpolado; en el juego salen de `predictions`.

Error encontrado y corregido: la marca de tiempo de `requestAnimationFrame`
puede ser anterior al clic. Sin limitar t a [0, 1], el temblor sacaba el mapa
de la pantalla.
