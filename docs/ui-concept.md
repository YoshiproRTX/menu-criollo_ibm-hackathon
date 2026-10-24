# Propuesta conceptual de UI — Quantum Buddy

## 1. Resumen general de la dirección de UI

La propuesta es una interfaz **futurista, tierna y limpia**, con la calidez de un
objeto cotidiano y la precisión visual de un compañero robótico. El azul pastel,
las superficies claras y los detalles luminosos discretos transmiten tranquilidad,
curiosidad y confianza para experimentar, incluso sin conocimientos de QML.

La referencia principal son las cinco imágenes de `imagenes/`: personajes de
carcasa clara y ambientes domésticos acogedores. El espíritu de «Taller Retro-Pop
de Villa Qubit» se expresa mediante formas simples, colores amables y una ligera
sensación de objeto tangible. El acabado se siente moderno y cuidado.

La dirección puede resumirse como **robótica doméstica de luz suave**: acercar
la tecnología mediante materiales familiares y pequeños detalles expresivos.
La revisión con [Visual Reference](../.agents/skills/visual-reference/SKILL.md)
identifica como rasgo distintivo el contraste entre carcasas frías y un hogar
cálido, unido por volúmenes redondeados y una iluminación suave.

[Pokémon Quest](https://pokemonquest.pokemon.com/en-us/) funciona como inspiración
general para la claridad, el encanto lúdico y la organización modular solicitados.
La identidad propia de Quantum Buddy surge de su azul pastel, sus robots y su
mundo doméstico; no se trasladan composiciones, símbolos ni elementos gráficos
reconocibles de aquella interfaz.

## 2. Principios visuales

- **Claridad:** cada elemento debe tener una intención visual comprensible.
  Pocos énfasis simultáneos y espacio suficiente para distinguir la información.
- **Ternura:** proporciones suaves, pequeñas curvas y detalles expresivos,
  tomando como referencia las caras del perrito y del robot guía.
- **Limpieza:** superficies mayormente lisas, sombras ligeras y decoración
  contenida. La riqueza de los ambientes ya aporta textura y personalidad.
- **Legibilidad:** texto oscuro sobre fondos claros y estables; iconos
  reconocibles y diferencias perceptibles más allá del color.
- **Equilibrio:** la calidez del hogar, la solidez de la robótica y la delicadeza
  de la luz cuántica deben sentirse parte del mismo universo. La tecnología
  despierta curiosidad sin exigir una estética de laboratorio.

## 3. Lenguaje visual

Predominan rectángulos de esquinas redondeadas, círculos y curvas cortas. Las
formas conservan estructura y un contorno definido: suaves sin parecer infladas.
Esta geometría recoge las placas del humanoide, las articulaciones del perrito
y el cuerpo compacto del guía.

Los paneles se imaginan como piezas claras de acabado mate o satinado, con un
ligero relieve. Bordes finos en azul grisáceo y sombras difusas aportan separación
sin contornos negros pesados. Las superficies de lectura serían mayormente
opacas para mantener estabilidad sobre los escenarios.

Las referencias distinguen el metal satinado del humanoide de las carcasas más
suaves del perrito y del guía. La UI puede recoger esa diferencia con reflejos
anchos y leves en los bordes, manteniendo lisas las zonas de lectura. La madera,
los tejidos y los azulejos aportan riqueza al mundo; su traducción a la interfaz
es una sensación de calidez y tactilidad, sin trasladar sus patrones como fondos.

Los botones comparten esa apariencia de pieza amable y tangible: silueta sencilla,
texto breve y un volumen sutil. Su énfasis procede del contraste y del color,
sin brillo intenso permanente. Las tarjetas o módulos pertenecen a la misma
familia visual, con contornos y profundidad consistentes, sin marcos ornamentales.

La iconografía utiliza siluetas compactas, trazos de grosor uniforme y detalles
mínimos. Puede recoger la sencillez de las luces y figuras del rostro del perrito.
Los símbolos que expresen información necesitan significado comprensible; la
decoración geométrica se mantiene secundaria. El encanto reside en pequeños
gestos visuales, sin convertir cada elemento en un personaje.

## 4. Paleta conceptual

El **azul pastel** define la identidad de la UI. Los neutros claros le dan aire
y los tonos cálidos permiten convivir con la casa. Estos valores son orientativos,
no colores extraídos de las imágenes ni una especificación cerrada.

Se propone un conjunto de **siete colores**: un principal, tres neutros de
soporte y tres colores de apoyo o acento. El azul pastel interpreta los armarios
de la cocina; el cian retoma las luces del guía y del perrito; salvia y melocotón
conectan con el sofá, las plantas y los materiales cálidos del hogar.

| Color | Referencia orientativa | Intención visual |
| --- | --- | --- |
| Azul pastel principal | `#B9D8F2` | Color reconocible de superficies y piezas destacadas |
| Blanco cálido | `#FAF8F2` | Fondos claros y continuidad con el ambiente doméstico |
| Azul grisáceo claro | `#DEE7ED` | Matices de carcasa y separación suave |
| Azul tinta | `#243B53` | Texto, iconos y definición sobre fondos pálidos |
| Cian suave | `#78DDD9` | Acentos luminosos ligados a los robots y lo cuántico |
| Verde salvia | `#B8CDBB` | Apoyo sereno relacionado con plantas y mobiliario |
| Melocotón suave | `#F2B79E` | Acento cálido ocasional, cercano a madera y terracota |

El cian se reserva para detalles; el azul pastel debe seguir siendo el color
predominante. Salvia y melocotón acompañan sin competir entre sí. El amarillo
puede permanecer en los ambientes, sin convertirse en el color rector de la UI.

El contraste se construye con azul tinta sobre superficies claras. Los pasteles
funcionan como fondos y acentos, evitando texto blanco pequeño sobre ellos.
Cuando el color comunique un significado, debe acompañarse de texto o forma.
La accesibilidad del contraste deberá comprobarse al concretar el diseño.

## 5. Tipografía conceptual

Encaja una tipografía sans serif humanista o geométrica de curvas moderadamente
redondeadas, con aperturas amplias y letras fáciles de distinguir. Su tono debe
ser cercano y contemporáneo, con suficiente sobriedad para explicar conceptos.

Los títulos pueden tener algo más de personalidad, mientras que los textos
explicativos necesitan regularidad y lectura cómoda. Una familia coherente,
pocos pesos y una jerarquía clara serían suficientes. Se favorecen frases cortas,
acentos bien resueltos y números distinguibles. No se impone una fuente concreta.

- **Títulos:** peso seminegrita y escala claramente mayor que el cuerpo, con
  curvas suaves y sin letras excesivamente anchas o de aspecto infantil.
- **Cuerpo:** peso regular, interlineado holgado y formas abiertas que faciliten
  leer explicaciones breves.
- **Texto secundario:** menor énfasis mediante peso o escala moderados,
  conservando contraste; evitar trazos finos y tonos pastel para el texto.

Las imágenes no establecen una tipografía de UI: los rótulos de las hojas de
personaje son anotaciones de referencia. Esta jerarquía es una recomendación
para acompañar su estética, no una fuente identificada en los assets.

## 6. Relación entre UI y el mundo del juego

El [perrito robótico](../imagenes/WhatsApp%20Image%202026-10-24%20at%201.21.52%20PM.jpeg)
aporta carcasas gris claro, articulaciones circulares y un rostro oscuro con
luces de color. La UI recoge su simpatía y sus pequeños acentos, sin extender
el fondo oscuro de su rostro a todas las superficies.

El [humanoide](../imagenes/WhatsApp%20Image%202026-10-24%20at%201.22.38%20PM.jpeg)
aporta placas definidas, simetría y líneas luminosas discretas. El
[robot guía](../imagenes/WhatsApp%20Image%202026-10-24%20at%2012.15.01%20PM.jpeg)
refuerza el carácter acogedor con su cabeza redondeada, ojos expresivos y luz
cian. Esos rasgos orientan el tono general sin reproducir sus caras en cada icono.

La [sala](../imagenes/WhatsApp%20Image%202026-10-24%20at%201.22.37%20PM.jpeg)
combina luz cálida, madera, plantas y un sofá verde suave. Los blancos cálidos y
el salvia permiten que la UI acompañe esa intimidad sin competir con la alfombra
y los objetos decorativos.

La [cocina](../imagenes/WhatsApp%20Image%202026-10-24%20at%201.22.39%20PM.jpeg)
ya contiene armarios azul claro, superficies crema, cobre y pequeños objetos
expresivos. Es el vínculo más directo con la paleta propuesta. Se mantiene el
mismo lenguaje de UI en ambos espacios, dejando que la personalidad de cada
ambiente provenga de sus materiales y su iluminación.

La tensión entre el acabado tecnológico de los personajes y la abundancia de
objetos domésticos se resuelve con superficies de UI serenas y pocos acentos.
El brillo cian tiene presencia puntual, como en antenas y uniones de los robots;
la luz cálida conserva el protagonismo ambiental. Así, la interfaz acompaña a
los compañeros y a la casa sin introducir una tercera estética dominante.

## 7. Tratamiento visual del componente cuántico

Lo cuántico se imagina como una tecnología cercana: pequeñas piezas geométricas,
puntos, conexiones suaves y trazos luminosos contenidos. La inspiración en
circuitos y Qiskit se expresa mediante relaciones visuales ordenadas y una
sensación de precisión, sin llenar la experiencia de notación especializada.

Los motivos de conexión pueden sugerir que las piezas forman parte de un mismo
sistema. El cian, junto al azul pastel, aporta una cualidad especial sin recurrir
a neón dominante, fondos negros o una estética de ciencia ficción agresiva.
La base visual permanece sencilla y reconocible.

Una abstracción educativa debe conservar un significado explicable. Si una línea
o figura representa información real, su apariencia debe corresponder a esa
información. Los brillos puramente decorativos no se presentan como evidencia de
aprendizaje, probabilidades o ventaja cuántica. El vocabulario visual ayuda a
acercarse al concepto sin atribuirle propiedades mágicas.

## 8. Conclusión breve

Quantum Buddy propone una UI de azul pastel, superficies claras y formas suaves,
con la calidez de su hogar y los acentos cian de sus compañeros robóticos.
El resultado busca hacer que experimentar con tecnología cuántica se sienta
accesible, amable y visualmente coherente con los personajes existentes.
