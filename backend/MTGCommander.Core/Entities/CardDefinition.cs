namespace MTGCommander.Core.Entities;

public class CardDefinition
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ScryfallId { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? ManaCost { get; set; }
    public string? Type { get; set; }
    public string? Text { get; set; }
    public string? Power { get; set; }
    public string? Toughness { get; set; }
    public string? Loyalty { get; set; }
    public bool IsCommander { get; set; }

    public GameCard CreateGameCard(string gameCardId, string ownerId)
    {
        var types = Type?.Split(' ') ?? Array.Empty<string>();
        return new GameCard(gameCardId, Name, types, ownerId);
    }
} 