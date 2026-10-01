// Unified Cognitive Training Architecture for Álvaro's Memory System

const STORAGE_KEY = 'neurofit_athlete_profile_v4';

export const DEFAULT_PROFILE = {
  // 1. MODELO PALABRAS
  words: {
    level: 1,
    normal: {
      itemsCount: 5,
      cadence: 3.5,
      masteryChecks: 0 // needs 3 checks >= 90% to level up permanently
    },
    cortaLevel: 1,     // Sprint: 1 (2.0s), 2 (1.5s), 3 (1.2s), 4 (1.0s), 5 (0.8s), 6 (0.6s)
    largaLevel: 1      // Long: 1 (15w), 2 (25w), 3 (40w), 4 (60w), 5 (100w)
  },

  // 2. MODELO NÚMEROS
  numbers: {
    conqueredRange: 9, // Starts with target 0-9 (10 basic digits: Aro to Boa)
    conqueredCount: 0, // Numbers fully mastered (starts at 0)
    masteryChecks: 0,  // needs 3 checks >= 90% to unlock next range
    normal: {
      itemsCount: 5,
      cadence: 3.5,
      masteryChecks: 0
    },
    cortaLevel: 1,
    largaLevel: 1
  },

  // 3. MODELO HÍBRIDO (PALABRAS + NÚMEROS)
  hybrid: {
    level: 1,
    normal: {
      itemsCount: 6,
      cadence: 3.5,
      masteryChecks: 0
    },
    cortaLevel: 1,
    largaLevel: 1
  },

  // PERSONAL RECORDS
  records: {
    longestWordChain: 0,
    longestNumberChain: 0,
    fastestWordSpeed: 99,
    fastestNumberSpeed: 99,
    totalSessionsCompleted: 0,
    history: []
  },

  streak: 1,
  maxStreak: 1,
  lastTrainDate: null,
  xp: 0
};

export const loadProfile = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROFILE };
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      words: { ...DEFAULT_PROFILE.words, ...(parsed.words || {}) },
      numbers: { ...DEFAULT_PROFILE.numbers, ...(parsed.numbers || {}) },
      hybrid: { ...DEFAULT_PROFILE.hybrid, ...(parsed.hybrid || {}) },
      records: { ...DEFAULT_PROFILE.records, ...(parsed.records || {}) }
    };
  } catch (e) {
    console.error('Error loading profile', e);
    return { ...DEFAULT_PROFILE };
  }
};

export const saveProfile = (profile) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving profile', e);
  }
};

// Sprint & Long static tier definitions
export const SPRINT_TIERS = [
  { level: 1, count: 6, cadence: 2.0, name: "Calentamiento Rápido" },
  { level: 2, count: 6, cadence: 1.5, name: "Aceleración Neuronal" },
  { level: 3, count: 7, cadence: 1.2, name: "Reflejo Instantáneo" },
  { level: 4, count: 8, cadence: 1.0, name: "Velocidad de Competición" },
  { level: 5, count: 8, cadence: 0.8, name: "Modo Ramón Campayo" },
  { level: 6, count: 10, cadence: 0.6, name: "Bestia del Reflejo" },
];

export const LONGRUN_TIERS = [
  { level: 1, count: 15, cadence: 3.0, name: "Primer Fondo (15 palabras)" },
  { level: 2, count: 25, cadence: 2.8, name: "Resistencia Media (25 palabras)" },
  { level: 3, count: 40, cadence: 2.5, name: "Gran Cadena (40 palabras)" },
  { level: 4, count: 60, cadence: 2.0, name: "Reto del Muro (60 palabras)" },
  { level: 5, count: 100, cadence: 1.8, name: "¡Centurión Épico (100 palabras)!" },
];

