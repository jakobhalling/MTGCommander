import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  createAction, 
  executeAction, 
  ActionType,
  MoveCardAction,
  TapCardAction
} from '../actions/actionSystem';
import { selectAllZones, selectCardById } from '../store/game/selectors';
import { RootState } from '../store';
import { CardState, ZoneState } from '../types/game/GameState';

interface ActionPanelProps {
  playerId: string;
}

// Mock data for when no game state is available
const mockZones: ZoneState[] = [
  {
    id: 'hand-1',
    type: 'hand',
    cards: ['card-1', 'card-2', 'card-3'],
    ownerId: 'player1'
  },
  {
    id: 'battlefield-1',
    type: 'battlefield',
    cards: ['card-4', 'card-5'],
    ownerId: 'player1'
  },
  {
    id: 'graveyard-1',
    type: 'graveyard',
    cards: ['card-6'],
    ownerId: 'player1'
  },
  {
    id: 'exile-1',
    type: 'exile',
    cards: [],
    ownerId: 'player1'
  },
  {
    id: 'command-1',
    type: 'command',
    cards: ['card-7'],
    ownerId: 'player1'
  }
];

const mockCards: Record<string, CardState> = {
  'card-1': {
    id: 'card-1',
    name: 'Creature Card 1',
    types: ['Creature'],
    currentZone: 'hand-1',
    ownerId: 'player1',
    isTapped: false,
    counters: {},
    attachments: []
  },
  'card-2': {
    id: 'card-2',
    name: 'Instant Card 2',
    types: ['Instant'],
    currentZone: 'hand-1',
    ownerId: 'player1',
    isTapped: false,
    counters: {},
    attachments: []
  },
  'card-3': {
    id: 'card-3',
    name: 'Sorcery Card 3',
    types: ['Sorcery'],
    currentZone: 'hand-1',
    ownerId: 'player1',
    isTapped: false,
    counters: {},
    attachments: []
  },
  'card-4': {
    id: 'card-4',
    name: 'Creature Card 4',
    types: ['Creature'],
    currentZone: 'battlefield-1',
    ownerId: 'player1',
    isTapped: false,
    counters: {},
    attachments: []
  },
  'card-5': {
    id: 'card-5',
    name: 'Artifact Card 5',
    types: ['Artifact'],
    currentZone: 'battlefield-1',
    ownerId: 'player1',
    isTapped: true,
    counters: { 'charge': 2 },
    attachments: []
  },
  'card-6': {
    id: 'card-6',
    name: 'Creature Card 6',
    types: ['Creature'],
    currentZone: 'graveyard-1',
    ownerId: 'player1',
    isTapped: false,
    counters: {},
    attachments: []
  },
  'card-7': {
    id: 'card-7',
    name: 'Commander Card 7',
    types: ['Creature', 'Legendary'],
    currentZone: 'command-1',
    ownerId: 'player1',
    isTapped: false,
    counters: {},
    attachments: []
  }
};

