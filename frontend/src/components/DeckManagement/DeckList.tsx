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
  ModalBody,
  Tile
} from '@carbon/react';
import { TrashCan, Edit, Add } from '@carbon/icons-react';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import { fetchDecks, deleteDeck, fetchDeckById } from '../../store/slices/deckSlice';
import { useNavigate } from 'react-router-dom';

// Mock data for decks when no backend is available
const mockDecks = [
  {
    id: 1,
    name: "Atraxa Superfriends",
    commanderId: 101,
    commander: {
      id: 101,
      name: "Atraxa, Praetors' Voice",
      scryfallId: "d0d33d7d-b3d0-48c5-9f1f-97f4f3e58d46",
      imageUrl: "https://cards.scryfall.io/normal/front/d/0/d0d33d7d-b3d0-48c5-9f1f-97f4f3e58d46.jpg",
      manaCost: "{G}{W}{U}{B}",
      type: "Legendary Creature — Angel Horror",
      text: "Flying, vigilance, deathtouch, lifelink\nAt the beginning of your end step, proliferate.",
      power: "4",
      toughness: "4",
      isCommander: true
    },
    cards: [
      {
        id: 101,
        name: "Atraxa, Praetors' Voice",
        scryfallId: "d0d33d7d-b3d0-48c5-9f1f-97f4f3e58d46",
        imageUrl: "https://cards.scryfall.io/normal/front/d/0/d0d33d7d-b3d0-48c5-9f1f-97f4f3e58d46.jpg",
        manaCost: "{G}{W}{U}{B}",
        type: "Legendary Creature — Angel Horror",
        text: "Flying, vigilance, deathtouch, lifelink\nAt the beginning of your end step, proliferate.",
        power: "4",
        toughness: "4",
        isCommander: true
      },
      {
        id: 102,
        name: "Jace, the Mind Sculptor",
        scryfallId: "c057dc0d-4017-4e60-9c5e-45fc569a8d31",
        imageUrl: "https://cards.scryfall.io/normal/front/c/0/c057dc0d-4017-4e60-9c5e-45fc569a8d31.jpg",
        manaCost: "{2}{U}{U}",
        type: "Legendary Planeswalker — Jace",
        text: "+2: Look at the top card of target player's library. You may put that card on the bottom of that player's library.\n0: Draw three cards, then put two cards from your hand on top of your library in any order.\n−1: Return target creature to its owner's hand.\n−12: Exile all cards from target player's library, then that player shuffles their hand into their library.",
        loyalty: "3",
        isCommander: false
      },
      {
        id: 103,
        name: "Doubling Season",
        scryfallId: "8676d164-c76e-402b-a649-6ded3f549b6e",
        imageUrl: "https://cards.scryfall.io/normal/front/8/6/8676d164-c76e-402b-a649-6ded3f549b6e.jpg",
        manaCost: "{4}{G}",
        type: "Enchantment",
        text: "If an effect would create one or more tokens under your control, it creates twice that many of those tokens instead.\nIf an effect would put one or more counters on a permanent you control, it puts twice that many of those counters on that permanent instead.",
        isCommander: false
      }
    ],
    createdAt: "2025-03-15T12:00:00Z",
    updatedAt: "2025-03-17T14:30:00Z"
  },
  {
    id: 2,
    name: "Krenko Goblin Tribal",
    commanderId: 201,
    commander: {
      id: 201,
      name: "Krenko, Mob Boss",
      scryfallId: "cd9fec9d-23c8-4d35-97c1-9499527198fb",
      imageUrl: "https://cards.scryfall.io/normal/front/c/d/cd9fec9d-23c8-4d35-97c1-9499527198fb.jpg",
      manaCost: "{2}{R}{R}",
      type: "Legendary Creature — Goblin Warrior",
      text: "{T}: Create X 1/1 red Goblin creature tokens, where X is the number of Goblins you control.",
      power: "3",
      toughness: "3",
      isCommander: true
    },
    cards: [
      {
        id: 201,
        name: "Krenko, Mob Boss",
        scryfallId: "cd9fec9d-23c8-4d35-97c1-9499527198fb",
        imageUrl: "https://cards.scryfall.io/normal/front/c/d/cd9fec9d-23c8-4d35-97c1-9499527198fb.jpg",
        manaCost: "{2}{R}{R}",
        type: "Legendary Creature — Goblin Warrior",
        text: "{T}: Create X 1/1 red Goblin creature tokens, where X is the number of Goblins you control.",
        power: "3",
        toughness: "3",
        isCommander: true
      },
      {
        id: 202,
        name: "Goblin Chieftain",
        scryfallId: "8faa9d55-c4bd-4e7c-9f3c-90bc762b4abc",
        imageUrl: "https://cards.scryfall.io/normal/front/8/f/8faa9d55-c4bd-4e7c-9f3c-90bc762b4abc.jpg",
        manaCost: "{1}{R}{R}",
        type: "Creature — Goblin",
        text: "Haste\nOther Goblin creatures you control get +1/+1 and have haste.",
        power: "2",
        toughness: "2",
        isCommander: false
      },
      {
        id: 203,
        name: "Goblin Warchief",
        scryfallId: "5bac033c-dc6e-465c-8d0c-fe361fe8d258",
        imageUrl: "https://cards.scryfall.io/normal/front/5/b/5bac033c-dc6e-465c-8d0c-fe361fe8d258.jpg",
        manaCost: "{1}{R}{R}",
        type: "Creature — Goblin Warrior",
        text: "Goblin spells you cast cost {1} less to cast.\nGoblins you control have haste.",
        power: "2",
        toughness: "2",
        isCommander: false
      }
    ],
    createdAt: "2025-03-10T09:15:00Z",
    updatedAt: "2025-03-16T11:45:00Z"
  }
];

