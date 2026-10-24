# Spec — Q-Anacleto y Q-Boby

> Síntesis de lo ya decidido en `goal.md` (fuente de verdad), `minijuegos.md`,
> `breadboard-fregadero.md` y `siguiente-sesion.md`. Si algo aquí contradice a
> `goal.md`, manda `goal.md`. Estado: diseño cerrado, sin código del producto.

## Planteamiento del problema

Un principiante que nunca vio computación cuántica no tiene forma intuitiva
de entender qué aporta el Machine Learning cuántico (QML) frente al ML
clásico. Los materiales existentes son clases con fórmulas: aburren antes de
que la persona toque algo y, a menudo, repiten mitos (el «paralelismo
cuántico», ventajas cuánticas que no existen en clasificación).

El reto del Qiskit Fall Fest 2026 (EdTech, IEEE Computer Society PUCP) pide
una experiencia interactiva que tome un concepto de Estadística o ML y lo
mapee a su equivalente cuántico, que sea intuitiva, visualmente dinámica,
adictiva y divertida, y que el usuario aprenda QML mientras juega. El equipo
tiene unas tres horas y debe entregar un video demo grabado en local.

## Solución

Un videojuego 3D isométrico, corto y cómico. El jugador entrena a robots
torpes —Q-Anacleto, robot doméstico humanoide, en la casa; Q-Boby, perrito
robótico, en el parque— que vienen con un «Chip Rectilíneo» (un modelo
lineal). El ciclo de cada minijuego es: **dar una instrucción → ver el
desastre → abrir el cerebro y encajar fichas (compuertas y perillas) →
reintentar → ganar el cromo**.

La decisión del robot sale de un circuito real de Qiskit que corre en vivo en
un backend local. Cada minijuego cubre uno de los pares de la consigna:

| Minijuego | Clásico ➔ Cuántico | Prioridad |
| --- | --- | --- |
| 1.1 Pelusa Rebelde (tutorial) | SVM lineal ➔ codificación por rotación RY | A |
| 1.2 Fiebre en el Fregadero | SVM ➔ modelo cuántico como método de kernel (XOR) | A |
| 2.2 Doble Hueso ⭐ estrella | Monte Carlo ➔ Quantum Amplitude Estimation | A |
| 2.1 Siéntate, Gira o Despega | Descenso de gradiente ➔ regla de parameter-shift | B |
| 1.3 Chef Catástrofe | Ancho del kernel clásico ➔ escala de la codificación cuántica (isla) | B |
| 1.4 Lavandería en Remolino | Red profunda ➔ QNN con data re-uploading | C |
| 2.3 Pista Láser-Musical | Distribuciones ➔ superposición, amplitudes, interferencia | C |
| 2.4 Gran Copa Canina | Red neuronal ➔ VQC con ruido NISQ | C |

En los minijuegos de clasificación la lección honesta es «una recta no basta,
hay que curvar el espacio»; lo cuántico es *una* forma de curvarlo, no una
mejor. La única ventaja cuántica real que presenta el juego es la del 2.2:
QAE alcanza la misma precisión que Monte Carlo con muchas menos consultas al
oráculo.

## Historias de usuario

### Jugador principiante: entrar y entender

1. Como jugador principiante, quiero entender qué hacer en cada minijuego con
   no más de 14 palabras antes de tocar algo, para no sentir que estoy en una
   clase.
2. Como jugador, quiero ver al empezar cada minijuego una nota adhesiva
   ilustrada durante unos 1.5 s con ejemplos (🍽️ → 🫧 Lavar), para saber la
   tarea sin leer instrucciones.
3. Como jugador, quiero entrar a la casa por la sala y pasar a la cocina en un
   recorrido natural, para sentir que exploro un lugar y no un menú.
4. Como jugador, quiero que el baño y la habitación existan aunque no tengan
   minijuego, para que la casa se sienta completa.
5. Como jugador, quiero ver a Q-Anacleto y a Q-Boby con expresiones
   exageradas (cara LED, orejas, cola-antena), para encariñarme con ellos.
6. Como jugador, quiero que Chispa me hable con bromas y pistas de dos
   líneas, para recibir ayuda sin discursos.
7. Como jugador, quiero ver la dificultad fija del minijuego (⭐, ⭐⭐ o
   ⭐⭐⭐) solo como información, para saber qué me espera sin tener que elegir.

### Jugador: fallar con el chip simple

8. Como jugador, quiero pulsar **¡Hazlo, Q-Anacleto!** con el chip simple y
   ver al robot actuar sobre los objetos de prueba, para comprobar qué tan
   bien decide una regla recta.
