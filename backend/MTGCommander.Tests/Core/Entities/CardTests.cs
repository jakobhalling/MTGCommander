using MTGCommander.Core.Entities;
using Xunit;

namespace MTGCommander.Tests.Core.Entities;

public class CardTests
{
    [Fact]
    public void Card_ShouldInitializeWithDefaultValues()
    {
        // Arrange & Act
        var card = new Card();

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
    public void Card_ShouldSetAndGetProperties()
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
} 