using System;
using System.Net.Http;
using System.Text.Json;
using System.Threading.Tasks;

namespace MTGCommander.Infrastructure.External
{
    public interface IScryfallClient
    {
        Task<ScryfallCard> GetCardByNameAsync(string cardName);
    }

    public class ScryfallClient : IScryfallClient
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private const string BaseUrl = "https://api.scryfall.com";

        public ScryfallClient(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory ?? throw new ArgumentNullException(nameof(httpClientFactory));
        }

        public async Task<ScryfallCard> GetCardByNameAsync(string cardName)
        {
            if (string.IsNullOrWhiteSpace(cardName))
                throw new ArgumentException("Card name cannot be empty", nameof(cardName));

            using var client = _httpClientFactory.CreateClient();
            var encodedCardName = Uri.EscapeDataString(cardName);
            var response = await client.GetAsync($"{BaseUrl}/cards/named?exact={encodedCardName}");

            if (response.IsSuccessStatusCode)
            {
                var content = await response.Content.ReadAsStringAsync();
                try
                {
                    var options = new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    };
                    var card = JsonSerializer.Deserialize<ScryfallCard>(content, options);
                    if (card == null)
                    {
                        throw new ScryfallException("Failed to deserialize Scryfall response: result was null");
                    }
                    return card;
                }
                catch (JsonException ex)
                {
                    throw new ScryfallException("Failed to deserialize Scryfall response", ex);
                }
            }

            if (response.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                throw new NotFoundException($"Card not found: {cardName}");
            }

            throw new ScryfallException($"Scryfall API error: {response.StatusCode}");
        }
    }
} 