9. Como jugador, quiero que un error del robot dispare un desastre cómico
   (vajilla de la abuela al basurero, gato en el recogedor), para reírme del
   fallo en vez de frustrarme.
10. Como jugador, quiero un aviso «¡Nuevo desastre!» cuando provoco un error
    distinto, para saber que lo coleccioné.
11. Como jugador, quiero ver en el HUD el contador de acierto del último
    intento, para medir mi progreso.
12. Como jugador, quiero que Chispa me sugiera abrir el cerebro tras el
    primer fallo, para descubrir el siguiente paso.

### Jugador: diagnosticar y rediseñar el cerebro

13. Como jugador, quiero abrir el cerebro del robot como una consola
    translúcida tipo Game Boy, para sentir que manipulo un juguete y no una
    fórmula.
14. Como jugador, quiero ver en el radar 2D los ejemplos etiquetados según
    sus dos sensores, para entender cómo «ve» el robot los objetos.
15. Como jugador, quiero un aro parpadeante sobre el ejemplo mal clasificado,
    para ver exactamente dónde falla la regla.
16. Como jugador, quiero arrastrar y girar la regla de plástico del chip
    simple con vista previa inmediata, para comprobar por mí mismo que una
    recta no separa ciertos patrones.
17. Como jugador, quiero un interruptor gigante entre chip simple y chip
    cuántico, para comparar ML clásico y QML en el mismo problema.
18. Como jugador, quiero ver dos cables luminosos (qubit 0 y qubit 1) con
    ranuras, para saber dónde encajar las fichas.
19. Como jugador, quiero arrastrar fichas desde una bandeja que solo muestra
    las permitidas en ese minijuego, para no perderme entre opciones.
20. Como jugador, quiero oír «¡CLACK!» y ver rayitos elásticos al encajar una
    ficha, para sentir la recompensa inmediata.
21. Como jugador, quiero una silueta guía brillante la primera vez que uso el
    chip cuántico, para saber qué ficha probar sin que me lo expliquen.
22. Como jugador, quiero que el mapa de decisión se doble «como gelatina» al
    soltar cada ficha, para ver cómo cambia la frontera del robot.
23. Como jugador, quiero que los ejemplos pasen de 😱 a 😄 cuando quedan bien
    clasificados, para notar la mejora sin leer números.
24. Como jugador, quiero que el mapa y las predicciones se actualicen en
    menos de medio segundo, para experimentar a ritmo de juego.
25. Como jugador, quiero que una ficha no permitida o una ranura ocupada se
    rechace con claridad, para entender las reglas del tablero.
26. Como jugador, quiero pulsar **¡Prueba otra vez!** y ver al robot decidir
    sobre objetos nuevos de la cinta, para saber si mi cerebro generaliza y
    no solo memoriza los ejemplos.
27. Como jugador, quiero ganar al llegar al umbral de acierto del minijuego
    (90 % por defecto), para tener una meta clara.

### Jugador: recompensa y colección

28. Como jugador, quiero que al ganar se revele sola, con destello, un cromo
    del concepto con su rareza (común, rara, holográfica o legendaria), para
    sentir la emoción de un sobre sorpresa.
29. Como jugador, quiero ver las probabilidades de cada rareza junto al
    cromo, para entender que la rareza salió de una medición cuántica real
    (regla de Born).
30. Como jugador, quiero leer en el cromo tres líneas que expliquen el
    concepto científico, para quedarme con la idea en unos 10 segundos.
31. Como jugador curioso, quiero pulsar **🔬 Rayos-X Qiskit** y ver el
    diagrama del circuito y el código Qiskit real, para comprobar que no es
    magia.
32. Como jugador, quiero un álbum de cromos que conserve mis cromos y su
    rareza entre sesiones, para querer completarlo.
33. Como jugador, quiero un álbum de desastres sin rareza, para tener un
    motivo para equivocarme a propósito y experimentar.
34. Como jugador, quiero pasar al siguiente minijuego desde el cromo, para
    mantener el ritmo.
35. Como jugador, quiero ganar estrellas de pericia (resolver, acierto alto,
    circuito corto), para tener un reto extra si me engancho.

### Jugador: minijuegos concretos

36. Como jugador del 1.1, quiero que el chip simple gane separando polvo
    frío y pequeño del gato grande y tibio, para aprender que cuando una
    recta basta no hace falta lo cuántico.
37. Como jugador del 1.1, quiero que Chispa me invite a probar los
    Giro-Sensores RY, para aprender que codificar un dato es rotar un qubit.
38. Como jugador del 1.2, quiero ver que sin Cable Gemelo el robot solo
    acierta la mitad y con él acierta todo, para entender que la medición
    cambia la frontera aunque la codificación sea la misma.
