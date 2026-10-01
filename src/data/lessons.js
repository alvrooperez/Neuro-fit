import curatedData from './curated_vocabulary.json';
import { CASILLERO_100 } from './casillero';

export const VOCABULARY = curatedData.vocabulary;
export const ABSTRACT_ANCHORS = curatedData.abstract_anchors;

export const CHAPTERS = [
  {
    id: 1,
    title: "Capítulo 1: El Despertar del Absurdo",
    subtitle: "Aprende a encadenar imágenes con movimiento, exageración y humor",
    color: "from-emerald-500 to-teal-600",
    badgeColor: "bg-emerald-500",
    icon: "🌱"
  },
  {
    id: 2,
    title: "Capítulo 2: La Barrera de la Velocidad",
    subtitle: "Baja de 4s a 2.5s y domina conceptos abstractos",
    color: "from-blue-500 to-indigo-600",
    badgeColor: "bg-indigo-500",
    icon: "⚡"
  },
  {
    id: 3,
    title: "Capítulo 3: El Casillero se Expande",
    subtitle: "Consolida los números del 1 al 25 y cadenas de 15 a 20 palabras",
    color: "from-purple-500 to-violet-600",
    badgeColor: "bg-purple-500",
    icon: "🧩"
  },
  {
    id: 4,
    title: "Capítulo 4: Modo Atleta Mental",
    subtitle: "Aceleración a 1.5s y cadenas de hasta 30 elementos",
    color: "from-amber-500 to-orange-600",
    badgeColor: "bg-amber-500",
    icon: "🔥"
  },
  {
    id: 5,
    title: "Capítulo 5: El Centurión Mnemotécnico",
    subtitle: "El camino hacia las 50 y 100 palabras de una sentada",
    color: "from-rose-500 to-red-600",
    badgeColor: "bg-rose-500",
    icon: "👑"
  }
];

