import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';

const ThemeContext = createContext();

export function useThemeMode() {
  return useContext(ThemeContext);
}

// Color tokens for both modes
export const tokens = {
  dark: {
    // Backgrounds
    bgPrimary: '#080c1a',
    bgSurface: 'rgba(15, 22, 41, 0.7)',
    bgSurfaceSolid: 'rgba(15, 22, 41, 0.85)',
    bgCard: 'rgba(20, 27, 50, 0.7)',
    bgCardInner: 'rgba(10, 14, 30, 0.5)',
    bgInput: 'rgba(10, 14, 30, 0.6)',
    bgHover: 'rgba(0, 212, 255, 0.04)',
    bgDialog: 'rgba(15, 22, 41, 0.95)',
    bgGradient: 'linear-gradient(160deg, #080c1a 0%, #0f1629 40%, #1a1040 100%)',
    bgRadial: 'radial-gradient(ellipse at 20% 20%, rgba(0, 212, 255, 0.06) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(124, 58, 237, 0.06) 0%, transparent 50%)',
    bgDrawer: 'linear-gradient(180deg, #0f1629 0%, #1a1040 100%)',
    bgHeaderSubtle: 'rgba(0, 212, 255, 0.06)',

    // Text
    textPrimary: '#e2e8f0',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
    textDim: '#64748b',
    textDimmer: '#475569',

    // Accent
    accentPrimary: '#00d4ff',
    accentPrimaryHover: '#22d3ee',
    accentSecondary: '#7c3aed',
    accentSecondaryHover: '#8b5cf6',
    accentSuccess: '#00ff88',
    accentSuccessHover: '#34d399',
    accentDanger: '#ff4757',
    accentDangerHover: '#ff6b81',

    // Borders
    borderSubtle: 'rgba(0, 212, 255, 0.12)',
    borderMedium: 'rgba(0, 212, 255, 0.2)',
    borderFocus: '#00d4ff',
    borderDanger: 'rgba(255, 71, 87, 0.2)',
    borderSuccess: 'rgba(0, 255, 136, 0.15)',

    // Shadows
    shadowGlow: '0 0 20px rgba(0, 212, 255, 0.25)',
    shadowGlowHover: '0 0 35px rgba(0, 212, 255, 0.4)',
    shadowCard: '0 0 30px rgba(0, 0, 0, 0.3)',
    titleGlow: '0 0 40px rgba(0, 212, 255, 0.3), 0 0 80px rgba(124, 58, 237, 0.15)',
    accentGradient: 'linear-gradient(90deg, #00d4ff, #7c3aed)',
    accentLineGlow: '0 0 12px rgba(0, 212, 255, 0.5)',

    // Buttons
    btnGradient: 'linear-gradient(135deg, #00d4ff, #7c3aed)',
    btnGradientHover: 'linear-gradient(135deg, #22d3ee, #8b5cf6)',
    btnSuccessGradient: 'linear-gradient(135deg, #00ff88, #10b981)',
    btnSuccessGradientHover: 'linear-gradient(135deg, #34d399, #059669)',
    btnDangerGradient: 'linear-gradient(135deg, #ff4757, #ef4444)',
    btnDangerGradientHover: 'linear-gradient(135deg, #ff6b81, #f87171)',
    btnSuccessText: '#0a0e27',

    // Scrollbar
    scrollTrack: 'rgba(10, 14, 30, 0.8)',
    scrollThumb: 'linear-gradient(180deg, #00d4ff, #7c3aed)',
    scrollThumbHover: 'linear-gradient(180deg, #22d3ee, #8b5cf6)',

    // Misc
    divider: 'rgba(0, 212, 255, 0.1)',
    chipBorder: 'rgba(0, 212, 255, 0.3)',
    linkColor: '#00d4ff',
  },
  light: {
    // Backgrounds
    bgPrimary: '#f0f4f8',
    bgSurface: 'rgba(255, 255, 255, 0.85)',
    bgSurfaceSolid: 'rgba(255, 255, 255, 0.95)',
    bgCard: 'rgba(255, 255, 255, 0.9)',
    bgCardInner: 'rgba(248, 250, 252, 0.8)',
    bgInput: 'rgba(255, 255, 255, 0.9)',
    bgHover: 'rgba(99, 102, 241, 0.04)',
    bgDialog: 'rgba(255, 255, 255, 0.98)',
    bgGradient: 'linear-gradient(160deg, #e8ecf4 0%, #f0f4f8 40%, #ede8f5 100%)',
    bgRadial: 'radial-gradient(ellipse at 20% 20%, rgba(99, 102, 241, 0.05) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(124, 58, 237, 0.04) 0%, transparent 50%)',
    bgDrawer: 'linear-gradient(180deg, #1e1b4b 0%, #312e81 100%)',
    bgHeaderSubtle: 'rgba(99, 102, 241, 0.06)',

    // Text
    textPrimary: '#1e293b',
    textSecondary: '#334155',
    textMuted: '#64748b',
    textDim: '#94a3b8',
    textDimmer: '#cbd5e1',

    // Accent
    accentPrimary: '#6366f1',
    accentPrimaryHover: '#4f46e5',
    accentSecondary: '#7c3aed',
    accentSecondaryHover: '#6d28d9',
    accentSuccess: '#10b981',
    accentSuccessHover: '#059669',
    accentDanger: '#ef4444',
    accentDangerHover: '#dc2626',

    // Borders
    borderSubtle: 'rgba(99, 102, 241, 0.12)',
    borderMedium: 'rgba(99, 102, 241, 0.25)',
    borderFocus: '#6366f1',
    borderDanger: 'rgba(239, 68, 68, 0.25)',
    borderSuccess: 'rgba(16, 185, 129, 0.2)',

    // Shadows
    shadowGlow: '0 4px 14px rgba(99, 102, 241, 0.15)',
    shadowGlowHover: '0 8px 25px rgba(99, 102, 241, 0.25)',
    shadowCard: '0 4px 20px rgba(0, 0, 0, 0.06)',
    titleGlow: 'none',
    accentGradient: 'linear-gradient(90deg, #6366f1, #7c3aed)',
    accentLineGlow: '0 2px 8px rgba(99, 102, 241, 0.3)',

    // Buttons
    btnGradient: 'linear-gradient(135deg, #6366f1, #7c3aed)',
    btnGradientHover: 'linear-gradient(135deg, #4f46e5, #6d28d9)',
    btnSuccessGradient: 'linear-gradient(135deg, #10b981, #059669)',
    btnSuccessGradientHover: 'linear-gradient(135deg, #059669, #047857)',
    btnDangerGradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    btnDangerGradientHover: 'linear-gradient(135deg, #f87171, #ef4444)',
    btnSuccessText: '#ffffff',

    // Scrollbar
    scrollTrack: '#f1f5f9',
    scrollThumb: 'linear-gradient(180deg, #6366f1, #7c3aed)',
    scrollThumbHover: 'linear-gradient(180deg, #4f46e5, #6d28d9)',

    // Misc
    divider: 'rgba(99, 102, 241, 0.12)',
    chipBorder: 'rgba(99, 102, 241, 0.3)',
    linkColor: '#6366f1',
  }
};

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try {
      return localStorage.getItem('themeMode') || 'dark';
    } catch {
      return 'dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('themeMode', mode);
    } catch {}
  }, [mode]);

  const toggleTheme = useCallback(() => setMode(prev => prev === 'dark' ? 'light' : 'dark'), []);

  const t = tokens[mode];

  const muiTheme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: { main: t.accentPrimary },
      secondary: { main: t.accentSecondary },
      error: { main: t.accentDanger },
      success: { main: t.accentSuccess },
      background: {
        default: t.bgPrimary,
        paper: mode === 'dark' ? '#0f1629' : '#ffffff',
      },
      text: {
        primary: t.textPrimary,
        secondary: t.textMuted,
      }
    },
    typography: {
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif",
    },
    shape: { borderRadius: 8 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: t.bgPrimary,
            color: t.textPrimary,
          },
          '::-webkit-scrollbar': { width: '6px' },
          '::-webkit-scrollbar-track': { background: t.scrollTrack },
          '::-webkit-scrollbar-thumb': { background: t.scrollThumb, borderRadius: '3px' },
          '::-webkit-scrollbar-thumb:hover': { background: t.scrollThumbHover },
        }
      }
    }
  }), [mode, t]);

  const value = useMemo(() => ({ mode, toggleTheme, t }), [mode, toggleTheme, t]);

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={muiTheme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
}
