import fullCasilleroData from './casillero_full.json';

// Álvaro's Complete 0 to 100 Mental Peg System
export const CASILLERO_100 = fullCasilleroData;

// Quick helper to get item by number (0-100)
export const getCasilleroItem = (num) => {
  return CASILLERO_100.find((item) => item.num === num) || null;
};

// Foundational 10 digits (0 to 9)
export const CASILLERO_DIGITS_0_9 = CASILLERO_100.filter(it => it.num >= 0 && it.num <= 9);

// Subset 1 to 10
export const CASILLERO_10 = CASILLERO_100.filter(it => it.num >= 1 && it.num <= 10);
