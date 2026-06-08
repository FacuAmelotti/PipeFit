const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'data', 'exercises.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Count exercises and find the cutoff point
const lines = content.split('\n');
let braceDepth = 0;
let exerciseCount = 0;
let inExercise = false;
let exerciseStart = -1;
const EXERCISE_LIMIT = 52;

// Find the end of the 52nd exercise
let cutoffLine = -1;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.trim() === '{' && !inExercise && exerciseCount < EXERCISE_LIMIT) {
    // Check if this starts an exercise (check if previous line has a comma or is a comment)
    const trimmedPrev = i > 0 ? lines[i-1].trim() : '';
    if (trimmedPrev.endsWith(',') || trimmedPrev.startsWith('//') || trimmedPrev === '' || trimmedPrev === '[') {
      inExercise = true;
      exerciseStart = i;
      exerciseCount++;
    }
  }
  
  if (line.trim() === '},' && inExercise) {
    // Check if this ends an exercise (look at the next non-empty line for id)
    let j = i + 1;
    while (j < lines.length && lines[j].trim() === '') j++;
    if (j < lines.length && (lines[j].trim().startsWith('{') || lines[j].trim().startsWith('//') || lines[j].trim() === ']')) {
      inExercise = false;
      if (exerciseCount >= EXERCISE_LIMIT) {
        cutoffLine = i + 1;
        break;
      }
    }
  }
}

if (cutoffLine === -1) {
  console.error('Could not find cutoff point');
  process.exit(1);
}

console.log(`Processing first ${EXERCISE_LIMIT} exercises, cutoff at line ${cutoffLine}`);

