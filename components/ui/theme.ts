export const theme = {
  colors: {
    // Main brand colors
    primary: '#4facfe',
    primaryDark: '#3b82f6',
    secondary: '#00f2fe',
    
    // Background gradients
    gradients: {
      main: ['#1a1a2e', '#16213e', '#0f3460'],
      secondary: ['#667eea', '#764ba2'],
      button: ['#4facfe', '#00f2fe'],
    },
    
    // Text colors
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
      tertiary: 'rgba(255, 255, 255, 0.9)',
      dark: '#1f2937',
      gray: '#6b7280',
      lightGray: '#4b5563',
    },
    
    // Status colors
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    
    // Background colors
    surface: 'rgba(255, 255, 255, 0.95)',
    surfaceTransparent: 'rgba(255, 255, 255, 0.1)',
    glass: 'rgba(255, 255, 255, 0.2)',
    
    // Border colors
    border: 'rgba(255, 255, 255, 0.1)',
    borderLight: 'rgba(255, 255, 255, 0.3)',
    progressBackground: '#e5e7eb',
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    huge: 40,
    massive: 50,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    round: 35,
  },
  
  typography: {
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 24,
      xxl: 28,
      xxxl: 32,
    },
    weights: {
      normal: '400' as const,
      medium: '600' as const,
      semibold: '700' as const,
      bold: '800' as const,
    },
  },
  
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 6,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 12,
    },
    button: {
      shadowColor: '#4facfe',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 12,
    },
  },
};