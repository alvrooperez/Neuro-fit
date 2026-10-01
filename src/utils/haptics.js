// Haptic feedback utility for mobile phones

export const triggerHaptic = (type = 'light') => {
  if (typeof window === 'undefined' || !('vibrate' in navigator)) return;

  try {
    switch (type) {
      case 'light':
        navigator.vibrate(15);
        break;
      case 'medium':
        navigator.vibrate(30);
        break;
      case 'heavy':
        navigator.vibrate(50);
        break;
      case 'success':
        navigator.vibrate([20, 50, 40]);
        break;
      case 'error':
        navigator.vibrate([40, 60, 40, 60, 80]);
        break;
      case 'levelUp':
        navigator.vibrate([40, 40, 60, 40, 100]);
        break;
      default:
        navigator.vibrate(20);
    }
  } catch (e) {
    // Ignore in browsers that block vibration without prior interaction
  }
};