const DeckList: React.FC = () => {
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

  const headers = [
    { key: 'name', header: 'Deck Name' },
    { key: 'commander', header: 'Commander' },
    { key: 'cardCount', header: 'Card Count' },
    { key: 'createdAt', header: 'Created' },
    { key: 'actions', header: 'Actions' },
  ];

  // Use mock data if backend fetch failed or returned empty
  const displayDecks = useMockData || decks.length === 0 ? mockDecks : decks;
  
  // Add safety check to ensure decks is an array before mapping
  const deckArray = Array.isArray(displayDecks) ? displayDecks : [];
  
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

  if (loading && !useMockData) {
    return <InlineLoading description="Loading decks..." />;
  }

  if (error && !useMockData) {
    return (
      <div className="deck-list">
        <div className="deck-list-header">
          <h2>My Decks</h2>
          <div className="deck-actions-container">
            <Button onClick={() => navigate('/decks/create')} renderIcon={Add}>Create New Deck</Button>
            <Button onClick={() => navigate('/decks/import')} style={{ marginLeft: '1rem' }}>Import Deck</Button>
          </div>
        </div>
        <Tile className="error-message">
          <p>Could not connect to the backend server. Showing mock data instead.</p>
        </Tile>
        {renderDeckTable()}
      </div>
    );
  }

  function renderDeckTable() {
    return (
      <>
        {deckArray.length === 0 ? (
          <div className="no-decks">
            <p>You don't have any decks yet. Create a new deck or import one to get started.</p>
            <div className="deck-actions-container">
              <Button onClick={() => navigate('/decks/create')} renderIcon={Add}>Create New Deck</Button>
              <Button onClick={() => navigate('/decks/import')} style={{ marginLeft: '1rem' }}>Import Deck</Button>
            </div>
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
      </>
    );
  }

  return (
    <div className="deck-list">
      <div className="deck-list-header">
        <h2>My Decks</h2>
        <div className="deck-actions-container">
          <Button onClick={() => navigate('/decks/create')} renderIcon={Add}>Create New Deck</Button>
          <Button onClick={() => navigate('/decks/import')} style={{ marginLeft: '1rem' }}>Import Deck</Button>
        </div>
      </div>

      {useMockData && (
        <Tile className="mock-data-notice" style={{ marginBottom: '1rem' }}>
          <p>Note: Showing mock data. Backend connection not available.</p>
        </Tile>
      )}

      {renderDeckTable()}

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
