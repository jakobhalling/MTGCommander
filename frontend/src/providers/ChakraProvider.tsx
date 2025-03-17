import React from 'react';
import { ChakraProvider as ChakraUIProvider, ColorModeScript } from '@chakra-ui/react';
import theme from '../theme';

interface ChakraProviderProps {
  children: React.ReactNode;
}

/**
 * ChakraProvider component that wraps the application with Chakra UI's provider
 * and sets up the color mode script for theme support.
 */
const ChakraProvider: React.FC<ChakraProviderProps> = ({ children }) => {
  return (
    <>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <ChakraUIProvider theme={theme}>
        {children}
      </ChakraUIProvider>
    </>
  );
};

export default ChakraProvider; 