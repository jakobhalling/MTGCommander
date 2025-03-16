namespace MTGCommander.Core.Entities;

public class Deck
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int CommanderId { get; set; }
    public Card? Commander { get; set; }
    public List<Card> Cards { get; set; } = new();
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
} 