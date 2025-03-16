using Microsoft.Extensions.DependencyInjection;
using MTGCommander.API.Configuration;
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
        services.AddMTGCommanderServices();

        // Assert
        var serviceProvider = services.BuildServiceProvider();

        // Verify required services are registered
        var scopeFactory = serviceProvider.GetService<IServiceScopeFactory>();
        Assert.NotNull(scopeFactory);
    }
} 