// Smart Session Generator based on Álvaro's exact probability weights:
// - 33% Words, 33% Numbers, 33% Hybrid
// - Majority to Normal/Consolidation, smaller share to Corta and Larga
export const generateSmartSession = (profile) => {
  const modelRoll = Math.random(); // 0.0 to 1.0

  if (modelRoll < 0.333) {
    // 1. MODELO PALABRAS
    const subRoll = Math.random();
    if (subRoll < 0.65) {
      // Normal (65%)
      const wordsNormal = profile.words?.normal || DEFAULT_PROFILE.words.normal;
      return {
        model: 'words',
        type: 'words',
        style: 'normal',
        count: wordsNormal.itemsCount || 5,
        cadence: wordsNormal.cadence || 3.5,
        title: `Palabras: Normal (Nivel ${profile.words.level})`,
        subtitle: `${wordsNormal.itemsCount} palabras a ${wordsNormal.cadence}s`,
        badge: "Palabras Normal",
        icon: "🧠",
        masteryChecks: wordsNormal.masteryChecks || 0
      };
    } else if (subRoll < 0.82) {
      // Corta (Sprint) (17%)
      const lvl = Math.min(6, profile.words?.cortaLevel || 1);
      const tier = SPRINT_TIERS[lvl - 1];
      return {
        model: 'words',
        type: 'words',
        style: 'corta',
        count: tier.count,
        cadence: tier.cadence,
        title: `Sprint de Palabras (Nivel ${lvl})`,
        subtitle: `${tier.count} palabras a ${tier.cadence}s (Reflejo)`,
        badge: "Palabras Corta",
        icon: "⚡"
      };
    } else {
      // Larga (18%)
      const lvl = Math.min(5, profile.words?.largaLevel || 1);
      const tier = LONGRUN_TIERS[lvl - 1];
      return {
        model: 'words',
        type: 'words',
        style: 'larga',
        count: tier.count,
        cadence: tier.cadence,
        title: `Tirada Larga de Palabras (Nivel ${lvl})`,
        subtitle: `${tier.count} palabras (Resistencia)`,
        badge: "Palabras Larga",
        icon: "🏔️"
      };
    }
  } else if (modelRoll < 0.666) {
    // 2. MODELO NÚMEROS
    const subRoll = Math.random();
    const conqueredRange = profile.numbers?.conqueredRange || 9;
    
    // Normal + Consolidación take 75%
    if (subRoll < 0.45) {
      // Consolidación de Casillero (45%)
      const blockStart = Math.max(0, conqueredRange - 9);
      const blockEnd = conqueredRange;
      return {
        model: 'numbers',
        type: 'numbers',
        style: 'consolidacion',
        count: 10,
        cadence: 3.0,
        range: [blockStart, blockEnd],
        title: `Números: Consolidación (${blockStart} al ${blockEnd})`,
        subtitle: "Afianza imágenes fijas: número ➔ palabra y viceversa",
        badge: "Casillero Drill",
        icon: "🎯",
        masteryChecks: profile.numbers.masteryChecks || 0
      };
    } else if (subRoll < 0.75) {
      // Números Normal (Cadena Numérica) (30%)
      const numbersNormal = profile.numbers?.normal || DEFAULT_PROFILE.numbers.normal;
      return {
        model: 'numbers',
        type: 'numbers',
        style: 'normal',
        count: numbersNormal.itemsCount || 5,
        cadence: numbersNormal.cadence || 3.5,
        range: [0, conqueredRange],
        title: `Números: Cadena en Memoria (Rango 0-${conqueredRange})`,
        subtitle: `${numbersNormal.itemsCount} números convertidos a casillero`,
        badge: "Números Normal",
        icon: "🔢",
        masteryChecks: numbersNormal.masteryChecks || 0
      };
    } else if (subRoll < 0.88) {
      // Corta (13%)
      const lvl = Math.min(6, profile.numbers?.cortaLevel || 1);
      const tier = SPRINT_TIERS[lvl - 1];
      return {
        model: 'numbers',
        type: 'numbers',
        style: 'corta',
        count: tier.count,
        cadence: tier.cadence,
        range: [0, conqueredRange],
        title: `Sprint de Números (Nivel ${lvl})`,
        subtitle: `${tier.count} números a ${tier.cadence}s`,
        badge: "Números Corta",
        icon: "⚡"
      };
    } else {
      // Larga (12%)
      const lvl = Math.min(5, profile.numbers?.largaLevel || 1);
      const tier = LONGRUN_TIERS[lvl - 1];
      return {
        model: 'numbers',
        type: 'numbers',
        style: 'larga',
        count: Math.min(tier.count, Math.max(10, conqueredRange + 1)),
        cadence: tier.cadence,
        range: [0, conqueredRange],
        title: `Tirada Larga de Números (Nivel ${lvl})`,
        subtitle: `${tier.count} números en cadena`,
        badge: "Números Larga",
        icon: "🏔️"
      };
    }
  } else {
    // 3. MODELO HÍBRIDO (PALABRAS + NÚMEROS)
    const subRoll = Math.random();
    const conqueredRange = profile.numbers?.conqueredRange || 9;

    if (subRoll < 0.70) {
      // Normal (70%)
      const hybridNormal = profile.hybrid?.normal || DEFAULT_PROFILE.hybrid.normal;
      return {
        model: 'hybrid',
        type: 'hybrid',
        style: 'normal',
        count: hybridNormal.itemsCount || 6,
        cadence: hybridNormal.cadence || 3.5,
        range: [0, conqueredRange],
        title: `Híbrido: Palabras + Números (Nivel ${profile.hybrid.level})`,
        subtitle: `${hybridNormal.itemsCount} elementos intercalados a ${hybridNormal.cadence}s`,
        badge: "Híbrido Normal",
        icon: "🌪️",
        masteryChecks: hybridNormal.masteryChecks || 0
      };
    } else if (subRoll < 0.85) {
      // Corta (15%)
      const lvl = Math.min(6, profile.hybrid?.cortaLevel || 1);
      const tier = SPRINT_TIERS[lvl - 1];
      return {
        model: 'hybrid',
        type: 'hybrid',
        style: 'corta',
        count: tier.count,
        cadence: tier.cadence,
        range: [0, conqueredRange],
        title: `Sprint Híbrido (Nivel ${lvl})`,
        subtitle: `${tier.count} ítems intercalados a ${tier.cadence}s`,
        badge: "Híbrido Corta",
        icon: "⚡"
      };
    } else {
      // Larga (15%)
      const lvl = Math.min(5, profile.hybrid?.largaLevel || 1);
      const tier = LONGRUN_TIERS[lvl - 1];
      return {
        model: 'hybrid',
        type: 'hybrid',
        style: 'larga',
        count: tier.count,
        cadence: tier.cadence,
        range: [0, conqueredRange],
        title: `Tirada Larga Híbrida (Nivel ${lvl})`,
        subtitle: `${tier.count} palabras y números enlazados`,
        badge: "Híbrido Larga",
        icon: "🏔️"
      };
    }
  }
};

