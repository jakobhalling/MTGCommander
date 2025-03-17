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
import {
  Select,
  SelectItem,
  Button,
  Grid,
  Column,
  Tile,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Tag,
  Loading,
  InlineLoading
} from '@carbon/react';

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
    <Grid>
      <Column lg={16} md={8} sm={4}>
        {useMockData && (
          <Tag type="blue" className="mb-4">Using mock data for demonstration</Tag>
        )}
        
        {/* Card Selection */}
        <Tile className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Select a Card</h3>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Zone</TableHeader>
                <TableHeader>Cards</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {playerZones.map(zone => (
                <TableRow key={zone.id}>
                  <TableCell>{zone.type}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      {zone.cards.map(card => {
                        const cardId = typeof card === 'string' ? card : (card as CardState).id;
                        const cardName = useMockData && typeof card === 'string' ? 
                          (mockCards[card]?.name || card) : 
                          (typeof card === 'string' ? card : (card as CardState).name);
                        
                        return (
                          <Button
                            key={cardId}
                            kind={selectedCard === cardId ? 'primary' : 'ghost'}
                            size="sm"
                            onClick={() => handleCardSelect(cardId, zone.id)}
                          >
                            {cardName}
                          </Button>
                        );
                      })}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Tile>
        
        {/* Card Details */}
        {cardDetails && (
          <Tile className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Selected Card</h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>{cardDetails.id}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>{cardDetails.name}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Zone</TableCell>
                  <TableCell>{cardDetails.currentZone}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Status</TableCell>
                  <TableCell>
                    <Tag type={cardDetails.isTapped ? 'magenta' : 'green'}>
                      {cardDetails.isTapped ? 'Tapped' : 'Untapped'}
                    </Tag>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Types</TableCell>
                  <TableCell>
                    {cardDetails.types.map(type => (
                      <Tag key={type} type="blue" className="mr-1">
                        {type}
                      </Tag>
                    ))}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Tile>
        )}
        
        {/* Action Controls */}
        <Tile className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Actions</h3>
          
          {/* Move Card Action */}
          <div className="mb-4">
            <h4 className="font-medium mb-2">Move Card</h4>
            <Select 
              id="target-zone"
              labelText="Target Zone"
              value={targetZone}
              onChange={(e) => setTargetZone(e.target.value)}
            >
              <SelectItem value="" text="Select Target Zone" />
              {playerZones.map(zone => (
                <SelectItem 
                  key={zone.id} 
                  value={zone.id} 
                  text={`${zone.type} (${zone.id})`} 
                />
              ))}
            </Select>
            <Button 
              className="mt-2"
              onClick={handleMoveCard}
              disabled={!selectedCard || !sourceZone || !targetZone}
              kind="primary"
            >
              Move Card
            </Button>
          </div>
          
          {/* Tap Card Action */}
          <div>
            <h4 className="font-medium mb-2">Tap/Untap</h4>
            <Button 
              onClick={handleTapCard}
              disabled={!selectedCard}
              kind="secondary"
            >
              {cardDetails?.isTapped ? 'Untap' : 'Tap'} Card
            </Button>
          </div>
        </Tile>
        
        {/* Action Result */}
        {actionResult && (
          <Tile>
            <h3 className="text-lg font-semibold mb-2">Result</h3>
            {actionResult.includes('Successfully') ? (
              <InlineLoading 
                status="finished" 
                description={actionResult} 
              />
            ) : (
              <InlineLoading 
                status="error" 
                description={actionResult} 
              />
            )}
          </Tile>
        )}
      </Column>
    </Grid>
  );
};

export default ActionPanel;