39. Como jugador del 1.2, quiero que Chispa diga que una red neuronal clásica
    también podría resolverlo, para no creer que lo cuántico es mejor aquí.
40. Como jugador del 1.3, quiero girar la Perilla de Escala de cada
    Giro-Sensor y ver la isla de panqueques agrandarse o encogerse, para
    entender que la escala de la codificación es el ancho del kernel.
40a. Como jugador del 1.3, quiero que con la escala de fábrica la isla quede
    demasiado grande y Q-Anacleto sirva panqueques crudos, para descubrir que
    tengo que ajustar la perilla.
40b. Como jugador del 1.3, quiero ver islas fantasma en los bordes si giro la
    perilla de más, para aprender que el giro es periódico y que «más» no
    siempre es mejor.
40c. Como jugador del 1.3, quiero que solo la perilla lleve a la victoria (no
    apilar fichas), para que la lección sea cierta.
41. Como jugador del 1.4, quiero comprobar que una sola capa no separa las
    espirales y dos capas sí, para entender el data re-uploading.
42. Como jugador del 2.1, quiero mover dos Perillas Doradas y ver el
    Termómetro de Mareo (la pérdida) subir o bajar, para sentir el descenso
    de gradiente con las manos.
43. Como jugador del 2.1, quiero ver que con una sola perilla lineal arreglar
    «Sentarse» estropea «Girar», para entender la limitación del modelo
    simple.
44. Como jugador del 2.1, quiero desbloquear el **Silbato Auto-Entrenar** y
    ver a un optimizador bajar la pérdida con gradientes reales de
    parameter-shift, para distinguir entrenamiento de inferencia.
45. Como jugador del 2.2, quiero que cada olfateo de Q-Boby gaste batería
    visible, para entender que cada consulta al oráculo cuesta.
46. Como jugador del 2.2, quiero ver con el chip simple (Monte Carlo) que la
    precisión sube lento y la batería se agota antes de elegir bien, para
    sentir el error ~ 1/√N.
47. Como jugador del 2.2, quiero ver con el chip cuántico (QAE) que alcanza la
    precisión pedida con muchas menos consultas, para sentir el error ~ 1/N.
48. Como jugador del 2.2, quiero una gráfica en vivo con ambas curvas de
    error contra batería gastada, cada una la trayectoria de una corrida
    real, para comparar los métodos con datos y no con dibujos.
49. Como jugador del 2.2, quiero que Chispa aclare que la ventaja es en
    consultas y que en el hardware ruidoso actual el error se satura por el
    ruido, para no salir con una idea exagerada.
50. Como jugador del 2.2, quiero desastres cómicos si elijo mal el túnel
    (rana en la nariz) o si me quedo sin batería (Q-Boby dormido en el barro),
    para que perder sea divertido.
51. Como jugador del 2.3, quiero armar el «sándwich de interferencia» y ver
    ondas que se cancelan y se refuerzan, para entender la interferencia.
52. Como jugador del 2.4, quiero un límite estricto de fichas y una Barra de
    Estática visible, y que pasarme del límite desate la Tormenta NISQ, para
    aprender que los circuitos largos sufren ruido en hardware actual.
52a. Como jurado, quiero que en el 2.4 el robot decida siempre con el
    circuito real (la estática es decorativa), para confiar en que ninguna
    decisión es inventada.

### Jurado y presentador del video

53. Como jurado, quiero ver que la decisión del robot, el acierto, el mapa,
    el entrenamiento, el QAE y la rareza salen de Qiskit corriendo en vivo,
    para confiar en que Qiskit es el núcleo del juego.
54. Como jurado, quiero que los cinco pares de la consigna queden cubiertos,
    para evaluar el ajuste al reto.
55. Como jurado, quiero que las afirmaciones científicas estén citadas con
    fuentes primarias verificadas (Schuld 2021; Brassard et al. 2002 y Suzuki
    et al. 2020 una vez verificadas), para confiar en su corrección.
56. Como presentador del video, quiero levantar todo el juego en local con un
    solo comando, para grabar la demo sin pasos manuales.
57. Como presentador del video, quiero recorrer de principio a fin los
    minijuegos de prioridad A sin fallos, para tener un video completo aunque
    B y C no estén.
58. Como presentador del video, quiero que cada respuesta de la API indique
    versión de Qiskit, simulador y milisegundos, para mostrar que el cálculo
    es real.

### Equipo de desarrollo (agentes por carril)

59. Como agente de un carril, quiero un contrato de API y un formato de
    configuración fijados en los primeros 15 minutos, para trabajar en
    paralelo con datos falsos sin pisar a los demás.
60. Como agente del carril de contenido, quiero definir un minijuego de
    clasificación nuevo solo con un archivo de configuración, para no
    escribir código por minijuego.
