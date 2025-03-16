using Microsoft.EntityFrameworkCore;
using MTGCommander.Infrastructure.Database;
using Xunit;

namespace MTGCommander.Tests.Infrastructure.Database;

public class MTGCommanderDbContextTests
{
    [Fact]
    public void DbContext_ShouldBeConfiguredCorrectly()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<MTGCommanderDbContext>()
            .UseInMemoryDatabase(databaseName: "TestDb")
            .Options;

        // Act
        using var context = new MTGCommanderDbContext(options);

        // Assert
        Assert.NotNull(context);
        Assert.NotNull(context.Cards);
        Assert.NotNull(context.Decks);
    }
} 