// Spanish translations
const translations = {
  // ===== BACK =====
  "back-001": {
    name: "Peso Muerto con Barra",
    description: "Un movimiento compuesto que levanta una barra con peso desde el suelo hasta la altura de la cadera, activando toda la cadena posterior.",
    history: "El peso muerto ha sido un levantamiento fundamental de fuerza desde los primeros días del levantamiento de pesas, con orígenes en competencias de forzudos del siglo XIX.",
    benefits: [
      "Desarrolla fuerza total del cuerpo y la cadena posterior",
      "Mejora la fuerza de agarre y la estabilidad del core",
      "Potencia la mecánica de bisagra de cadera para rendimiento atlético",
    ],
    commonMistakes: [
      "Redondear la zona lumbar durante el levantamiento",
      "Comenzar con las caderas demasiado bajas como en una sentadilla",
      "Arrancar la barra del suelo con un tirón en lugar de un movimiento suave",
    ],
    tips: [
      "Mantén la barra sobre el mediopie durante todo el tirón",
      "Contrae el core como si te prepararas para un golpe antes de cada repetición",
      "Impulsa a través de los talones y aprieta los glúteos al llegar arriba",
    ],
    variations: ["Peso Muerto Sumo", "Peso Muerto Rumano", "Peso Muerto con Barra Hexagonal", "Peso Muerto con Déficit"],
    instructions: [
      "Párate con los pies al ancho de las caderas, la barra sobre el mediopie",
      "Inclina las caderas hacia atrás y flexiona las rodillas hasta que las espinillas toquen la barra",
      "Agarra la barra justo por fuera de las rodillas con agarre prono o mixto",
      "Contrae el core, mantén la espalda neutral e impulsa a través de los talones para levantarte",
      "Bloquea arriba apretando los glúteos, luego baja la barra con control",
    ],
  },
  "back-002": {
    name: "Dominadas",
    description: "Un ejercicio de peso corporal donde te elevas desde una posición colgada hasta que la barbilla supera la barra.",
    history: "Las dominadas se han utilizado en entrenamiento militar y gimnástico durante más de un siglo como prueba definitiva de fuerza de la parte superior del cuerpo.",
    benefits: [
      "Desarrolla el ancho de los dorsales y el grosor de la espalda alta",
      "Mejora la fuerza de agarre y la fuerza relativa del cuerpo",
      "Potencia la estabilidad del hombro y la fuerza de brazo extendido",
    ],
    commonMistakes: [
      "Usar demasiado impulso de kipping en lugar de fuerza controlada",
      "No lograr el rango completo de movimiento en la parte inferior",
      "Tirar solo con los brazos en lugar de activar los dorsales",
    ],
    tips: [
      "Inicia el tirón llevando los codos hacia abajo y atrás",
      "Aprieta los omóplatos al final del movimiento",
      "Usa una ligera elevación de piernas para evitar balancearte",
    ],
    variations: ["Dominada con Agarre Amplio", "Dominada Chin-Up", "Dominada con Peso", "Dominada con Agarre Neutro"],
    instructions: [
      "Agarra la barra con las palmas hacia afuera, manos ligeramente más anchas que los hombros",
      "Cuélgate con los brazos completamente extendidos y los pies fuera del suelo",
      "Elevate llevando los codos hacia las caderas",
      "Continúa hasta que la barbilla pase la barra, luego bájate con control",
      "Haz una pausa breve abajo antes de comenzar la siguiente repetición",
    ],
  },
  "back-003": {
    name: "Remo con Barra Inclinado",
    description: "Un tirón horizontal donde remas una barra hacia la parte baja de las costillas mientras estás inclinado desde las caderas.",
    history: "El remo inclinado ha sido un pilar del entrenamiento de fuerza desde los años 50, popularizado por culturistas de la era dorada para desarrollar grosor en la espalda.",
    benefits: [
      "Construye grosor en los dorsales medios y bajos",
      "Fortalece los erectores espinales y la zona lumbar",
      "Mejora la mecánica de tirón y la postura",
    ],
    commonMistakes: [
      "Redondear la zona lumbar por una bisagra de cadera insuficiente",
      "Usar demasiado impulso corporal para balancear el peso hacia arriba",
      "Llevar la barra demasiado alta hacia el pecho en lugar de las costillas bajas",
    ],
    tips: [
      "Mantén una columna neutral sacando el pecho hacia afuera",
      "Lleva la barra al ombligo, no al pecho",
      "Aprieta los omóplatos al final de cada repetición",
    ],
    variations: ["Remo Pendlay", "Remo Meadows", "Remo T-Bar", "Remo con Barra y Agarre Supino"],
    instructions: [
      "Párate con los pies al ancho de los hombros, sosteniendo una barra con agarre prono",
      "Inclina las caderas hasta que el torso esté casi paralelo al suelo",
      "Deja que la barra cuelgue a la altura de los brazos con una ligera flexión de rodillas",
      "Remo la barra hacia tus costillas bajas, manteniendo los codos cerca del cuerpo",
      "Baja la barra con control hasta que los brazos estén completamente extendidos",
    ],
  },
  "back-004": {
    name: "Polea Alta al Pecho",
    description: "Un ejercicio con cable donde llevas una barra ancha hacia la parte superior del pecho mientras estás sentado.",
    history: "La máquina de polea alta se introdujo a principios del siglo XX como una alternativa accesible a las dominadas para desarrollar el ancho de la espalda.",
    benefits: [
      "Apunta a los dorsales para anchura y apariencia de V",
      "Permite una progresión de peso controlada para principiantes en dominadas",
      "Proporciona tensión constante durante todo el rango de movimiento",
    ],
    commonMistakes: [
      "Inclinarse demasiado hacia atrás y usar impulso corporal",
      "Llevar la barra detrás del cuello en lugar de al pecho",
      "Dejar que el stack de peso golpee arriba al regresar",
    ],
    tips: [
      "Imagina que llevas los codos hacia abajo y atrás hacia tus bolsillos",
      "Mantén el pecho arriba y evita arquear excesivamente",
      "Controla la fase excéntrica para una mejor activación muscular",
    ],
    variations: ["Polea con Agarre Amplio", "Polea con Agarre Inverso", "Polea con Agarre Cerrado", "Polea con Barra V"],
    instructions: [
      "Ajusta la almohadilla del muslo para que tus rodillas queden firmemente aseguradas",
      "Agarra la barra con las palmas hacia adelante, más ancho que los hombros",
      "Inclínate ligeramente hacia atrás y lleva la barra hacia la parte superior del pecho",
      "Aprieta los dorsales abajo, luego regresa lentamente la barra arriba",
      "Mantén el torso estable y evita balancearte durante el movimiento",
    ],
  },
  "back-005": {
    name: "Remo Sentado en Cable",
    description: "Un ejercicio de tirón sentado usando una máquina de cable con mango en V dirigido a la espalda media.",
    history: "Los remos en cable se convirtieron en un pilar del culturismo en los años 70 al popularizarse las máquinas de cable por su tensión constante.",
    benefits: [
      "Aísla la espalda media y los romboides eficazmente",
      "Permite un estiramiento profundo y una contracción fuerte",
      "Es más suave para la zona lumbar comparado con las variaciones inclinadas",
    ],
    commonMistakes: [
      "Usar la zona lumbar para tirar en lugar de los músculos de la espalda alta",
      "Redondear los hombros hacia adelante al final de cada repetición",
      "Tirar demasiado rápido usando impulso en lugar de control muscular",
    ],
    tips: [
      "Lleva el mango hacia el abdomen inferior, no al pecho",
      "Mantén el pecho arriba y los hombros atrás durante todo el movimiento",
      "Aprieta durante un segundo en la contracción completa antes de soltar",
    ],
    variations: ["Remo Unilateral en Cable", "Remo en Cable con Agarre Amplio", "Remo en Cable con Cuerda", "Remo en Cable con Agarre Inverso"],
    instructions: [
      "Siéntate en el banco de remo en cable con los pies apoyados en la plataforma",
      "Agarra el mango V con los brazos completamente extendidos y la columna neutral",
      "Lleva el mango hacia el abdomen inferior mientras aprietas los omóplatos",
      "Haz una pausa breve en la contracción máxima, luego extiende los brazos completamente",
      "Mantén una posición de pecho erguido durante cada repetición",
    ],
  },
  "back-006": {
    name: "Remo T-Bar",
    description: "Un remo compuesto realizado usando un accesorio T-bar o una barra anclada en una esquina.",
    history: "El remo T-Bar ganó fama durante los años 60 y 70 como favorito de leyendas del culturismo para lograr una musculatura dorsal densa y gruesa.",
    benefits: [
      "Permite cargar peso pesado para grosor de la espalda media",
      "Proporciona una posición estable y apoyada para remos pesados",
      "Activa los erectores espinales como estabilizadores eficazmente",
    ],
    commonMistakes: [
      "Redondear la columna bajo carga pesada",
      "Tirar solo con los brazos en lugar de conducir con la espalda",
      "Usar movimiento excesivo de cadera para hacer trampa al subir el peso",
    ],
    tips: [
      "Mantén el pecho arriba y mira ligeramente hacia adelante durante el tirón",
      "Lleva los codos hacia atrás y aprieta los omóplatos",
      "Usa un rango completo de movimiento con un tempo controlado",
    ],
    variations: ["Remo T-Bar Acostado", "Remo T-Bar Unilateral", "Remo T-Bar con Agarre Amplio", "Remo Landmine"],
    instructions: [
      "Carga la T-bar o barra con el peso deseado y monta la barra",
      "Flexiona las caderas y rodillas para agarrar los mangos con agarre neutro",
      "Mantén la espalda plana y rema el peso hacia tu pecho",
      "Aprieta los músculos de la espalda arriba, luego baja el peso con control",
      "Reinicia tu posición después de cada repetición para evitar usar impulso",
    ],
  },
  "back-007": {
    name: "Remo Unilateral con Mancuerna",
    description: "Un remo unilateral realizado con un brazo mientras la otra mano y rodilla están apoyadas en un banco.",
    history: "El remo unilateral con mancuerna ha sido un favorito correctivo y de construcción de fuerza desde los primeros días del entrenamiento con mancuernas.",
    benefits: [
      "Corrige desequilibrios de fuerza izquierda-derecha mediante entrenamiento unilateral",
      "Permite un mayor rango de movimiento que los remos bilaterales",
      "Proporciona soporte estable para la zona lumbar durante el movimiento",
    ],
    commonMistakes: [
      "Rotar el torso excesivamente durante el tirón",
      "Usar una mancuerna demasiado pesada y sacrificar la forma",
      "No lograr la extensión completa del brazo en la parte inferior del movimiento",
    ],
    tips: [
      "Lleva la mancuerna hacia la cadera, no hacia la axila",
      "Mantén el torso estacionario y evita girar",
      "Imagina llevar el codo hacia atrás más allá del cuerpo para una contracción completa",
    ],
    variations: ["Remo Unilateral de Rodillas", "Remo Unilateral en Inclinado", "Remo Unilateral en Cable", "Remo Meadows"],
    instructions: [
      "Coloca una rodilla y la mano del mismo lado en un banco plano para apoyo",
      "Agarra una mancuerna con la mano opuesta, dejándola colgar a la altura del brazo",
      "Lleva la mancuerna hacia la cadera llevando el codo hacia atrás",
      "Aprieta el dorsal arriba, luego baja la mancuerna con control",
      "Completa todas las repeticiones de un lado antes de cambiar al otro",
    ],
  },
  "back-008": {
    name: "Pullover con Mancuerna",
    description: "Un ejercicio clásico realizado acostado a través de un banco, bajando una mancuerna detrás de la cabeza y llevándola sobre el pecho.",
    history: "El pullover fue un pilar de las rutinas de pecho y espalda de la era dorada del culturismo, valorado por la expansión de la caja torácica y el desarrollo dorsal.",
    benefits: [
      "Estira y fortalece los dorsales a través de un largo rango de movimiento",
      "Mejora la movilidad del hombro y la extensión torácica",
      "Potencia el desarrollo de la caja torácica y el serrato anterior",
    ],
    commonMistakes: [
      "Doblar demasiado los codos y convertirlo en un ejercicio de tríceps",
      "Bajar el peso demasiado rápido sin controlar el estiramiento",
      "Usar peso excesivo que compromete la seguridad del hombro",
    ],
    tips: [
      "Mantén una ligera flexión en los codos durante todo el movimiento",
      "Respira profundamente y expande la caja torácica durante el estiramiento",
      "Concéntrate en tirar con los dorsales en lugar del pecho",
    ],
    variations: ["Pullover en Cable", "Pullover con Barra", "Pullover en Máquina", "Pulldown de Brazo Recto"],
    instructions: [
      "Acuéstate perpendicular a un banco plano con solo la espalda alta apoyada",
      "Sostén una mancuerna con ambas manos debajo de la placa superior, brazos extendidos sobre el pecho",
      "Baja la mancuerna detrás de la cabeza en un arco hasta sentir un estiramiento en los dorsales",
      "Lleva la mancuerna de vuelta a la posición inicial usando los dorsales",
      "Mantén las caderas bajas y estables durante todo el movimiento",
    ],
  },
  "back-009": {
    name: "Chin-Ups (Dominadas Supinas)",
    description: "Una variación de dominada con agarre supino que enfatiza los dorsales bajos y los bíceps más fuertemente.",
    history: "Las chin-ups han sido un ejercicio estándar en las pruebas de aptitud física militar en todo el mundo durante décadas por su simplicidad y efectividad.",
    benefits: [
      "Apunta a los dorsales bajos mientras maximiza la participación de los bíceps",
      "A menudo más fácil que las dominadas para que los principiantes hagan más repeticiones",
      "Desarrolla fuerza impresionante en brazos y espalda simultáneamente",
    ],
    commonMistakes: [
      "La barbilla no supera completamente la barra arriba",
      "No extender completamente los brazos en la parte inferior de cada repetición",
      "Usar kipping o impulso de piernas excesivamente para completar repeticiones",
    ],
    tips: [
      "Mantén los codos apuntando hacia adelante en lugar de hacia afuera",
      "Mira ligeramente hacia arriba para mantener un mejor ángulo de tirón",
      "Controla el descenso durante al menos dos segundos por repetición",
    ],
    variations: ["Chin-Up con Peso", "Chin-Up con Agarre Cerrado", "Chin-Up en Anillas", "Chin-Up con Toalla"],
    instructions: [
      "Agarra la barra con las palmas hacia ti, manos al ancho de los hombros",
      "Cuélgate con los brazos completamente extendidos y los pies fuera del suelo",
      "Elevate llevando los codos hacia abajo y adelante",
      "Levántate hasta que la barbilla esté sobre la barra, luego bájate con control",
      "Extiende completamente los brazos abajo antes de comenzar la siguiente repetición",
    ],
  },
  "back-010": {
    name: "Rack Pull (Peso Muerto desde Elevado)",
    description: "Una variación de peso muerto realizada con la barra elevada sobre pins o bloques, enfocándose en la parte superior del levantamiento.",
    history: "Los rack pulls se originaron como una variación de rango parcial del peso muerto usada por powerlifters para sobrecargar la fase de bloqueo.",
    benefits: [
      "Permite carga supramáxima para fuerza de bloqueo",
      "Reduce el estrés en la zona lumbar comparado con pesos muertos completos",
      "Desarrolla densidad en la espalda alta y trapecios bajo peso pesado",
    ],
    commonMistakes: [
      "Redondear la espalda debido al peso excesivo",
      "Colocar los pins demasiado alto y reducir el rango de movimiento excesivamente",
      "No contraer el core antes de cada repetición",
    ],
    tips: [
      "Coloca la barra justo debajo o a la altura de la rodilla para una transferencia óptima",
      "Usa las mismas indicaciones de configuración que un peso muerto completo",
      "Impulsa las caderas hacia adelante agresivamente en el bloqueo",
    ],
    variations: ["Peso Muerto con Déficit", "Block Pull", "Rack Pull con Agarre de Arranque", "Peso Muerto Elevado"],
    instructions: [
      "Coloca los pins de seguridad o bloques a la altura de la rodilla dentro del rack",
      "Carga la barra y acércate con los pies al ancho de las caderas",
      "Agarra la barra y contrae el core con la columna neutral",
      "Impulsa a través de los talones y extiende las caderas para bloquear",
      "Baja la barra de vuelta a los pins bajo control total",
    ],
  },
  "back-011": {
    name: "Good Morning (Buenos Días)",
    description: "Un ejercicio de bisagra de cadera donde se coloca una barra en la espalda alta y el torso se inclina hacia adelante manteniendo la espalda recta.",
    history: "El good morning debe su nombre a los forzudos antiguos que lo usaban como accesorio para mejorar la mecánica del peso muerto y la sentadilla.",
    benefits: [
      "Fortalece los erectores espinales y los isquiotibiales simultáneamente",
      "Enseña el patrón correcto de bisagra de cadera para pesos muertos",
      "Mejora la resiliencia de la zona lumbar y la postura",
    ],
    commonMistakes: [
      "Permitir que la zona lumbar se redondee en la parte inferior del movimiento",
      "Doblar demasiado las rodillas y convertirlo en una sentadilla",
      "Usar peso excesivo antes de dominar la forma",
    ],
    tips: [
      "Mantén una ligera flexión en las rodillas durante todo el movimiento",
      "Empuja las caderas hacia atrás como si cerraras la puerta de un coche con los glúteos",
      "Mantén el pecho erguido y la columna neutral en todo momento",
    ],
    variations: ["Good Morning Sentado", "Good Morning con Barra de Seguridad", "Good Morning con Banda", "Good Morning con Mancuerna"],
    instructions: [
      "Coloca la barra sobre los trapecios superiores, no en el cuello",
      "Párate con los pies al ancho de los hombros y una ligera flexión de rodillas",
      "Inclina las caderas, empujando los glúteos hacia atrás mientras bajas el torso hacia adelante",
      "Baja hasta que el torso esté casi paralelo al suelo, manteniendo la espalda recta",
      "Invierte el movimiento llevando las caderas hacia adelante para volver a la posición erguida",
    ],
  },
  "back-012": {
    name: "Remo con Mancuerna",
    description: "Un remo bilateral o unilateral usando mancuernas para apuntar a la espalda media y dorsales con libertad de rotación de muñeca.",
    history: "Los remos con mancuerna han sido un elemento básico del gimnasio desde los años 40, valorados por su simplicidad y efectividad para construir grosor en la espalda.",
    benefits: [
      "Permite una rotación natural de la muñeca para comodidad y mejor conexión mente-músculo",
      "Puede realizarse bilateral o unilateralmente para variedad",
      "Requiere configuración mínima y accesibilidad de equipo",
    ],
    commonMistakes: [
      "Redondear los hombros y la espalda durante el tirón",
      "Usar un peso demasiado pesado y comprometer el rango de movimiento",
      "Remar demasiado rápido sin control muscular",
    ],
    tips: [
      "Gira las muñecas en la parte superior para una mejor activación dorsal",
      "Lleva las mancuernas hacia las caderas en lugar de las axilas",
      "Mantén el cuello alineado con la columna durante todo el movimiento",
    ],
    variations: ["Remo con Mancuerna en Inclinado", "Remo con Dos Mancuernas", "Remo Unilateral con Mancuerna", "Remo con Mancuerna en Banco"],
    instructions: [
      "Sostén una mancuerna en cada mano con los pies al ancho de los hombros",
      "Inclina las caderas hasta que el torso esté en un ángulo de 45 grados",
      "Deja que las mancuernas cuelguen a la altura de los brazos con las palmas enfrentadas",
      "Remo ambas mancuernas hacia las costillas bajas, apretando los omóplatos",
      "Baja las mancuernas con control hasta que los brazos estén completamente extendidos",
    ],
  },
  "back-013": {
    name: "Aperturas Inversas (Reverse Flyes)",
    description: "Un movimiento de aislamiento para los deltoides posteriores y la espalda alta realizado con mancuernas o máquina pec-deck.",
    history: "Las aperturas inversas se popularizaron en los años 60 cuando los culturistas buscaban trabajo más específico para los deltoides posteriores para un desarrollo equilibrado del hombro.",
    benefits: [
      "Aísla los deltoides posteriores y romboides para mejora postural",
      "Equilibra el desarrollo del hombro apuntando a los deltoides posteriores a menudo descuidados",
      "Ayuda a corregir hombros redondeados por exceso de press",
    ],
    commonMistakes: [
      "Usar impulso para balancear las mancuernas hacia arriba en lugar de control muscular",
      "Doblar demasiado los codos y convertirlo en un remo",
      "Encoger los hombros durante el movimiento",
    ],
    tips: [
      "Imagina apretar un lápiz entre los omóplatos en la parte superior",
      "Mantén una ligera flexión en los codos y mantenla durante todo el movimiento",
      "Controla el descenso durante dos segundos para maximizar el estiramiento",
    ],
    variations: ["Apertura Inversa en Cable", "Apertura Inversa en Pec-Deck", "Apertura Inversa Inclinado", "Apertura Inversa en Banco Inclinado"],
    instructions: [
      "Sostén una mancuerna en cada mano e inclínate hacia adelante desde las caderas con la espalda plana",
      "Deja que las mancuernas cuelguen debajo del pecho con las palmas enfrentadas",
      "Eleva las mancuernas hacia los lados hasta que alcancen la altura de los hombros",
      "Aprieta los deltoides posteriores arriba, luego baja con control",
      "Mantén el cuello neutral y evita sacudir el peso hacia arriba",
    ],
  },
  "back-014": {
    name: "Face Pull (Jalón Facial)",
    description: "Un ejercicio de tirón con cable que apunta a los deltoides posteriores, trapecios y músculos del manguito rotador usando un accesorio de cuerda.",
    history: "Los face pulls ganaron popularidad generalizada en los años 2000 cuando la salud del hombro y la prehabilitación se volvieron mainstream en el entrenamiento de fuerza.",
    benefits: [
      "Fortalece los deltoides posteriores y rotadores externos a menudo descuidados",
      "Mejora la salud del hombro y la postura equilibrando el volumen de press",
      "Potencia la estabilidad del manguito rotador para prevención de lesiones",
    ],
    commonMistakes: [
      "Llevar la cuerda recta hacia atrás en lugar de hacia la cara",
      "Usar demasiado peso y sacrificar el rango de movimiento",
      "Inclinarse hacia atrás para usar impulso corporal",
    ],
    tips: [
      "Lleva la cuerda hacia tu cara con los codos abiertos hacia los lados",
      "Rota externamente los hombros al final del tirón",
      "Usa un peso más ligero y concéntrate en la contracción y el control",
    ],
    variations: ["Face Pull con Banda", "Face Pull con Mancuerna", "Face Pull de Pie", "Face Pull Acostado"],
    instructions: [
      "Coloca una polea a la altura del pecho superior y coloca un mango de cuerda",
      "Agarra la cuerda con agarre prono y retrocede para crear tensión",
      "Lleva la cuerda hacia tu cara, separando los extremos a medida que se acercan",
      "Rota los hombros externamente en el pico del movimiento",
      "Regresa lentamente a la posición inicial con control",
    ],
  },
  "back-015": {
    name: "Remo Invertido (Inverted Row)",
    description: "Un remo de peso corporal realizado llevando el pecho hacia una barra fija mientras cuelgas debajo de ella en un ángulo.",
    history: "Los remos invertidos se han utilizado en entrenamiento de gimnasia y calistenia durante décadas como movimiento de tirón fundamental antes de progresar a dominadas.",
    benefits: [
      "Proporciona un tirón horizontal escalable para todos los niveles de condición física",
      "Desarrolla fuerza dorsal y romboides sin compresión espinal",
      "Excelente como calentamiento o accesorio para remos más avanzados",
    ],
    commonMistakes: [
      "No mantener el cuerpo en una posición de plancha recta",
      "Tirar solo con los brazos en lugar de activar la espalda",
      "Permitir que las caderas se hundan hacia el suelo",
    ],
    tips: [
      "Mantén el cuerpo rígido desde los talones hasta los hombros durante todo el movimiento",
      "Lleva el pecho hacia la barra, no la barbilla",
      "Bájate lentamente para maximizar el tiempo bajo tensión",
    ],
    variations: ["Remo en Anillas", "Remo Invertido con Pies Elevados", "Remo Arquero", "Remo Invertido con Peso"],
    instructions: [
      "Coloca una barra en un rack a la altura de la cadera o usa una barra de dominadas baja",
      "Colócate debajo de la barra y agárrala con las manos más anchas que los hombros",
      "Cuélgate de la barra con los brazos extendidos y el cuerpo en línea recta",
      "Lleva el pecho hacia la barra apretando los omóplatos",
      "Bájate de vuelta a la extensión completa del brazo con control",
    ],
  },
  "back-016": {
    name: "Pullover en Cable",
    description: "Una versión en cable del pullover clásico que proporciona tensión constante en los dorsales durante todo el movimiento.",
    history: "Los pullovers en cable surgieron a medida que las máquinas de cable se volvieron más avanzadas, ofreciendo una alternativa más suave al pullover con mancuerna.",
    benefits: [
      "Proporciona tensión constante en los dorsales durante todo el rango de movimiento",
      "Más suave para las articulaciones del hombro comparado con pullovers con mancuerna",
      "Permite ajustes fáciles de peso y series descendentes",
    ],
    commonMistakes: [
      "Usar los tríceps para empujar en lugar de los dorsales para tirar",
      "Dejar que el cable lleve los brazos demasiado atrás más allá de la comodidad del hombro",
      "Inclinarse hacia adelante desde las caderas excesivamente durante el movimiento",
    ],
    tips: [
      "Mantén los codos ligeramente flexionados y bloqueados en esa posición",
      "Concéntrate en iniciar el movimiento desde los dorsales",
      "Controla la fase de retorno para mantener tensión en los músculos trabajados",
    ],
    variations: ["Pulldown de Brazo Recto", "Pullover con Cuerda", "Pullover Unilateral en Cable", "Pullover de Pie en Cable"],
    instructions: [
      "Coloca una barra recta o cuerda en una polea alta",
      "Agarra el accesorio con ambas manos y retrocede, inclinándote ligeramente hacia adelante",
      "Manteniendo los brazos casi rectos, lleva el cable hacia abajo hasta los muslos",
      "Aprieta los dorsales abajo, luego regresa lentamente a la posición inicial",
      "Mantén el torso estable durante todo el movimiento sin balancearte",
    ],
  },
  "back-017": {
    name: "Pulldown de Brazo Recto (Straight-Arm Pulldown)",
    description: "Un ejercicio de aislamiento en cable que apunta a los dorsales con brazos rectos llevando una barra desde arriba hacia los muslos.",
    history: "Los pulldowns de brazo recto se volvieron favoritos entre los culturistas en los años 80 por aislar los dorsales sin participación de los bíceps.",
    benefits: [
      "Aísla los dorsales con mínima contribución de bíceps o tríceps",
      "Proporciona un estiramiento profundo arriba y una fuerte contracción abajo",
      "Ideal como finalizador después de trabajo pesado de espalda para flujo sanguíneo",
    ],
    commonMistakes: [
      "Doblar los codos y convertir el movimiento en un pushdown de tríceps",
      "Usar un peso demasiado pesado y perder rango de movimiento",
      "Balancear el cuerpo excesivamente para generar impulso",
    ],
    tips: [
      "Mantén una ligera flexión en los codos pero mantenlos bloqueados en posición",
      "Empuja la barra hacia abajo y atrás, no solo recto hacia abajo",
      "Imagina que estás vertiendo agua de una jarra en la posición inferior",
    ],
    variations: ["Pulldown de Brazo Recto con Cuerda", "Pulldown de Brazo Recto con Banda", "Pulldown de Brazo Recto Unilateral", "Pulldown de Brazo Recto con Barra EZ"],
    instructions: [
      "Coloca una barra recta en una polea alta y agárrala con las palmas hacia abajo",
      "Retrocede con los pies al ancho de los hombros e inclínate hacia adelante desde las caderas",
      "Mantén los brazos casi rectos y lleva la barra hacia abajo hasta los muslos",
      "Aprieta los dorsales abajo y mantén por un momento breve",
      "Eleva lentamente la barra de vuelta a la altura de los hombros, sintiendo el estiramiento en los dorsales",
    ],
  },
  "back-018": {
    name: "Remo Sentado en Cable con Agarre Amplio",
    description: "Una variación de remo en cable usando un mango más ancho para enfatizar la espalda alta y los deltoides posteriores más fuertemente.",
    history: "Los remos en cable con agarre amplio fueron adoptados por culturistas que buscaban añadir anchura a la espalda alta y mejorar la estética en V.",
    benefits: [
      "Apunta a los dorsales superiores, romboides y deltoides posteriores",
      "Crea una apariencia más ancha en la espalda alta",
      "Proporciona un estímulo diferente al de los remos estándar con agarre cerrado",
    ],
    commonMistakes: [
      "Abrir demasiado los codos y perder la activación de la espalda",
      "Llevar el mango al pecho en lugar del abdomen superior",
      "Redondear la zona lumbar al final del movimiento",
    ],
    tips: [
      "Lleva la barra hacia el pecho superior con los codos abiertos a 45 grados",
      "Mantén el pecho alto y los hombros hacia abajo durante todo el movimiento",
      "Usa un tempo controlado con una contracción de dos segundos en la contracción completa",
    ],
    variations: ["Remo Sentado con Agarre Cerrado", "Remo Sentado con Agarre Inverso", "Remo en Cable con Agarre Amplio", "Remo en Cable de Pie"],
    instructions: [
      "Siéntate en la estación de remo en cable y coloca la barra de agarre amplio",
      "Agarra la barra con las palmas hacia abajo, manos más anchas que los hombros",
      "Mantén el pecho arriba y los hombros atrás mientras llevas la barra hacia el pecho superior",
      "Aprieta los omóplatos en el pico del movimiento",
      "Extiende los brazos completamente y siente el estiramiento antes de comenzar la siguiente repetición",
    ],
  },
  "back-019": {
    name: "Peso Muerto con Agarre de Arranque (Snatch-Grip Deadlift)",
    description: "Una variación de peso muerto usando un agarre muy amplio que aumenta el rango de movimiento y enfatiza la espalda alta.",
    history: "El peso muerto con agarre de arranque fue tomado del levantamiento olímpico como accesorio para fortalecer el tirón de arranque y la espalda alta.",
    benefits: [
      "Aumenta el rango de movimiento comparado con los pesos muertos convencionales",
      "Coloca mayor demanda en la espalda alta y los trapecios",
      "Mejora la fuerza de tirón con agarre amplio para levantadores olímpicos",
    ],
    commonMistakes: [
      "Permitir que la barra se aleje de las espinillas durante el tirón",
      "Redondear la espalda alta por el agarre excesivamente amplio",
      "Colocar las caderas demasiado bajas y convertir el tirón en una sentadilla",
    ],
    tips: [
      "Usa correas de muñeca si el agarre se vuelve un factor limitante",
      "Mantén la barra cerca del cuerpo durante todo el tirón",
      "Saca la holgura de la barra antes de impulsar a través del suelo",
    ],
    variations: ["Tirón de Arranque", "Peso Muerto de Arranque", "Peso Muerto con Déficit y Agarre de Arranque", "Peso Muerto con Pausa y Agarre de Arranque"],
    instructions: [
      "Acércate a la barra con los pies al ancho de las caderas y agarra la barra cerca de los collares con un agarre amplio",
      "Baja las caderas a posición con el pecho arriba y la espalda plana",
      "Saca la holgura de la barra y contrae el core",
      "Impulsa a través de los talones y levanta la barra, manteniéndola cerca del cuerpo",
      "Bloquea arriba apretando los glúteos, luego baja la barra con control",
    ],
  },
  "back-020": {
    name: "Remo Pendlay",
    description: "Una variación explosiva de remo con barra donde la barra se levanta desde una parada completa en el suelo hasta el pecho superior en cada repetición.",
    history: "Nombrado en honor al entrenador de levantamiento olímpico Glenn Pendlay, esta variación fue diseñada para construir potencia explosiva de tirón desde el suelo.",
    benefits: [
      "Elimina el impulso comenzando cada repetición desde una parada completa en el suelo",
      "Construye potencia explosiva de tirón desde la posición del suelo",
      "Fortalece la espalda alta con forma estricta y técnica controlada",
    ],
    commonMistakes: [
      "No dejar que la barra se detenga completamente entre repeticiones",
      "Llevar la barra al estómago en lugar del pecho superior",
      "Rotación excesiva del torso durante el tirón",
    ],
    tips: [
      "Reinicia la posición de la espalda después de cada repetición antes de tirar de nuevo",
      "Lleva la barra al esternón inferior para una activación óptima de la espalda",
      "Mantén el ángulo del torso consistente durante todo el movimiento",
    ],
    variations: ["Remo Touch-and-Go", "Remo con Barra", "Remo Meadows", "Remo Kroc"],
    instructions: [
      "Coloca una barra en el suelo con los discos de peso deseados",
      "Párate con los pies al ancho de los hombros e inclínate con la espalda plana hasta que el torso esté casi paralelo al suelo",
      "Agarra la barra con agarre prono justo por fuera de las rodillas",
      "Lleva la barra explosivamente hacia el pecho superior manteniendo el torso estacionario",
      "Baja la barra al suelo y deja que se detenga completamente antes de la siguiente repetición",
    ],
  },
  "back-021": {
    name: "Remo Meadows",
    description: "Una variación unilateral de remo usando una barra landmine que permite una contracción intensa de los dorsales a través de un ángulo único.",
    history: "Popularizado por el culturista John Meadows, esta variación de remo se hizo famosa por su ángulo único y su brutal contracción dorsal.",
    benefits: [
      "Proporciona una línea de tirón única que apunta a los dorsales intensamente",
      "La naturaleza unilateral ayuda a corregir desequilibrios musculares",
      "Reduce el estrés lumbar comparado con los remos con barra inclinados",
    ],
    commonMistakes: [
      "Usar demasiada rotación corporal para mover el peso",
      "No lograr un estiramiento completo en la parte inferior del movimiento",
      "Llevar la barra demasiado alta hacia el pecho",
    ],
    tips: [
      "Lleva el mango landmine hacia la cadera para máxima activación dorsal",
      "Deja que el peso estire realmente el dorsal abajo antes de tirar",
      "Mantén los pies escalonados para mejor equilibrio y estabilidad",
    ],
    variations: ["Remo con Mancuerna", "Remo Kroc", "Remo Unilateral Landmine", "Spoto Press"],
    instructions: [
      "Coloca un accesorio landmine o acuña una barra en una esquina y carga un extremo",
      "Párate al lado de la barra con una postura escalonada, pies al ancho de los hombros",
      "Agarra la barra cerca del extremo cargado e inclínate desde las caderas con la espalda plana",
      "Remo la barra hacia la cadera, manteniendo el codo cerca del cuerpo",
      "Baja la barra hasta la extensión completa del brazo, sintiendo el estiramiento dorsal antes de tirar de nuevo",
    ],
  },
  "back-022": {
    name: "Remo Kroc",
    description: "Un remo unilateral con mancuerna de altas repeticiones y peso pesado, nombrado por el culturista John Kroc, conocido por su rango de movimiento extremo.",
    history: "John Kroc popularizó esta variación extrema de remo a principios de los 2000, usando mancuernas muy pesadas para altas repeticiones para construir tamaño masivo de espalda.",
    benefits: [
      "Combina peso pesado con altas repeticiones para hipertrofia y resistencia",
      "El rango de movimiento extremo estira y contrae el dorsal completamente",
      "Desarrolla fuerza de agarre y fortaleza mental a través de trabajo de altas repeticiones",
    ],
    commonMistakes: [
      "Apresurar las repeticiones sin lograr el rango completo de movimiento",
      "Usar demasiado balanceo corporal para levantar el peso",
      "Descuidar la fase excéntrica dejando caer el peso",
    ],
    tips: [
      "Deja que la mancuerna cuelgue con la extensión completa del brazo abajo",
      "Lleva la mancuerna lo más alto posible hacia la cadera",
      "Agarra firmemente el banco con la mano libre para estabilidad",
    ],
    variations: ["Remo Unilateral Estándar con Mancuerna", "Remo Meadows", "Remo con Mancuerna en Inclinado", "Remo Landmine"],
    instructions: [
      "Apoya una rodilla y mano en un banco plano con el otro pie plantado en el suelo",
      "Agarra una mancuerna pesada con la mano libre y déjala colgar con la extensión completa del brazo",
      "Lleva la mancuerna hacia la cadera con una ligera rotación corporal",
      "Aprieta el dorsal fuertemente arriba, luego baja la mancuerna con control total",
      "Completa todas las repeticiones de un lado antes de cambiar al otro brazo",
    ],
  },
  "back-023": {
    name: "Superman Hold (Superman Estático)",
    description: "Un ejercicio isométrico de peso corporal donde levantas ambos brazos y piernas del suelo mientras estás acostado boca abajo.",
    history: "El superman hold es un elemento básico de fisioterapia nombrado por la pose de vuelo del personaje de cómic, usado para fortalecer la zona lumbar durante décadas.",
    benefits: [
      "Fortalece los erectores espinales y los músculos de la zona lumbar",
      "Mejora la estabilidad espinal y la postura sin carga",
      "Actúa como ejercicio correctivo para trabajadores de escritorio y personas sedentarias",
    ],
    commonMistakes: [
      "Sacudir las extremidades hacia arriba en lugar de levantarlas con control",
      "Contener la respiración durante la fase de mantenimiento",
      "Levantar la cabeza demasiado atrás, forzando el cuello",
    ],
    tips: [
      "Mantén la mirada en el suelo para mantener una posición neutral del cuello",
      "Aprieta los glúteos y la zona lumbar simultáneamente en la parte superior",
      "Respira constantemente durante la retención en lugar de contener la respiración",
    ],
    variations: ["Superman Alternado", "Superman solo Brazos", "Superman solo Piernas", "Superman con Peso"],
    instructions: [
      "Acuéstate boca abajo en el suelo con los brazos extendidos sobre la cabeza y las piernas rectas",
      "Levanta simultáneamente brazos, pecho y piernas del suelo lo más alto posible cómodamente",
      "Mantén la posición arriba, apretando la zona lumbar y los glúteos",
      "Baja todo de vuelta a la posición inicial con control",
      "Repite para el número prescrito de repeticiones o tiempo de retención",
    ],
  },
  "back-024": {
    name: "Face Pull con Rotación Externa en Cable",
    description: "Una variación de face pull que añade rotación externa al final del tirón para una mayor activación del manguito rotador.",
    history: "Esta variación fue desarrollada por fisioterapeutas y entrenadores de fuerza para abordar la disfunción del hombro y mejorar la fuerza de rotación externa.",
    benefits: [
      "Fortalece específicamente el infraespinoso y el redondo menor del manguito rotador",
      "Mejora el rango de movimiento de rotación externa del hombro",
      "Proporciona desarrollo completo del deltoides posterior y la espalda alta",
    ],
    commonMistakes: [
      "Usar peso excesivo y perder la capacidad de rotar externamente",
      "Girar el torso para ayudar a la rotación en lugar de aislar el hombro",
      "No lograr la rotación externa completa en el pico del movimiento",
    ],
    tips: [
      "Concéntrate en rotar las palmas hacia adelante al final del tirón",
      "Imagina que intentas mostrar tus bíceps a alguien detrás de ti",
      "Mantén el peso moderado y prioriza el componente rotacional",
    ],
    variations: ["Face Pull con Banda", "Face Pull con Mancuerna", "Face Pull Prono", "Rotación Externa de Pie"],
    instructions: [
      "Coloca una polea a la altura del pecho superior y coloca una cuerda",
      "Agarra la cuerda con las palmas hacia abajo y retrocede para crear tensión",
      "Lleva la cuerda hacia tu cara mientras abres los codos hacia afuera",
      "Al final del tirón, rota externamente los hombros girando las palmas hacia adelante",
      "Invierte el movimiento lentamente y regresa a la posición inicial",
    ],
  },
  "back-025": {
    name: "Band Pull-Apart (Apertura con Banda)",
    description: "Un ejercicio simple con banda de resistencia donde se abre la banda horizontalmente a través del pecho.",
    history: "Los band pull-aparts se convirtieron en un elemento básico en las rutinas de calentamiento durante los 2010 al reconocerse ampliamente la importancia de la salud del hombro y la prehabilitación.",
    benefits: [
      "Activa los deltoides posteriores y romboides antes del trabajo de press",
      "Mejora la postura fortaleciendo los retractores escapulares",
      "Portátil y se puede hacer en cualquier lugar como calentamiento",
    ],
    commonMistakes: [
      "Usar una banda demasiado gruesa y comprometer el rango de movimiento",
      "Doblar los codos y reducir la efectividad",
      "Abrir solo hasta el ancho de los hombros en lugar de completamente más allá del pecho",
    ],
    tips: [
      "Abre la banda hasta que toque tu pecho para máxima contracción",
      "Mantén los brazos rectos durante todo el movimiento",
      "Úsalo como parte de un circuito de calentamiento antes del entrenamiento de la parte superior del cuerpo",
    ],
    variations: ["Band Pull-Apart sobre Cabeza", "Band Pull-Apart detrás de la Espalda", "Apertura Inversa con Banda", "Dislocación con Banda"],
    instructions: [
      "Párate erguido con una banda de resistencia sostenida en ambas manos a la altura de los hombros",
      "Mantén los brazos rectos y las palmas hacia abajo",
      "Abre la banda horizontalmente hasta que toque tu pecho",
      "Aprieta los omóplatos en el pico",
      "Regresa lentamente a la posición inicial bajo tensión",
    ],
  },
  "back-026": {
    name: "Remo con Apoyo en el Pecho",
    description: "Un remo realizado en un banco inclinado que apoya el pecho, eliminando la necesidad de estabilización lumbar.",
    history: "Los remos con apoyo en el pecho se desarrollaron como una alternativa más segura a los remos inclinados para personas con problemas o lesiones lumbares.",
    benefits: [
      "Elimina la tensión lumbar proporcionando apoyo en el pecho",
      "Permite remar pesado sin comprometer la posición espinal",
      "Aísla los dorsales y romboides eliminando el impulso",
    ],
    commonMistakes: [
      "Encoger los hombros durante el remo en lugar de retraer las escápulas",
      "Llevar el peso demasiado alto y activar los trapecios excesivamente",
      "Dejar que el pecho se levante del soporte durante la fase concéntrica",
    ],
    tips: [
      "Coloca el banco a 30-45 grados para una activación óptima de los dorsales",
      "Lleva los codos hacia atrás y aprieta los omóplatos",
      "Mantén el pecho presionado firmemente contra el banco durante todo el movimiento",
    ],
    variations: ["Remo con Apoyo en Máquina", "Remo con Apoyo en Cable", "Remo con Apoyo y Mancuerna", "Remo DB en Inclinado"],
    instructions: [
      "Coloca un banco ajustable a una inclinación de 30 grados",
      "Acuéstate boca abajo en el banco con el pecho apoyado y los pies en el suelo",
      "Sostén una mancuerna en cada mano con los brazos colgando rectos hacia abajo",
      "Remo las mancuernas hacia las costillas bajas, manteniendo los codos cerca",
      "Baja las mancuernas hasta la extensión completa del brazo antes de tirar de nuevo",
    ],
  },
  "back-027": {
    name: "Encogimiento de Hombros con Mancuerna",
    description: "Un ejercicio de aislamiento para los músculos trapecios realizado elevando los hombros contra resistencia.",
    history: "Los encogimientos se han usado desde principios del 1900 por forzudos y culturistas que buscaban desarrollar tamaño imponente de trapecios y fuerza en el cuello.",
    benefits: [
      "Aísla y construye los músculos trapecios superiores eficazmente",
      "Mejora la estabilidad del hombro y la postura del cuello",
      "Requiere equipo mínimo y complejidad técnica baja",
    ],
    commonMistakes: [
      "Rodar los hombros en un movimiento circular en lugar de subir y bajar recto",
      "Usar los brazos para hacer curl con las mancuernas en lugar de encoger",
      "Encoger demasiado rápido sin mantener la contracción máxima",
    ],
    tips: [
      "Piensa en intentar tocar tus orejas con los hombros",
      "Mantén la contracción máxima durante uno o dos segundos cada repetición",
      "Mantén los brazos rectos y deja que los trapecios hagan todo el trabajo",
    ],
    variations: ["Encogimiento con Barra", "Encogimiento en Smith Machine", "Encogimiento en Cable", "Encogimiento con Barra detrás de la Espalda"],
    instructions: [
      "Párate con los pies al ancho de los hombros, sosteniendo una mancuerna en cada mano a los costados",
      "Mantén los brazos completamente extendidos y el pecho arriba",
      "Eleva los hombros rectos hacia arriba hacia las orejas lo más alto posible",
      "Mantén la posición superior por un segundo, apretando los trapecios",
      "Baja las mancuernas de vuelta con control",
    ],
  },
  "back-028": {
    name: "Encogimiento de Hombros con Barra",
    description: "Una versión más pesada del encogimiento usando una barra para cargar al máximo los músculos trapecios superiores.",
    history: "Los encogimientos con barra se convirtieron en un sello del powerlifting y el culturismo en los años 60, famosamente usados por atletas como Ronnie Coleman para construir trapecios masivos.",
    benefits: [
      "Permite la carga más pesada de los músculos trapecios",
      "Construye grosor del cuello y masa de trapecios superiores rápidamente",
      "Transfiere a un mejor rendimiento en peso muerto y rack pull",
    ],
    commonMistakes: [
      "Encoger con los brazos doblados en lugar de usar los trapecios",
      "Rebotar el peso abajo para comenzar la siguiente repetición",
      "Mirar hacia abajo excesivamente y comprometer la seguridad del cuello",
    ],
    tips: [
      "Usa un agarre prono para mejor activación de los trapecios",
      "Mantén la barbilla recogida y el cuello neutral durante todo el movimiento",
      "Usa correas de levantamiento si el agarre falla antes que los trapecios",
    ],
    variations: ["Encogimiento con Mancuerna", "Encogimiento en Smith Machine", "Encogimiento con Barra detrás de la Espalda", "Encogimiento con Barra Hexagonal"],
    instructions: [
      "Sostén una barra a la altura de la cadera con agarre prono ligeramente más ancho que los hombros",
      "Párate con los pies al ancho de las caderas, brazos completamente extendidos",
      "Encoje los hombros rectos hacia arriba lo más alto posible hacia las orejas",
      "Pausa arriba y aprieta los trapecios",
      "Baja la barra de vuelta a la posición inicial bajo control",
    ],
  },
  "back-029": {
    name: "Extensión de Espalda (Back Extension)",
    description: "Un movimiento de bisagra de cadera en un banco de hiperextensión que apunta a los erectores espinales y la zona lumbar.",
    history: "Las extensiones de espalda han sido un elemento básico en gimnasia y entrenamiento de fuerza desde principios del siglo XX para desarrollar resiliencia lumbar.",
    benefits: [
      "Fortalece la zona lumbar y los erectores espinales de forma segura",
      "Enseña la mecánica correcta de bisagra de cadera para pesos muertos",
      "Rehabilita y previene el dolor lumbar a través del movimiento controlado",
    ],
    commonMistakes: [
      "Hiperextender la zona lumbar en la parte superior del movimiento",
      "Redondear excesivamente la espalda en la parte inferior",
      "Usar impulso para balancear el torso hacia arriba en lugar de trabajo muscular controlado",
    ],
    tips: [
      "Mantén las manos detrás de la cabeza o cruzadas sobre el pecho",
      "Eleva el torso hasta que esté en línea con las piernas, no más allá de paralelo",
      "Aprieta los glúteos arriba para proteger la zona lumbar",
    ],
    variations: ["Extensión de Espalda con Peso", "Extensión de Espalda a 45 Grados", "Extensión de Espalda Inversa", "Retención en Silla Romana"],
    instructions: [
      "Coloca las caderas en el cojín del banco de hiperextensión con los tobillos asegurados",
      "Cruza los brazos sobre el pecho o coloca las manos detrás de la cabeza",
      "Baja el torso inclinándote desde las caderas hasta sentir un estiramiento en los isquiotibiales",
      "Eleva el torso de vuelta a la posición inicial contrayendo la zona lumbar y los glúteos",
      "Detente cuando tu cuerpo forme una línea recta, evitando la hiperextensión",
    ],
  },
  "back-030": {
    name: "Dominada con Agarre Amplio (Wide-Grip Pull-Up)",
    description: "Una variación de dominada con las manos colocadas significativamente más anchas que los hombros para enfatizar el ancho de los dorsales.",
    history: "Las dominadas con agarre amplio se convirtieron en un ejercicio definitorio de la era dorada del culturismo, apreciadas por crear el clásico físico en V.",
    benefits: [
      "Maximiza el ancho de los dorsales y el desarrollo de la espalda alta",
      "Crea una apariencia más ancha en V desde la parte posterior",
      "Fortalece los músculos redondo mayor y menor eficazmente",
    ],
    commonMistakes: [
      "Agarre demasiado amplio que reduce significativamente el rango de movimiento",
      "Balancear las piernas para generar impulso para el tirón",
      "No llevar la barbilla sobre la barra para el rango completo de movimiento",
    ],
    tips: [
      "Agarra la barra a una anchura donde los antebrazos estén verticales arriba",
      "Lleva los codos hacia atrás y abajo para iniciar el tirón",
      "Usa un tempo controlado en lugar de movimientos explosivos y bruscos",
    ],
    variations: ["Dominada Estándar", "Dominada Amplia con Peso", "Chin-Up Amplio", "Dominada con Agarre Neutro"],
    instructions: [
      "Agarra la barra de dominadas con las palmas hacia afuera, manos significativamente más anchas que los hombros",
      "Cuélgate con los brazos completamente extendidos y activa el core para evitar balancearte",
      "Elevate hacia arriba llevando los codos hacia abajo y atrás",
      "Continúa hasta que la barbilla supere la barra, luego bájate con control",
      "Extiende completamente los brazos abajo antes de comenzar la siguiente repetición",
    ],
  },
  "back-031": {
    name: "Remo Foca (Seal Row)",
    description: "Una variación de remo realizada acostado boca abajo en un banco plano con mancuernas, apuntando a la espalda media con forma estricta.",
    history: "Los remos foca obtuvieron su nombre de las focas en la parte posterior de los bancos ajustables antiguos y se popularizaron entre culturistas por el aislamiento estricto de la espalda.",
    benefits: [
      "Elimina completamente el estrés lumbar al acostarse boca abajo",
      "Permite un movimiento de remo muy estricto y controlado",
      "Proporciona un estiramiento profundo y una fuerte contracción a través del ROM completo",
    ],
    commonMistakes: [
      "Dejar que las mancuernas se desvíen hacia adelante en lugar de tirar recto hacia arriba",
      "Encoger los hombros en lugar de retraer las escápulas",
      "Usar impulso levantando el pecho del banco",
    ],
    tips: [
      "Mantén el pecho y la barbilla en el banco durante todo el movimiento",
      "Lleva las mancuernas hacia los lados de la caja torácica",
      "Aprieta los omóplatos al final de cada repetición",
    ],
    variations: ["Remo Foca con Barra", "Remo Foca en Cable", "Remo Foca en Inclinado", "Remo Foca con Placas"],
    instructions: [
      "Acuéstate boca abajo en un banco plano con una mancuerna en cada mano, brazos colgando rectos hacia abajo",
      "Mantén el pecho presionado contra el banco y la barbilla fuera del banco",
      "Lleva las mancuernas hacia arriba hacia los lados de la caja torácica, manteniendo los codos cerca",
      "Aprieta los omóplatos en la parte superior del movimiento",
      "Baja las mancuernas hasta la extensión completa del brazo bajo control",
    ],
  },
  "back-032": {
    name: "Dominada Horizontal (Horizontal Pull-Up)",
    description: "Una variación de remo de peso corporal realizada en una barra baja donde el cuerpo está horizontal y se eleva hacia la barra.",
    history: "Las dominadas horizontales, también conocidas como dominadas australianas, se han usado en calistenia y entrenamiento militar como progresión hacia dominadas completas.",
    benefits: [
      "Proporciona un movimiento de tirón horizontal escalable para principiantes",
      "Construye fuerza de espalda fundamental para progresar a dominadas",
      "Activa el core para mantener una posición corporal rígida",
    ],
    commonMistakes: [
      "Dejar que las caderas se hundan hacia el suelo durante el tirón",
      "No lograr la extensión completa del brazo en la parte inferior",
      "Tirar solo con los brazos en lugar de activar la espalda",
    ],
    tips: [
      "Mantén el cuerpo recto desde los hombros hasta los tobillos durante todo el movimiento",
      "Lleva el pecho a la barra, no la barbilla",
      "Bájate con una excéntrica lenta y controlada",
    ],
    variations: ["Remo en Anillas", "Remo Inclinado", "Dominada Horizontal con Pies Elevados", "Dominada Horizontal con Peso"],
    instructions: [
      "Coloca una barra a la altura de la cadera y colócate debajo de ella",
      "Agarra la barra con las manos más anchas que los hombros, cuerpo en línea recta desde los talones hasta los hombros",
      "Lleva el pecho hacia la barra apretando los omóplatos",
      "Haz una pausa breve arriba con el pecho tocando o cerca de la barra",
      "Bájate de vuelta a la extensión completa del brazo con control",
    ],
  },
  "back-033": {
    name: "Remo Unilateral con Mancuerna y Landmine",
    description: "Un remo unilateral usando una mancuerna sostenida por el extremo para un rango de movimiento extendido y palanca única.",
    history: "Esta variación surgió del entrenamiento cruzado y el fitness funcional como una forma de añadir variedad a los movimientos de remo con equipo mínimo.",
    benefits: [
      "Proporciona un rango de movimiento extendido debido al peso descentrado",
      "Construye estabilidad rotacional y activación del core a través del remo",
      "Corrige desequilibrios con carga unilateral y control",
    ],
    commonMistakes: [
      "Rotar el torso excesivamente durante el tirón",
      "Usar una mancuerna demasiado pesada y perder el control de la trayectoria",
      "No lograr la extensión completa en la parte inferior del movimiento",
    ],
    tips: [
      "Sostén la mancuerna por un extremo para máxima palanca",
      "Mantén las caderas cuadradas y mirando hacia adelante durante todo el movimiento",
      "Lleva la mancuerna hacia la cadera, no hacia la axila",
    ],
    variations: ["Remo Landmine con Barra", "Remo Unilateral en Cable", "Remo Meadows", "Remo Kroc"],
    instructions: [
      "Párate con los pies al ancho de los hombros, sosteniendo una mancuerna por un extremo",
      "Inclínate desde las caderas hasta que el torso esté a 45 grados, manteniendo la espalda plana",
      "Deja que la mancuerna cuelgue con la extensión completa del brazo hacia el suelo",
      "Remo la mancuerna hacia la cadera llevando el codo hacia atrás",
      "Baja la mancuerna hasta la extensión completa y repite para todas las repeticiones de un lado",
    ],
  },
  "back-034": {
    name: "Apertura con Banda de Resistencia",
    description: "Un ejercicio de hombros y espalda alta usando una banda de resistencia que se abre horizontalmente a la altura del pecho.",
    history: "Los ejercicios con banda de resistencia ganaron popularidad en entornos de rehabilitación y entrenamientos en casa por su portabilidad y naturaleza amigable para las articulaciones.",
    benefits: [
      "Fortalece los romboides y deltoides posteriores para mejor postura",
      "Mejora la retracción escapular y la estabilidad de los omóplatos",
      "Se puede realizar en cualquier lugar como calentamiento o ejercicio de rehabilitación",
    ],
    commonMistakes: [
      "Usar una banda demasiado ligera que no proporciona suficiente resistencia",
      "Doblar los codos y reducir la efectividad del tirón",
      "Abrir la banda solo parcialmente en lugar de completamente hasta el pecho",
    ],
    tips: [
      "Mantén los brazos rectos y abre la banda hasta que toque tu pecho",
      "Aprieta los omóplatos en el pico del movimiento",
      "Realiza este ejercicio como parte de un calentamiento antes de cualquier entrenamiento de la parte superior del cuerpo",
    ],
    variations: ["Apertura con Banda sobre Cabeza", "Apertura con Banda detrás de la Espalda", "Apertura Inversa con Banda", "Apertura con Banda de Pie"],
    instructions: [
      "Párate con los pies al ancho de los hombros sosteniendo una banda de resistencia con ambas manos a la altura de los hombros",
      "Mantén los brazos rectos y las palmas hacia abajo",
      "Abre la banda horizontalmente hasta que los brazos estén completamente extendidos a los lados",
      "Lleva la banda de vuelta a la posición inicial con control",
      "Mantén la tensión en la banda durante todo el movimiento",
    ],
  },
  
  // ===== CHEST (20 exercises) =====
  "chest-001": {
    name: "Press de Banca con Barra",
    description: "Un movimiento compuesto de press realizado acostado en un banco plano, bajando una barra al pecho y presionándola hacia arriba.",
    history: "El press de banca ha sido la prueba principal de fuerza de la parte superior del cuerpo desde los años 50 y es uno de los tres levantamientos de competencia de powerlifting.",
    benefits: [
      "Construye masa total del pecho y fuerza de press",
      "Mejora la potencia de empuje para deportes y actividades diarias",
      "Desarrolla fuerza de tríceps y deltoides frontales como sinergistas",
    ],
    commonMistakes: [
      "Rebotar la barra en el pecho para ganar impulso",
      "Abrir los codos en un ángulo de 90 grados con el torso",
      "Levantar los glúteos del banco durante el press",
    ],
    tips: [
      "Retrae los omóplatos y mantenlos pegados al banco",
      "Toca la barra en el esternón inferior, no en el cuello",
      "Impulsa los pies contra el suelo para impulso de piernas y estabilidad",
    ],
    variations: ["Press de Banca Inclinado", "Press de Banca Declinado", "Press de Banca con Agarre Cerrado", "Spoto Press"],
    instructions: [
      "Acuéstate plano en un banco con los ojos debajo de la barra y los pies firmemente plantados en el suelo",
      "Agarra la barra ligeramente más ancho que los hombros con un agarre completo",
      "Descuelga la barra estirando los brazos y sostenla sobre los hombros",
      "Baja la barra al esternón inferior con los codos a 45 grados del torso",
      "Presiona la barra de vuelta a la posición inicial impulsando a través del pecho",
    ],
  },
  "chest-002": {
    name: "Press de Banca Inclinado con Barra",
    description: "Una variación de press de banca realizada en un banco inclinado para enfatizar la cabeza clavicular superior del pecho.",
    history: "El press inclinado se volvió esencial en el culturismo en los años 60 cuando los atletas descubrieron su capacidad para desarrollar la plenitud del pecho superior.",
    benefits: [
      "Apunta al pecho superior para un físico más lleno y equilibrado",
      "Reduce la tensión del hombro comparado con el press de banca plano",
      "Mejora la fuerza de press en un ángulo mecánico diferente",
    ],
    commonMistakes: [
      "Colocar el banco en un ángulo demasiado inclinado y convertirlo en un press de hombros",
      "Abrir los codos excesivamente y forzar los hombros",
      "Arquear demasiado la zona lumbar para levantar más peso",
    ],
    tips: [
      "Coloca el banco a 30-45 grados para una activación óptima del pecho superior",
      "Toca la barra en el pecho superior, justo debajo de la clavícula",
      "Mantén los hombros hacia atrás y abajo durante todo el movimiento",
    ],
    variations: ["Press Inclinado con Mancuerna", "Press Inclinado en Smith Machine", "Press Inclinado Hammer Strength", "Press de Bajo Ángulo"],
    instructions: [
      "Coloca un banco ajustable a 30-45 grados de inclinación",
      "Recuéstate y agarra la barra ligeramente más ancho que los hombros",
      "Descuelga la barra y bájala al pecho superior con control",
      "Presiona la barra hacia arriba, manteniendo los codos a 45 grados",
      "Bloquea arriba sin abrir los codos completamente",
    ],
  },
  "chest-003": {
    name: "Press de Banca Declinado con Barra",
    description: "Una variación de press de banca realizada en un banco declinado para enfatizar las fibras inferiores del pecho.",
    history: "El press declinado ganó popularidad en los años 70 cuando los culturistas buscaban desarrollar completamente la región pectoral inferior para definición del pecho.",
    benefits: [
      "Apunta al pecho inferior para desarrollo completo del pectoral",
      "Permite cargas más pesadas debido a la mejor palanca y estabilidad",
      "Activa los tríceps más fuertemente como sinergista",
    ],
    commonMistakes: [
      "Colocar el declive demasiado pronunciado y comprometer la seguridad del hombro",
      "Rebotar la barra en el pecho",
      "Usar un agarre demasiado amplio que reduce el rango de movimiento",
    ],
    tips: [
      "Mantén los pies firmemente enganchados bajo las almohadillas",
      "Toca la barra en la parte inferior del esternón",
      "Impulsa la barra hacia el rack en lugar de recto hacia arriba",
    ],
    variations: ["Press Declinado con Mancuerna", "Press Declinado en Cable", "Press Declinado en Smith Machine", "Fondo con Peso"],
    instructions: [
      "Recuéstate en un banco declinado y asegura tus pies bajo las almohadillas",
      "Agarra la barra ligeramente más ancho que los hombros y descuelga",
      "Baja la barra al esternón inferior con los codos pegados a 45 grados",
      "Presiona la barra de vuelta a la extensión completa del brazo",
      "Mantén la retracción de los omóplatos durante todo el movimiento",
    ],
  },
  "chest-004": {
    name: "Press de Banca con Mancuerna",
    description: "Un movimiento de press con peso libre usando mancuernas en un banco plano para desarrollo unilateral del pecho.",
    history: "El press de banca con mancuerna ha sido un elemento básico del culturismo desde los años 40, valorado por su mayor rango de movimiento y activación muscular.",
    benefits: [
      "Permite un mayor rango de movimiento que el press de banca con barra",
      "Corrige desequilibrios de fuerza izquierda-derecha mediante movimiento independiente de brazos",
      "Proporciona un arco de press más natural para la comodidad del hombro",
    ],
    commonMistakes: [
      "Llevar las mancuernas demasiado abajo y sobreestirar los hombros",
      "Dejar que las mancuernas se separen en la parte inferior del movimiento",
      "Usar un agarre neutral y reducir la activación del pecho",
    ],
    tips: [
      "Rota las palmas hacia adelante arriba para mejor contracción del pecho",
      "Imagina apretar una pelota de playa entre tus manos mientras presionas",
      "Controla la excéntrica y explota a través de la fase concéntrica",
    ],
    variations: ["Press Inclinado con Mancuerna", "Press Declinado con Mancuerna", "Press con Mancuerna y Agarre Neutro", "Press Alternado con Mancuerna"],
    instructions: [
      "Acuéstate en un banco plano con una mancuerna en cada mano descansando sobre los muslos",
      "Impulsa las mancuernas hacia arriba a la altura de los hombros usando los muslos",
      "Presiona las mancuernas hacia arriba hasta la extensión completa del brazo con las palmas hacia adelante",
      "Baja las mancuernas a los lados del pecho hasta sentir un estiramiento",
      "Presiona de vuelta a la posición inicial, apretando el pecho arriba",
    ],
  },
  "chest-005": {
    name: "Press Inclinado con Mancuerna",
    description: "Un movimiento de press con mancuernas en un banco inclinado para enfatizar el pecho superior con movimiento independiente de brazos.",
    history: "El press inclinado con mancuerna se convirtió en un favorito de Arnold Schwarzenegger y otros culturistas de la era dorada para construir masa en el pecho superior.",
    benefits: [
      "Proporciona una activación superior del pecho superior comparado con el press plano",
      "Permite un arco de press natural que es amigable para los hombros",
      "Corrige desequilibrios entre los pectorales izquierdo y derecho",
    ],
    commonMistakes: [
      "Colocar el banco demasiado inclinado y convertirlo en un press de hombros",
      "Abrir los codos excesivamente",
      "Rebotar las mancuernas en el pecho en la parte inferior",
    ],
    tips: [
      "Toca las mancuernas en el pecho superior, justo debajo de la clavícula",
      "Mantén los codos a 45 grados con respecto al torso",
      "Aprieta el pecho arriba en lugar de bloquear fuertemente",
    ],
    variations: ["Press Plano con Mancuerna", "Press Declinado con Mancuerna", "Press Inclinado en Cable", "Press Inclinado en Smith Machine"],
    instructions: [
      "Coloca el banco a 30-45 grados de inclinación y siéntate con las mancuernas sobre las rodillas",
      "Impulsa las mancuernas hacia arriba a la altura de los hombros y recuéstate",
      "Presiona las mancuernas hacia arriba hasta que los brazos estén completamente extendidos",
      "Baja las mancuernas a los lados del pecho superior con control",
      "Impulsa las mancuernas de vuelta arriba, apretando el pecho en la parte superior",
    ],
  },
  "chest-006": {
    name: "Cruce de Cables (Cable Crossover)",
    description: "Un ejercicio de aislamiento en cable donde llevas las manos juntas frente al pecho desde poleas altas.",
    history: "Los cruces de cables se convirtieron en un movimiento fundamental de finalización de pecho en los años 70 cuando las máquinas de cable permitieron trabajo de aislamiento con tensión constante.",
    benefits: [
      "Aísla el pecho con tensión constante durante todo el rango de movimiento",
      "Crea una contracción potente en el pecho interno",
      "Estira los pectorales al inicio de cada repetición para mejorar la flexibilidad",
    ],
    commonMistakes: [
      "Usar demasiado peso y perder el control del movimiento",
      "Inclinarse excesivamente hacia adelante y convertirlo en un movimiento de press",
      "Dejar que los cables lleven los brazos demasiado atrás detrás de los hombros",
    ],
    tips: [
      "Imagina que estás abrazando un árbol grande mientras juntas las manos",
      "Mantén una ligera flexión en los codos durante todo el movimiento",
      "Cruza las manos ligeramente más allá para máxima contracción",
    ],
    variations: ["Cruce de Cables Bajo", "Cruce de Cables Medio", "Cruce de Cables Unilateral", "Apertura en Cable de Pie"],
    instructions: [
      "Coloca ambas poleas en la posición más alta y selecciona un peso moderado",
      "Párate centrado entre las poleas y agarra cada mango",
      "Da un paso adelante e inclina el torso ligeramente hacia adelante con una leve flexión de codos",
      "Junta las manos en un arco frente al pecho",
      "Aprieta el pecho en el pico, luego regresa lentamente a la posición inicial de estiramiento",
    ],
  },
  "chest-007": {
    name: "Apertura en Máquina Pec-Deck",
    description: "Un ejercicio de aislamiento en máquina donde juntas palancas acolchadas frente al pecho mientras estás sentado.",
    history: "La máquina pec-deck fue inventada en los años 70 y rápidamente se convirtió en un clásico del gimnasio para apuntar al pecho sin participación de tríceps.",
    benefits: [
      "Aísla el pecho sin fatiga de tríceps o hombros",
      "Proporciona una posición sentada estable para trabajo de aislamiento pesado seguro",
      "Excelente para lograr una fuerte conexión mente-músculo con los pectorales",
    ],
    commonMistakes: [
      "Encoger los hombros durante el movimiento",
      "Usar impulso corporal para balancear el peso",
      "Dejar que las placas toquen entre repeticiones para descansar",
    ],
    tips: [
      "Mantén los hombros hacia abajo y presionados contra el cojín",
      "Aprieta el pecho durante dos segundos en el pico de cada repetición",
      "Controla la fase excéntrica durante al menos dos segundos por repetición",
    ],
    variations: ["Pec-Deck Inverso", "Apertura en Cable", "Apertura con Mancuerna", "Press de Pecho en Máquina"],
    instructions: [
      "Siéntate en la máquina pec-deck con la espalda plana contra el cojín",
      "Coloca los antebrazos en las palancas acolchadas con los codos a la altura de los hombros",
      "Junta los brazos frente al pecho en un movimiento de abrazo",
      "Pausa y aprieta en el pico de la contracción",
      "Abre lentamente los brazos de vuelta a la posición inicial hasta sentir un estiramiento",
    ],
  },
  "chest-008": {
    name: "Apertura con Mancuerna (Dumbbell Fly)",
    description: "Un ejercicio de aislamiento del pecho donde las mancuernas se bajan hacia los lados en un arco mientras estás acostado en un banco.",
    history: "Las aperturas con mancuerna han sido un fundamental del culturismo desde los años 40 para estirar y esculpir los músculos pectorales.",
    benefits: [
      "Estira el pecho a través de un largo rango de movimiento para reclutamiento de fibras musculares",
      "Enfatiza la función de aducción de los pectorales",
      "Mejora la flexibilidad del pecho y la movilidad del hombro",
    ],
    commonMistakes: [
      "Doblar demasiado los codos y convertir la apertura en un press",
      "Bajar las mancuernas demasiado y forzar las articulaciones del hombro",
      "Usar peso excesivo que compromete la forma y el rango de movimiento",
    ],
    tips: [
      "Mantén una flexión fija y leve en los codos durante todo el movimiento",
      "Imagina que estás abrazando un barril mientras juntas las mancuernas",
      "Baja las mancuernas hasta sentir un estiramiento cómodo, no dolor",
    ],
    variations: ["Apertura Inclinada con Mancuerna", "Apertura Declinada con Mancuerna", "Apertura en Cable", "Apertura en el Suelo"],
    instructions: [
      "Acuéstate en un banco plano sosteniendo una mancuerna en cada mano sobre el pecho con las palmas enfrentadas",
      "Con una ligera flexión en los codos, baja las mancuernas hacia los lados en un arco amplio",
      "Baja hasta sentir un estiramiento en el pecho aproximadamente al nivel de los hombros",
      "Invierte el movimiento juntando las mancuernas usando los músculos del pecho",
      "Aprieta arriba y repite sin dejar que las mancuernas se toquen",
    ],
  },
  "chest-009": {
    name: "Fondos en Paralelas (Dips)",
    description: "Un ejercicio compuesto de peso corporal donde bajas y elevas tu cuerpo entre barras paralelas usando el pecho y tríceps.",
    history: "Los fondos han sido un ejercicio fundamental de calistenia desde la antigua Grecia, usados para construir fuerza de empuje y desarrollo del pecho.",
    benefits: [
      "Desarrolla fuerza del pecho inferior y tríceps simultáneamente",
      "No requiere equipo más allá de barras paralelas",
      "Fácilmente progresable con peso adicional para crecimiento continuo",
    ],
    commonMistakes: [
      "Inclinarse demasiado hacia adelante y sobrecargar los hombros",
      "No bajar lo suficiente para lograr una activación completa del pecho",
      "Bloquear los codos agresivamente en la parte superior",
    ],
    tips: [
      "Inclina el torso ligeramente hacia adelante para enfatizar el pecho sobre los tríceps",
      "Bájate hasta que los brazos superiores estén paralelos al suelo",
      "Mantén los hombros hacia abajo y evita encogerlos arriba",
    ],
    variations: ["Fondos con Peso", "Fondos en Anillas", "Fondos en Banco", "Máquina de Fondos de Pecho"],
    instructions: [
      "Agarra las barras paralelas con los brazos rectos y el cuerpo erguido",
      "Baja lentamente el cuerpo flexionando los codos, inclinándote ligeramente hacia adelante",
      "Baja hasta que los brazos superiores estén paralelos al suelo o ligeramente más abajo",
      "Presiona a través de las palmas para elevar el cuerpo de vuelta a la posición inicial",
      "Controla el movimiento durante todo el recorrido y evita bloquear fuertemente arriba",
    ],
  },
  "chest-010": {
    name: "Flexiones de Brazos (Push-Ups)",
    description: "Un ejercicio clásico de peso corporal donde bajas y elevas tu cuerpo usando los brazos mientras mantienes una posición de plancha.",
    history: "Las flexiones han sido un ejercicio fundamental de fitness durante miles de años, usadas por militares y atletas en todo el mundo como medida de resistencia de la parte superior del cuerpo.",
    benefits: [
      "Desarrolla fuerza de pecho, hombros y tríceps sin equipo",
      "Fortalece el core a través de la retención isométrica de plancha",
      "Escalable a cualquier nivel de condición física a través de numerosas variaciones",
    ],
    commonMistakes: [
      "Dejar que las caderas se hundan hacia el suelo durante el movimiento",
      "Abrir los codos a 90 grados del cuerpo",
      "No lograr el rango completo de movimiento con el pecho cerca del suelo",
    ],
    tips: [
      "Mantén el cuerpo en línea recta desde la cabeza hasta los talones durante todo el movimiento",
      "Bájate hasta que el pecho roce el suelo o la altura de tus manos",
      "Aprieta los glúteos y contrae el core para mantener la rigidez",
    ],
    variations: ["Flexión Abierta", "Flexión Cerrada", "Flexión Declinada", "Flexión Inclinada", "Flexión Diamante"],
    instructions: [
      "Comienza en una posición de plancha alta con las manos ligeramente más anchas que los hombros",
      "Mantén el cuerpo en línea recta desde la cabeza hasta los talones",
      "Baja el cuerpo flexionando los codos hasta que el pecho casi toque el suelo",
      "Empuja a través de las palmas para regresar a la posición inicial",
      "Mantén los codos a 45 grados del cuerpo durante todo el movimiento",
    ],
  },
  "chest-011": {
    name: "Press de Banca en Smith Machine",
    description: "Un press de banca con barra guiada realizado en una Smith Machine con una trayectoria de barra fija vertical.",
    history: "La Smith Machine fue inventada en los años 50 por Jack LaLanne y luego refinada por Rudy Smith, convirtiéndose en un elemento fijo del gimnasio para entrenamiento seguro en solitario.",
    benefits: [
      "Proporciona un movimiento de press seguro sin necesidad de spotter",
      "Permite concentrarse en la contracción del pecho sin preocuparse por el equilibrio de la barra",
      "Útil para series descendentes y entrenamiento al fallo con seguros de seguridad",
    ],
    commonMistakes: [
      "Colocar el banco en la posición incorrecta con respecto a la trayectoria de la barra",
      "Abrir los codos excesivamente ya que la trayectoria de la barra es fija",
      "Arquear excesivamente la zona lumbar para mover más peso",
    ],
    tips: [
      "Posiciona el banco de modo que la barra se alinee con el esternón inferior",
      "Mantén los hombros retraídos contra el banco durante todo el movimiento",
      "No bloquees completamente arriba para mantener la tensión en el pecho",
    ],
    variations: ["Press Inclinado en Smith Machine", "Press Declinado en Smith Machine", "Press de Hombros en Smith Machine", "Press en Smith Machine desde el Suelo"],
    instructions: [
      "Coloca la barra de la Smith Machine a una altura apropiada y carga el peso",
      "Acuéstate en un banco plano posicionado debajo de la barra con los pies plantados",
      "Agarra la barra con las manos ligeramente más anchas que los hombros y descuelga girando",
      "Baja la barra al pecho con control, manteniendo los codos a 45 grados",
      "Presiona la barra de vuelta arriba y repite, volviendo a colocar girando la barra al final",
    ],
  },
  "chest-012": {
    name: "Press desde el Suelo (Floor Press)",
    description: "Una variación de press de banca realizada acostado en el suelo, limitando el rango de movimiento en la parte inferior para proteger los hombros.",
    history: "El floor press fue desarrollado por powerlifters como accesorio para fortalecer la fase de bloqueo de tríceps del press de banca.",
    benefits: [
      "Limita la extensión del hombro para un press más seguro con problemas de hombro",
      "Enfatiza la fase de bloqueo de tríceps del press de banca",
      "Permite sobrecarga pesada del pecho superior y tríceps",
    ],
    commonMistakes: [
      "Rebotar los codos en el suelo para ganar impulso",
      "Abrir los codos y perder el énfasis en tríceps",
      "Usar un agarre más amplio de lo necesario y reducir demasiado el rango de movimiento",
    ],
    tips: [
      "Mantén los codos pegados a 45 grados para enfatizar la participación de tríceps",
      "Mantén los glúteos en el suelo durante todo el movimiento",
      "Usa un toque y despegue controlado en el suelo en lugar de descansar",
    ],
    variations: ["Floor Press con Mancuerna", "Floor Press en Cable", "Floor Press Unilateral", "Floor Press con Agarre Cerrado"],
    instructions: [
      "Acuéstate en el suelo con una barra en rack sobre ti o haz que un compañero te la entregue",
      "Agarra la barra ligeramente más estrecho que tu agarre de press de banca regular",
      "Baja la barra al pecho, dejando que los brazos superiores toquen el suelo",
      "Haz una pausa breve cuando los tríceps toquen el suelo, luego presiona la barra de vuelta arriba",
      "Mantén los glúteos y la zona lumbar presionados en el suelo durante todo el movimiento",
    ],
  },
  "chest-013": {
    name: "Press de Banca con Agarre Cerrado",
    description: "Una variación de press de banca con barra con un agarre estrecho que desplaza el énfasis a los tríceps y el pecho interno.",
    history: "El press de banca con agarre cerrado ha sido un elemento básico para tríceps en los círculos de powerlifting desde los años 60 para mejorar la fuerza de bloqueo.",
    benefits: [
      "Desplaza el énfasis a los tríceps mientras sigue activando el pecho",
      "Mejora la fuerza de bloqueo del press de banca para powerlifters",
      "Desarrolla masa de brazos y definición de tríceps eficazmente",
    ],
    commonMistakes: [
      "Colocar las manos demasiado juntas y forzar las muñecas",
      "Abrir los codos en lugar de mantenerlos pegados",
      "Bajar la barra al lugar incorrecto del pecho",
    ],
    tips: [
      "Mantén las manos al ancho de los hombros o justo por dentro para una comodidad óptima de la muñeca",
      "Mantén los codos pegados durante todo el movimiento para maximizar el reclutamiento de tríceps",
      "Baja la barra al esternón inferior, no al cuello",
    ],
    variations: ["Press Cerrado con Mancuerna", "Floor Press con Agarre Cerrado", "Press Cerrado con Barra EZ", "Press de Banca con Agarre Inverso"],
    instructions: [
      "Acuéstate en un banco plano y agarra la barra con las manos al ancho de los hombros",
      "Descuelga la barra y sostenla directamente sobre los hombros",
      "Baja la barra al esternón inferior manteniendo los codos pegados al cuerpo",
      "Presiona la barra de vuelta arriba hasta la extensión completa del brazo, apretando los tríceps",
      "Controla la barra en el descenso e impulsa hacia arriba con potencia",
    ],
  },
  "chest-014": {
    name: "Press Svend (Svend Press)",
    description: "Un ejercicio de aislamiento del pecho donde se presionan dos discos de peso juntos y se extienden hacia adelante mientras se aprietan.",
    history: "Nombrado en honor al culturista Svend Karlsen, este press se popularizó como técnica de pre-agotamiento para apuntar al pecho interno antes del press pesado.",
    benefits: [
      "Aísla el pecho interno y el serrato anterior eficazmente",
      "Crea una fuerte conexión mente-músculo con los pectorales",
      "Requiere equipo mínimo y puede usarse como calentamiento o finalizador",
    ],
    commonMistakes: [
      "Dejar que los discos se separen durante el press",
      "Usar discos demasiado pesados y comprometer la forma",
      "Extender los brazos demasiado y perder la tensión en el pecho",
    ],
    tips: [
      "Aprieta los discos juntos lo más fuerte posible durante todo el movimiento",
      "Extiende los brazos solo hasta la extensión completa sin bloquear",
      "Mantén los hombros hacia abajo y apretados durante todo el movimiento",
    ],
    variations: ["Press Svend con Mancuernas", "Press Svend en Inclinado", "Press de Discos", "Press Svend con Pausa"],
    instructions: [
      "Párate o siéntate con dos discos de peso ligero sostenidos juntos entre las palmas",
      "Aprieta los discos juntos lo más fuerte posible con los brazos en el pecho",
      "Presiona los discos hacia adelante hasta que los brazos estén completamente extendidos frente a ti",
      "Continúa apretando los discos juntos con los brazos extendidos",
      "Regresa los discos al pecho bajo control mientras mantienes la presión",
    ],
  },
  "chest-015": {
    name: "Apertura Inclinada con Mancuerna",
    description: "Una variación de apertura en un banco inclinado que enfatiza el pecho superior a través de un movimiento de arco de estiramiento y contracción.",
    history: "Las aperturas inclinadas con mancuerna se convirtieron en un ejercicio clave para el pecho superior durante el boom del culturismo de los años 60, apreciadas por su capacidad para esculpir el detalle del pecho.",
    benefits: [
      "Apunta al pecho superior con un movimiento de aislamiento",
      "Estira los pectorales superiores para mejorar la flexibilidad",
      "Crea definición del pecho y separación entre pectorales superiores e inferiores",
    ],
    commonMistakes: [
      "Usar demasiado peso y convertir la apertura en un press",
      "Dejar caer las mancuernas demasiado bajo y forzar la cápsula del hombro",
      "Doblar demasiado los codos durante todo el movimiento",
    ],
    tips: [
      "Coloca el banco a 30 grados para un estiramiento óptimo del pecho superior",
      "Imagina dibujar un círculo grande con las mancuernas mientras bajas y elevas",
      "Mantén los hombros apretados y evita encogerlos arriba",
    ],
    variations: ["Apertura Plana con Mancuerna", "Apertura Declinada con Mancuerna", "Apertura Inclinada en Cable", "Apertura en Máquina"],
    instructions: [
      "Coloca el banco a 30 grados de inclinación y recuéstate con mancuernas presionadas sobre el pecho",
      "Con una ligera flexión en los codos, baja las mancuernas hacia los lados en un arco",
      "Baja hasta sentir un estiramiento en el pecho superior a la altura de los hombros",
      "Invierte el movimiento y junta las mancuernas usando el pecho",
      "Aprieta arriba y repite con tempo controlado",
    ],
  },
  "chest-016": {
    name: "Press Declinado con Mancuerna",
    description: "Un movimiento de press con mancuernas en un banco declinado dirigido al pecho inferior con movimiento independiente de brazos.",
    history: "El press declinado con mancuerna se popularizó en los años 70 cuando los culturistas buscaban variaciones para desarrollar completamente las estrías del pecho inferior.",
    benefits: [
      "Apunta a las fibras del pecho inferior con un mayor rango de movimiento",
      "Proporciona movimiento independiente de brazos para corregir desequilibrios",
      "Reduce el estrés del hombro comparado con el press plano para algunas personas",
    ],
    commonMistakes: [
      "Colocar el declive demasiado pronunciado y reducir la activación del pecho",
      "Dejar que las mancuernas se separen demasiado en la parte inferior",
      "Usar impulso para presionar el peso en lugar de trabajo muscular controlado",
    ],
    tips: [
      "Mantén los codos a 45 grados del torso",
      "Toca las mancuernas en los lados del pecho inferior",
      "Aprieta el pecho arriba en lugar de bloquear fuertemente",
    ],
    variations: ["Press Declinado con Barra", "Press Declinado en Cable", "Press Declinado en Máquina", "Fondos con Peso"],
    instructions: [
      "Coloca el banco en posición declinada y asegura tus pies bajo las almohadillas",
      "Sostén una mancuerna en cada mano a la altura de los hombros con las palmas hacia adelante",
      "Presiona las mancuernas hacia arriba hasta que los brazos estén completamente extendidos",
      "Baja las mancuernas a los lados del pecho inferior con control",
      "Presiona de vuelta arriba, apretando el pecho en la parte superior del movimiento",
    ],
  },
  "chest-017": {
    name: "Press en Cable",
    description: "Un movimiento de press usando cables para proporcionar tensión constante en el pecho durante todo el rango de movimiento.",
    history: "Los presses en cable evolucionaron de los cruces de cables en los años 80 cuando los atletas buscaban formas de añadir más volumen de press sin fatiga de barra.",
    benefits: [
      "Proporciona tensión constante en el pecho durante todo el movimiento",
      "Permite un estiramiento profundo en la parte posterior del movimiento",
      "Más suave para las articulaciones del hombro comparado con el press pesado con barra",
    ],
    commonMistakes: [
      "Usar demasiado peso y perder el control de los cables",
      "Estabilizar con el cuerpo en lugar de aislar el pecho",
      "No lograr la extensión completa del brazo en la parte frontal del press",
    ],
    tips: [
      "Da un paso adelante y escalona la postura para mejor equilibrio",
      "Mantén las muñecas rectas durante todo el movimiento de press",
      "Aprieta el pecho en el pico del press en lugar de los tríceps",
    ],
    variations: ["Press de Abajo a Arriba en Cable", "Press de Arriba a Abajo en Cable", "Press Unilateral en Cable", "Press de Pie en Cable"],
    instructions: [
      "Coloca ambas poleas a la altura del pecho y coloca mangos individuales",
      "Párate centrado entre las poleas, agarra los mangos y da un paso adelante",
      "Con una ligera flexión en los codos, presiona ambos mangos hacia adelante hasta que los brazos estén extendidos",
      "Aprieta el pecho en el pico del press",
      "Regresa lentamente a la posición inicial, permitiendo que los cables lleven los brazos hacia atrás",
    ],
  },
};

