namespace MTGCommander.Core.Entities;

public class Deck
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int CommanderId { get; set; }
    public CardDefinition? Commander { get; set; }
    public List<CardDefinition> Cards { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
} 