import React, { useState } from 'react';
import { 
  Box, 
  Heading, 
  VStack, 
  HStack, 
  Flex, 
  Text, 
  Divider, 
  useColorModeValue,
  Badge
} from '@chakra-ui/react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAvailableActions, selectGamePhase } from '../store/game/selectors';
import { executeAction } from '../store/game/actions';
import { Action } from '../types/actions';
import ChakraActionButton from './ChakraActionButton';

const ChakraActionPanel: React.FC = () => {
  const dispatch = useDispatch();
  const availableActions = useSelector(selectAvailableActions);
  const currentPhase = useSelector(selectGamePhase);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('gray.800', 'white');
  const phaseColor = useColorModeValue('blue.500', 'blue.300');

  const handleActionClick = (action: Action) => {
    setSelectedAction(action);
    dispatch(executeAction(action));
  };

  // Group actions by type for better organization
  const groupedActions = availableActions.reduce<Record<string, Action[]>>((acc, action) => {
    const type = action.type;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(action);
    return acc;
  }, {});

  return (
    <Box
      data-testid="action-panel"
      bg={bgColor}
      borderRadius="lg"
      borderWidth="1px"
      borderColor={borderColor}
      p={4}
      boxShadow="md"
      width="100%"
    >
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between" align="center">
          <Heading as="h2" size="md" color={headingColor}>
            Actions
          </Heading>
          <Badge colorScheme="blue" fontSize="sm" px={2} py={1} borderRadius="md">
            Phase: {currentPhase}
          </Badge>
        </HStack>
        
        <Divider />
        
        {Object.entries(groupedActions).length > 0 ? (
          Object.entries(groupedActions).map(([type, actions]) => (
            <Box key={type}>
              <Text fontWeight="semibold" mb={2} color={headingColor}>
                {type.charAt(0) + type.slice(1).toLowerCase()} Actions
              </Text>
              <Flex wrap="wrap" gap={2}>
                {actions.map((action) => (
                  <ChakraActionButton
                    key={action.id}
                    action={action}
                    onActionClick={handleActionClick}
                  />
                ))}
              </Flex>
            </Box>
          ))
        ) : (
          <Text color="gray.500" textAlign="center" py={4}>
            No actions available in this phase
          </Text>
        )}
        
        {selectedAction && (
          <Box mt={2}>
            <Divider mb={2} />
            <Text fontSize="sm" fontWeight="medium">
              Last action: {selectedAction.name}
            </Text>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default ChakraActionPanel; 