export const getRecommendedSession = generateSmartSession;

// Temporary Streak Booster: slightly amps up volume or cadence for consecutive practice
export const generateNextInStreakSession = (currentConfig) => {
  const cfg = { ...currentConfig };
  if (cfg.style === 'corta') {
    cfg.cadence = parseFloat(Math.max(0.5, (cfg.cadence || 1.5) - 0.1).toFixed(1));
    cfg.subtitle = `🔥 Modo Racha: Acelerado a ${cfg.cadence}s por elemento`;
  } else if (cfg.style === 'larga') {
    cfg.count = Math.min(100, (cfg.count || 15) + 3);
    cfg.subtitle = `🔥 Modo Racha: Resistencia extendida a ${cfg.count} elementos`;
  } else if (cfg.style === 'consolidacion') {
    cfg.cadence = parseFloat(Math.max(1.5, (cfg.cadence || 3.0) - 0.3).toFixed(1));
    cfg.subtitle = `🔥 Modo Racha: Evocación rápida a ${cfg.cadence}s`;
  } else {
    // Normal style: add 1 element
    cfg.count = Math.min(100, (cfg.count || 5) + 1);
    cfg.subtitle = `🔥 Modo Racha: Reto aumentado a ${cfg.count} elementos`;
  }
  cfg.title = `${cfg.title || 'Entrenamiento'} (Racha)`;
  cfg.badge = "🔥 En Racha";
  return cfg;
};

