import React, { useState } from 'react';
import {
  TextInput,
  Button,
  InlineLoading,
  Tile,
  Grid,
  Column
} from '@carbon/react';
import { Search } from '@carbon/icons-react';
import { useAppDispatch } from '../../hooks/reduxHooks';
import { addCardToDeck } from '../../store/slices/deckSlice';
import axios from 'axios';

interface CardSearchProps {
  deckId: number;
  onCardAdded: () => void;
}

interface ScryfallCard {
  id: string;
  name: string;
  image_uris?: {
    small: string;
    normal: string;
  };
  card_faces?: Array<{
    image_uris?: {
      small: string;
      normal: string;
    }
  }>;
  set: string;
  set_name: string;
  type_line: string;
}

const CardSearch: React.FC<CardSearchProps> = ({ deckId, onCardAdded }) => {
  const dispatch = useAppDispatch();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<ScryfallCard[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(searchTerm)}`);
      setSearchResults(response.data.data || []);
    } catch (err) {
      setError('No cards found. Try a different search term.');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async (cardName: string, set?: string) => {
    try {
      await dispatch(addCardToDeck({ deckId, cardName, set })).unwrap();
      onCardAdded();
    } catch (err) {
      setError('Failed to add card to deck.');
    }
  };

  const getCardImage = (card: ScryfallCard) => {
    if (card.image_uris?.small) {
      return card.image_uris.small;
    } else if (card.card_faces && card.card_faces[0]?.image_uris?.small) {
      return card.card_faces[0].image_uris.small;
    }
    return null;
  };

  return (
    <div className="card-search">
      <h3>Add Cards</h3>
      
      <div className="search-bar">
        <TextInput
          id="card-search"
          labelText="Search for cards"
          placeholder="Enter card name"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
        />
        <Button 
          renderIcon={Search} 
          onClick={handleSearch}
          disabled={loading || !searchTerm.trim()}
        >
          Search
        </Button>
      </div>
      
      {loading && <InlineLoading description="Searching cards..." />}
      
      {error && <div className="error-message">{error}</div>}
      
      {searchResults.length > 0 && (
        <div className="search-results">
          <h4>Search Results</h4>
          <Grid>
            {searchResults.map(card => (
              <Column sm={4} md={4} lg={4} key={card.id}>
                <Tile className="card-result">
                  <div className="card-result-content">
                    {getCardImage(card) && (
                      <img 
                        src={getCardImage(card)} 
                        alt={card.name} 
                        className="card-thumbnail" 
                      />
                    )}
                    <div className="card-info">
                      <h5>{card.name}</h5>
                      <p className="card-set">{card.set_name} ({card.set})</p>
                      <p className="card-type">{card.type_line}</p>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    onClick={() => handleAddCard(card.name, card.set)}
                  >
                    Add to Deck
                  </Button>
                </Tile>
              </Column>
            ))}
          </Grid>
        </div>
      )}
    </div>
  );
};

export default CardSearch;
