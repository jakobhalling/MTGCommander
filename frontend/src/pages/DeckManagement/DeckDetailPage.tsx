import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { 
  fetchDeckById, 
  updateDeck, 
  removeCardFromDeck, 
  setCommander
} from '../../store/slices/deckSlice';
import DeckDetail from '../../components/DeckManagement/DeckDetail';

const DeckDetailPage: React.FC = () => {
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
      // Use environment variable for API URL if available
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      dispatch(fetchDeckById({ id: deckId, apiUrl }));
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
      // Use environment variable for API URL if available
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      await dispatch(updateDeck({ 
        id: currentDeck.id, 
        name: newDeckName,
        apiUrl
      }));
      setIsEditNameModalOpen(false);
    }
  };

  const handleRemoveCard = async (cardId: number) => {
    if (confirm('Are you sure you want to remove this card from the deck?')) {
      // Use environment variable for API URL if available
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      await dispatch(removeCardFromDeck({ 
        deckId, 
        cardId,
        apiUrl
      }));
    }
  };

  const openSetCommanderModal = () => {
    setSelectedCommanderId(currentDeck?.commanderId || null);
    setIsSetCommanderModalOpen(true);
  };

  const handleSetCommander = async () => {
    if (selectedCommanderId !== null && currentDeck) {
      // Use environment variable for API URL if available
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
      await dispatch(setCommander({ 
        deckId: currentDeck.id, 
        cardId: selectedCommanderId,
        apiUrl
      }));
      await dispatch(fetchDeckById({ id: deckId, apiUrl })); // Refresh deck data
      setIsSetCommanderModalOpen(false);
    }
  };

  const handleBackToDeckList = () => {
    navigate('/decks');
  };

  const handleCloseEditNameModal = () => {
    setIsEditNameModalOpen(false);
  };

  const handleCloseSetCommanderModal = () => {
    setIsSetCommanderModalOpen(false);
  };

  return (
    <DeckDetail
      deck={currentDeck}
      loading={loading}
      error={error}
      onEditName={handleEditName}
      onSaveName={handleSaveName}
      onRemoveCard={handleRemoveCard}
      onSetCommander={handleSetCommander}
      onBackToDeckList={handleBackToDeckList}
      isEditNameModalOpen={isEditNameModalOpen}
      isSetCommanderModalOpen={isSetCommanderModalOpen}
      newDeckName={newDeckName}
      selectedCommanderId={selectedCommanderId}
      onCloseEditNameModal={handleCloseEditNameModal}
      onCloseSetCommanderModal={handleCloseSetCommanderModal}
      onNewDeckNameChange={setNewDeckName}
      onSelectedCommanderChange={setSelectedCommanderId}
    />
  );
};

export default DeckDetailPage;
