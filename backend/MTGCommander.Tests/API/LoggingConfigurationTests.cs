using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MTGCommander.API.Configuration;
using Serilog;
using Serilog.Events;
using Xunit;

namespace MTGCommander.Tests.API;

public class LoggingConfigurationTests : IDisposable
{
    private readonly ServiceProvider _serviceProvider;
    private readonly string _logFilePath;
    private readonly ILogger<LoggingConfigurationTests> _logger;

    public LoggingConfigurationTests()
    {
        _logFilePath = Path.Combine(Path.GetTempPath(), $"mtgcommander-test-{Guid.NewGuid()}.log");
        
        // Configure Serilog for tests
        Log.Logger = new LoggerConfiguration()
            .MinimumLevel.Debug()
            .WriteTo.File(_logFilePath, shared: true, fileSizeLimitBytes: null)
            .CreateLogger();

        var services = new ServiceCollection();
        services.AddLogging(builder => builder.AddSerilog(Log.Logger));
        _serviceProvider = services.BuildServiceProvider();
        _logger = _serviceProvider.GetRequiredService<ILogger<LoggingConfigurationTests>>();
    }

    [Fact]
    public void Logger_ShouldBeConfiguredCorrectly()
    {
        Assert.NotNull(_logger);
    }

    [Fact]
    public async Task Logger_ShouldWriteToFile()
    {
        // Arrange
        var testMessage = $"Test log message {Guid.NewGuid()}";

        try
        {
            // Act
            _logger.LogInformation(testMessage);
            await Task.Delay(500); // Give the logger more time to write to the file

            // Assert
            Assert.True(File.Exists(_logFilePath), "Log file should exist");
            var logContent = await File.ReadAllTextAsync(_logFilePath);
            Assert.Contains(testMessage, logContent);
        }
        finally
        {
            Log.CloseAndFlush();
        }
    }

    public void Dispose()
    {
        Log.CloseAndFlush();
        _serviceProvider.Dispose();

        // Wait longer to ensure the file is released
        Thread.Sleep(500);

        if (File.Exists(_logFilePath))
        {
            try
            {
                File.Delete(_logFilePath);
            }
            catch (IOException)
            {
                // Ignore file deletion errors in cleanup
            }
        }
    }
} 