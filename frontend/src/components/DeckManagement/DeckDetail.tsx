import React, { useEffect, useState } from 'react';
import {
  Button,
  Tile,
  Grid,
  Column,
  Tag,
  InlineLoading,
  Modal,
  TextInput,
  ModalBody,
  Dropdown
} from '@carbon/react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { 
  fetchDeckById, 
  updateDeck, 
  removeCardFromDeck, 
  setCommander,
  Card
} from '../../store/slices/deckSlice';

const DeckDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const deckId = parseInt(id || '0');
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentDeck, loading, error } = useAppSelector(state => state.decks);
  
  const [isEditNameModalOpen, setIsEditNameModalOpen] = useState(false);
  const [newDeckName, setNewDeckName] = useState('');
  const [isSetCommanderModalOpen, setIsSetCommanderModalOpen] = useState(false);
  const [selectedCommanderId, setSelectedCommanderId] = useState<number | null>(null);

  useEffect(() => {
    if (deckId) {
      dispatch(fetchDeckById(deckId));
    }
  }, [dispatch, deckId]);

  useEffect(() => {
    if (currentDeck) {
      setNewDeckName(currentDeck.name);
    }
  }, [currentDeck]);

  const handleEditName = () => {
    setIsEditNameModalOpen(true);
  };

  const handleSaveName = async () => {
    if (newDeckName.trim() && currentDeck) {
      await dispatch(updateDeck({ id: currentDeck.id, name: newDeckName }));
      setIsEditNameModalOpen(false);
    }
  };

  const handleRemoveCard = async (cardId: number) => {
    if (confirm('Are you sure you want to remove this card from the deck?')) {
      await dispatch(removeCardFromDeck({ deckId, cardId }));
    }
  };

  const openSetCommanderModal = () => {
    setSelectedCommanderId(currentDeck?.commanderId || null);
    setIsSetCommanderModalOpen(true);
  };

  const handleSetCommander = async () => {
    if (selectedCommanderId !== null && currentDeck) {
      await dispatch(setCommander({ deckId: currentDeck.id, cardId: selectedCommanderId }));
      await dispatch(fetchDeckById(deckId)); // Refresh deck data
      setIsSetCommanderModalOpen(false);
    }
  };

  // Group cards by type
  const groupCardsByType = (cards: Card[]) => {
    const groups: Record<string, Card[]> = {};
    
    // Add safety check to ensure cards is an array
    const cardsArray = Array.isArray(cards) ? cards : [];
    
    cardsArray.forEach(card => {
      const type = card.type?.split(' ')[0] || 'Unknown';
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(card);
    });
    
    return groups;
  };

  if (loading) {
    return <InlineLoading description="Loading deck..." />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!currentDeck) {
    return <div>Deck not found</div>;
  }

  // Add safety check for cards array
  const cards = Array.isArray(currentDeck.cards) ? currentDeck.cards : [];
  const cardGroups = groupCardsByType(cards);

  return (
    <div className="deck-detail">
      <div className="deck-header">
        <h2>{currentDeck.name}</h2>
        <div className="deck-actions">
          <Button onClick={handleEditName}>Edit Name</Button>
          <Button onClick={openSetCommanderModal}>Set Commander</Button>
          <Button onClick={() => navigate('/decks')}>Back to Decks</Button>
        </div>
      </div>

      <div className="deck-info">
        <p>
          <strong>Commander:</strong> {currentDeck.commander?.name || 'No Commander Set'}
        </p>
        <p>
          <strong>Cards:</strong> {cards.length}
        </p>
        <p>
          <strong>Created:</strong> {new Date(currentDeck.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="commander-section">
        {currentDeck.commander && (
          <Tile className="commander-tile">
            <h3>Commander</h3>
            <div className="card-display">
              {currentDeck.commander.imageUrl ? (
                <img 
                  src={currentDeck.commander.imageUrl} 
                  alt={currentDeck.commander.name} 
                  className="card-image"
                />
              ) : (
                <div className="card-placeholder">
                  <h4>{currentDeck.commander.name}</h4>
                  <p>{currentDeck.commander.type}</p>
                  <p>{currentDeck.commander.text}</p>
                </div>
              )}
            </div>
          </Tile>
        )}
      </div>

      <h3>Cards</h3>
      <Grid>
        {Object.entries(cardGroups).map(([type, cards]) => (
          <Column sm={4} md={8} lg={16} key={type}>
            <Tile className="card-group">
              <h4>{type} ({cards.length})</h4>
              <div className="card-list">
                {cards.map(card => (
                  <div className="card-item" key={card.id}>
                    <div className="card-name">
                      {card.name}
                      {card.id === currentDeck.commanderId && (
                        <Tag type="blue">Commander</Tag>
                      )}
                    </div>
                    <Button 
                      kind="danger--ghost" 
                      size="sm" 
                      onClick={() => handleRemoveCard(card.id)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            </Tile>
          </Column>
        ))}
      </Grid>

      {/* Edit Name Modal */}
      <Modal
        open={isEditNameModalOpen}
        onRequestClose={() => setIsEditNameModalOpen(false)}
        modalHeading="Edit Deck Name"
        primaryButtonText="Save"
        secondaryButtonText="Cancel"
        onRequestSubmit={handleSaveName}
        onSecondarySubmit={() => setIsEditNameModalOpen(false)}
      >
        <ModalBody>
          <TextInput
            id="new-deck-name"
            labelText="Deck Name"
            value={newDeckName}
            onChange={e => setNewDeckName(e.target.value)}
          />
        </ModalBody>
      </Modal>

      {/* Set Commander Modal */}
      <Modal
        open={isSetCommanderModalOpen}
        onRequestClose={() => setIsSetCommanderModalOpen(false)}
        modalHeading="Set Commander"
        primaryButtonText="Set Commander"
        secondaryButtonText="Cancel"
        onRequestSubmit={handleSetCommander}
        onSecondarySubmit={() => setIsSetCommanderModalOpen(false)}
      >
        <ModalBody>
          <Dropdown
            id="commander-select"
            titleText="Select Commander"
            label="Select a card to be your commander"
            items={cards.map(card => ({ id: card.id.toString(), text: card.name }))}
            selectedItem={selectedCommanderId ? { id: selectedCommanderId.toString() } : undefined}
            onChange={({ selectedItem }) => setSelectedCommanderId(selectedItem ? parseInt(selectedItem.id) : null)}
          />
        </ModalBody>
      </Modal>
    </div>
  );
};

export default DeckDetail;
