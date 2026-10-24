> Alcance, prioridades y decisiones: ver [goal.md](goal.md), que manda sobre
> este documento. Aquí se describe el diseño de cada minijuego.

# 🎨 1. Temática y diseño visual: «El Taller Retro-Pop de Villa Qubit»

Para que sea educativo sin parecer jamás una clase escolar, la estética ideal es **Ciencia Ficción de Juguete (Toyetic Cartoon)**: una mezcla entre el carisma de *WALL-E*, el caos colorido de *Overcooked!* y el humor rápido de *WarioWare*.

## 1.1. La historia en 10 segundos

En Villa Qubit, una fábrica vendió miles de robots domésticos y mascotas robóticas en oferta con un chip baratísimo llamado **«Chip Rectilíneo v1.0»**, que solo sabe pensar trazando una línea recta.

Todo el barrio es un desastre cómico.

Tú eres el dueño de un alegre **Taller de Mentes Cuánticas**: abres la tapita de sus cabezas y cambias su chip rígido por un **Cerebro Cuántico** para enseñarles a decidir correctamente.

## 1.2. Contraste visual

### 🏠 Afuera: la casa y el parque

- **Paleta:** crema, coral, amarillo mantequilla y verde menta.
- **Estilo:** caricaturas con trazos gruesos y redondeados.
- **Animaciones:** reacciones exageradas cuando algo sale mal, como espuma, platos volando y chispas de cómic.

### ⚛️ Adentro: el cerebro cuántico

Al abrir la cabecita del personaje aparece una consola translúcida estilo juguete retro, similar a una Game Boy Color luminosa.

- **Paleta:** azul espacial, cian y magenta.
- **Compuertas:** fichas magnéticas gomosas en lugar de letras frías.
- **Interacciones:** las fichas hacen «¡CLACK!» al encajarlas y lanzan rayitos elásticos cuando se entrelazan los cables.

## 1.3. Personajes

### 🤖 Q-Anacleto — Robot doméstico humanoide (Nivel 1)

Robot humanoide de estilo retro de los años 60.

**Características:**
- Brazos de acordeón.
- Guantes amarillos.
- Pantalla LED como rostro: `(^‿^)`, `O_o`, `@_@`.
- Aunque destruya la cocina, siempre termina haciendo una reverencia orgullosa.

### 🐶 Q-Boby — Perrito robótico (Nivel 2)

Un corgi-beagle metálico con:

- Orejas flotantes magnéticas.
- Cola-antena que cambia de color cuando su cerebro cuántico está en superposición.
- Orejas que apuntan en direcciones diferentes cuando experimenta dudas estadísticas.

### 🧚‍♀️ Chispa — Personaje guía

Una pequeña luciérnaga-dron con gafas de aviador, posada sobre la llave inglesa del jugador.

**Personalidad:** humorística y directa.

No da discursos largos; solamente ofrece bromas y pistas rápidas de dos líneas.

## 1.4. Escenarios

| Escenario | Personaje | Habitaciones o zonas | Minijuegos |
|---|---|---|---|
| 🏠 La casa | Q-Anacleto | Sala (inicio) → cocina, recorrido natural. Lavandería para el 1.4. Baño y habitación son habitaciones simples, sin minijuego por ahora. | Sala: 1.1 · Cocina: 1.2 y 1.3 · Lavandería: 1.4 |
| 🌳 El parque | Q-Boby | Un parque genérico para perros | 2.1 a 2.4 |

---

# 🧠 2. Modalidades: «Cerebro Simple» vs. «Cerebro Cuántico»

Cada minijuego dispone de un **interruptor gigante** en la cabeza del compañero para comparar Machine Learning clásico y Quantum Machine Learning (QML).

**Regla de honestidad:** en los minijuegos de clasificación la lección es «una recta no basta, hay que curvar el espacio». El Cerebro Cuántico es *una* forma de curvarlo (feature maps y kernels cuánticos), no una forma mejor: una red neuronal clásica también podría. Chispa lo dice en voz alta. La única ventaja cuántica real que presenta el juego es la de Quantum Amplitude Estimation (minijuego 2.2).

