import React from 'react';
import { Button, Tooltip, useColorModeValue } from '@chakra-ui/react';
import { Action } from '../types/actions';

export interface ChakraActionButtonProps {
  action: Action;
  onActionClick: (action: Action) => void;
  isDisabled?: boolean;
}

const ChakraActionButton: React.FC<ChakraActionButtonProps> = ({
  action,
  onActionClick,
  isDisabled = false,
}) => {
  // Determine button color based on action type
  const getColorScheme = () => {
    switch (action.type) {
      case 'DRAW':
        return 'blue';
      case 'PLAY':
        return 'green';
      case 'ATTACK':
        return 'red';
      case 'TAP':
        return 'orange';
      case 'UNTAP':
        return 'teal';
      default:
        return 'gray';
    }
  };

  const bgColor = useColorModeValue(`${getColorScheme()}.500`, `${getColorScheme()}.300`);
  const hoverBgColor = useColorModeValue(`${getColorScheme()}.600`, `${getColorScheme()}.400`);
  const textColor = useColorModeValue('white', 'gray.800');
  const disabledBgColor = useColorModeValue('gray.300', 'gray.600');
  const disabledTextColor = useColorModeValue('gray.500', 'gray.400');

  const handleClick = () => {
    if (!isDisabled) {
      onActionClick(action);
    }
  };

  return (
    <Tooltip 
      label={action.description || action.name} 
      placement="top"
      hasArrow
    >
      <Button
        data-testid={`action-button-${action.id}`}
        onClick={handleClick}
        isDisabled={isDisabled}
        size="md"
        px={4}
        py={2}
        borderRadius="md"
        fontWeight="semibold"
        bg={isDisabled ? disabledBgColor : bgColor}
        color={isDisabled ? disabledTextColor : textColor}
        _hover={{
          bg: isDisabled ? disabledBgColor : hoverBgColor,
        }}
        _active={{
          transform: 'scale(0.98)',
        }}
        transition="all 0.2s"
      >
        {action.name}
      </Button>
    </Tooltip>
  );
};

export default ChakraActionButton; 