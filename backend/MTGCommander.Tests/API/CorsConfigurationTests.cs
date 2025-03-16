using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using MTGCommander.API.Configuration;
using System.Net;
using System.Net.Http;
using Xunit;

namespace MTGCommander.Tests.API;

public class CorsConfigurationTests
{
    [Fact]
    public async Task Cors_ShouldAllowConfiguredOrigins()
    {
        // Arrange
        var hostBuilder = new HostBuilder()
            .ConfigureWebHost(webHost =>
            {
                webHost.UseTestServer();
                webHost.ConfigureServices(services =>
                {
                    services.AddMTGCommanderServices();
                    services.AddRouting();
                });
                webHost.Configure(app =>
                {
                    app.UseCors("AllowedOrigins");
                    app.UseRouting();
                    app.UseEndpoints(endpoints =>
                    {
                        endpoints.MapGet("/api/test", context =>
                        {
                            context.Response.StatusCode = 200;
                            return Task.CompletedTask;
                        });
                    });
                });
            });

        var host = await hostBuilder.StartAsync();
        var client = host.GetTestClient();

        // Create preflight request
        var request = new HttpRequestMessage(HttpMethod.Options, "/api/test");
        request.Headers.Add("Origin", "http://localhost:3000");
        request.Headers.Add("Access-Control-Request-Method", "GET");

        // Act
        var response = await client.SendAsync(request);
        
        // Assert
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
        Assert.Contains("http://localhost:3000", response.Headers.GetValues("Access-Control-Allow-Origin"));
        Assert.Contains("GET", response.Headers.GetValues("Access-Control-Allow-Methods"));

        await host.StopAsync();
    }
} 