const ActionPanel: React.FC<ActionPanelProps> = ({ playerId }) => {
  const dispatch = useDispatch();
  const storeZones = useSelector(selectAllZones) || [];
  const [zones, setZones] = useState<ZoneState[]>([]);
  const [selectedCard, setSelectedCard] = useState<string>('');
  const [sourceZone, setSourceZone] = useState<string>('');
  const [targetZone, setTargetZone] = useState<string>('');
  const [actionResult, setActionResult] = useState<string>('');
  const [useMockData, setUseMockData] = useState<boolean>(false);
  
  // Use mock data if no zones are available in the store
  useEffect(() => {
    const playerZonesFromStore = storeZones.filter(zone => zone.ownerId === playerId);
    if (playerZonesFromStore.length === 0) {
      setZones(mockZones);
      setUseMockData(true);
    } else {
      setZones(storeZones);
      setUseMockData(false);
    }
  }, [storeZones, playerId]);
  
  // Get card details if a card is selected
  const storeCardDetails = useSelector((state: RootState) => 
    selectedCard ? selectCardById(selectedCard)(state) : null
  );
  
  // Use mock card data if using mock zones
  const cardDetails = useMockData && selectedCard ? mockCards[selectedCard] : storeCardDetails;

  // Filter zones by player
  const playerZones = zones.filter(zone => zone.ownerId === playerId);
  
  // Handle card selection
  const handleCardSelect = (cardId: string, zoneId: string) => {
    setSelectedCard(cardId);
    setSourceZone(zoneId);
  };
  
  // Execute move card action
  const handleMoveCard = () => {
    if (!selectedCard || !sourceZone || !targetZone) {
      setActionResult('Please select a card, source zone, and target zone');
      return;
    }
    
    const moveAction = createAction<MoveCardAction>({
      type: ActionType.MOVE_CARD,
      cardId: selectedCard,
      sourceZoneId: sourceZone,
      targetZoneId: targetZone,
      playerId
    });
    
    if (useMockData) {
      // Simulate action execution with mock data
      // Remove card from source zone
      const sourceZoneIndex = zones.findIndex(zone => zone.id === sourceZone);
      if (sourceZoneIndex !== -1) {
        const updatedZones = [...zones];
        updatedZones[sourceZoneIndex] = {
          ...updatedZones[sourceZoneIndex],
          cards: updatedZones[sourceZoneIndex].cards.filter(id => id !== selectedCard)
        };
        
        // Add card to target zone
        const targetZoneIndex = zones.findIndex(zone => zone.id === targetZone);
        if (targetZoneIndex !== -1) {
          updatedZones[targetZoneIndex] = {
            ...updatedZones[targetZoneIndex],
            cards: [...updatedZones[targetZoneIndex].cards, selectedCard]
          };
          
          // Update mock card location
          if (mockCards[selectedCard]) {
            mockCards[selectedCard] = {
              ...mockCards[selectedCard],
              currentZone: targetZone
            };
          }
          
          setZones(updatedZones);
          setActionResult(`Successfully moved card ${selectedCard} from ${sourceZone} to ${targetZone}`);
        }
      }
    } else {
      // Use real Redux store for action execution
      const state = (window as any).__REDUX_DEVTOOLS_EXTENSION__ ? 
        (window as any).__REDUX_DEVTOOLS_EXTENSION__.getState() : 
        { game: { currentGame: null } };
      
      const result = executeAction(moveAction, { 
        dispatch, 
        getState: () => state
      } as any);
      
      setActionResult(result.success 
        ? `Successfully moved card ${selectedCard} from ${sourceZone} to ${targetZone}` 
        : `Failed to move card: ${result.errors.join(', ')}`
      );
    }
  };
  
  // Execute tap card action
  const handleTapCard = () => {
    if (!selectedCard) {
      setActionResult('Please select a card');
      return;
    }
    
    const tapAction = createAction<TapCardAction>({
      type: ActionType.TAP_CARD,
      cardId: selectedCard,
      playerId
    });
    
    if (useMockData) {
      // Simulate action execution with mock data
      if (mockCards[selectedCard]) {
        mockCards[selectedCard] = {
          ...mockCards[selectedCard],
          isTapped: !mockCards[selectedCard].isTapped
        };
        
        // Force re-render
        setZones([...zones]);
        setActionResult(`Successfully ${mockCards[selectedCard].isTapped ? 'tapped' : 'untapped'} card ${selectedCard}`);
      }
    } else {
      // Use real Redux store for action execution
      const state = (window as any).__REDUX_DEVTOOLS_EXTENSION__ ? 
        (window as any).__REDUX_DEVTOOLS_EXTENSION__.getState() : 
        { game: { currentGame: null } };
      
      const result = executeAction(tapAction, { 
        dispatch, 
        getState: () => state
      } as any);
      
      setActionResult(result.success 
        ? `Successfully tapped card ${selectedCard}` 
        : `Failed to tap card: ${result.errors.join(', ')}`
      );
    }
  };
  
  // If there are no zones, show a message
  if (playerZones.length === 0) {
    return (
      <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Action System Demo</h2>
        <p className="text-white">No zones found for player {playerId}. Please ensure the game state is properly initialized.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Action System Demo</h2>
      
      {useMockData && (
        <div className="bg-blue-700 text-white p-2 mb-4 rounded">
          Using mock data for demonstration purposes
        </div>
      )}
      
      {/* Card Selection */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">Select a Card</h3>
        <div className="grid grid-cols-2 gap-2">
          {playerZones.map(zone => (
            <div key={zone.id} className="bg-gray-700 p-2 rounded">
              <h4 className="text-white font-medium">{zone.type}</h4>
              <ul className="mt-2">
                {zone.cards.map(card => {
                  // Handle both string IDs and card objects
                  const cardId = typeof card === 'string' ? card : (card as unknown as CardState).id;
                  const cardName = useMockData && typeof card === 'string' ? 
                    (mockCards[card]?.name || card) : 
                    (typeof card === 'string' ? card : (card as unknown as CardState).name);
                  
                  return (
                    <li 
                      key={cardId}
                      className={`cursor-pointer p-1 rounded ${selectedCard === cardId ? 'bg-blue-600' : 'bg-gray-600'}`}
                      onClick={() => handleCardSelect(cardId, zone.id)}
                    >
                      {cardName}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
      
      {/* Card Details */}
      {cardDetails && (
        <div className="mb-4 bg-gray-700 p-3 rounded">
          <h3 className="text-lg font-semibold text-white mb-2">Selected Card</h3>
          <p className="text-white">ID: {cardDetails.id}</p>
          <p className="text-white">Name: {cardDetails.name}</p>
          <p className="text-white">Zone: {cardDetails.currentZone}</p>
          <p className="text-white">Tapped: {cardDetails.isTapped ? 'Yes' : 'No'}</p>
          <p className="text-white">Types: {cardDetails.types.join(', ')}</p>
          {Object.keys(cardDetails.counters).length > 0 && (
            <div className="mt-2">
              <p className="text-white font-medium">Counters:</p>
              <ul className="pl-4">
                {Object.entries(cardDetails.counters).map(([type, count]) => (
                  <li key={type} className="text-white">
                    {type}: {count}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      
      {/* Action Controls */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">Actions</h3>
        
        {/* Move Card Action */}
        <div className="mb-3 bg-gray-700 p-3 rounded">
          <h4 className="text-white font-medium mb-2">Move Card</h4>
          <div className="flex flex-col space-y-2">
            <select 
              className="bg-gray-600 text-white p-2 rounded"
              value={targetZone}
              onChange={(e) => setTargetZone(e.target.value)}
            >
              <option value="">Select Target Zone</option>
              {playerZones.map(zone => (
                <option key={zone.id} value={zone.id}>
                  {zone.type} ({zone.id})
                </option>
              ))}
            </select>
            <button 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleMoveCard}
              disabled={!selectedCard || !sourceZone || !targetZone}
            >
              Move Card
            </button>
          </div>
        </div>
        
        {/* Tap Card Action */}
        <div className="bg-gray-700 p-3 rounded">
          <h4 className="text-white font-medium mb-2">Tap Card</h4>
          <button 
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleTapCard}
            disabled={!selectedCard}
          >
            {cardDetails?.isTapped ? 'Untap' : 'Tap'} Card
          </button>
        </div>
      </div>
      
      {/* Action Result */}
      {actionResult && (
        <div className="bg-gray-700 p-3 rounded">
          <h3 className="text-lg font-semibold text-white mb-2">Result</h3>
          <p className="text-white">{actionResult}</p>
        </div>
      )}
    </div>
  );
};

export default ActionPanel; 