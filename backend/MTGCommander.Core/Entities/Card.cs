namespace MTGCommander.Core.Entities;

public class Card
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
} 