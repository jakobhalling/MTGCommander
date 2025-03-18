using MTGCommander.Core.Entities;

namespace MTGCommander.Core.Interfaces;

public interface IDeckService
{
    Task<IEnumerable<Deck>> GetAllDecksAsync();
    Task<Deck?> GetDeckByIdAsync(int id);
    Task<Deck> CreateDeckAsync(string name);
    Task<Deck> UpdateDeckAsync(Deck deck);
    Task<bool> DeleteDeckAsync(int id);
    Task<Deck?> ImportDeckAsync(string deckText, string deckName);
    Task<bool> SetCommanderAsync(int deckId, int cardId);
    Task<bool> AddCardToDeckAsync(int deckId, CardDefinition card);
    Task<bool> RemoveCardFromDeckAsync(int deckId, int cardId);
}
