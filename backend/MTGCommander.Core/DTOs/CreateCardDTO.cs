using System.ComponentModel.DataAnnotations;
using MTGCommander.Core.Entities;

namespace MTGCommander.Core.DTOs;

public class CreateCardDTO
{
    [Required(ErrorMessage = "Name is required")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "ScryfallId is required")]
    public string ScryfallId { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }
    public string? ManaCost { get; set; }
    public string? Type { get; set; }
    public string? Text { get; set; }
    public string? Power { get; set; }
    public string? Toughness { get; set; }
    public string? Loyalty { get; set; }
    public bool IsCommander { get; set; }

    public void Validate()
    {
        var validationContext = new ValidationContext(this);
        var validationResults = new List<ValidationResult>();
        if (!Validator.TryValidateObject(this, validationContext, validationResults, true))
        {
            throw new ValidationException(string.Join(", ", validationResults.Select(r => r.ErrorMessage)));
        }
    }

    public Card ToEntity()
    {
        Validate();
        return new Card
        {
            Name = Name,
            ScryfallId = ScryfallId,
            ImageUrl = ImageUrl,
            ManaCost = ManaCost,
            Type = Type,
            Text = Text,
            Power = Power,
            Toughness = Toughness,
            Loyalty = Loyalty,
            IsCommander = IsCommander
        };
    }
} 