// Adaptive Mastery Engine: Checks threshold >= 90% (3 checks to graduate)
export const evaluateSessionResult = (currentProfile, sessionData) => {
  const model = sessionData.model || sessionData.type || 'words';
  const style = sessionData.style || 'normal';
  const { count, cadence, score, total } = sessionData;
  const accuracy = total > 0 ? (score / total) : 0;
  const isMasteryHit = accuracy >= 0.90; // Exactly >= 90%
  const isSevereFail = accuracy < 0.65;

  const profile = JSON.parse(JSON.stringify(currentProfile));
  const newRecords = [];
  let levelGraduated = false;
  let feedbackMessage = '';
  let masteryChecks = 0;

  // XP calculation
  const baseXP = score * (model === 'numbers' ? 12 : model === 'hybrid' ? 14 : 10);
  const speedMultiplier = Math.max(1, 4 / (cadence || 2));
  const earnedXP = Math.round(baseXP * speedMultiplier);
  profile.xp = (profile.xp || 0) + earnedXP;

  // Track personal records
  if (model === 'words' && score > (profile.records.longestWordChain || 0)) {
    profile.records.longestWordChain = score;
    newRecords.push(`¡Nuevo Récord: ${score} palabras seguidas!`);
  }
  if (model === 'numbers' && score > (profile.records.longestNumberChain || 0)) {
    profile.records.longestNumberChain = score;
    newRecords.push(`¡Nuevo Récord: ${score} números seguidos!`);
  }
  if (isMasteryHit && cadence && cadence < (profile.records.fastestWordSpeed || 99)) {
    profile.records.fastestWordSpeed = cadence;
    newRecords.push(`¡Nuevo Récord de Velocidad: ${cadence}s por ítem!`);
  }

  // --- MASTERY & PROGRESSION LOGIC (Needs 3 checks >= 90%) ---
  if (style === 'normal') {
    const targetModel = profile[model] || profile.words;
    if (isMasteryHit) {
      targetModel.normal.masteryChecks = (targetModel.normal.masteryChecks || 0) + 1;
      masteryChecks = targetModel.normal.masteryChecks;
      if (targetModel.normal.masteryChecks >= 3) {
        // GRADUATED! Level up!
        levelGraduated = true;
        targetModel.level = (targetModel.level || 1) + 1;
        targetModel.normal.itemsCount = Math.min(100, (targetModel.normal.itemsCount || 5) + 2);
        if (targetModel.normal.cadence > 1.0) {
          targetModel.normal.cadence = parseFloat(Math.max(1.0, targetModel.normal.cadence - 0.2).toFixed(1));
        }
        targetModel.normal.masteryChecks = 0; // Reset checks for the new level
        masteryChecks = 3;
        feedbackMessage = `¡MAESTRÍA CONSOLIDADA (3/3 aciertos ≥ 90%)! Asciendes al Nivel ${targetModel.level} en ${model}. En la próxima aumentamos a ${targetModel.normal.itemsCount} elementos a ${targetModel.normal.cadence}s.`;
      } else {
        feedbackMessage = `¡Excelente sesión (${Math.round(accuracy * 100)}%)! Sumas ${targetModel.normal.masteryChecks} de 3 checks para consolidar el Nivel ${targetModel.level}.`;
      }
    } else if (isSevereFail) {
      if (targetModel.normal.masteryChecks > 0) {
        targetModel.normal.masteryChecks -= 1;
      }
      masteryChecks = targetModel.normal.masteryChecks;
      feedbackMessage = `Sesión difícil (${Math.round(accuracy * 100)}%). El sistema mantiene el nivel para consolidar bien la técnica sin subir en falso.`;
    } else {
      masteryChecks = targetModel.normal.masteryChecks || 0;
      feedbackMessage = `Buen entrenamiento de práctica (${Math.round(accuracy * 100)}%). Mantienes tu ritmo estable.`;
    }
  } else if (style === 'consolidacion' && model === 'numbers') {
    // Casillero Block Consolidation
    if (isMasteryHit) {
      profile.numbers.masteryChecks = (profile.numbers.masteryChecks || 0) + 1;
      masteryChecks = profile.numbers.masteryChecks;
      if (profile.numbers.masteryChecks >= 3) {
        levelGraduated = true;
        const currentRange = profile.numbers.conqueredRange || 9;
        const nextRange = Math.min(100, currentRange + 10);
        profile.numbers.conqueredRange = nextRange;
        profile.numbers.conqueredCount = nextRange + 1;
        profile.numbers.masteryChecks = 0;
        masteryChecks = 3;
        feedbackMessage = `¡BLOQUE CONQUISTADO (3/3 checks)! Has asimilado los números hasta el ${nextRange}. El motor empezará a incluir el siguiente bloque en tus entrenamientos.`;
      } else {
        feedbackMessage = `¡Casillero firme (${Math.round(accuracy * 100)}%)! ${profile.numbers.masteryChecks}/3 checks hacia la conquista de este bloque.`;
      }
    } else {
      masteryChecks = profile.numbers.masteryChecks || 0;
      feedbackMessage = `Sigue afianzando estas imágenes (${Math.round(accuracy * 100)}%). El objetivo es responder en menos de un segundo.`;
    }
  } else if (style === 'corta') {
    // Sprint
    const targetModel = profile[model] || profile.words;
    if (isMasteryHit) {
      targetModel.cortaLevel = Math.min(6, (targetModel.cortaLevel || 1) + 1);
      feedbackMessage = `¡Sprint superado con ${Math.round(accuracy * 100)}%! Subes de velocidad en Sprint (Nivel ${targetModel.cortaLevel}).`;
    } else {
      feedbackMessage = `Sprint completado (${Math.round(accuracy * 100)}%). Tus reflejos se van afilando.`;
    }
  } else if (style === 'larga') {
    // Endurance
    const targetModel = profile[model] || profile.words;
    if (isMasteryHit) {
      targetModel.largaLevel = Math.min(5, (targetModel.largaLevel || 1) + 1);
      feedbackMessage = `¡Fondo mental demostrado (${Math.round(accuracy * 100)}%)! Desbloqueas el siguiente volumen de Tirada Larga (Nivel ${targetModel.largaLevel}).`;
    } else {
      feedbackMessage = `Gran esfuerzo de resistencia (${Math.round(accuracy * 100)}%). La capacidad de no romper la cadena mejora con cada intento.`;
    }
  }

  // Update streak
  const today = new Date().toISOString().split('T')[0];
  if (profile.lastTrainDate !== today) {
    profile.streak = (profile.streak || 0) + 1;
    profile.lastTrainDate = today;
    if (profile.streak > (profile.maxStreak || 1)) {
      profile.maxStreak = profile.streak;
    }
  }

  // Save in history
  profile.records.totalSessionsCompleted = (profile.records.totalSessionsCompleted || 0) + 1;
  const historyEntry = {
    id: Date.now(),
    date: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
    model,
    style,
    count,
    cadence,
    score,
    accuracy: Math.round(accuracy * 100),
    xp: earnedXP
  };
  profile.records.history = [historyEntry, ...(profile.records.history || [])].slice(0, 30);

  saveProfile(profile);
  return {
    newProfile: profile,
    feedbackMessage,
    levelGraduated,
    newRecords,
    earnedXP,
    masteryChecks,
    isMasteryHit,
    accuracy: Math.round(accuracy * 100)
  };
};
