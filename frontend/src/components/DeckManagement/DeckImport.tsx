import React, { useState } from 'react';
import {
  Button,
  TextArea,
  TextInput,
  Form,
  Stack,
  InlineLoading,
  Modal,
  ModalBody,
  ModalFooter,
  Tile,
  Tag,
  Grid,
  Column
} from '@carbon/react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { importDeck, resetImportStatus } from '../../store/slices/deckSlice';
import { useNavigate } from 'react-router-dom';

// Interface for parsed card
interface ParsedCard {
  quantity: number;
  name: string;
  set?: string;
  isValid: boolean;
}

const DeckImport: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { importStatus, error } = useAppSelector(state => state.decks);
  
  const [deckName, setDeckName] = useState('');
  const [deckText, setDeckText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parsedCards, setParsedCards] = useState<ParsedCard[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  
  // Parse the deck text into card objects
  const parseCardList = (text: string): ParsedCard[] => {
    if (!text.trim()) return [];
    
    const lines = text.trim().split('\n');
    const parsedCards: ParsedCard[] = [];
    const errors: string[] = [];
    
    lines.forEach((line, index) => {
      line = line.trim();
      if (!line) return; // Skip empty lines
      
      // Skip comment lines
      if (line.startsWith('//') || line.startsWith('#')) return;
      
      // Match patterns:
      // 1. "2 Lightning Bolt" - quantity and name
      // 2. "2x Lightning Bolt" - quantity with 'x' and name
      // 3. "2 Lightning Bolt (M10)" - quantity, name, and set
      // 4. "Lightning Bolt" - just name (assume quantity 1)
      
      let match = line.match(/^(\d+)(?:x|\s+)(.+?)(?:\s+\(([^)]+)\))?$/i);
      
      if (!match) {
        // Try matching just the card name without quantity
        match = line.match(/^(.+?)(?:\s+\(([^)]+)\))?$/i);
        
        if (match) {
          // If just name, assume quantity 1
          parsedCards.push({
            quantity: 1,
            name: match[1].trim(),
            set: match[2]?.trim(),
            isValid: true
          });
        } else {
          errors.push(`Line ${index + 1}: "${line}" doesn't match expected format`);
          parsedCards.push({
            quantity: 0,
            name: line,
            isValid: false
          });
        }
      } else {
        // Full match with quantity
        parsedCards.push({
          quantity: parseInt(match[1]),
          name: match[2].trim(),
          set: match[3]?.trim(),
          isValid: true
        });
      }
    });
    
    if (errors.length > 0) {
      setParseError(errors.join('\n'));
    } else {
      setParseError(null);
    }
    
    return parsedCards;
  };
  
  // Preview the parsed deck
  const handlePreview = () => {
    if (!deckText.trim()) return;
    
    const cards = parseCardList(deckText);
    setParsedCards(cards);
    setIsPreviewMode(true);
  };
  
  // Import the deck
  const handleImport = async () => {
    if (!deckName.trim() || !deckText.trim()) {
      return;
    }
    
    await dispatch(importDeck({ name: deckName, deckText }));
    
    if (importStatus === 'succeeded') {
      setDeckName('');
      setDeckText('');
      setParsedCards([]);
      setIsPreviewMode(false);
      setIsModalOpen(true);
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    dispatch(resetImportStatus());
    navigate('/decks');
  };
  
  // Group cards by type for preview
  const groupCardsByType = (cards: ParsedCard[]) => {
    const groups: Record<string, ParsedCard[]> = {
      'Valid Cards': cards.filter(card => card.isValid),
      'Invalid Format': cards.filter(card => !card.isValid)
    };
    
    return groups;
  };
  
  const cardGroups = groupCardsByType(parsedCards);
  
  // Calculate total cards
  const totalCards = parsedCards.reduce((sum, card) => sum + (card.isValid ? card.quantity : 0), 0);
  const totalUniqueCards = parsedCards.filter(card => card.isValid).length;
  
  return (
    <div className="deck-import">
      <h2>Import Deck</h2>
      
      {!isPreviewMode ? (
        <Form onSubmit={e => { e.preventDefault(); handlePreview(); }}>
          <Stack gap={5}>
            <TextInput
              id="deck-name"
              labelText="Deck Name"
              placeholder="Enter deck name"
              value={deckName}
              onChange={e => setDeckName(e.target.value)}
              required
            />
            
            <TextArea
              id="deck-text"
              labelText="Deck List"
              placeholder="Enter deck list in format: 1 Card Name or 1 Card Name (set)"
              helperText="Examples: '2 Lightning Bolt', '1x Counterspell (7ED)', 'Sol Ring'"
              value={deckText}
              onChange={e => setDeckText(e.target.value)}
              rows={15}
              required
            />
            
            <div>
              <Button type="submit" disabled={!deckText.trim() || !deckName.trim()}>
                Preview Deck
              </Button>
              
              <Button kind="secondary" onClick={() => navigate('/decks')} style={{ marginLeft: '1rem' }}>
                Cancel
              </Button>
            </div>
          </Stack>
        </Form>
      ) : (
        <div className="deck-preview">
          <h3>Deck Preview: {deckName}</h3>
          
          <div className="deck-stats">
            <p>Total Cards: {totalCards}</p>
            <p>Unique Cards: {totalUniqueCards}</p>
          </div>
          
          {parseError && (
            <Tile className="error-tile">
              <h4>Warning: Some lines couldn't be parsed correctly</h4>
              <p>The following errors were found:</p>
              <pre>{parseError}</pre>
              <p>You can still import the deck, but invalid entries will be skipped.</p>
            </Tile>
          )}
          
          <Grid>
            {Object.entries(cardGroups).map(([type, cards]) => (
              cards.length > 0 && (
                <Column sm={4} md={8} lg={16} key={type}>
                  <Tile className="card-group">
                    <h4>{type} ({cards.length})</h4>
                    <div className="card-list">
                      {cards.map((card, index) => (
                        <div className="card-item" key={index}>
                          <div className="card-name">
                            {card.isValid ? (
                              <>
                                <span className="card-quantity">{card.quantity}x</span> {card.name}
                                {card.set && <Tag type="blue">{card.set}</Tag>}
                              </>
                            ) : (
                              <span className="invalid-card">{card.name}</span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Tile>
                </Column>
              )
            ))}
          </Grid>
          
          <div className="action-buttons" style={{ marginTop: '2rem' }}>
            {importStatus === 'loading' ? (
              <InlineLoading description="Importing deck..." />
            ) : (
              <>
                <Button onClick={handleImport} disabled={importStatus === 'loading' || totalCards === 0}>
                  Import Deck
                </Button>
                <Button kind="secondary" onClick={() => setIsPreviewMode(false)} style={{ marginLeft: '1rem' }}>
                  Back to Edit
                </Button>
              </>
            )}
            
            {importStatus === 'failed' && (
              <div className="error-message">
                {error || 'Failed to import deck. Please check your input and try again.'}
              </div>
            )}
          </div>
        </div>
      )}
      
      <Modal
        open={isModalOpen}
        onRequestClose={closeModal}
        modalHeading="Deck Imported"
        primaryButtonText="View My Decks"
        onRequestSubmit={closeModal}
      >
        <ModalBody>
          <p>Your deck "{deckName}" has been successfully imported with {totalCards} cards.</p>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default DeckImport;
