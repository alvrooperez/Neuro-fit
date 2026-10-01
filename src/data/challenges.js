export const CHALLENGE_MODES = [
  {
    id: "marathon",
    title: "Maratón Centurión",
    subtitle: "Memorizar cientos de palabras o números",
    icon: "👑",
    color: "purple",
    bgGradient: "from-purple-600 to-indigo-600",
    description: "El entrenamiento definitivo de los campeones: memoriza 10, 25, 50, 100 o 200 elementos a gran velocidad.",
    difficulties: [
      { id: "custom", name: "Configurar Maratón", pairs: 25, timePerPair: 1.5, xp: 200 }
    ]
  },
  {
    id: "duo",
    title: "Dúos Absurdos",
    subtitle: "Parejas relámpago con recall inverso",
    icon: "⚡",
    color: "emerald",
    bgGradient: "from-emerald-500 to-teal-600",
    description: "Crea una escena estrafalaria entre dos objetos y demuestra que recuerdas la pareja al instante.",
    difficulties: [
      { id: "easy", name: "Fácil (3 parejas)", pairs: 3, timePerPair: 12, xp: 30 },
      { id: "medium", name: "Medio (5 parejas)", pairs: 5, timePerPair: 8, xp: 60 },
      { id: "hard", name: "Difícil (8 parejas)", pairs: 8, timePerPair: 5, xp: 100 },
      { id: "crack", name: "Modo Crack (12 parejas)", pairs: 12, timePerPair: 3, xp: 160 }
    ]
  },
  {
    id: "chain",
    title: "El Método de la Cadena",
    subtitle: "Historias encadenadas sin fin",
    icon: "🔗",
    color: "indigo",
    bgGradient: "from-indigo-500 to-purple-600",
    description: "Conecta el objeto A con el B, el B con el C... y recuerda la secuencia completa como una película de locura.",
    difficulties: [
      { id: "easy", name: "Cadena Corta (4)", count: 4, timePerItem: 6, xp: 40 },
      { id: "medium", name: "Cadena Media (6)", count: 6, timePerItem: 5, xp: 75 },
      { id: "hard", name: "Cadena Larga (10)", count: 10, timePerItem: 4, xp: 130 },
      { id: "crack", name: "Campayo Beast (15)", count: 15, timePerItem: 2.5, xp: 220 }
    ]
  }
];