export const LESSONS = [
  // CAPÍTULO 1
  {
    id: 1,
    chapterId: 1,
    title: "El Primer Vínculo",
    subtitle: "3 palabras concretas a ritmo relajado",
    icon: "⭐",
    tip: "Regla nº 1: Haz que el objeto A golpee, muerda o aplaste al objeto B. El movimiento graba la memoria.",
    itemCount: 3,
    cadence: 4.0,
    stimulusType: "concrete",
    xp: 35
  },
  {
    id: 2,
    chapterId: 1,
    title: "Adjetivos Extremos",
    subtitle: "Objetos con cualidades imposibles",
    icon: "🎨",
    tip: "Si sale un 'Tiburón Congelado', imagina que se resbala por el suelo y echa cubitos de hielo por las agallas.",
    itemCount: 4,
    cadence: 3.5,
    stimulusType: "with_adjectives",
    xp: 45
  },
  {
    id: 3,
    chapterId: 1,
    title: "Nace tu Casillero: 1 al 5",
    subtitle: "Té, Ñu, Humo, Oca y Ola",
    icon: "🧠",
    tip: "Asocia el número con su imagen fija: 1 es Té hirviendo, 2 es un Ñu con cuernos, 3 es Humo denso, 4 una Oca loca, 5 una Ola gigante.",
    itemCount: 5,
    cadence: 3.5,
    stimulusType: "casillero",
    casilleroRange: [1, 5],
    xp: 55
  },
  {
    id: 4,
    chapterId: 1,
    title: "Cadena de 6 Eslabones",
    subtitle: "Tu primera historia encadenada",
    icon: "🔗",
    tip: "No intentes recordar toda la lista a la vez. Conecta solo el 1 con el 2, luego el 2 con el 3, y así sucesivamente.",
    itemCount: 6,
    cadence: 3.2,
    stimulusType: "concrete",
    xp: 60
  },
  {
    id: 5,
    chapterId: 1,
    title: "Jefe: El Testigo Relámpago",
    subtitle: "Examen de 8 palabras para pasar de capítulo",
    icon: "👑",
    tip: "Confía en tu primer impacto visual. Si la imagen fue ridícula, tu subconsciente no la habrá olvidado.",
    itemCount: 8,
    cadence: 3.0,
    stimulusType: "concrete",
    xp: 80,
    isBoss: true
  },

  // CAPÍTULO 2
  {
    id: 6,
    chapterId: 2,
    title: "Materializar lo Abstracto",
    subtitle: "Transforma conceptos en objetos",
    icon: "💡",
    tip: "¿Cómo imaginar 'Libertad'? Imagina una Estatua de la Libertad rompiendo cadenas con rayos láser.",
    itemCount: 6,
    cadence: 3.0,
    stimulusType: "abstract",
    xp: 70
  },
  {
    id: 7,
    chapterId: 2,
    title: "Casillero 6 al 10",
    subtitle: "Oso, Ufo, Hacha, Boa y Toro",
    icon: "🧠",
    tip: "6=Oso pardo, 7=Ufo platillo volante, 8=Hacha afilada, 9=Boa constrictor, 10=Toro bravo.",
    itemCount: 6,
    cadence: 3.0,
    stimulusType: "casillero",
    casilleroRange: [6, 10],
    xp: 75
  },
  {
    id: 8,
    chapterId: 2,
    title: "Ritmo 2.5 Segundos",
    subtitle: "Tu mente empieza a acelerar",
    icon: "⚡",
    tip: "No pienses con palabras lógicas, piensa con 'flashes' cinematográficos instantáneos.",
    itemCount: 8,
    cadence: 2.5,
    stimulusType: "mixed",
    xp: 85
  },
  {
    id: 9,
    chapterId: 2,
    title: "Cadena de 10 Palabras",
    subtitle: "Una decena completa de una sentada",
    icon: "🔗",
    tip: "Si un eslabón falla, exagera el sonido o el olor de la escena en tu mente.",
    itemCount: 10,
    cadence: 2.5,
    stimulusType: "mixed",
    xp: 95
  },
  {
    id: 10,
    chapterId: 2,
    title: "Jefe: Casillero 1-10 a Toda Máquina",
    subtitle: "Control absoluto de los primeros 10 números",
    icon: "👑",
    tip: "Los números ya no son cifras; son actores reales interactuando.",
    itemCount: 10,
    cadence: 2.2,
    stimulusType: "casillero",
    casilleroRange: [1, 10],
    xp: 110,
    isBoss: true
  },

  // CAPÍTULO 3
  {
    id: 11,
    chapterId: 3,
    title: "Casillero 11 al 15",
    subtitle: "Dado, Atún, Tomo, Taco y Tela",
    icon: "🎲",
    tip: "11 es un Dado gigante rodando; 12 es un Atún saltando con sombrero; 14 es un Taco mexicano que explota salsa.",
    itemCount: 6,
    cadence: 2.5,
    stimulusType: "casillero",
    casilleroRange: [11, 15],
    xp: 90
  },
  {
    id: 12,
    chapterId: 3,
    title: "Fusión Concreto + Abstracto",
    subtitle: "10 palabras de todo tipo",
    icon: "🌪️",
    tip: "Mezcla dolor, tijeras, esperanza y tractor en una sola película mental.",
    itemCount: 10,
    cadence: 2.2,
    stimulusType: "mixed",
    xp: 105
  },
  {
    id: 13,
    chapterId: 3,
    title: "Casillero 16 al 20",
    subtitle: "Tiza, Tofu, Ducha, Topo y Noria",
    icon: "🎡",
    tip: "16=Tiza de colores, 17=Tofu blando, 18=Ducha de agua caliente, 19=Topo excavador, 20=Noria de feria.",
    itemCount: 6,
    cadence: 2.2,
    stimulusType: "casillero",
    casilleroRange: [16, 20],
    xp: 100
  },
  {
    id: 14,
    chapterId: 3,
    title: "La Cadena de 15",
    subtitle: "15 palabras a 2 segundos",
    icon: "🔗",
    tip: "Mantén el ritmo constante. No te quedes atascado en el pasado; salta al siguiente eslabón.",
    itemCount: 15,
    cadence: 2.0,
    stimulusType: "mixed",
    xp: 130
  },
  {
    id: 15,
    chapterId: 3,
    title: "Jefe: Las 20 Palabras",
    subtitle: "El umbral de los 20 elementos",
    icon: "👑",
    tip: "Si logras recordar 20 seguidas, tu cerebro ya opera como el de un mnemotécnico profesional.",
    itemCount: 20,
    cadence: 2.0,
    stimulusType: "mixed",
    xp: 160,
    isBoss: true
  },

  // CAPÍTULO 4
  {
    id: 16,
    chapterId: 4,
    title: "Aceleración 1.5 Segundos",
    subtitle: "Velocidad de Campeonato",
    icon: "⚡",
    tip: "A 1.5 segundos no hay tiempo para dudar. La primera ocurrencia absurda es la que vale.",
    itemCount: 15,
    cadence: 1.5,
    stimulusType: "concrete",
    xp: 140
  },
  {
    id: 17,
    chapterId: 4,
    title: "Casillero 21 al 25",
    subtitle: "Nido, Enano, Nemo, Yunque y Anillo",
    icon: "💍",
    tip: "21=Nido con huevos, 22=Enano barbudo, 23=Pez Nemo, 24=Yunque pesado, 25=Anillo dorado brillante.",
    itemCount: 8,
    cadence: 1.8,
    stimulusType: "casillero",
    casilleroRange: [21, 25],
    xp: 130
  },
  {
    id: 18,
    chapterId: 4,
    title: "La Cadena de 25 Eslabones",
    subtitle: "25 palabras a 1.5s",
    icon: "🔗",
    tip: "Crea mini-escenas de 3 en 3 para no saturar tu memoria de trabajo.",
    itemCount: 25,
    cadence: 1.5,
    stimulusType: "mixed",
    xp: 180
  },
  {
    id: 19,
    chapterId: 4,
    title: "Duelo de Dígitos",
    subtitle: "15 números al vuelo",
    icon: "🔢",
    tip: "Cada número se transforma en su objeto del casillero en menos de medio segundo.",
    itemCount: 15,
    cadence: 1.5,
    stimulusType: "numbers",
    xp: 150
  },
  {
    id: 20,
    chapterId: 4,
    title: "Jefe: El Muro de los 30",
    subtitle: "30 palabras a 1.5 segundos",
    icon: "👑",
    tip: "Mantén la respiración y visualiza la película completa sin interrupciones.",
    itemCount: 30,
    cadence: 1.5,
    stimulusType: "mixed",
    xp: 220,
    isBoss: true
  },

  // CAPÍTULO 5
  {
    id: 21,
    chapterId: 5,
    title: "Velocidad 1.0 Segundo",
    subtitle: "Puro reflejo subconsciente",
    icon: "🚀",
    tip: "A 1 segundo por palabra, tus ojos ven y tu mente pinta en paralelo.",
    itemCount: 20,
    cadence: 1.0,
    stimulusType: "concrete",
    xp: 200
  },
  {
    id: 22,
    chapterId: 5,
    title: "El Gran Casillero (1 al 30)",
    subtitle: "Mezcla aleatoria de los 30 primeros números",
    icon: "🧠",
    tip: "Salta de casilla en casilla con soltura total.",
    itemCount: 15,
    cadence: 1.2,
    stimulusType: "casillero",
    casilleroRange: [1, 30],
    xp: 180
  },
  {
    id: 23,
    chapterId: 5,
    title: "El Medio Centurión: 50 Palabras",
    subtitle: "50 elementos de una sentada",
    icon: "🔥",
    tip: "El hito que separa a los aficionados de los cracks de la memoria.",
    itemCount: 50,
    cadence: 1.3,
    stimulusType: "mixed",
    xp: 300
  },
  {
    id: 24,
    chapterId: 5,
    title: "Cadena de 40 Números",
    subtitle: "Memorización numérica masiva",
    icon: "🔢",
    tip: "Empareja los números de 2 en 2 mentalmente.",
    itemCount: 40,
    cadence: 1.2,
    stimulusType: "numbers",
    xp: 280
  },
  {
    id: 25,
    chapterId: 5,
    title: "Jefe Supremo: ¡Centurión 100 Palabras!",
    subtitle: "100 palabras de una sentada",
    icon: "👑",
    tip: "El gran objetivo final. 100 palabras seguidas. Eres una máquina mnemotécnica.",
    itemCount: 100,
    cadence: 1.2,
    stimulusType: "mixed",
    xp: 500,
    isBoss: true
  }
];

