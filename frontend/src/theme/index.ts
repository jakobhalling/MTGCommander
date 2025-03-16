import { extendTheme, ThemeConfig } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

// Color mode config
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: true,
};

// MTG color palette
const colors = {
  // MTG's five colors
  white: {
    50: '#FFFFFF',
    100: '#FEFEFE',
    200: '#FAFAFA',
    300: '#F5F5F5',
    400: '#EEEEEE',
    500: '#E0E0E0', // Primary
    600: '#BDBDBD',
    700: '#9E9E9E',
    800: '#757575',
    900: '#616161',
  },
  blue: {
    50: '#E3F2FD',
    100: '#BBDEFB',
    200: '#90CAF9',
    300: '#64B5F6',
    400: '#42A5F5',
    500: '#2196F3', // Primary
    600: '#1E88E5',
    700: '#1976D2',
    800: '#1565C0',
    900: '#0D47A1',
  },
  black: {
    50: '#EEEEEE',
    100: '#BDBDBD',
    200: '#9E9E9E',
    300: '#757575',
    400: '#616161',
    500: '#424242', // Primary
    600: '#303030',
    700: '#212121',
    800: '#181818',
    900: '#000000',
  },
  red: {
    50: '#FFEBEE',
    100: '#FFCDD2',
    200: '#EF9A9A',
    300: '#E57373',
    400: '#EF5350',
    500: '#F44336', // Primary
    600: '#E53935',
    700: '#D32F2F',
    800: '#C62828',
    900: '#B71C1C',
  },
  green: {
    50: '#E8F5E9',
    100: '#C8E6C9',
    200: '#A5D6A7',
    300: '#81C784',
    400: '#66BB6A',
    500: '#4CAF50', // Primary
    600: '#43A047',
    700: '#388E3C',
    800: '#2E7D32',
    900: '#1B5E20',
  },
  // Game-specific UI colors
  card: {
    border: '#DAA520', // Gold border for cards
    background: '#F5F5DC', // Beige background
    highlight: '#FFD700', // Gold highlight
  },
  battlefield: {
    background: '#2E7D32', // Green felt
    grid: '#1B5E20', // Darker green for grid lines
  },
  ui: {
    primary: '#1976D2', // Blue for primary actions
    secondary: '#424242', // Dark gray for secondary actions
    accent: '#FFC107', // Amber for accents
    danger: '#D32F2F', // Red for dangerous actions
    success: '#388E3C', // Green for success states
    warning: '#FFA000', // Amber for warnings
    info: '#0288D1', // Light blue for info
  },
};

// Typography
const fonts = {
  heading: '"Beleren", "Beleren Bold", serif',
  body: '"Roboto", "Open Sans", sans-serif',
  mono: '"Roboto Mono", "Courier New", monospace',
};

// Component-specific styles
const components = {
  Card: {
    baseStyle: (props: any) => ({
      bg: mode('card.background', 'gray.700')(props),
      borderColor: mode('card.border', 'yellow.600')(props),
      borderWidth: '1px',
      borderRadius: 'md',
      overflow: 'hidden',
      transition: 'all 0.2s',
      _hover: {
        transform: 'scale(1.02)',
        boxShadow: 'lg',
      },
    }),
    variants: {
      tapped: {
        transform: 'rotate(90deg)',
      },
      highlighted: {
        borderColor: 'card.highlight',
        borderWidth: '2px',
        boxShadow: '0 0 0 2px rgba(255, 215, 0, 0.3)',
      },
    },
  },
  Zone: {
    baseStyle: (props: any) => ({
      bg: mode('gray.100', 'gray.700')(props),
      borderRadius: 'md',
      p: 4,
      minHeight: '200px',
    }),
    variants: {
      battlefield: (props: any) => ({
        bg: mode('battlefield.background', 'gray.800')(props),
        minHeight: '400px',
      }),
      hand: {
        position: 'relative',
      },
      graveyard: {
        opacity: 0.9,
      },
      exile: {
        opacity: 0.7,
      },
    },
  },
  Button: {
    baseStyle: {
      fontWeight: 'bold',
      borderRadius: 'md',
    },
    variants: {
      primary: {
        bg: 'ui.primary',
        color: 'white',
        _hover: {
          bg: 'blue.600',
        },
      },
      secondary: {
        bg: 'ui.secondary',
        color: 'white',
        _hover: {
          bg: 'gray.600',
        },
      },
      phase: {
        bg: 'transparent',
        border: '1px solid',
        borderColor: 'ui.accent',
        color: 'ui.accent',
        _hover: {
          bg: 'rgba(255, 193, 7, 0.1)',
        },
      },
    },
    defaultProps: {
      variant: 'primary',
    },
  },
};

// Breakpoints for responsive design
const breakpoints = {
  sm: '30em', // 480px
  md: '48em', // 768px
  lg: '62em', // 992px
  xl: '80em', // 1280px
  '2xl': '96em', // 1536px
};

// Create the theme
const theme = extendTheme({
  config,
  colors,
  fonts,
  components,
  breakpoints,
  styles: {
    global: (props: any) => ({
      body: {
        bg: mode('gray.50', 'gray.900')(props),
        color: mode('gray.800', 'whiteAlpha.900')(props),
      },
    }),
  },
});

export default theme; 