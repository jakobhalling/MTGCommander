import React, { useEffect } from 'react';
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Button,
  InlineLoading,
  Modal,
  ModalBody
} from '@carbon/react';
import { TrashCan, Edit } from '@carbon/icons-react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchDecks, deleteDeck, fetchDeckById } from '../../store/slices/deckSlice';
import { useNavigate } from 'react-router-dom';

const DeckList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { decks, loading, error } = useAppSelector(state => state.decks);
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [deckToDelete, setDeckToDelete] = React.useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchDecks());
  }, [dispatch]);

  const handleViewDeck = (deckId: number) => {
    dispatch(fetchDeckById(deckId));
    navigate(`/decks/${deckId}`);
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
      await dispatch(deleteDeck(deckToDelete));
      closeDeleteModal();
    }
  };

  const headers = [
    { key: 'name', header: 'Deck Name' },
    { key: 'commander', header: 'Commander' },
    { key: 'cardCount', header: 'Card Count' },
    { key: 'createdAt', header: 'Created' },
    { key: 'actions', header: 'Actions' },
  ];

  // Add safety check to ensure decks is an array before mapping
  const deckArray = Array.isArray(decks) ? decks : [];
  
  const rows = deckArray.map(deck => ({
    id: deck.id.toString(),
    name: deck.name,
    commander: deck.commander?.name || 'No Commander',
    cardCount: deck.cards.length,
    createdAt: new Date(deck.createdAt).toLocaleDateString(),
    actions: (
      <div className="deck-actions">
        <Button kind="ghost" size="sm" onClick={() => handleViewDeck(deck.id)}>
          View
        </Button>
        <Button kind="ghost" size="sm" onClick={() => handleEditDeck(deck.id)}>
          <Edit size={16} />
        </Button>
        <Button kind="danger--ghost" size="sm" onClick={() => openDeleteModal(deck.id)}>
          <TrashCan size={16} />
        </Button>
      </div>
    ),
  }));

  if (loading) {
    return <InlineLoading description="Loading decks..." />;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="deck-list">
      <div className="deck-list-header">
        <h2>My Decks</h2>
        <Button onClick={() => navigate('/decks/import')}>Import New Deck</Button>
      </div>

      {deckArray.length === 0 ? (
        <div className="no-decks">
          <p>You don't have any decks yet. Import a deck to get started.</p>
          <Button onClick={() => navigate('/decks/import')}>Import Deck</Button>
        </div>
      ) : (
        <DataTable rows={rows} headers={headers}>
          {({ rows, headers, getHeaderProps, getTableProps }) => (
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map(header => (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  <TableRow key={row.id}>
                    {row.cells.map(cell => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DataTable>
      )}

      <Modal
        open={deleteModalOpen}
        onRequestClose={closeDeleteModal}
        modalHeading="Delete Deck"
        danger
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        onRequestSubmit={confirmDelete}
        onSecondarySubmit={closeDeleteModal}
      >
        <ModalBody>
          <p>Are you sure you want to delete this deck? This action cannot be undone.</p>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default DeckList;
