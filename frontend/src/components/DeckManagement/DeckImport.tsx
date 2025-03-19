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
  Tile,
  Tag,
  Grid,
  Column
} from '@carbon/react';

// Interface for parsed card
export interface ParsedCardProps {
  quantity: number;
  name: string;
  set?: string;
  isValid: boolean;
}

interface DeckImportProps {
  deckName: string;
  setDeckName: (name: string) => void;
  deckText: string;
  setDeckText: (text: string) => void;
  isPreviewMode: boolean;
  parsedCards: ParsedCardProps[];
  parseError: string | null;
  cardGroups: Record<string, ParsedCardProps[]>;
  totalCards: number;
  totalUniqueCards: number;
  importStatus: string;
  error: string | null;
  isModalOpen: boolean;
  onPreview: () => void;
  onImport: () => void;
  onCancel: () => void;
  onBackToEdit: () => void;
  onCloseModal: () => void;
}

const DeckImport: React.FC<DeckImportProps> = ({
  deckName,
  setDeckName,
  deckText,
  setDeckText,
  isPreviewMode,
  parsedCards,
  parseError,
  cardGroups,
  totalCards,
  totalUniqueCards,
  importStatus,
  error,
  isModalOpen,
  onPreview,
  onImport,
  onCancel,
  onBackToEdit,
  onCloseModal
}) => {
  return (
    <div className="deck-import">
      <h2>Import Deck</h2>
      
      {!isPreviewMode ? (
        <Form onSubmit={e => { e.preventDefault(); onPreview(); }}>
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
              
              <Button kind="secondary" onClick={onCancel} style={{ marginLeft: '1rem' }}>
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
                <Button onClick={onImport} disabled={importStatus === 'loading' || totalCards === 0}>
                  Import Deck
                </Button>
                <Button kind="secondary" onClick={onBackToEdit} style={{ marginLeft: '1rem' }}>
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
        onRequestClose={onCloseModal}
        modalHeading="Deck Imported"
        primaryButtonText="View My Decks"
        onRequestSubmit={onCloseModal}
      >
        <ModalBody>
          <p>Your deck "{deckName}" has been successfully imported with {totalCards} cards.</p>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default DeckImport;
