using Microsoft.AspNetCore.Mvc;
using MTGCommander.Infrastructure.External;
using System.Threading.Tasks;

namespace MTGCommander.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CardsController : ControllerBase
    {
        private readonly IScryfallClient _scryfallClient;
        private readonly ILogger<CardsController> _logger;

        public CardsController(IScryfallClient scryfallClient, ILogger<CardsController> logger)
        {
            _scryfallClient = scryfallClient;
            _logger = logger;
        }

        [HttpGet("search")]
        public async Task<ActionResult<ScryfallCard>> SearchCard([FromQuery] string name)
        {
            try
            {
                _logger.LogInformation("Searching for card: {CardName}", name);
                var card = await _scryfallClient.GetCardByNameAsync(name);
                return Ok(card);
            }
            catch (NotFoundException ex)
            {
                _logger.LogWarning(ex, "Card not found: {CardName}", name);
                return NotFound(new { message = ex.Message });
            }
            catch (ScryfallException ex)
            {
                _logger.LogError(ex, "Scryfall API error while searching for card: {CardName}", name);
                return StatusCode(500, new { message = "An error occurred while searching for the card" });
            }
        }
    }
} 