61. Como agente del carril del cerebro, quiero que el frontend nunca envíe
    los datos del minijuego al backend, para que el backend sea la única
    autoridad de los datos y del acierto.
62. Como agente, quiero experimentos con semilla fija que confirmen que la
    ficha que «enseña» cada concepto es la que cambia el resultado, para no
    construir contenido sobre una lección falsa.
63. Como agente, quiero comparar cada modelo cuántico con una referencia
    clásica sencilla, para validar las predicciones con datos conocidos.
64. Como integrante del equipo, quiero que lo de prioridad C pueda quedar con
    su configuración básica corriendo de verdad aunque no tenga escena
    propia, para no bloquear el video.

## Decisiones de implementación

### Arquitectura y módulos

- **Backend:** Python con uv, FastAPI y Qiskit 2.x en vivo, con `Statevector`
  para probabilidades exactas y `StatevectorSampler` donde haga falta un
  muestreo real (rareza, consultas del 2.2). Sin hardware real. Módulos
  pequeños:
  - *Contenido:* carga la configuración de un minijuego por id.
  - *Circuitos:* construye el circuito a partir de las fichas del jugador y
    un objeto, validando contra las fichas permitidas y las ranuras.
  - *Modelo:* predicción por lectura fija sobre un conjunto (`ejemplos` o
    `prueba`) y mapa de decisión.
  - *Rareza:* sorteo de 1 shot.
  - *Rayos-X:* diagrama en texto y código Qiskit equivalente.
  - *QAE (2.2):* oráculo A, operador de Grover, Monte Carlo y MLAE sobre el
    mismo oráculo.
  - *Gradientes (2.1):* regla de parameter-shift y optimizador.
- **Frontend:** Vite, TypeScript y React Three Fiber (`@react-three/drei`),
  cámara ortográfica isométrica, assets low-poly CC0. La consola del cerebro
  es una capa React sobre el canvas. Áreas:
  - *Estado:* store con zustand (configuración, modo, regla, circuito,
    último resultado, mapa actual y anterior, Rayos-X) y el bucle de juego
    (`runTask`, `checkWin`).
  - *Cerebro:* consola, interruptor, regla, ranuras, bandeja, radar 2D y la
    regla lineal calculada en TypeScript.
  - *Cliente de la API:* una función por recurso.
  - *Mundo:* casa y parque isométricos, robots, cinta, animación de cada
    resultado.
  - *Meta:* Chispa, desastres, cromos y álbumes.
- **Motor compartido:** los minijuegos de clasificación (1.1, 1.2, 1.3, 1.4,
  2.3, 2.4) reutilizan el mismo radar, fichas y endpoints; cada uno es un
  archivo de configuración. Solo 2.1 y 2.2 tienen interfaz propia.
- **Comando único:** un `package.json` en la raíz con `concurrently` levanta
  uvicorn y Vite; Vite redirige `/api` al backend en el puerto 8000.

### Decisiones cerradas del motor compartido (D1–D13)

| # | Decisión |
| --- | --- |
| D1 | Modelo de **lectura fija**: el jugador diseña el circuito y se lee la probabilidad de un resultado. Sin entrenamiento automático en clasificación |
| D2 | Encuadre científico: **modelo cuántico como método de kernel** (Schuld 2021, arXiv:2101.11020). La codificación fija el kernel; lo que va después forma parte de la medición y traza la frontera |
| D3 | El chip simple (la regla) se calcula en el frontend |
| D4 | Los datos del minijuego viven en una carpeta de contenido compartida, leída por backend y frontend |
| D5 | REST, un recurso por endpoint: predicciones, mapa de decisión, Rayos-X, sorteo de rareza |
| D6 | El mapa se recalcula al soltar cada ficha, con espera de 150 ms |
| D7 | Ejemplos etiquetados en el radar para diseñar; objetos nuevos en la cinta para medir el acierto |
| D8 | Victoria con umbral de acierto de 90 % en la cinta, ajustable por minijuego |
| D9 | Rareza: 1 shot real del circuito ganador sobre el objeto estrella; `00`, `01`, `10`, `11` = común, rara, holográfica, legendaria; se muestran las probabilidades |
| D10 | Estado del frontend en zustand |
| D11 | Álbumes en `localStorage` |
| D12 | Rayos-X como diagrama de texto de Qiskit más código |
| D13 | Comando único con `concurrently` y proxy de Vite |
| D14 | Perilla de escala: campo opcional `escala` en cada ficha de giro, con rango en la configuración; los cuerpos sin `escala` siguen siendo válidos. Las Perillas Doradas del Nivel 2 siguen el mismo patrón |
| D15 | 2.2: una llamada por método devuelve la trayectoria de una corrida real |
| D16 | 2.4: límite de fichas como regla del juego y estática decorativa; sin `qiskit-aer` |
| D17 | 2.1: `train` devuelve el historial real; las perillas a mano usan `predictions` |
| D18 | Pruebas con pytest (backend) y Vitest (frontend) |