## 2.1. 📏 Modo 1: Cerebro Simple

**Equivalencia:** ML clásico — regla lineal / perceptrón.

### ¿Qué ve y manipula el jugador?

Un radar cuadrado que representa lo que perciben los dos sensores del robot. Por ejemplo:

- Humedad.
- Peso.

También aparece una **regla de plástico rígida** que puede girarse y desplazarse.

Todo lo situado a un lado de la regla recibe la **Acción A**; lo situado al otro lado recibe la **Acción B**.

### ¿Para qué sirve?

El compañero siempre comienza con este chip.

- En tareas sencillas, funciona correctamente.
- Cuando los objetos presentan patrones cruzados o distribuciones circulares, la regla lineal comienza a fallar.
- El jugador experimenta directamente las limitaciones de una separación lineal.

## 2.2. ⚛️ Modo 2: Cerebro Cuántico

**Equivalencia:** QML implementado con Qiskit.

La regla rígida desaparece y aparecen dos cables luminosos:

- Qubit 0.
- Qubit 1.

El jugador puede colocar diferentes fichas magnéticas.

### Fichas disponibles

| Elemento | Operación cuántica | Función propuesta |
|---|---|---|
| 🌀 Ficha Prisma | H — Hadamard | «Moneda cuántica»: crea superposición; al medir, cada resultado sale con la probabilidad que dictan sus amplitudes. |
| 🎛️ Ficha Giro-Sensor | RX / RY / RZ | Codificar datos de los sensores mediante rotaciones. |
| ⚡ Cable Gemelo | CX / RZZ | Entrelazar qubits y representar combinaciones entre características. |
| 🔍 Perilla de Escala | Escala de RY(escala · dato) | Ajustar cuánto gira el qubit por unidad de sensor (1.3). |
| 🎚️ Perillas Doradas | Parámetros \(\theta\) | Ajustar parámetros del circuito. |
| 🎲 Dial de Vistazos | Shots | Controlar cuántas mediciones se realizan. |

Las **Perillas Doradas** y el **Dial de Vistazos** se incorporan en el Nivel 2.

## 2.3. 🌩️ Tormenta NISQ

No es un modo de juego ni un selector de dificultad: aparece solo en los minijuegos cuya dificultad fija la incluye (2.4).

### Concepto

El cerebro cuántico experimenta interferencia electromagnética.

Cada **⚡ Cable Gemelo (CX)** incrementa una Barra de Estática.

### Efectos

- Cada ficha suma estática morada en la barra (efecto decorativo, simulado).
- Si el circuito pasa el límite de fichas del minijuego, se desata la Tormenta: el cerebro se marea, el circuito no se ejecuta y ocurre el desastre.
- Mientras no se pase del límite, el robot decide siempre con el circuito real, sin ruido. La estática nunca cambia sus decisiones: inventar acciones aleatorias sería falsear la decisión del robot.

### Objetivo educativo

Premiar al jugador por resolver los retos utilizando circuitos más cortos y limpios.

Chispa: «En un chip cuántico real, cada compuerta suma ruido: por eso ganan los circuitos cortos».

---

# 🎓 3. Metodología de enseñanza e instrucciones

## 3.1. Regla de oro

**«Prohibido aburrir con párrafos: máximo 14 palabras antes de tocar algo».**

La enseñanza debe producirse principalmente mediante interacción, experimentación y humor.

## 3.2. Instrucciones visuales

Al iniciar cada minijuego aparece una nota adhesiva ilustrada durante aproximadamente 1.5 segundos.

Puede encontrarse pegada a una nevera o a un cartel del parque.

**Ejemplo:**

🍽️ Plato sucio → 🫧 Lavar

🍌 Cáscara → 🗑️ Basura

**Botón principal:** ▶ ¡HAZLO, Q-ANACLETO!

