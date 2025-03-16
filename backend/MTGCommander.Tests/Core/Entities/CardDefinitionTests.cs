using MTGCommander.Core.Entities;
using Xunit;

namespace MTGCommander.Tests.Core.Entities;

public class CardDefinitionTests
{
    [Fact]
    public void CardDefinition_WhenCreated_ShouldHaveDefaultValues()
    {
        // Arrange & Act
        var card = new CardDefinition();

        // Assert
        Assert.Equal(0, card.Id);
        Assert.Equal(string.Empty, card.Name);
        Assert.Equal(string.Empty, card.ScryfallId);
        Assert.Null(card.ImageUrl);
        Assert.Null(card.ManaCost);
        Assert.Null(card.Type);
        Assert.Null(card.Text);
        Assert.Null(card.Power);
        Assert.Null(card.Toughness);
        Assert.Null(card.Loyalty);
        Assert.False(card.IsCommander);
    }

    [Fact]
    public void CardDefinition_WhenPropertiesSet_ShouldRetainValues()
    {
        // Arrange
        var card = new CardDefinition
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

        // Assert
        Assert.Equal(1, card.Id);
        Assert.Equal("Sol Ring", card.Name);
        Assert.Equal("test-id", card.ScryfallId);
        Assert.Equal("https://example.com/image.jpg", card.ImageUrl);
        Assert.Equal("{1}", card.ManaCost);
        Assert.Equal("Artifact", card.Type);
        Assert.Equal("{T}: Add {C}{C}.", card.Text);
        Assert.Null(card.Power);
        Assert.Null(card.Toughness);
        Assert.Null(card.Loyalty);
        Assert.False(card.IsCommander);
    }

    [Fact]
    public void CreateGameCard_ShouldCreateGameCardWithCorrectProperties()
    {
        // Arrange
        var cardDefinition = new CardDefinition
        {
            Name = "Lightning Bolt",
            Type = "Instant"
        };
        var gameCardId = "game-card-123";
        var ownerId = "player-1";

        // Act
        var gameCard = cardDefinition.CreateGameCard(gameCardId, ownerId);

        // Assert
        Assert.Equal(gameCardId, gameCard.Id);
        Assert.Equal("Lightning Bolt", gameCard.Name);
        Assert.Collection(gameCard.Types,
            type => Assert.Equal("Instant", type));
        Assert.Equal(ownerId, gameCard.OwnerId);
        Assert.False(gameCard.IsTapped);
        Assert.Empty(gameCard.Counters);
        Assert.Empty(gameCard.Attachments);
    }

    [Fact]
    public void CreateGameCard_WithMultipleTypes_ShouldParseTypesCorrectly()
    {
        // Arrange
        var cardDefinition = new CardDefinition
        {
            Name = "Golos, Tireless Pilgrim",
            Type = "Artifact Creature - Scout"
        };
        var gameCardId = "game-card-123";
        var ownerId = "player-1";

        // Act
        var gameCard = cardDefinition.CreateGameCard(gameCardId, ownerId);

        // Assert
        Assert.Equal(gameCardId, gameCard.Id);
        Assert.Equal("Golos, Tireless Pilgrim", gameCard.Name);
        Assert.Collection(gameCard.Types,
            type => Assert.Equal("Artifact", type),
            type => Assert.Equal("Creature", type),
            type => Assert.Equal("-", type),
            type => Assert.Equal("Scout", type));
        Assert.Equal(ownerId, gameCard.OwnerId);
    }
} 