### Contrato de la API (motor compartido)

Detalle y ejemplos en la sección 8 del breadboard. Resumen:

- Todas las rutas son `POST /api/minigames/{id}/<recurso>` y reciben en el
  cuerpo el circuito del jugador como lista de fichas `{ficha, cable, pos}`.
  El frontend nunca envía los datos del minijuego.
- `predictions`: recibe además `conjunto` (`ejemplos` | `prueba`); devuelve
  por objeto `id`, `p_accion`, `prediccion`, `correcto`, más `acierto` global
  y `meta` (versión de Qiskit, simulador, ms).
- `decision-map`: recibe `resolucion` opcional (32 por defecto); devuelve
  `resolucion²` valores de P(acción positiva), fila por fila, y `meta`.
- `xray`: devuelve `diagrama` y `codigo`.
- `rarity-draws`: no idempotente; devuelve `resultado`, `rareza`,
  `probabilidades` por rareza y `shots` (= 1).
- Las fichas de giro aceptan un campo opcional `escala`. Si no viene, se usa
  la de la configuración; solo se acepta si el minijuego define
  `perilla_escala` y dentro de su rango.
- `estimates` (2.2): recibe `metodo` (`monte_carlo` | `qae`), `tunel`,
  `presupuesto` y `semilla` opcional; devuelve la `trayectoria` de una sola
  corrida (`consultas`, `estimacion`, `error` por punto), la `estimacion`
  final, `consultas_usadas` y `meta`. `error` es |estimación − p real|, con la
  p real de la configuración.
- `train` (2.1): recibe `theta_inicial`, `iteraciones` y `tasa`; devuelve
  `historial` (`iteracion`, `theta`, `perdida`) y `meta`.
- Errores: `404` si el minijuego no existe; `422` si la ficha no está
  permitida, la ranura está ocupada, el cable está fuera de rango, la
  `escala` no está permitida o está fuera de rango, o el circuito pasa
  `limite_fichas`.

### Catálogo de fichas

| Ficha | Compuerta | Efecto |
| --- | --- | --- |
| `giro_y` | RY(escala · x[cable]) | El cable *i* codifica el sensor *i*; `escala` opcional (Perilla de Escala) |
| `giro_z` | RZ(escala · x[cable]) | Igual, en el eje Z |
| `prisma` | H | «Moneda cuántica» (nunca «explora varias posibilidades a la vez») |
| `cable_gemelo` | CX(cable → otro), ocupa ambos cables en esa posición | Combina los dos sensores en el qubit destino |

Las Perillas Doradas (parámetros θ) y el Dial de Vistazos (shots) entran en
el Nivel 2.

### Formato de configuración de minijuego

Ejemplo completo en la sección 9 del breadboard. Campos: `id`, `nivel`,
`escenario`, `habitacion`, `titulo`, `dificultad`, `sensores` (dos),
`codificacion.escala`, `lectura` (qubits leídos, resultado, acción positiva y
la otra), `ranuras`, `fichas_permitidas`, `objetos` (emoji y acción
correcta), `ejemplos` y `prueba` (id, objeto, x), `victoria.acierto_minimo`,
`objeto_estrella`, `desastres` (objeto, acción errónea, texto), `chispa`
(textos por evento: inicio, primer fallo, primera ficha, victoria) y `cromo`
(concepto, título, tres líneas).

Campos opcionales: `perilla_escala` (`min`, `max`, `paso`, en radianes por
unidad de sensor) y `limite_fichas` (número máximo de fichas; pasarse dispara
la Tormenta NISQ).

### Minijuego 1.3 «Chef Catástrofe» (rediseño verificado)

- La lección es la **escala de la codificación**. Con dos `giro_y` y lectura
  `00`, el kernel de fidelidad es cos²(escala·Δ₀/2)·cos²(escala·Δ₁/2): la
  escala es el ancho del kernel. Cerca del centro se parece a un kernel RBF
  clásico con γ ≈ escala²/4; lejos es periódico (islas fantasma).
- Configuración: `ranuras: 1`, escala de fábrica 1.5 rad, `perilla_escala`
  de 0.5 a 8 rad con paso 0.25.
- Verificado con Qiskit 2.5.2 (semilla 13): regla recta 79 %; mejor circuito
  sin tocar la perilla (búsqueda exhaustiva) 67 %; perilla entre 2.5 y 5.5
  rad, 96–100 %.
