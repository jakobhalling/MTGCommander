import React from 'react';
import {
  Box,
  Flex,
  Text,
  Avatar,
  HStack,
  VStack,
  Badge,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  useColorModeValue,
  Tooltip,
} from '@chakra-ui/react';
import { Player } from '../types/game';

export interface ChakraPlayerInfoProps {
  player: Player;
  isActivePlayer: boolean;
  isCurrentPlayer: boolean;
}

const ChakraPlayerInfo: React.FC<ChakraPlayerInfoProps> = ({
  player,
  isActivePlayer,
  isCurrentPlayer,
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const activePlayerBg = useColorModeValue('green.50', 'green.900');
  const activePlayerBorder = useColorModeValue('green.200', 'green.700');
  const currentPlayerBg = useColorModeValue('blue.50', 'blue.900');
  const currentPlayerBorder = useColorModeValue('blue.200', 'blue.700');
  const nameColor = useColorModeValue('gray.800', 'white');
  const statBgColor = useColorModeValue('gray.50', 'gray.700');

  // Determine background and border colors based on player status
  const getBgColor = () => {
    if (isActivePlayer) return activePlayerBg;
    if (isCurrentPlayer) return currentPlayerBg;
    return bgColor;
  };

  const getBorderColor = () => {
    if (isActivePlayer) return activePlayerBorder;
    if (isCurrentPlayer) return currentPlayerBorder;
    return borderColor;
  };

  // Get color identity badges
  const getColorIdentityBadges = () => {
    const colorMap: Record<string, { color: string; label: string }> = {
      W: { color: 'white', label: 'White' },
      U: { color: 'blue', label: 'Blue' },
      B: { color: 'black', label: 'Black' },
      R: { color: 'red', label: 'Red' },
      G: { color: 'green', label: 'Green' },
    };

    return player.colorIdentity.map((color) => (
      <Tooltip key={color} label={colorMap[color]?.label || color}>
        <Badge
          colorScheme={colorMap[color]?.color.toLowerCase() || 'gray'}
          variant="solid"
          borderRadius="full"
          px={2}
        >
          {color}
        </Badge>
      </Tooltip>
    ));
  };

  return (
    <Box
      data-testid={`player-info-${player.id}`}
      bg={getBgColor()}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={getBorderColor()}
      p={4}
      boxShadow="md"
      width="100%"
      position="relative"
    >
      {isActivePlayer && (
        <Badge
          position="absolute"
          top="-2"
          right="-2"
          colorScheme="green"
          variant="solid"
          borderRadius="full"
          px={2}
        >
          Active
        </Badge>
      )}

      {isCurrentPlayer && (
        <Badge
          position="absolute"
          top="-2"
          left="-2"
          colorScheme="blue"
          variant="solid"
          borderRadius="full"
          px={2}
        >
          You
        </Badge>
      )}

      <Flex direction="column" gap={3}>
        <HStack spacing={4}>
          <Avatar
            name={player.name}
            src={player.avatarUrl}
            size="md"
            bg={`${player.colorIdentity[0]?.toLowerCase() || 'gray'}.500`}
          />
          <VStack align="start" spacing={0}>
            <Text fontWeight="bold" fontSize="lg" color={nameColor}>
              {player.name}
            </Text>
            <HStack spacing={1}>{getColorIdentityBadges()}</HStack>
          </VStack>
        </HStack>

        <StatGroup
          bg={statBgColor}
          p={2}
          borderRadius="md"
          textAlign="center"
        >
          <Stat>
            <StatLabel fontSize="xs">Life</StatLabel>
            <StatNumber>{player.life}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="xs">Hand</StatLabel>
            <StatNumber>{player.hand.length}</StatNumber>
          </Stat>
          <Stat>
            <StatLabel fontSize="xs">Library</StatLabel>
            <StatNumber>{player.library.length}</StatNumber>
          </Stat>
        </StatGroup>

        {player.commander && (
          <Box>
            <Text fontSize="sm" fontWeight="medium" mb={1}>
              Commander
            </Text>
            <Text fontSize="sm">{player.commander.name}</Text>
          </Box>
        )}
      </Flex>
    </Box>
  );
};

export default ChakraPlayerInfo; 