// Helper to generate items for a specific lesson
export const generateLessonItems = (lesson) => {
  const { stimulusType, itemCount, casilleroRange } = lesson;

  if (stimulusType === 'casillero') {
    const [min, max] = casilleroRange || [1, 10];
    const available = CASILLERO_100.filter(item => item.num >= min && item.num <= max);
    const shuffled = [...available].sort(() => 0.5 - Math.random());
    const count = Math.min(itemCount, shuffled.length);
    return shuffled.slice(0, count).map(it => ({
      text: `${it.num}. ${it.word}`,
      cue: `${it.num}`,
      target: it.word,
      emoji: it.emoji,
      type: 'casillero'
    }));
  }

  if (stimulusType === 'numbers') {
    const nums = [];
    for (let i = 0; i < itemCount; i++) {
      const n = Math.floor(Math.random() * 100) + 1;
      const cas = CASILLERO_100.find(c => c.num === n);
      nums.push({
        text: `${n}`,
        cue: `${n}`,
        target: cas ? cas.word : `${n}`,
        emoji: cas ? cas.emoji : "🔢",
        type: 'number'
      });
    }
    return nums;
  }

  if (stimulusType === 'abstract') {
    const pool = [...VOCABULARY.abstractos].sort(() => 0.5 - Math.random()).slice(0, itemCount);
    return pool.map(word => {
      const cap = word.charAt(0).toUpperCase() + word.slice(1);
      return {
        text: cap,
        target: cap,
        tip: ABSTRACT_ANCHORS[word] || null,
        type: 'abstract'
      };
    });
  }

  if (stimulusType === 'with_adjectives') {
    const nouns = [...VOCABULARY.concretos].sort(() => 0.5 - Math.random()).slice(0, itemCount);
    const adjs = [...VOCABULARY.adjetivos].sort(() => 0.5 - Math.random()).slice(0, itemCount);
    return nouns.map((noun, i) => {
      const text = `${noun.charAt(0).toUpperCase() + noun.slice(1)} ${adjs[i]}`;
      return {
        text,
        target: text,
        type: 'adjective_pair'
      };
    });
  }

  // Mixed or concrete
  let pool = [];
  if (stimulusType === 'mixed') {
    const concretePart = [...VOCABULARY.concretos].sort(() => 0.5 - Math.random()).slice(0, Math.ceil(itemCount * 0.7));
    const abstractPart = [...VOCABULARY.abstractos].sort(() => 0.5 - Math.random()).slice(0, Math.floor(itemCount * 0.3));
    pool = [...concretePart, ...abstractPart].sort(() => 0.5 - Math.random()).slice(0, itemCount);
  } else {
    pool = [...VOCABULARY.concretos].sort(() => 0.5 - Math.random()).slice(0, itemCount);
  }

  return pool.map(word => {
    const cap = word.charAt(0).toUpperCase() + word.slice(1);
    return {
      text: cap,
      target: cap,
      tip: ABSTRACT_ANCHORS[word] || null,
      type: 'word'
    };
  });
};
