import React from 'react';
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
import { Card } from '../../store/slices/deckSlice';

interface DeckDetailProps {
  deck: any;
  loading: boolean;
  error: string | null;
  onEditName: () => void;
  onSaveName: () => void;
  onRemoveCard: (cardId: number) => void;
  onSetCommander: () => void;
  onBackToDeckList: () => void;
  isEditNameModalOpen: boolean;
  isSetCommanderModalOpen: boolean;
  newDeckName: string;
  selectedCommanderId: number | null;
  onCloseEditNameModal: () => void;
  onCloseSetCommanderModal: () => void;
  onNewDeckNameChange: (name: string) => void;
  onSelectedCommanderChange: (commanderId: number | null) => void;
}

const DeckDetail: React.FC<DeckDetailProps> = ({
  deck,
  loading,
  error,
  onEditName,
  onSaveName,
  onRemoveCard,
  onSetCommander,
  onBackToDeckList,
  isEditNameModalOpen,
  isSetCommanderModalOpen,
  newDeckName,
  selectedCommanderId,
  onCloseEditNameModal,
  onCloseSetCommanderModal,
  onNewDeckNameChange,
  onSelectedCommanderChange
}) => {
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

  if (!deck) {
    return <div>Deck not found</div>;
  }

  // Add safety check for cards array
  const cards = Array.isArray(deck.cards) ? deck.cards : [];
  const cardGroups = groupCardsByType(cards);

  return (
    <div className="deck-detail">
      <div className="deck-header">
        <h2>{deck.name}</h2>
        <div className="deck-actions">
          <Button onClick={onEditName}>Edit Name</Button>
          <Button onClick={() => onSetCommander()}>Set Commander</Button>
          <Button onClick={onBackToDeckList}>Back to Decks</Button>
        </div>
      </div>

      <div className="deck-info">
        <p>
          <strong>Commander:</strong> {deck.commander?.name || 'No Commander Set'}
        </p>
        <p>
          <strong>Cards:</strong> {cards.length}
        </p>
        <p>
          <strong>Created:</strong> {new Date(deck.createdAt).toLocaleDateString()}
        </p>
      </div>

      <div className="commander-section">
        {deck.commander && (
          <Tile className="commander-tile">
            <h3>Commander</h3>
            <div className="card-display">
              {deck.commander.imageUrl ? (
                <img 
                  src={deck.commander.imageUrl} 
                  alt={deck.commander.name} 
                  className="card-image"
                />
              ) : (
                <div className="card-placeholder">
                  <h4>{deck.commander.name}</h4>
                  <p>{deck.commander.type}</p>
                  <p>{deck.commander.text}</p>
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
                      {card.id === deck.commanderId && (
                        <Tag type="blue">Commander</Tag>
                      )}
                    </div>
                    <Button 
                      kind="danger--ghost" 
                      size="sm" 
                      onClick={() => onRemoveCard(card.id)}
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
        onRequestClose={onCloseEditNameModal}
        modalHeading="Edit Deck Name"
        primaryButtonText="Save"
        secondaryButtonText="Cancel"
        onRequestSubmit={onSaveName}
        onSecondarySubmit={onCloseEditNameModal}
      >
        <ModalBody>
          <TextInput
            id="new-deck-name"
            labelText="Deck Name"
            value={newDeckName}
            onChange={e => onNewDeckNameChange(e.target.value)}
          />
        </ModalBody>
      </Modal>

      {/* Set Commander Modal */}
      <Modal
        open={isSetCommanderModalOpen}
        onRequestClose={onCloseSetCommanderModal}
        modalHeading="Set Commander"
        primaryButtonText="Set Commander"
        secondaryButtonText="Cancel"
        onRequestSubmit={onSetCommander}
        onSecondarySubmit={onCloseSetCommanderModal}
      >
        <ModalBody>
          <Dropdown
            id="commander-select"
            titleText="Select Commander"
            label="Select a card to be your commander"
            items={cards.map(card => ({ id: card.id.toString(), text: card.name }))}
            selectedItem={selectedCommanderId ? { id: selectedCommanderId.toString() } : undefined}
            onChange={({ selectedItem }) => onSelectedCommanderChange(selectedItem ? parseInt(selectedItem.id) : null)}
          />
        </ModalBody>
      </Modal>
    </div>
  );
};

export default DeckDetail;
