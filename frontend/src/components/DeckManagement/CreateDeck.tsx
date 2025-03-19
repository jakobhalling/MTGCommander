import React from 'react';
import {
  Button,
  TextInput,
  Form,
  Stack,
  InlineLoading,
  Modal,
  ModalBody
} from '@carbon/react';

interface CreateDeckProps {
  deckName: string;
  setDeckName: (name: string) => void;
  loading: boolean;
  error: string | null;
  isModalOpen: boolean;
  onCreateDeck: () => void;
  onCancel: () => void;
  onCloseModal: () => void;
}

const CreateDeck: React.FC<CreateDeckProps> = ({
  deckName,
  setDeckName,
  loading,
  error,
  isModalOpen,
  onCreateDeck,
  onCancel,
  onCloseModal
}) => {
  return (
    <div className="create-deck">
      <h2>Create New Deck</h2>
      
      <Form onSubmit={e => { e.preventDefault(); onCreateDeck(); }}>
        <Stack gap={5}>
          <TextInput
            id="deck-name"
            labelText="Deck Name"
            placeholder="Enter a name for your new deck"
            value={deckName}
            onChange={e => setDeckName(e.target.value)}
            required
          />
          
          <div>
            {loading ? (
              <InlineLoading description="Creating deck..." />
            ) : (
              <>
                <Button type="submit" disabled={!deckName.trim()}>
                  Create Deck
                </Button>
                <Button 
                  kind="secondary" 
                  onClick={onCancel} 
                  style={{ marginLeft: '1rem' }}
                >
                  Cancel
                </Button>
              </>
            )}
            
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
          </div>
        </Stack>
      </Form>
      
      <Modal
        open={isModalOpen}
        onRequestClose={onCloseModal}
        modalHeading="Deck Created"
        primaryButtonText="Go to Deck"
        onRequestSubmit={onCloseModal}
      >
        <ModalBody>
          <p>Your new deck "{deckName}" has been successfully created.</p>
          <p>You can now add cards to your deck.</p>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default CreateDeck;