La intención es que cualquier persona desde los 10 años comprenda inmediatamente qué debe hacer.

## 3.3. Aprender riéndose del error

### Paso 1. Probar y fallar

El jugador pulsa «¡Hazlo!» utilizando el Cerebro Simple.

El robot comete un error y ocurre un desastre cómico.

### Paso 2. Diagnóstico visual

Se abre la burbuja mental del robot.

Un aro parpadeante señala exactamente qué objeto quedó clasificado en el lado incorrecto de la regla.

**Ejemplo:** «¡Mira, la regla dejó las cucharitas del lado de la basura!».

### Paso 3. Tocar y doblar

El jugador cambia al Cerebro Cuántico y coloca una ficha.

Durante el primer intento recibe ayuda mediante una silueta brillante.

El mapa de clasificación se dobla visualmente como gelatina hasta que los objetos dejan de mostrar 😱 y pasan a 😄.

### Paso 4. Cápsula «¡Ajá!»

Después de superar el desafío aparece un cromo coleccionable de aproximadamente 10 segundos.

Contiene tres líneas que explican el concepto científico utilizado.

**Ejemplo:**

«¡Tus Giro-Sensores codificaron los datos y tu Cable Gemelo cambió lo que mide el robot: así funciona un modelo cuántico de kernel!».

Incluye un botón opcional:

**🔬 Ver Rayos-X Qiskit**

Permite inspeccionar el circuito y el código real.

El cromo tiene **rareza** (común, rara, holográfica o legendaria) que sale de una medición real del circuito ganador (regla de Born). Se revela sola con una animación de destello, sin palanca.

Las cápsulas «¡Ajá!» se verifican con la skill de Qiskit y documentación oficial antes de escribirlas.

## 3.4. Dificultad

Cada minijuego tiene **una sola dificultad fija** (⭐, ⭐⭐ o ⭐⭐⭐), solo informativa. No hay selector. Cada sección indica cuál es (propuesta, ajustable por el equipo).

---

# 🏠 4. Minijuegos del Nivel 1: Q-Anacleto, el robot doméstico

## 4.1. Minijuego 1.1: «¡Operación Pelusa Rebelde!»

**Tarea:** Barrer la sala.

### Reto e interacción

La alfombra contiene:

- Bolas de polvo.
- Cenizas.
- Al gato Sr. Bigotes durmiendo.

El jugador puede colocar objetos de prueba en la sala y encender el ventilador de techo antes de ordenar a Q-Anacleto que barra.

### Sensores

- Tamaño del bulto.
- Calor / ronroneo.

### Errores cómicos

- Q-Anacleto toma la escoba al revés.
- Intenta barrer al gato dentro del recogedor y termina con el gato pegado a su cara LED.
- Arropa una bola de polvo con una mantita y le ofrece croquetas.

### Concepto educativo

**Margen lineal SVM vs. codificación por rotación RY** (tutorial).

El polvo es frío y pequeño, mientras que el gato es grande y tibio.

El Cerebro Simple consigue clasificarlos correctamente.

Chispa explica que, cuando una recta es suficiente, no hace falta gastar batería cuántica.

Luego invita a probar el Cerebro Cuántico: los Giro-Sensores RY convierten cada sensor en una rotación del qubit, la primera pieza de cualquier modelo de QML.

### Dificultad fija

⭐ Taller: grupos fáciles de separar. El Cerebro Simple consigue la victoria.

## 4.2. Minijuego 1.2: «¡Fiebre en el Fregadero!»

**Tarea:** Lavar los platos.

### Reto e interacción

Una cinta transportadora de cocina, inspirada en *Overcooked!*, transporta:

- Platos con salsa.
- Cucharitas de postre.
- Cáscaras de sandía.
- Servilletas mojadas.

El jugador puede acelerar la cinta mientras Q-Anacleto decide qué debe lavarse y qué debe desecharse.

### Sensores

- Humedad.
- Peso.

### Patrón de clasificación

