using MTGCommander.Core.Entities;

namespace MTGCommander.Core.Interfaces;

public interface IScryfallService
{
    Task<CardDefinition?> GetCardByNameAsync(string cardName);
    Task<CardDefinition?> GetCardByNameAndSetAsync(string cardName, string set);
    Task<IEnumerable<CardDefinition>> SearchCardsByNameAsync(string cardName);
    Task<bool> CacheCardDataAsync(CardDefinition card);
}
