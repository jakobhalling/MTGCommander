using Microsoft.AspNetCore.Mvc;
using MTGCommander.Core.Entities;
using MTGCommander.Core.Interfaces;

namespace MTGCommander.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DecksController : ControllerBase
{
    private readonly IDeckService _deckService;
    private readonly IScryfallService _scryfallService;

    public DecksController(IDeckService deckService, IScryfallService scryfallService)
    {
        _deckService = deckService;
        _scryfallService = scryfallService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Deck>>> GetAllDecks()
    {
        var decks = await _deckService.GetAllDecksAsync();
        return Ok(decks);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<Deck>> GetDeckById(int id)
    {
        var deck = await _deckService.GetDeckByIdAsync(id);
        if (deck == null)
        {
            return NotFound();
        }
        return Ok(deck);
    }

    [HttpPost]
    public async Task<ActionResult<Deck>> CreateDeck([FromBody] CreateDeckRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest("Deck name is required");
        }

        var deck = await _deckService.CreateDeckAsync(request.Name);
        return CreatedAtAction(nameof(GetDeckById), new { id = deck.Id }, deck);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<Deck>> UpdateDeck(int id, [FromBody] UpdateDeckRequest request)
    {
        var existingDeck = await _deckService.GetDeckByIdAsync(id);
        if (existingDeck == null)
        {
            return NotFound();
        }

        existingDeck.Name = request.Name;
        var updatedDeck = await _deckService.UpdateDeckAsync(existingDeck);
        return Ok(updatedDeck);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteDeck(int id)
    {
        var result = await _deckService.DeleteDeckAsync(id);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }

    [HttpPost("import")]
    public async Task<ActionResult<Deck>> ImportDeck([FromBody] ImportDeckRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.DeckText))
        {
            return BadRequest("Deck text is required");
        }

        if (string.IsNullOrWhiteSpace(request.Name))
        {
            return BadRequest("Deck name is required");
        }

        var deck = await _deckService.ImportDeckAsync(request.DeckText, request.Name);
        if (deck == null)
        {
            return BadRequest("Failed to import deck");
        }

        return CreatedAtAction(nameof(GetDeckById), new { id = deck.Id }, deck);
    }

    [HttpPut("{id}/commander")]
    public async Task<ActionResult> SetCommander(int id, [FromBody] SetCommanderRequest request)
    {
        var result = await _deckService.SetCommanderAsync(id, request.CardId);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }

    [HttpPost("{id}/cards")]
    public async Task<ActionResult> AddCardToDeck(int id, [FromBody] AddCardRequest request)
    {
        // First try to get the card from Scryfall
        CardDefinition? card = null;
        
        if (!string.IsNullOrEmpty(request.Set))
        {
            card = await _scryfallService.GetCardByNameAndSetAsync(request.CardName, request.Set);
        }
        else
        {
            card = await _scryfallService.GetCardByNameAsync(request.CardName);
        }

        if (card == null)
        {
            return BadRequest($"Card '{request.CardName}' not found");
        }

        var result = await _deckService.AddCardToDeckAsync(id, card);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }

    [HttpDelete("{id}/cards/{cardId}")]
    public async Task<ActionResult> RemoveCardFromDeck(int id, int cardId)
    {
        var result = await _deckService.RemoveCardFromDeckAsync(id, cardId);
        if (!result)
        {
            return NotFound();
        }
        return NoContent();
    }

    public class CreateDeckRequest
    {
        public string Name { get; set; } = string.Empty;
    }

    public class UpdateDeckRequest
    {
        public string Name { get; set; } = string.Empty;
    }

    public class ImportDeckRequest
    {
        public string Name { get; set; } = string.Empty;
        public string DeckText { get; set; } = string.Empty;
    }

    public class SetCommanderRequest
    {
        public int CardId { get; set; }
    }

    public class AddCardRequest
    {
        public string CardName { get; set; } = string.Empty;
        public string? Set { get; set; }
    }
}