// Now apply the translations
let translatableFields = ['name', 'description', 'history'];
let arrayFields = ['benefits', 'commonMistakes', 'tips', 'variations', 'instructions'];

// Simple approach: find each exercise block and transform it
let result = '';
let currentId = null;
let inTargetExercise = false;
let currentExerciseLines = [];
let exercisesProcessed = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  // Detect start of an exercise
  if (line.trim() === 'id: "back-001"' || line.trim() === "id: 'back-001'") {
    // This is the first exercise
  }
  
  // Simple detection: look for id fields
  const idMatch = line.match(/^\s*id:\s*"([^"]+)"/);
  if (idMatch) {
    currentId = idMatch[1];
    // Check if this is in our first 52
    const num = parseInt(currentId.split('-')[1]);
    const group = currentId.split('-')[0];
    
    // Back: 001-034, Chest: 001-020
    let isTarget = false;
    if (group === 'back' && num >= 1 && num <= 34) isTarget = true;
    if (group === 'chest' && num >= 1 && num <= 18) isTarget = true;
    
    inTargetExercise = isTarget;
  }
  
  if (inTargetExercise && translations[currentId]) {
    // Transform this line
    const trans = translations[currentId];
    const trimmed = line.trim();
    
    // Handle each translatable field
    let transformed = false;
    
    for (const field of translatableFields) {
      if (trimmed.startsWith(field + ':')) {
        // Add _en with original English
        const origMatch = line.match(new RegExp(`${field}:\\s*"([^"]*)"`));
        if (origMatch) {
          const origValue = origMatch[1];
          const indent = line.match(/^(\s*)/)[1];
          result += line + '\n';
          result += `${indent}${field}_en: "${origValue}",\n`;
          transformed = true;
          break;
        }
      }
    }
    
    if (!transformed) {
      // Handle array fields
      for (const field of arrayFields) {
        if (trimmed.startsWith(field + ':')) {
          const indent = line.match(/^(\s*)/)[1];
          // Add _en after the base field
          // The base field (Spanish) needs to be written, and then _en after
          result += line + '\n';
          // We'll handle the _en when we encounter closing ]
          // Track that we need to inject _en after the array
          currentArrayField = field;
          needInjectEn = true;
          transformed = true;
          break;
        }
      }
    }
    
    if (transformed) continue;
  }
  
  result += line + '\n';
}

fs.writeFileSync(filePath, result, 'utf-8');
console.log('Done');