- Con dos ranuras o más se gana sin la perilla apilando dos `giro_y` en el
  mismo cable (RY(a)·RY(a) = RY(2a)). Por eso el 1.3 usa una sola ranura.
- El mapa se recalcula al soltar la perilla, con la misma espera que las
  fichas.

### Minijuego 2.2 «Doble Hueso» (estrella)

- QAE hecho a mano con 1–2 qubits, sin `qiskit-algorithms`: un operador A con
  P(medir 1) = p = sin²θ y el operador de Grover Q = A·S₀·A†·S_χ con
  compuertas explícitas, de modo que Qᵏ·A da P(1) = sin²((2k+1)θ).
- Estimación por máxima verosimilitud (MLAE) con búsqueda en una grilla de θ
  en (0, π/2). Se mantiene k = 0: sin él, una sola potencia no distingue θ de
  su alias.
- Monte Carlo y QAE usan **el mismo oráculo A**. Las consultas se cuentan
  como Σ shots·(2k+1). La batería del minijuego es ese conteo de consultas.
- La ventaja se presenta en **consultas al oráculo, no en tiempo de reloj**.
  La gráfica sale de corridas reales, nunca de curvas suavizadas a mano.
- Verificado (Qiskit 2.5.2, 200 semillas): la pendiente log-log del RMSE es
  −0.50 para Monte Carlo y −1.05 para MLAE con 30 shots por potencia.
- Batería del minijuego (dos túneles, p = 0.30 y 0.36): **180 consultas**, es
  decir, 90 por túnel con k = 0, 1, 2, 4 y 5 shots por potencia. QAE elige
  bien el túnel el 95 % de las veces y Monte Carlo cerca del 77 %; Monte
  Carlo necesita ~400 consultas por túnel (≈ 4.4 veces más).
- Una estimación completa tarda ~15 ms (el límite era 300 ms).
- La gráfica en vivo muestra la trayectoria de la ronda, que es ruidosa. La
  curva promediada del experimento (real y reproducible) puede ir en el cromo
  o en el Rayos-X.
- Chispa no dice que el ruido «se come» la ventaja: la fuente (Tanaka et al.
  2021) dice que el error se satura.
- Endpoint decidido (D15): `POST /api/minigames/doble-hueso/estimates`, una
  llamada por método. La gráfica es la trayectoria de esa corrida real; el
  frontend solo la anima punto a punto.
- La frase de Chispa sobre el ruido se apoya en una fuente verificada, sin
  simular ruido con `qiskit-aer`.
- Se eliminan los «perritos fantasma» (metáfora engañosa).

### Minijuego 2.1 «Siéntate, Gira o Despega»

- Clasificador variacional con dos Perillas Doradas θ₁, θ₂; el Termómetro de
  Mareo muestra la pérdida real.
- El gradiente se calcula con parameter-shift: dos ejecuciones del circuito
  por perilla, con el ángulo desplazado ±π/2.
- El entrenamiento corre en el backend bajo demanda (Silbato Auto-Entrenar),
  nunca por fotograma; devuelve el historial real de pérdida para animarlo.
  Referencia medida: 100 iteraciones ≈ 0.5 s.
- Endpoint (D17): `train` devuelve el historial real de pérdida y θ; mover
  las perillas a mano usa `predictions`, con θ como campo numérico opcional
  de la ficha (mismo patrón que D14).
- Pérdida del Termómetro de Mareo: promedio de (1 − P(truco correcto))², entre
  0 y 1. Verificado: el gradiente por parameter-shift coincide con
  diferencias finitas (10⁻¹¹); desde 20 inicios al azar se aprenden las cuatro
  órdenes; con una perilla congelada en mal valor no se llega. 30 iteraciones
  tardan ~230 ms. El mapeo definitivo de órdenes a trucos lo fija el carril de
  contenido.

### Minijuego 2.4 «Gran Copa Canina»

- El límite de fichas (`limite_fichas`) es una regla del juego: representa
  el presupuesto de compuertas de un chip NISQ. Pasarse dispara la Tormenta
  NISQ y el desastre, sin ejecutar el circuito.
- La Barra de Estática es decorativa. El robot decide siempre con el
  circuito real sin ruido; la estática nunca inventa acciones.
- **`limite_fichas`: 5**, el circuito mínimo que gana. Datos: pasillo
  diagonal (atrapa si viento y giro se compensan), escala 2π, lectura qubit 1.
  Verificado: la regla recta llega a 73 %, sin Cable Gemelo a 63 %, con 4
  fichas a 78 % y con 5 a 96–97 %.

### Verificación del motor compartido

Búsqueda exhaustiva con Qiskit de todos los circuitos de cada minijuego
(detalle y configuración de cada JSON en la tabla de verificación de
experimentos):

