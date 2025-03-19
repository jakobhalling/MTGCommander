import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { importDeck, resetImportStatus } from '../../store/slices/deckSlice';
import { useNavigate } from 'react-router-dom';
import DeckImport, { ParsedCardProps } from '../../components/DeckManagement/DeckImport';

const DeckImportPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { importStatus, error } = useAppSelector(state => state.decks);
  
  const [deckName, setDeckName] = useState('');
  const [deckText, setDeckText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parsedCards, setParsedCards] = useState<ParsedCardProps[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [parseError, setParseError] = useState<string | null>(null);
  
  // Parse the deck text into card objects
  const parseCardList = (text: string): ParsedCardProps[] => {
    if (!text.trim()) return [];
    
    const lines = text.trim().split('\n');
    const parsedCards: ParsedCardProps[] = [];
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
    
    // Use environment variable for API URL if available
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    
    await dispatch(importDeck({ 
      name: deckName, 
      deckText,
      apiUrl
    }));
    
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
  
  const handleCancel = () => {
    navigate('/decks');
  };
  
  const handleBackToEdit = () => {
    setIsPreviewMode(false);
  };
  
  // Group cards by type for preview
  const groupCardsByType = (cards: ParsedCardProps[]) => {
    const groups: Record<string, ParsedCardProps[]> = {
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
    <DeckImport
      deckName={deckName}
      setDeckName={setDeckName}
      deckText={deckText}
      setDeckText={setDeckText}
      isPreviewMode={isPreviewMode}
      parsedCards={parsedCards}
      parseError={parseError}
      cardGroups={cardGroups}
      totalCards={totalCards}
      totalUniqueCards={totalUniqueCards}
      importStatus={importStatus}
      error={error}
      isModalOpen={isModalOpen}
      onPreview={handlePreview}
      onImport={handleImport}
      onCancel={handleCancel}
      onBackToEdit={handleBackToEdit}
      onCloseModal={closeModal}
    />
  );
};

export default DeckImportPage;
