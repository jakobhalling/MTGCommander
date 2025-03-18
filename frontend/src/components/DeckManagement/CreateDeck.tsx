import React, { useState } from 'react';
import {
  Button,
  TextInput,
  Form,
  Stack,
  InlineLoading,
  Modal,
  ModalBody
} from '@carbon/react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { createDeck } from '../../store/slices/deckSlice';
import { useNavigate } from 'react-router-dom';

const CreateDeck: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector(state => state.decks);
  
  const [deckName, setDeckName] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [createdDeckId, setCreatedDeckId] = useState<number | null>(null);
  
  const handleCreate = async () => {
    if (!deckName.trim()) {
      return;
    }
    
    try {
      const resultAction = await dispatch(createDeck(deckName));
      if (createDeck.fulfilled.match(resultAction)) {
        setCreatedDeckId(resultAction.payload.id);
        setIsModalOpen(true);
      }
    } catch (err) {
      console.error('Failed to create deck:', err);
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    if (createdDeckId) {
      navigate(`/decks/${createdDeckId}`);
    } else {
      navigate('/decks');
    }
  };
  
  return (
    <div className="create-deck">
      <h2>Create New Deck</h2>
      
      <Form onSubmit={e => { e.preventDefault(); handleCreate(); }}>
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
                  onClick={() => navigate('/decks')} 
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
        onRequestClose={closeModal}
        modalHeading="Deck Created"
        primaryButtonText="Go to Deck"
        onRequestSubmit={closeModal}
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