| Objeto | Características | Acción |
|---|---|---|
| Plato sopero | Mojado y pesado | Lavar |
| Cucharita con azúcar | Seca y ligera | Lavar |
| Cáscara de sandía | Seca por fuera y pesada | Basura |
| Servilleta | Mojada y ligera | Basura |

La distribución forma un **patrón cruzado XOR**.

### Errores cómicos

- Q-Anacleto grita «¡TRIPLE!» y lanza la vajilla fina de la abuela al basurero: «¡CRASH!».
- Lava con esponja, jabón y perfume una cáscara de plátano y luego la guarda en la vitrina.

### Concepto educativo

**Problema XOR clásico vs. modelo cuántico como método de kernel.**

La regla lineal del Cerebro Simple no logra separar correctamente los grupos cruzados.

Al activar el Cerebro Cuántico, los Giro-Sensores codifican humedad y peso en los dos qubits, y el robot lee el qubit 1. Sin Cable Gemelo, ese qubit solo «ve» el peso (50 % de acierto). Al conectar el Cable Gemelo CX, el qubit 1 pasa a reflejar la combinación de ambos sensores y el mapa se transforma visualmente en cuatro regiones diagonales (100 % de acierto, verificado con Qiskit).

Base: Schuld (2021), *Supervised quantum machine learning models are kernel methods*, arXiv:2101.11020. La codificación fija el kernel y la medición traza una frontera lineal sobre los estados cuánticos; el CX, al ir después de la codificación, forma parte de la medición.

Chispa aclara que una red neuronal clásica pequeña también resuelve XOR: lo que falla es la recta, no lo clásico.

### Dificultad fija

⭐ Taller: cuatro esquinas claramente identificadas. Se desbloquea el primer Cable Gemelo.

## 4.3. Minijuego 1.3: «¡Chef Catástrofe: En su Punto!»

**Tarea:** Preparar comida.

### Reto e interacción

Es domingo de panqueques.

El jugador debe manipular:

- La intensidad de la llama de la hornilla.
- El espesor de la mezcla.

Solamente las combinaciones cercanas al centro ideal están listas para servir.

Las configuraciones alejadas producen resultados:

- Demasiado fríos.
- Quemados.
- Aguados.
- Excesivamente espesos.

### Sensores

- Desviación de fuego.
- Desviación de espesor.

### Errores cómicos

- Q-Anacleto toca una campanita francesa y sirve un disco carbonizado en llamas, activando el rociador del techo.
- Vierte mezcla cruda directamente en el bolsillo del jugador.
- Isla gigante (escala baja): sirve como «perfectos» panqueques crudos y quemados.
- Islas fantasma (escala excesiva): en los bordes del radar aparecen islas falsas y sirve un disco quemado con orgullo.

### Concepto educativo

**Ancho del kernel: kernel clásico vs. escala de la codificación cuántica.**

El Cerebro Simple no puede encerrar una región circular utilizando una única recta (la mejor regla se queda en 79 %).

En el Cerebro Cuántico, dos Giro-Sensores RY con lectura `00` dibujan una isla en el centro del radar. Con la escala de fábrica la isla es demasiado grande (67 %). El jugador gira la **Perilla de Escala** de cada Giro-Sensor: la isla se encoge hasta abrazar los panqueques en su punto (96–100 %, entre 2.5 y 5.5 rad). Si la gira de más, aparecen islas fantasma, porque el giro es periódico: una vuelta completa es como no girar.

La ciencia: la escala es el ancho del kernel de fidelidad, cos²(escala·Δ₀/2)·cos²(escala·Δ₁/2). Cerca del centro se parece a un kernel RBF clásico con γ ≈ escala²/4. Coincide con Schuld (2021): la codificación fija el kernel.

Chispa: «Un kernel clásico también tiene su perilla de ancho; aquí es cuánto gira el qubit».

El 1.3 tiene **una sola ranura por cable**: con dos, apilar dos Giro-Sensores duplica la escala y se gana sin la perilla. Verificado con Qiskit y búsqueda exhaustiva en [experiments/rediseno_1_3/resultados.md](experiments/rediseno_1_3/resultados.md).