| Minijuego | Sin la ficha clave | Con ella | Regla recta |
| --- | --- | --- | --- |
| 1.1 (`giro_y`) | 50 % | 100 % | 100 % (tutorial) |
| 1.2 (`cable_gemelo`) | 45 % | 100 % | 75 % |
| 1.3 (perilla de escala) | 67 % | 96–100 % | 79 % |
| 1.4 (recarga tras el Cable Gemelo) | 85–87 % | 95 % | 72 % |
| 2.3 (H después de la fase) | 50–65 % | 100 % | 75 % |
| 2.4 (`cable_gemelo` y 5 fichas) | 63–78 % | 96–97 % | 73 % |

El 1.4 se rediseñó para que la lección sea cierta: espiral de 1 vuelta,
50 puntos por brazo y 5 ranuras.

### Honestidad científica y qué se simula

- Siempre real (Qiskit en el backend): decisión del robot con el chip
  cuántico, acierto, mapa de decisión, entrenamiento, QAE y rareza.
- Se puede simular: efectos visuales de ruido NISQ, barra de estática,
  animaciones de desastres, transiciones, la «gelatina» del mapa y cualquier
  cosa costosa que sea solo decorativa.
- Nunca se afirma ventaja cuántica en clasificación. Chispa: «Una red
  neuronal clásica también podría; aquí lo hacemos con qubits para ver cómo
  piensan».
- No se usa la Esfera de Bloch para describir el mapa de dos qubits.
- Toda cita y cápsula «¡Ajá!» se verifica contra la fuente primaria y la
  documentación oficial antes de escribirla.
- Semillas fijas en experimentos y sorteos reproducibles en pruebas.

### Animación «gelatina» del mapa

- El componente recibe mapa anterior, mapa nuevo y duración; interpola entre
  ambos (unos 400 ms) con un temblor amortiguado, sin bajar de 60 fps, y
  suaviza el escalado de 32×32 al tamaño del radar. Si se implementa con
  shader y texturas o con canvas 2D se decide en la demo aislada.

### Reparto en tres carriles (confirmado)

| Carril | Responsable de |
| --- | --- |
| 1. QML y contenido | Backend completo (motor compartido, QAE, parameter-shift, rareza, Rayos-X), configuraciones de minijuegos con datos verificados y pruebas |
| 2. Cerebro e integración | Consola, fichas, perillas, radar, interruptor, regla, cliente de la API, store y bucle de juego |
| 3. Mundo y meta | Casa y parque, robots, Chispa, desastres, cromos, álbumes, textos y guion del video |

## Decisiones de pruebas

### Qué es una buena prueba aquí

- Prueba comportamiento externo a través de la costura más alta, no detalles
  internos: lo que entra por la API y lo que sale, o lo que el jugador hace
  sobre el store y lo que el store termina mostrando.
- Codifica las lecciones científicas como invariantes: si alguien cambia un
  dataset o una escala y la ficha clave deja de importar, la prueba falla.
- Es determinista: semillas fijas en todo lo que muestrea.
- Compara contra una referencia clásica sencilla y contra datos conocidos.

### Costuras propuestas

1. **API REST del backend (costura principal).** Las pruebas llaman a los
   endpoints con un cliente de pruebas de FastAPI sobre las configuraciones
   reales del contenido. Cubren:
   - 1.2: con dos `giro_y` el acierto de `prueba` es ~50 %; al añadir
     `cable_gemelo` llega a 100 % (resultado ya verificado con Qiskit 2.5.2).
   - Por cada minijuego del motor compartido: «sin ficha clave < umbral, con
     ficha clave ≥ umbral». Es la versión permanente de la investigación 2.
   - 1.1: el chip cuántico con dos `giro_y` y la regla lineal óptima superan
     ambos el 90 %.
   - 1.3: con la escala de fábrica ningún circuito de una ranura llega al
     90 %; con dos `giro_y` y `escala` dentro de la ventana ganadora sí; la
     regla recta no. Una `escala` fuera de rango o enviada a un minijuego sin
     perilla da `422`.
   - 2.4: un circuito que pasa `limite_fichas` da `422`.
   - El mapa de decisión tiene `resolucion²` valores en [0, 1] y coincide con
     las predicciones de los mismos puntos.
   - Rareza: las probabilidades suman 1 y coinciden con las del
     `Statevector` del circuito ganador; con semilla fija el resultado es
     reproducible.
   - Rayos-X: el código devuelto reconstruye el mismo circuito.
   - Errores `404` y `422` en cada caso del contrato.
   - 1.4, 2.3 y 2.4: las invariantes de la tabla de verificación (por
     ejemplo, en el 1.4 ningún circuito que cargue cada sensor una sola vez
     llega al 90 %).
   - 2.2: con semillas fijas, la pendiente log-log del RMSE contra consultas
     queda cerca de −0.5 para Monte Carlo y cerca de −1 para MLAE (con 30
     shots por potencia; con menos, el RMSE es inestable por los alias); con
     la batería de 180 consultas MLAE acierta el túnel en ≥ 95 % de las
     semillas y Monte Carlo no; P(1) de Qᵏ·A coincide con sin²((2k+1)θ).
   - 2.1: el gradiente por parameter-shift coincide con diferencias finitas y
     la pérdida baja durante el entrenamiento.
