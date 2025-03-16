using MTGCommander.Core.Entities;
using Xunit;

namespace MTGCommander.Tests.Core.Entities;

public class GameCardTests
{
    [Fact]
    public void GameCard_WhenCreated_ShouldHaveBasicProperties()
    {
        // Arrange
        var cardId = "test-card-123";
        var cardName = "Lightning Bolt";
        var types = new[] { "Instant" };
        var ownerId = "player-1";

        // Act
        var card = new GameCard(cardId, cardName, types, ownerId);

        // Assert
        Assert.Equal(cardId, card.Id);
        Assert.Equal(cardName, card.Name);
        Assert.Equal(types, card.Types);
        Assert.Equal(ownerId, card.OwnerId);
        Assert.False(card.IsTapped);
        Assert.Empty(card.Counters);
        Assert.Empty(card.Attachments);
    }

    [Fact]
    public void GameCard_WhenTapped_ShouldUpdateTappedState()
    {
        // Arrange
        var card = new GameCard("test-card", "Test Card", new[] { "Creature" }, "player-1");
        
        // Act
        card.Tap();

        // Assert
        Assert.True(card.IsTapped);

        // Act
        card.Untap();

        // Assert
        Assert.False(card.IsTapped);
    }

    [Fact]
    public void GameCard_WhenAddingCounter_ShouldTrackCounters()
    {
        // Arrange
        var card = new GameCard("test-card", "Test Card", new[] { "Creature" }, "player-1");
        
        // Act
        card.AddCounter("+1/+1", 2);
        card.AddCounter("loyalty", 1);

        // Assert
        Assert.Equal(2, card.Counters["+1/+1"]);
        Assert.Equal(1, card.Counters["loyalty"]);

        // Act
        card.RemoveCounter("+1/+1", 1);

        // Assert
        Assert.Equal(1, card.Counters["+1/+1"]);
    }

    [Fact]
    public void GameCard_WhenAttaching_ShouldTrackAttachments()
    {
        // Arrange
        var card = new GameCard("test-card", "Test Card", new[] { "Creature" }, "player-1");
        var auraId = "aura-123";
        var equipmentId = "equipment-123";

        // Act
        card.AttachCard(auraId);
        card.AttachCard(equipmentId);

        // Assert
        Assert.Contains(auraId, card.Attachments);
        Assert.Contains(equipmentId, card.Attachments);
        Assert.Equal(2, card.Attachments.Count);

        // Act
        card.DetachCard(auraId);

        // Assert
        Assert.DoesNotContain(auraId, card.Attachments);
        Assert.Single(card.Attachments);
    }

    [Fact]
    public void GameCard_WhenMovingZones_ShouldUpdateZone()
    {
        // Arrange
        var card = new GameCard("test-card", "Test Card", new[] { "Creature" }, "player-1");
        var handZoneId = "hand-1";
        var battlefieldZoneId = "battlefield-1";

        // Act
        card.MoveToZone(handZoneId);

        // Assert
        Assert.Equal(handZoneId, card.CurrentZoneId);

        // Act
        card.MoveToZone(battlefieldZoneId);

        // Assert
        Assert.Equal(battlefieldZoneId, card.CurrentZoneId);
    }
} 