(No se usa la metáfora de la Esfera de Bloch: describe un solo qubit, no el mapa de decisión de un circuito de dos.)

### Dificultad fija

⭐ Taller: panqueques caseros, ventana ganadora ancha de la perilla.

## 4.4. Minijuego 1.4: «¡Lavandería en Remolino!»

**Jefe del Nivel 1 — Tarea:** Separar la ropa.

### Reto e interacción

Una lavadora gigante gira en pantalla y forma dos espirales entrelazadas:

- Camisas blancas.
- Calcetines rojos que destiñen.

Q-Anacleto introduce sus pinzas en el tambor giratorio para extraer únicamente los calcetines rojos.

### Errores cómicos

¡Explosión de espuma rosada!

Q-Anacleto aparece desfilando como modelo, usando ropa encogida al tamaño de un chihuahua y teñida de rosa fosforescente.

### Concepto educativo

**Underfitting vs. Data Re-Uploading / capas repetidas.**

Ni la regla lineal ni una única capa cuántica consiguen representar correctamente las espirales del remolino.

El jugador conecta capas consecutivas:

**Sensores → Cable Gemelo → Sensores nuevamente.**

El objetivo es modificar el espacio de representación hasta ajustarse al patrón.

Verificado con búsqueda exhaustiva ([experiments/verificacion.md](experiments/verificacion.md)): espiral doble de 1 vuelta, 5 ranuras.

| Cerebro | Acierto en la cinta |
| --- | --- |
| Regla recta | 72 % |
| Cada sensor se carga una sola vez | 85 % |
| Giros apilados sin Cable Gemelo de por medio | 87 % |
| Sensores → Cable Gemelo → sensores otra vez | 95 % |

Base: Pérez-Salinas et al. (2020), *Data re-uploading for a universal quantum classifier*, Quantum 4, 226. Y Schuld, Sweke y Meyer (2021), Phys. Rev. A 103, 032430: repetir la codificación da acceso a frecuencias más ricas.

### Dificultad fija

⭐⭐ Centrifugado turbo: espiral doble completa, que una sola capa no alcanza a separar.

---

# 🐶 5. Minijuegos del Nivel 2: Q-Boby, el perrito robótico

## 5.1. Minijuego 2.1: «¡Siéntate, Gira o Despega!»

**Tarea:** Obedecer instrucciones.

### Reto e interacción

El jugador controla:

- Un **Silbato Musical**, con sonidos graves y agudos.
- Una **Mano Virtual**, que puede apuntar hacia arriba o abajo.

Mediante estos controles debe enseñar a Q-Boby a:

- Sentarse.
- Dar la pata.
- Girar.

Sobre la cabeza de Q-Boby aparece un **Termómetro de Mareo**, que representa la función de pérdida (*Loss / Error*): el promedio de (1 − P(truco correcto))², entre 0 (obedece) y 1 (hace todo al revés).

### Errores cómicos

- Al escuchar «¡Siéntate!», Q-Boby enciende sus propulsores y queda colgado de la lámpara.
- Al recibir la orden «¡Avanza!», gira como un helicóptero hasta que su cabecita se desenrosca y cae a la alfombra, donde continúa ladrando feliz.

### Concepto educativo

**Descenso de gradiente clásico vs. gradiente cuántico (regla de parameter-shift) en un clasificador variacional VQC.**

En Cerebro Simple, el jugador dispone de una única perilla lineal.

Cuando corrige «Sentarse», puede perjudicar «Girar».

En Cerebro Cuántico, el jugador ajusta dos Perillas Doradas:

\[
\theta_1,\theta_2
\]

Estas permiten experimentar con los parámetros del clasificador variacional.

El Termómetro de Mareo ofrece retroalimentación mediante un sistema de «frío/caliente» mientras disminuye el error.

Posteriormente, el jugador desbloquea:

**🎺 Silbato Auto-Entrenar**

