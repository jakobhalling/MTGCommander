using MTGCommander.Core.Entities;
using MTGCommander.Core.Interfaces;

namespace MTGCommander.Infrastructure.Repositories;

public class InMemoryDeckRepository : IDeckRepository
{
    private readonly List<Deck> _decks = new();
    private int _nextId = 1;

    public Task<IEnumerable<Deck>> GetAllDecksAsync()
    {
        return Task.FromResult<IEnumerable<Deck>>(_decks);
    }

    public Task<Deck?> GetDeckByIdAsync(int id)
    {
        return Task.FromResult(_decks.FirstOrDefault(d => d.Id == id));
    }

    public Task<Deck> CreateDeckAsync(Deck deck)
    {
        deck.Id = _nextId++;
        deck.CreatedAt = DateTime.UtcNow;
        _decks.Add(deck);
        return Task.FromResult(deck);
    }

    public Task<Deck> UpdateDeckAsync(Deck deck)
    {
        var existingDeck = _decks.FirstOrDefault(d => d.Id == deck.Id);
        if (existingDeck == null)
        {
            throw new KeyNotFoundException($"Deck with ID {deck.Id} not found");
        }

        var index = _decks.IndexOf(existingDeck);
        deck.UpdatedAt = DateTime.UtcNow;
        _decks[index] = deck;
        
        return Task.FromResult(deck);
    }

    public Task<bool> DeleteDeckAsync(int id)
    {
        var deck = _decks.FirstOrDefault(d => d.Id == id);
        if (deck == null)
        {
            return Task.FromResult(false);
        }

        _decks.Remove(deck);
        return Task.FromResult(true);
    }

    public async Task<bool> AddCardToDeckAsync(int deckId, CardDefinition card)
    {
        var deck = await GetDeckByIdAsync(deckId);
        if (deck == null)
        {
            return false;
        }

        deck.Cards.Add(card);
        deck.UpdatedAt = DateTime.UtcNow;
        return true;
    }

    public async Task<bool> RemoveCardFromDeckAsync(int deckId, int cardId)
    {
        var deck = await GetDeckByIdAsync(deckId);
        if (deck == null)
        {
            return false;
        }

        var card = deck.Cards.FirstOrDefault(c => c.Id == cardId);
        if (card == null)
        {
            return false;
        }

        deck.Cards.Remove(card);
        deck.UpdatedAt = DateTime.UtcNow;
        return true;
    }

    public async Task<bool> SetCommanderAsync(int deckId, int cardId)
    {
        var deck = await GetDeckByIdAsync(deckId);
        if (deck == null)
        {
            return false;
        }

        var card = deck.Cards.FirstOrDefault(c => c.Id == cardId);
        if (card == null)
        {
            return false;
        }

        deck.CommanderId = cardId;
        deck.Commander = card;
        deck.UpdatedAt = DateTime.UtcNow;
        return true;
    }
}
