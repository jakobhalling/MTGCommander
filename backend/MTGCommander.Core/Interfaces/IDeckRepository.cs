using MTGCommander.Core.Entities;

namespace MTGCommander.Core.Interfaces;

public interface IDeckRepository
{
    Task<IEnumerable<Deck>> GetAllDecksAsync();
    Task<Deck?> GetDeckByIdAsync(int id);
    Task<Deck> CreateDeckAsync(Deck deck);
    Task<Deck> UpdateDeckAsync(Deck deck);
    Task<bool> DeleteDeckAsync(int id);
    Task<bool> AddCardToDeckAsync(int deckId, CardDefinition card);
    Task<bool> RemoveCardFromDeckAsync(int deckId, int cardId);
    Task<bool> SetCommanderAsync(int deckId, int cardId);
}
