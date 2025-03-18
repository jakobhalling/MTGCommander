import React, { useState } from 'react';
import {
  Button,
  TextArea,
  TextInput,
  Form,
  Stack,
  InlineLoading,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter
} from '@carbon/react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { importDeck, resetImportStatus } from '../../store/slices/deckSlice';

const DeckImport: React.FC = () => {
  const dispatch = useAppDispatch();
  const { importStatus, error } = useAppSelector(state => state.decks);
  
  const [deckName, setDeckName] = useState('');
  const [deckText, setDeckText] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleImport = async () => {
    if (!deckName.trim() || !deckText.trim()) {
      return;
    }
    
    await dispatch(importDeck({ name: deckName, deckText }));
    
    if (importStatus === 'succeeded') {
      setDeckName('');
      setDeckText('');
      setIsModalOpen(true);
    }
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    dispatch(resetImportStatus());
  };
  
  return (
    <div className="deck-import">
      <h2>Import Deck</h2>
      <Form onSubmit={e => { e.preventDefault(); handleImport(); }}>
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
            value={deckText}
            onChange={e => setDeckText(e.target.value)}
            rows={15}
            required
          />
          
          <div>
            {importStatus === 'loading' ? (
              <InlineLoading description="Importing deck..." />
            ) : (
              <Button type="submit" disabled={importStatus === 'loading'}>
                Import Deck
              </Button>
            )}
            
            {importStatus === 'failed' && (
              <div className="error-message">
                {error || 'Failed to import deck. Please check your input and try again.'}
              </div>
            )}
          </div>
        </Stack>
      </Form>
      
      <Modal
        open={isModalOpen}
        onRequestClose={closeModal}
        modalHeading="Deck Imported"
        primaryButtonText="OK"
        onRequestSubmit={closeModal}
      >
        <ModalBody>
          <p>Your deck has been successfully imported.</p>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default DeckImport;
