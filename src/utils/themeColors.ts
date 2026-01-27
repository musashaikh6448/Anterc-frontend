// Utility to get theme colors from CSS variables
export const getThemeColor = (color: 'primary' | 'secondary'): string => {
  const root = document.documentElement;
  return getComputedStyle(root).getPropertyValue(`--theme-${color}`).trim() || 
    (color === 'primary' ? '#4f46e5' : '#6366f1');
};

// Apply theme colors to CSS variables
export const applyThemeColors = (primary: string, secondary: string) => {
  const root = document.documentElement;
  root.style.setProperty('--theme-primary', primary);
  root.style.setProperty('--theme-secondary', secondary);
};

// Reset to default colors
export const resetThemeColors = () => {
  applyThemeColors('#4f46e5', '#6366f1');
};
