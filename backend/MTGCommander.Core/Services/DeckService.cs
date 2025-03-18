using MTGCommander.Core.Entities;
using MTGCommander.Core.Interfaces;

namespace MTGCommander.Core.Services;

public class DeckService : IDeckService
{
    private readonly IDeckRepository _deckRepository;
    private readonly IScryfallService _scryfallService;
    private int _nextCardId = 1;

    public DeckService(IDeckRepository deckRepository, IScryfallService scryfallService)
    {
        _deckRepository = deckRepository;
        _scryfallService = scryfallService;
    }

    public Task<IEnumerable<Deck>> GetAllDecksAsync()
    {
        return _deckRepository.GetAllDecksAsync();
    }

    public Task<Deck?> GetDeckByIdAsync(int id)
    {
        return _deckRepository.GetDeckByIdAsync(id);
    }

    public async Task<Deck> CreateDeckAsync(string name)
    {
        var deck = new Deck
        {
            Name = name,
            CreatedAt = DateTime.UtcNow
        };

        return await _deckRepository.CreateDeckAsync(deck);
    }

    public Task<Deck> UpdateDeckAsync(Deck deck)
    {
        return _deckRepository.UpdateDeckAsync(deck);
    }

    public Task<bool> DeleteDeckAsync(int id)
    {
        return _deckRepository.DeleteDeckAsync(id);
    }

    public async Task<Deck?> ImportDeckAsync(string deckText, string deckName)
    {
        var deck = new Deck
        {
            Name = deckName,
            CreatedAt = DateTime.UtcNow
        };

        var createdDeck = await _deckRepository.CreateDeckAsync(deck);
        
        var lines = deckText.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        foreach (var line in lines)
        {
            var trimmedLine = line.Trim();
            if (string.IsNullOrWhiteSpace(trimmedLine))
                continue;

            // Parse the line: <Quantity Card Name> or <Quantity Card Name (set)>
            var match = System.Text.RegularExpressions.Regex.Match(trimmedLine, @"^(\d+)\s+(.+?)(?:\s+\((.+?)\))?$");
            if (!match.Success)
                continue;

            var quantity = int.Parse(match.Groups[1].Value);
            var cardName = match.Groups[2].Value.Trim();
            var set = match.Groups[3].Success ? match.Groups[3].Value.Trim() : null;

            CardDefinition? card = null;
            
            // Try to get card by name and set if provided
            if (!string.IsNullOrEmpty(set))
            {
                card = await _scryfallService.GetCardByNameAndSetAsync(cardName, set);
            }
            
            // If not found or set not provided, try by name only
            if (card == null)
            {
                card = await _scryfallService.GetCardByNameAsync(cardName);
            }

            // If card found, add it to the deck
            if (card != null)
            {
                // Assign an ID to the card if it doesn't have one
                if (card.Id == 0)
                {
                    card.Id = _nextCardId++;
                }

                // Add the card to the deck for each quantity
                for (int i = 0; i < quantity; i++)
                {
                    await _deckRepository.AddCardToDeckAsync(createdDeck.Id, card);
                }
            }
        }

        return await _deckRepository.GetDeckByIdAsync(createdDeck.Id);
    }

    public Task<bool> SetCommanderAsync(int deckId, int cardId)
    {
        return _deckRepository.SetCommanderAsync(deckId, cardId);
    }

    public Task<bool> AddCardToDeckAsync(int deckId, CardDefinition card)
    {
        // Assign an ID to the card if it doesn't have one
        if (card.Id == 0)
        {
            card.Id = _nextCardId++;
        }
        
        return _deckRepository.AddCardToDeckAsync(deckId, card);
    }

    public Task<bool> RemoveCardFromDeckAsync(int deckId, int cardId)
    {
        return _deckRepository.RemoveCardFromDeckAsync(deckId, cardId);
    }
}
