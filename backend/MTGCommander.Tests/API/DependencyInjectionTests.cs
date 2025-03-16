using Microsoft.Extensions.DependencyInjection;
using MTGCommander.API.Configuration;
using MTGCommander.Infrastructure.Database;
using Xunit;

namespace MTGCommander.Tests.API;

public class DependencyInjectionTests
{
    [Fact]
    public void ConfigureServices_ShouldRegisterRequiredServices()
    {
        // Arrange
        var services = new ServiceCollection();

        // Act
        services.AddMTGCommanderServices("TestConnectionString");

        // Assert
        var serviceProvider = services.BuildServiceProvider();

        // Verify DbContext is registered
        var dbContext = serviceProvider.GetService<MTGCommanderDbContext>();
        Assert.NotNull(dbContext);

        // Verify other required services are registered
        var scopeFactory = serviceProvider.GetService<IServiceScopeFactory>();
        Assert.NotNull(scopeFactory);
    }
} 