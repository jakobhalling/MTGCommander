using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;
using Serilog;
using Serilog.Events;
using MTGCommander.Infrastructure.External;

namespace MTGCommander.API.Configuration;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddMTGCommanderServices(this IServiceCollection services)
    {
        // Configure Serilog
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Debug()
            .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
            .Enrich.FromLogContext()
            .WriteTo.Console()
            .WriteTo.File(
                Path.Combine(Path.GetTempPath(), "mtgcommander.log"),
                rollingInterval: RollingInterval.Day,
                fileSizeLimitBytes: 10 * 1024 * 1024, // 10MB
                retainedFileCountLimit: 31) // Keep logs for 31 days
            .CreateLogger();

        services.AddLogging(loggingBuilder =>
            loggingBuilder.AddSerilog(dispose: true));

        // Add CORS
        services.AddCors(options =>
        {
            options.AddPolicy("AllowedOrigins", policy =>
                policy.WithOrigins("http://localhost:3000") // Frontend development server
                     .AllowAnyMethod()
                     .AllowAnyHeader());
        });

        // Configure Swagger
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen(c =>
        {
            c.SwaggerDoc("v1", new OpenApiInfo
            {
                Title = "MTG Commander API",
                Version = "v1",
                Description = "API for MTG Commander game"
            });
        });

        // Add HttpClient and Scryfall client
        services.AddHttpClient();
        services.AddScoped<IScryfallClient, ScryfallClient>();

        return services;
    }
} 