Este botón permite observar cómo un optimizador ajusta automáticamente los parámetros. El gradiente se calcula de verdad con la regla de parameter-shift: dos ejecuciones del circuito por perilla, con el ángulo desplazado ±π/2.

Verificado ([experiments/parameter_shift/resultados.md](experiments/parameter_shift/resultados.md)):

- El gradiente coincide con diferencias finitas (diferencia de 10⁻¹¹).
- Desde 20 inicios al azar, Q-Boby aprende las cuatro órdenes.
- Con una perilla congelada en un mal valor, la otra no basta.
- 30 iteraciones tardan ~230 ms.

### Dificultad fija

⭐ Taller: dos trucos dentro de casa.

## 5.2. Minijuego 2.2: «¡El Dilema del Doble Hueso!» ⭐ Minijuego estrella

**Tarea:** Estimar en qué túnel es más probable encontrar el hueso.

### Reto e interacción

En el parque hay varios túneles. Cada uno esconde el hueso con cierta probabilidad desconocida, y las pistas de olor son ruidosas.

Q-Boby debe estimar esas probabilidades con la precisión suficiente para elegir el mejor túnel.

Cada olfateo (consulta) gasta batería de su cola-antena, y la batería es limitada.

### Errores cómicos

Con pocos olfateos, el Cerebro Simple se equivoca: Q-Boby entra muy seguro al túnel vacío y sale con una rana sobre la nariz.

Si insiste en olfatear de más, se queda sin batería a mitad del parque y se duerme roncando sobre el barro.

### Concepto educativo

**Monte Carlo vs. Quantum Amplitude Estimation (QAE).**

- **Cerebro Simple (Monte Carlo):** Q-Boby entra y sale del túnel muchas veces y promedia. El error baja lento, como 1/√N: para ganar el doble de precisión necesita cuatro veces más olfateos.
- **Cerebro Cuántico (QAE):** Q-Boby codifica la probabilidad en la amplitud de un qubit y la amplifica con el operador de Grover. El error baja como 1/N: llega a la misma precisión con muchos menos olfateos.

Una gráfica en vivo muestra ambas curvas de precisión contra batería gastada. Cada curva es la trayectoria de una corrida real del backend (una llamada por método); el frontend solo la anima punto a punto.

Es la **única ventaja cuántica real y demostrada** del juego (aceleración cuadrática en consultas). Chispa aclara que en los chips ruidosos de hoy el error deja de bajar pasado cierto punto: el ruido le pone un piso a la ventaja (Tanaka et al., 2021, arXiv:2006.16223).

Verificado con Qiskit ([experiments/qae/resultados.md](experiments/qae/resultados.md)):

- Sobre el mismo oráculo, el error de Monte Carlo baja con pendiente −0.50 y el de QAE con −1.05.
- Batería del minijuego: 180 olfateos (90 por túnel, con potencias k = 0, 1, 2, 4 y 5 mediciones cada una).
- Con túneles de p = 0.30 y 0.36, QAE elige bien el 95 % de las veces y Monte Carlo cerca del 77 %. Monte Carlo necesitaría unas 4.4 veces más olfateos.

Frase de Chispa: «Con el mismo olfato, el chip cuántico necesitó unas 4 veces menos olfateos. La ventaja es en consultas, no en tiempo: aquí todo corre en una laptop».

Implementación prevista: QAE simple hecho a mano con 1-2 qubits (potencias de Grover y estimación por máxima verosimilitud), sin depender de `qiskit-algorithms`.

### Dificultad fija

⭐⭐ Hora Punta: batería limitada; solo el Cerebro Cuántico alcanza la precisión pedida antes de agotarla.

## 5.3. Minijuego 2.3: «¡Pista de Agilidad Láser-Musical!»

**Tarea:** Realizar trucos y saltos rítmicos.

### Reto e interacción

Una pista de feria funciona como un videojuego musical.

El ritmo sigue patrones como:

**BUM — CLAP — BUM — CLAP**

