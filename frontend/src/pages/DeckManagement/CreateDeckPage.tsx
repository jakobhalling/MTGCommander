import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { createDeck } from '../../store/slices/deckSlice';
import { useNavigate } from 'react-router-dom';
import CreateDeck from '../../components/DeckManagement/CreateDeck';

const CreateDeckPage: React.FC = () => {
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
    
    // Use environment variable for API URL if available
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    
    try {
      const resultAction = await dispatch(createDeck({
        name: deckName,
        apiUrl
      }));
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
  
  const handleCancel = () => {
    navigate('/decks');
  };

  return (
    <CreateDeck
      deckName={deckName}
      setDeckName={setDeckName}
      loading={loading}
      error={error}
      isModalOpen={isModalOpen}
      onCreateDeck={handleCreate}
      onCancel={handleCancel}
      onCloseModal={closeModal}
    />
  );
};

export default CreateDeckPage;
