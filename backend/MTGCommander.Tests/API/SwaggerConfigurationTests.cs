using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MTGCommander.API.Configuration;
using System.Net;
using Xunit;

namespace MTGCommander.Tests.API;

public class SwaggerConfigurationTests
{
    [Fact]
    public async Task SwaggerEndpoint_ShouldBeAccessible()
    {
        // Arrange
        var hostBuilder = new HostBuilder()
            .ConfigureWebHost(webHost =>
            {
                webHost.UseTestServer();
                webHost.ConfigureServices(services =>
                {
                    services.AddControllers();
                    services.AddMTGCommanderServices("TestConnectionString");
                });
                webHost.Configure(app =>
                {
                    app.UseRouting();
                    app.UseSwagger();
                    app.UseSwaggerUI();
                    app.UseEndpoints(endpoints =>
                    {
                        endpoints.MapControllers();
                    });
                });
            });

        var host = await hostBuilder.StartAsync();
        var client = host.GetTestClient();

        // Act
        var response = await client.GetAsync("/swagger/v1/swagger.json");
        var uiResponse = await client.GetAsync("/swagger/index.html");

        // Assert
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal(HttpStatusCode.OK, uiResponse.StatusCode);

        var swaggerJson = await response.Content.ReadAsStringAsync();
        Assert.Contains("MTG Commander API", swaggerJson);
        Assert.Contains("v1", swaggerJson);

        await host.StopAsync();
    }
} 