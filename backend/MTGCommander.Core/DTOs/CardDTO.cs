using MTGCommander.Core.Entities;

namespace MTGCommander.Core.DTOs;

public class CardDTO
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

    public static CardDTO FromEntity(CardDefinition entity)
    {
        return new CardDTO
        {
            Id = entity.Id,
            Name = entity.Name,
            ScryfallId = entity.ScryfallId,
            ImageUrl = entity.ImageUrl,
            ManaCost = entity.ManaCost,
            Type = entity.Type,
            Text = entity.Text,
            Power = entity.Power,
            Toughness = entity.Toughness,
            Loyalty = entity.Loyalty,
            IsCommander = entity.IsCommander
        };
    }
} 