Hay vallas de neón y trampolines que suben y bajan, formando un tablero de ajedrez de ondas musicales.

Q-Boby debe decidir:

- Cuándo saltar.
- Cuándo agacharse.
- Qué baldosa utilizar.

### Errores cómicos

- Q-Boby se agacha sobre un resorte y sale disparado hacia las nubes, dejando su silueta en el cielo.
- Salta tres veces sobre suelo plano y termina de cabeza dentro de un carrito de algodón de azúcar, con una peluca rosa.

### Concepto educativo

**Fase cuántica RZ e interferencia constructiva/destructiva.**

La regla lineal del Cerebro Simple falla en determinadas regiones del tablero.

Con Cerebro Cuántico, el jugador construye el **Sándwich de Interferencia**:

**🌀 Prisma H → Giro de Fase + Cable Gemelo → 🌀 Prisma H**

Visualmente:

- Las ondas asociadas a decisiones incorrectas se cancelan.
- Las asociadas a decisiones correctas se refuerzan.

Verificado con búsqueda exhaustiva ([experiments/verificacion.md](experiments/verificacion.md)), con fichas Prisma, Giro de Fase (RZ) y Cable Gemelo:

- Sin Prisma, los giros de fase no cambian nada (50 %).
- Con Prisma pero sin la H final, la fase sigue invisible (65 %).
- El sándwich completo llega al 100 %.

La regla recta se queda en 75 %. Lección: la fase solo se ve cuando una H la hace interferir.

### Dificultad fija

⭐ Taller: pista 2×2 guiada.

## 5.4. Minijuego 2.4: «¡La Gran Copa Canina de Villa Qubit!»

**Gran final — Tarea:** Dominar diferentes trucos.

### Reto e interacción

La competencia ocurre en un estadio lleno de espectadores y cámaras.

El jugador lanza un frisbee con trayectoria curva.

Q-Boby debe superar:

- Vallas.
- Gestos.
- Obstáculos.
- Interferencias producidas por reflectores gigantes.

### Errores cómicos

Si el jugador se pasa del límite de fichas, se desata la Tormenta NISQ sobre Q-Boby.

En lugar de atrapar el frisbee:

1. Salta al palco de honor.
2. Roba el peluquín del juez principal.
3. Lo entierra en medio de la cancha.

### Concepto educativo

**Equilibrio entre expresividad del circuito y ruido en hardware cuántico NISQ.**

El jugador debe diseñar un circuito cuántico compacto y eficiente para superar los desafíos sin generar un exceso de ruido.

El ruido no se simula en la decisión: el límite de fichas representa el presupuesto de compuertas de un chip NISQ, y la estática es decorativa.

Verificado con búsqueda exhaustiva ([experiments/verificacion.md](experiments/verificacion.md)): Q-Boby atrapa el frisbee cuando viento y giro se compensan (un pasillo diagonal). La regla recta se queda en 73 %, sin Cable Gemelo nada pasa del 63 %, y el circuito mínimo que gana tiene 5 fichas (96–97 %). **`limite_fichas`: 5.**

### Dificultad fija

⭐⭐⭐ Copa Mundial NISQ: límite estricto de compuertas cuánticas, con Tormenta NISQ.

---

# 🔥 6. Ganchos de retención

- **Celebración inmediata estilo gambling:** «¡CLACK!» al encajar fichas, el mapa que se dobla en vivo, caritas de 😱 a 😄 y destellos al ganar.
- **Álbum de cromos:** un cromo de concepto por minijuego, con rareza que sale de una medición real (ver 3.3, paso 4).
- **Álbum de desastres:** cada error cómico distinto que provoca el jugador se colecciona, sin rareza. Invita a equivocarse a propósito y experimentar con el circuito.
- **Estrellas de pericia (secundario):** resolver, superar un porcentaje de acierto y usar el circuito más corto.

Descartado (ver No goals en [goal.md](goal.md)): «¡El Cortocircuito del Día!», rachas diarias, Tuercas Doradas y accesorios.