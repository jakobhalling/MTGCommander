import React from 'react';
import { Box, Heading, VStack, Flex, useColorModeValue } from '@chakra-ui/react';
import { Card } from '../types/game';
import ChakraCard from './ChakraCard';

export interface ChakraZoneProps {
  id: string;
  name: string;
  cards: Card[];
  onCardClick?: (card: Card) => void;
  onCardContextMenu?: (card: Card, event: React.MouseEvent) => void;
  selectedCardIds?: string[];
  tappedCardIds?: string[];
}

const ChakraZone: React.FC<ChakraZoneProps> = ({
  id,
  name,
  cards,
  onCardClick,
  onCardContextMenu,
  selectedCardIds = [],
  tappedCardIds = [],
}) => {
  const bgColor = useColorModeValue('gray.100', 'gray.700');
  const borderColor = useColorModeValue('gray.300', 'gray.600');
  const headingColor = useColorModeValue('gray.700', 'gray.200');

  const handleCardClick = (card: Card) => {
    if (onCardClick) {
      onCardClick(card);
    }
  };

  const handleCardContextMenu = (card: Card, event: React.MouseEvent) => {
    if (onCardContextMenu) {
      onCardContextMenu(card, event);
    }
  };

  return (
    <Box
      data-testid={`zone-${id}`}
      bg={bgColor}
      borderRadius="md"
      borderWidth="1px"
      borderColor={borderColor}
      p={3}
      minH="150px"
      w="100%"
      boxShadow="sm"
    >
      <Heading 
        as="h3" 
        size="sm" 
        mb={2} 
        color={headingColor}
        fontWeight="semibold"
      >
        {name} ({cards.length})
      </Heading>
      
      {cards.length > 0 ? (
        <Flex flexWrap="wrap" gap={2}>
          {cards.map((card) => (
            <ChakraCard
              key={card.id}
              card={card}
              isSelected={selectedCardIds.includes(card.id)}
              isTapped={tappedCardIds.includes(card.id)}
              onClick={handleCardClick}
              onContextMenu={(e) => handleCardContextMenu(card, e)}
            />
          ))}
        </Flex>
      ) : (
        <VStack 
          justify="center" 
          align="center" 
          h="100px"
          color="gray.500"
          fontSize="sm"
        >
          <Box>Empty</Box>
        </VStack>
      )}
    </Box>
  );
};

export default ChakraZone; 