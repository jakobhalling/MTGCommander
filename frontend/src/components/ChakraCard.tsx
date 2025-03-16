import React from 'react';
import { Box, Image, Text, Flex, Badge, useColorModeValue } from '@chakra-ui/react';
import { CardType } from '../types/game';

interface ChakraCardProps {
  card: CardType;
  isTapped?: boolean;
  isSelected?: boolean;
  onClick?: (card: CardType) => void;
  onContextMenu?: (card: CardType, event: React.MouseEvent) => void;
}

const ChakraCard: React.FC<ChakraCardProps> = ({
  card,
  isTapped = false,
  isSelected = false,
  onClick,
  onContextMenu,
}) => {
  // Theme-based colors
  const bgColor = useColorModeValue('card.background', 'gray.700');
  const borderColor = useColorModeValue(
    isSelected ? 'card.highlight' : 'card.border',
    isSelected ? 'yellow.400' : 'yellow.600'
  );
  const textColor = useColorModeValue('gray.800', 'white');
  
  // Card type colors based on MTG color identity
  const getTypeColor = () => {
    if (!card.colorIdentity || card.colorIdentity.length === 0) {
      return 'gray.500'; // Colorless
    }
    
    if (card.colorIdentity.length > 1) {
      return 'yellow.500'; // Multicolor/Gold
    }
    
    const color = card.colorIdentity[0].toLowerCase();
    switch (color) {
      case 'w': return 'white.500';
      case 'u': return 'blue.500';
      case 'b': return 'black.500';
      case 'r': return 'red.500';
      case 'g': return 'green.500';
      default: return 'gray.500';
    }
  };
  
  // Handle click events
  const handleClick = () => {
    if (onClick) {
      onClick(card);
    }
  };
  
  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    if (onContextMenu) {
      onContextMenu(card, event);
    }
  };
  
  return (
    <Box
      width="200px"
      height="280px"
      bg={bgColor}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      overflow="hidden"
      boxShadow={isSelected ? 'lg' : 'md'}
      transition="all 0.2s"
      transform={isTapped ? 'rotate(90deg)' : undefined}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
      position="relative"
      _hover={{
        transform: isTapped ? 'rotate(90deg) scale(1.02)' : 'scale(1.02)',
        boxShadow: 'lg',
        zIndex: 1,
      }}
      data-testid={`card-${card.id}`}
    >
      {/* Card Image */}
      {card.imageUrl ? (
        <Image 
          src={card.imageUrl} 
          alt={card.name} 
          width="100%" 
          height="140px" 
          objectFit="cover"
        />
      ) : (
        <Flex 
          width="100%" 
          height="140px" 
          bg={getTypeColor()} 
          alignItems="center" 
          justifyContent="center"
        >
          <Text color="white" fontWeight="bold" fontSize="lg">
            {card.name}
          </Text>
        </Flex>
      )}
      
      {/* Card Content */}
      <Box p={3}>
        <Text fontWeight="bold" fontSize="md" color={textColor} mb={1}>
          {card.name}
        </Text>
        
        <Text fontSize="sm" color={textColor} opacity={0.8} mb={2}>
          {card.type}
        </Text>
        
        {/* Card Text */}
        {card.text && (
          <Text fontSize="xs" color={textColor} noOfLines={3} mb={2}>
            {card.text}
          </Text>
        )}
        
        {/* Power/Toughness */}
        {card.power && card.toughness && (
          <Badge 
            position="absolute" 
            bottom="8px" 
            right="8px" 
            colorScheme={getTypeColor().split('.')[0]}
          >
            {card.power}/{card.toughness}
          </Badge>
        )}
        
        {/* Counters */}
        {card.counters && Object.keys(card.counters).length > 0 && (
          <Flex position="absolute" top="8px" right="8px" flexWrap="wrap" justifyContent="flex-end">
            {Object.entries(card.counters).map(([type, count]) => (
              <Badge 
                key={type} 
                colorScheme="purple" 
                borderRadius="full" 
                px={2} 
                ml={1} 
                mb={1}
              >
                {count} {type}
              </Badge>
            ))}
          </Flex>
        )}
      </Box>
    </Box>
  );
};

export default ChakraCard; 