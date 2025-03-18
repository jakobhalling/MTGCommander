using System.Net.Http.Json;
using System.Text.Json;
using System.Text.Json.Serialization;
using MTGCommander.Core.Entities;
using MTGCommander.Core.Interfaces;

namespace MTGCommander.Infrastructure.Services;

public class ScryfallService : IScryfallService
{
    private readonly HttpClient _httpClient;
    private readonly Dictionary<string, CardDefinition> _cardCache = new();
    private readonly SemaphoreSlim _rateLimiter = new(1, 1);
    private DateTime _lastRequestTime = DateTime.MinValue;
    private readonly TimeSpan _requestDelay = TimeSpan.FromMilliseconds(100); // Delay between requests to avoid rate limiting

    public ScryfallService(HttpClient httpClient)
    {
        _httpClient = httpClient;
        _httpClient.BaseAddress = new Uri("https://api.scryfall.com/");
    }

    public async Task<CardDefinition?> GetCardByNameAsync(string cardName)
    {
        // Check cache first
        var cacheKey = cardName.ToLowerInvariant();
        if (_cardCache.TryGetValue(cacheKey, out var cachedCard))
        {
            return cachedCard;
        }

        // Apply rate limiting
        await ApplyRateLimitingAsync();

        try
        {
            var response = await _httpClient.GetAsync($"cards/named?fuzzy={Uri.EscapeDataString(cardName)}");
            if (response.IsSuccessStatusCode)
            {
                var scryfallCard = await response.Content.ReadFromJsonAsync<ScryfallCard>();
                if (scryfallCard != null)
                {
                    var card = MapToCardDefinition(scryfallCard);
                    await CacheCardDataAsync(card);
                    return card;
                }
            }
            return null;
        }
        catch (Exception)
        {
            // Log exception
            return null;
        }
    }

    public async Task<CardDefinition?> GetCardByNameAndSetAsync(string cardName, string set)
    {
        // Check cache first
        var cacheKey = $"{cardName.ToLowerInvariant()}|{set.ToLowerInvariant()}";
        if (_cardCache.TryGetValue(cacheKey, out var cachedCard))
        {
            return cachedCard;
        }

        // Apply rate limiting
        await ApplyRateLimitingAsync();

        try
        {
            var response = await _httpClient.GetAsync($"cards/named?fuzzy={Uri.EscapeDataString(cardName)}&set={Uri.EscapeDataString(set)}");
            if (response.IsSuccessStatusCode)
            {
                var scryfallCard = await response.Content.ReadFromJsonAsync<ScryfallCard>();
                if (scryfallCard != null)
                {
                    var card = MapToCardDefinition(scryfallCard);
                    await CacheCardDataAsync(card);
                    return card;
                }
            }
            
            // If not found with set, try without set
            return await GetCardByNameAsync(cardName);
        }
        catch (Exception)
        {
            // Log exception
            return null;
        }
    }

    public async Task<IEnumerable<CardDefinition>> SearchCardsByNameAsync(string cardName)
    {
        // Apply rate limiting
        await ApplyRateLimitingAsync();

        try
        {
            var response = await _httpClient.GetAsync($"cards/search?q={Uri.EscapeDataString(cardName)}");
            if (response.IsSuccessStatusCode)
            {
                var searchResult = await response.Content.ReadFromJsonAsync<ScryfallSearchResult>();
                if (searchResult != null && searchResult.Data != null)
                {
                    var cards = searchResult.Data.Select(MapToCardDefinition).ToList();
                    foreach (var card in cards)
                    {
                        await CacheCardDataAsync(card);
                    }
                    return cards;
                }
            }
            return Enumerable.Empty<CardDefinition>();
        }
        catch (Exception)
        {
            // Log exception
            return Enumerable.Empty<CardDefinition>();
        }
    }

    public Task<bool> CacheCardDataAsync(CardDefinition card)
    {
        if (string.IsNullOrEmpty(card.Name))
        {
            return Task.FromResult(false);
        }

        var cacheKey = card.Name.ToLowerInvariant();
        _cardCache[cacheKey] = card;
        return Task.FromResult(true);
    }

    private async Task ApplyRateLimitingAsync()
    {
        await _rateLimiter.WaitAsync();
        try
        {
            var timeSinceLastRequest = DateTime.UtcNow - _lastRequestTime;
            if (timeSinceLastRequest < _requestDelay)
            {
                await Task.Delay(_requestDelay - timeSinceLastRequest);
            }
            _lastRequestTime = DateTime.UtcNow;
        }
        finally
        {
            _rateLimiter.Release();
        }
    }

    private CardDefinition MapToCardDefinition(ScryfallCard scryfallCard)
    {
        return new CardDefinition
        {
            Name = scryfallCard.Name,
            ScryfallId = scryfallCard.Id,
            ImageUrl = scryfallCard.ImageUris?.Normal ?? scryfallCard.ImageUris?.Small,
            ManaCost = scryfallCard.ManaCost,
            Type = scryfallCard.TypeLine,
            Text = scryfallCard.OracleText,
            Power = scryfallCard.Power,
            Toughness = scryfallCard.Toughness,
            Loyalty = scryfallCard.Loyalty
        };
    }

    private class ScryfallCard
    {
        [JsonPropertyName("id")]
        public string Id { get; set; } = string.Empty;

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("mana_cost")]
        public string? ManaCost { get; set; }

        [JsonPropertyName("type_line")]
        public string? TypeLine { get; set; }

        [JsonPropertyName("oracle_text")]
        public string? OracleText { get; set; }

        [JsonPropertyName("power")]
        public string? Power { get; set; }

        [JsonPropertyName("toughness")]
        public string? Toughness { get; set; }

        [JsonPropertyName("loyalty")]
        public string? Loyalty { get; set; }

        [JsonPropertyName("image_uris")]
        public ImageUris? ImageUris { get; set; }
    }

    private class ImageUris
    {
        [JsonPropertyName("small")]
        public string? Small { get; set; }

        [JsonPropertyName("normal")]
        public string? Normal { get; set; }

        [JsonPropertyName("large")]
        public string? Large { get; set; }
    }

    private class ScryfallSearchResult
    {
        [JsonPropertyName("data")]
        public List<ScryfallCard>? Data { get; set; }
    }
}
