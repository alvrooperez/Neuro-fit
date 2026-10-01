import largeWordList from './word_bank_large.json';

// Curated starter words with visual emojis
export const CURATED_EMOJI_WORDS = [
  { word: "Tiburón", emoji: "🦈", category: "animal" },
  { word: "Microondas", emoji: "📻", category: "objeto" },
  { word: "Dinosaurio", emoji: "🦖", category: "animal" },
  { word: "Bicicleta", emoji: "🚲", category: "vehículo" },
  { word: "Trompeta", emoji: "🎺", category: "música" },
  { word: "Sandía", emoji: "🍉", category: "comida" },
  { word: "Submarino", emoji: "🥪", category: "vehículo" },
  { word: "Plátano", emoji: "🍌", category: "comida" },
  { word: "Cohete", emoji: "🚀", category: "espacio" },
  { word: "Guitarra", emoji: "🎸", category: "música" },
  { word: "Elefante", emoji: "🐘", category: "animal" },
  { word: "Paraguas", emoji: "☂️", category: "objeto" },
  { word: "Volcán", emoji: "🌋", category: "naturaleza" },
  { word: "Ovni", emoji: "🛸", category: "espacio" },
  { word: "Hamburguesa", emoji: "🍔", category: "comida" },
  { word: "Espada", emoji: "⚔️", category: "objeto" },
  { word: "Helado", emoji: "🍦", category: "comida" },
  { word: "Canguro", emoji: "🦘", category: "animal" },
  { word: "Reloj", emoji: "⏰", category: "objeto" },
  { word: "Castillo", emoji: "🏰", category: "lugar" },
  { word: "Extintor", emoji: "🧯", category: "objeto" },
  { word: "Zapatilla", emoji: "👟", category: "ropa" },
  { word: "Telescopio", emoji: "🔭", category: "objeto" },
  { word: "Piña", emoji: "🍍", category: "comida" },
  { word: "Camaleón", emoji: "🦎", category: "animal" },
  { word: "Diamante", emoji: "💎", category: "objeto" },
  { word: "Robot", emoji: "🤖", category: "personaje" },
  { word: "Fantasma", emoji: "👻", category: "personaje" },
  { word: "Monopatín", emoji: "🛹", category: "vehículo" },
  { word: "Cactus", emoji: "🌵", category: "planta" },
  { word: "Fuego", emoji: "🔥", category: "naturaleza" },
  { word: "Espejo", emoji: "🪞", category: "objeto" },
  { word: "Pulpo", emoji: "🐙", category: "animal" },
  { word: "Bombilla", emoji: "💡", category: "objeto" },
  { word: "Batería", emoji: "🥁", category: "música" },
  { word: "Pizza", emoji: "🍕", category: "comida" },
  { word: "Tractor", emoji: "🚜", category: "vehículo" },
  { word: "Hacha", emoji: "🪓", category: "objeto" },
  { word: "Momia", emoji: "🧟", category: "personaje" },
  { word: "Girasol", emoji: "🌻", category: "planta" },
  { word: "Maleta", emoji: "🧳", category: "objeto" },
  { word: "Avión", emoji: "✈️", category: "vehículo" },
  { word: "Corona", emoji: "👑", category: "objeto" },
  { word: "Cisne", emoji: "🦢", category: "animal" },
  { word: "Taza", emoji: "☕", category: "objeto" },
  { word: "Helicóptero", emoji: "🚁", category: "vehículo" },
  { word: "Murciélago", emoji: "🦇", category: "animal" },
  { word: "Tarta", emoji: "🎂", category: "comida" },
  { word: "Cámara", emoji: "📷", category: "objeto" },
  { word: "Ancla", emoji: "⚓", category: "objeto" }
];

// Mapping for quick emoji lookup if word matches
const emojiMap = {};
CURATED_EMOJI_WORDS.forEach((item) => {
  emojiMap[item.word.toLowerCase()] = item.emoji;
});

// Comprehensive thousands of Spanish words
export const MASSIVE_WORD_LIST = largeWordList.map((word) => {
  const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
  return {
    word: capitalized,
    emoji: emojiMap[word.toLowerCase()] || "📦",
    category: "general"
  };
});

// Default active word bank for trainers
export const WORD_BANK = MASSIVE_WORD_LIST;

// Generator of absurd verbs and scenarios to inspire the user
export const ABSURD_ACTIONS = [
  "baila flamenco desenfrenado encima de",
  "dispara rayos láser fosforitos contra",
  "se traga entero y lo expulsa como confeti sobre",
  "lo usa como sombrero gigante y ridículo que aplasta a",
  "lo derrite convirtiéndolo en gelatina que vibra con",
  "le da cuerda con una llave dorada que hace explotar a",
  "se lanza en paracaídas directo a la boca de",
  "toca como si fuera una guitarra eléctrica estridente contra",
  "lo congela en un cubito de hielo titánico junto a",
  "le pone ruedas de camión y atropella a toda velocidad a",
  "lo parte por la mitad con un kárate chop épico revelando a",
  "lo infla con una pajita cósmica hasta reventar encima de"
];

// The 4 Golden Rules of Ramón Campayo / Absurd Association
export const MNEMONIC_PILLARS = [
  {
    title: "1. Acción enérgica",
    desc: "Nada de imágenes estáticas. Pon a los objetos a moverse, chocar, romperse o bailar.",
    icon: "⚡"
  },
  {
    title: "2. Desproporción brutal",
    desc: "Haz lo diminuto gigantesco o lo gigante enano (un elefante tamaño pulga).",
    icon: "🔍"
  },
  {
    title: "3. Sustitución inverosímil",
    desc: "Usa un objeto para una función totalmente ilógica (un plátano como teléfono láser).",
    icon: "🤯"
  },
  {
    title: "4. Sentidos y Emoción",
    desc: "Siente el tacto pegajoso, el olor a quemado, el sonido chirriante o el ridículo cómico.",
    icon: "🎨"
  }
];
