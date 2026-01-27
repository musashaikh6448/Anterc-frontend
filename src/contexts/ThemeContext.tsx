import React, { createContext, useContext, useState, useEffect } from 'react';
import { getActiveTheme } from '@/api/themeApi';

interface ThemeContextType {
  theme: any;
  loading: boolean;
  refreshTheme: () => void;
}

const defaultThemeContext: ThemeContextType = {
  theme: null,
  loading: true,
  refreshTheme: () => {},
};

const ThemeContext = createContext<ThemeContextType>(defaultThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const applyAllColors = (colorObj: any) => {
    const root = document.documentElement;
    if (!colorObj) return;
    
    // Apply all color properties to CSS variables
    Object.entries(colorObj).forEach(([key, value]) => {
      if (value && typeof value === 'string') {
        const cssVar = `--theme-${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        root.style.setProperty(cssVar, value);
      }
    });
  };

  const fetchTheme = async () => {
    try {
      const { data } = await getActiveTheme();
      setTheme(data);
      
      // Apply all colors to document
      if (data?.colors) {
        applyAllColors(data.colors);
      } else {
        // Set default colors if no theme colors exist
        const defaultColors = {
          primary: '#4f46e5',
          secondary: '#6366f1',
          background: '#fcfdfe',
          backgroundSecondary: '#f8fafc',
          backgroundDark: '#0f172a',
          textPrimary: '#0f172a',
          textSecondary: '#64748b',
          textLight: '#ffffff',
          border: '#e2e8f0',
          borderLight: '#f1f5f9',
          accent: '#6366f1',
          accentHover: '#4f46e5',
          success: '#10b981',
          error: '#ef4444',
          warning: '#f59e0b',
          info: '#3b82f6',
          buttonPrimary: '#4f46e5',
          buttonPrimaryHover: '#4338ca',
          buttonSecondary: '#6366f1',
          buttonSecondaryHover: '#4f46e5',
          link: '#4f46e5',
          linkHover: '#4338ca',
          dark: '#0f172a',
          darkHover: '#1e293b',
        };
        applyAllColors(defaultColors);
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
      // Set default colors on error
      const defaultColors = {
        primary: '#4f46e5',
        secondary: '#6366f1',
        background: '#fcfdfe',
        backgroundSecondary: '#f8fafc',
        backgroundDark: '#0f172a',
        textPrimary: '#0f172a',
        textSecondary: '#64748b',
        textLight: '#ffffff',
        border: '#e2e8f0',
        borderLight: '#f1f5f9',
        accent: '#6366f1',
        accentHover: '#4f46e5',
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
        buttonPrimary: '#4f46e5',
        buttonPrimaryHover: '#4338ca',
        buttonSecondary: '#6366f1',
        buttonSecondaryHover: '#4f46e5',
        link: '#4f46e5',
        linkHover: '#4338ca',
      };
      applyAllColors(defaultColors);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, loading, refreshTheme: fetchTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  return useContext(ThemeContext);
};