2. **Store del frontend (costura secundaria).** Pruebas del bucle de juego
   sobre el store con el cliente de la API sustituido por respuestas de
   ejemplo del contrato: `runTask` con el chip simple usa la regla y con el
   cuántico usa las predicciones; `checkWin` respeta el umbral; un fallo
   registra el desastre una sola vez; la victoria dispara el sorteo de
   rareza y guarda el cromo en el álbum. La regla lineal se prueba como
   función pura.
3. **Contrato compartido.** Los ejemplos JSON del contrato son a la vez los
   datos falsos del frontend y la forma esperada de las respuestas del
   backend, para que ambos lados no se desalineen.

Las escenas 3D, animaciones y sonidos no tienen pruebas automáticas: se
verifican a mano durante el recorrido completo del video.

### Herramientas y antecedentes

- Backend: pytest gestionado con uv. Frontend: Vitest, que encaja con Vite.
  Ambas son dependencias de desarrollo, aprobadas por el equipo.
- Antecedentes en el repo: los scripts de experimentos, todos con semilla
  fija. Son el del modelo A (XOR 50 % sin CX y 100 % con CX, kernel de
  fidelidad idéntico con y sin CX, mapa 32×32 en ~250 ms), el del rediseño
  del 1.3, la verificación exhaustiva del motor compartido, la prueba del QAE
  y la del parameter-shift del 2.1. Sus comprobaciones pasan a ser las
  primeras pruebas de la API, y sus datasets, los JSON del contenido.

## Fuera de alcance

- Reto del Día, rachas diarias, Tuercas Doradas, tienda y sombreros.
- Palanca o tragamonedas para revelar cromos; rareza en los desastres.
- Selector de dificultad o varias dificultades por minijuego; la Tormenta
  NISQ no es un modo de juego.
- Hardware cuántico real: basta la simulación local.
- Que QML controle cada movimiento: el circuito decide la acción; la
  animación es normal.
- Cuentas, guardado en la nube, multijugador, rankings online.
- Dinero real o compras.
- Arte final pulido: basta low-poly simple y expresivo.
- Despliegue obligatorio (Render y Cloudflare Pages son un extra; Qiskit no
  corre en Cloudflare Workers).
- Dependencia de `qiskit-algorithms` para el QAE y de `qiskit-aer` para el
  ruido.
- Ruido simulado que altere las decisiones del robot.
- Afirmar ventaja cuántica en cualquier minijuego que no sea el 2.2.

## Notas adicionales

- **Orden de construcción:** A completo (obligatorio para el video); B solo
  si A está listo antes de la hora y media; luego C. C puede quedar con su
  configuración básica corriendo de verdad, sin escena ni animación propia.
- **Investigaciones previas: todas cerradas** (resumen en
  `siguiente-sesion.md`). QAE del 2.2, verificación del motor compartido,
  rediseño del 1.3, pérdida del 2.1 y demo de la gelatina. Sus resultados ya
  están incorporados en este spec.
- **Animación del mapa:** canvas 2D dentro de la consola. Mezcla los
  `valores` del mapa anterior y del nuevo en ~400 ms con un temblor
  amortiguado (0.5–0.7 ms por cuadro). Usa un divergente magenta → gris → cian
  con forma y carita como codificación secundaria. La demo es un HTML
  descartable; no se llevó al stack.
- **Convención de `valores` del mapa:** `valores[fila * resolucion +
  columna]`; la columna es el sensor 0 y la fila el sensor 1, de 0 a 1, con
  la fila 0 abajo.
- **Citas verificadas** en arXiv: Schuld (2021); Brassard et al. (2002);
  Suzuki et al. (2020); Tanaka et al. (2021); Pérez-Salinas et al. (2020);
  Schuld, Sweke y Meyer (2021).
- El cambio de contrato D14 (campo `escala`) es aditivo y queda dentro del
  contrato que se fija en los primeros 15 minutos.
- Mantener la documentación en español y registrar en `goal.md` cualquier
  decisión que cambie a raíz de las investigaciones.
