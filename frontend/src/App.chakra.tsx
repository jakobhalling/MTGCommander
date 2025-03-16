import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { Box, Container, Flex, Grid, GridItem } from '@chakra-ui/react';
import store from './store';
import ChakraProvider from './providers/ChakraProvider';
import ChakraActionPanel from './components/ChakraActionPanel';
import ChakraPlayerInfo from './components/ChakraPlayerInfo';
import ChakraZone from './components/ChakraZone';
import Header from './components/Header';

/**
 * This is a sample App component that demonstrates how the application would look
 * with Chakra UI components. This is not meant to replace the actual App.tsx yet,
 * but serves as a reference for the migration.
 */
const ChakraApp: React.FC = () => {
  // Mock data for demonstration
  const mockPlayer = {
    id: 'player-1',
    name: 'Player 1',
    life: 40,
    colorIdentity: ['U', 'R', 'G'],
    hand: [{ id: 'card-1' }, { id: 'card-2' }],
    library: Array(60).fill({ id: 'library-card' }),
    graveyard: [],
    exile: [],
    battlefield: [],
    commander: {
      id: 'commander-1',
      name: 'Omnath, Locus of Creation',
      colorIdentity: ['W', 'U', 'R', 'G'],
    },
  };

  const mockCards = [
    {
      id: 'card-1',
      name: 'Lightning Bolt',
      type: 'Instant',
      imageUrl: 'https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=442125&type=card',
    },
    {
      id: 'card-2',
      name: 'Island',
      type: 'Basic Land — Island',
      imageUrl: 'https://gatherer.wizards.com/Handlers/Image.ashx?multiverseid=439602&type=card',
    },
  ];

  return (
    <ChakraProvider>
      <Provider store={store}>
        <Router>
          <Flex direction="column" minH="100vh">
            <Header />
            
            <Container maxW="container.xl" py={6}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <Grid
                      templateColumns={{ base: '1fr', md: 'repeat(3, 1fr)' }}
                      templateRows={{ base: 'auto', md: 'auto 1fr auto' }}
                      gap={4}
                    >
                      {/* Player Info Section */}
                      <GridItem colSpan={{ base: 1, md: 3 }}>
                        <Flex gap={4} wrap={{ base: 'wrap', md: 'nowrap' }}>
                          <ChakraPlayerInfo
                            player={mockPlayer}
                            isActivePlayer={true}
                            isCurrentPlayer={true}
                          />
                          <ChakraPlayerInfo
                            player={{...mockPlayer, id: 'player-2', name: 'Player 2'}}
                            isActivePlayer={false}
                            isCurrentPlayer={false}
                          />
                        </Flex>
                      </GridItem>
                      
                      {/* Game Zones */}
                      <GridItem colSpan={{ base: 1, md: 2 }} rowSpan={1}>
                        <Grid templateColumns="repeat(2, 1fr)" gap={4}>
                          <ChakraZone
                            id="battlefield"
                            name="Battlefield"
                            cards={mockCards}
                          />
                          <ChakraZone
                            id="hand"
                            name="Hand"
                            cards={mockCards}
                          />
                          <ChakraZone
                            id="graveyard"
                            name="Graveyard"
                            cards={[]}
                          />
                          <ChakraZone
                            id="exile"
                            name="Exile"
                            cards={[]}
                          />
                        </Grid>
                      </GridItem>
                      
                      {/* Action Panel */}
                      <GridItem colSpan={1} rowSpan={1}>
                        <ChakraActionPanel />
                      </GridItem>
                    </Grid>
                  }
                />
              </Routes>
            </Container>
            
            <Box as="footer" mt="auto" py={4} textAlign="center" bg="gray.100">
              MTG Commander © 2023
            </Box>
          </Flex>
        </Router>
      </Provider>
    </ChakraProvider>
  );
};

export default ChakraApp; 