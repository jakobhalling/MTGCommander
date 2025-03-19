import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchDecks, deleteDeck, fetchDeckById } from '../../store/slices/deckSlice';
import { useNavigate } from 'react-router-dom';
import DeckList from '../../components/DeckManagement/DeckList';

const DeckListPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { decks, loading, error } = useAppSelector(state => state.decks);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [deckToDelete, setDeckToDelete] = React.useState<number | null>(null);
  const [useMockData, setUseMockData] = React.useState(false);

  useEffect(() => {
    // Try to fetch decks from the backend
    dispatch(fetchDecks())
      .unwrap()
      .catch(() => {
        // If fetching fails, use mock data
        setUseMockData(true);
      });
  }, [dispatch]);

  const handleViewDeck = (deckId: number) => {
    if (useMockData) {
      navigate(`/decks/${deckId}`);
    } else {
      dispatch(fetchDeckById(deckId));
      navigate(`/decks/${deckId}`);
    }
  };

  const handleEditDeck = (deckId: number) => {
    navigate(`/decks/${deckId}/edit`);
  };

  const openDeleteModal = (deckId: number) => {
    setDeckToDelete(deckId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setDeckToDelete(null);
  };

  const confirmDelete = async () => {
    if (deckToDelete !== null) {
      if (!useMockData) {
        await dispatch(deleteDeck(deckToDelete));
      }
      closeDeleteModal();
    }
  };

  const handleCreateDeck = () => {
    navigate('/decks/create');
  };

  const handleImportDeck = () => {
    navigate('/decks/import');
  };

  return (
    <DeckList
      decks={decks}
      loading={loading}
      error={error}
      useMockData={useMockData}
      onViewDeck={handleViewDeck}
      onEditDeck={handleEditDeck}
      onDeleteDeck={openDeleteModal}
      onCreateDeck={handleCreateDeck}
      onImportDeck={handleImportDeck}
      deleteModalOpen={deleteModalOpen}
      onCloseDeleteModal={closeDeleteModal}
      onConfirmDelete={confirmDelete}
    />
  );
};

export default DeckListPage;
