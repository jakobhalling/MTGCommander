using System.ComponentModel.DataAnnotations;
using MTGCommander.Core.DTOs;
using MTGCommander.Core.Entities;
using Xunit;

namespace MTGCommander.Tests.Core.DTOs;

public class CardDTOTests
{
    [Fact]
    public void CardDTO_ShouldMapFromEntity()
    {
        // Arrange
        var card = new Card
        {
            Id = 1,
            Name = "Sol Ring",
            ScryfallId = "test-id",
            ImageUrl = "https://example.com/image.jpg",
            ManaCost = "{1}",
            Type = "Artifact",
            Text = "{T}: Add {C}{C}.",
            Power = null,
            Toughness = null,
            Loyalty = null,
            IsCommander = false
        };

        // Act
        var dto = CardDTO.FromEntity(card);

        // Assert
        Assert.Equal(card.Id, dto.Id);
        Assert.Equal(card.Name, dto.Name);
        Assert.Equal(card.ScryfallId, dto.ScryfallId);
        Assert.Equal(card.ImageUrl, dto.ImageUrl);
        Assert.Equal(card.ManaCost, dto.ManaCost);
        Assert.Equal(card.Type, dto.Type);
        Assert.Equal(card.Text, dto.Text);
        Assert.Equal(card.Power, dto.Power);
        Assert.Equal(card.Toughness, dto.Toughness);
        Assert.Equal(card.Loyalty, dto.Loyalty);
        Assert.Equal(card.IsCommander, dto.IsCommander);
    }

    [Fact]
    public void CreateCardDTO_ShouldCreateEntity()
    {
        // Arrange
        var createDto = new CreateCardDTO
        {
            Name = "Sol Ring",
            ScryfallId = "test-id",
            ImageUrl = "https://example.com/image.jpg",
            ManaCost = "{1}",
            Type = "Artifact",
            Text = "{T}: Add {C}{C}.",
            IsCommander = false
        };

        // Act
        var entity = createDto.ToEntity();

        // Assert
        Assert.Equal(createDto.Name, entity.Name);
        Assert.Equal(createDto.ScryfallId, entity.ScryfallId);
        Assert.Equal(createDto.ImageUrl, entity.ImageUrl);
        Assert.Equal(createDto.ManaCost, entity.ManaCost);
        Assert.Equal(createDto.Type, entity.Type);
        Assert.Equal(createDto.Text, entity.Text);
        Assert.Equal(createDto.IsCommander, entity.IsCommander);
        Assert.Equal(0, entity.Id); // Id should be default since it's a new entity
    }

    [Fact]
    public void CreateCardDTO_ShouldValidateRequiredFields()
    {
        // Arrange
        var createDto = new CreateCardDTO();

        // Act & Assert
        var exception = Assert.Throws<ValidationException>(() => createDto.Validate());
        Assert.Contains("Name is required", exception.Message);
        Assert.Contains("ScryfallId is required", exception.Message);
    }
} 