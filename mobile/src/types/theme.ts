export interface Theme {
  colors: {
    primary: string;
    background: string;
    surface: string;
    text: string;
    textSecondary: string;
    textTertiary: string;
    border: string;
    errorBackground: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    secondary: string;
    onPrimary: string;
    onSecondary: string;
    onError: string;
    disabled: string;
    white: string;
    black: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  typography: {
    title: {
      fontSize: number;
      fontWeight: string;
    };
    subtitle: {
      fontSize: number;
      fontWeight: string;
    };
    body: {
      fontSize: number;
      fontWeight: string;
    };
    caption: {
      fontSize: number;
      fontWeight: string;
    };
  };
  borderRadius: {
    sm: number;
    md: number;
    lg: number;
  };
}

export interface ThemeContextValue {
  theme: Theme;
  colors: Theme['colors'];
  isDarkMode: boolean;
  toggleTheme?: () => void;
}
