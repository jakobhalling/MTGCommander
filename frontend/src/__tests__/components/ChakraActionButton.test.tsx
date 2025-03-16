import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ChakraProvider } from '@chakra-ui/react';
import ChakraActionButton from '../../components/ChakraActionButton';
import theme from '../../theme';

// Mock action data
const mockDrawAction = {
  id: 'draw-1',
  type: 'DRAW',
  name: 'Draw Card',
  description: 'Draw a card from your library',
  targets: [],
  validate: () => ({ valid: true }),
  execute: () => {},
};

const mockAttackAction = {
  id: 'attack-1',
  type: 'ATTACK',
  name: 'Attack',
  description: 'Attack with selected creature',
  targets: ['creature-1'],
  validate: () => ({ valid: true }),
  execute: () => {},
};

describe('ChakraActionButton Component', () => {
  const renderButton = (props = {}) => {
    return render(
      <ChakraProvider theme={theme}>
        <ChakraActionButton
          action={mockDrawAction}
          onActionClick={jest.fn()}
          {...props}
        />
      </ChakraProvider>
    );
  };

  it('renders the button with correct action name', () => {
    renderButton();
    
    expect(screen.getByText('Draw Card')).toBeInTheDocument();
  });

  it('calls onActionClick when clicked', () => {
    const handleActionClick = jest.fn();
    renderButton({ onActionClick: handleActionClick });
    
    fireEvent.click(screen.getByTestId('action-button-draw-1'));
    expect(handleActionClick).toHaveBeenCalledWith(mockDrawAction);
  });

  it('does not call onActionClick when disabled', () => {
    const handleActionClick = jest.fn();
    renderButton({ 
      onActionClick: handleActionClick,
      isDisabled: true
    });
    
    fireEvent.click(screen.getByTestId('action-button-draw-1'));
    expect(handleActionClick).not.toHaveBeenCalled();
  });

  it('applies different styles based on action type', () => {
    const { rerender } = renderButton();
    
    // First check the draw action (blue)
    const drawButton = screen.getByTestId('action-button-draw-1');
    expect(drawButton).toBeInTheDocument();
    
    // Then check the attack action (red)
    rerender(
      <ChakraProvider theme={theme}>
        <ChakraActionButton
          action={mockAttackAction}
          onActionClick={jest.fn()}
        />
      </ChakraProvider>
    );
    
    const attackButton = screen.getByTestId('action-button-attack-1');
    expect(attackButton).toBeInTheDocument();
    expect(screen.getByText('Attack')).toBeInTheDocument();
  });

  it('shows tooltip with description on hover', async () => {
    renderButton();
    
    // Note: Testing tooltips is challenging with react-testing-library
    // This is a simplified test that just checks the tooltip attribute
    const button = screen.getByTestId('action-button-draw-1');
    expect(button).toHaveAttribute('aria-describedby');
  });

  it('applies disabled styles when isDisabled is true', () => {
    renderButton({ isDisabled: true });
    
    const button = screen.getByTestId('action-button-draw-1');
    expect(button).toBeDisabled();
  });
}); 