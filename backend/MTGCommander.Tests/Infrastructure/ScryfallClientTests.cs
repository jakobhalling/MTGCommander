using System;
using System.Net.Http;
using System.Threading.Tasks;
using MTGCommander.Infrastructure.External;
using Xunit;
using FluentAssertions;
using Moq;
using Moq.Protected;
using System.Net;
using System.Text.Json;

namespace MTGCommander.Tests.Infrastructure
{
    public class ScryfallClientTests
    {
        private readonly Mock<IHttpClientFactory> _httpClientFactoryMock;
        private readonly Mock<HttpMessageHandler> _httpMessageHandlerMock;
        private readonly HttpClient _httpClient;

        public ScryfallClientTests()
        {
            _httpMessageHandlerMock = new Mock<HttpMessageHandler>();
            _httpClient = new HttpClient(_httpMessageHandlerMock.Object);
            _httpClientFactoryMock = new Mock<IHttpClientFactory>();
            _httpClientFactoryMock.Setup(x => x.CreateClient(It.IsAny<string>()))
                .Returns(_httpClient);
        }

        [Fact]
        public async Task GetCardByName_ValidCardName_ReturnsCard()
        {
            // Arrange
            var cardName = "Sol Ring";
            var expectedResponse = new ScryfallCard
            {
                Id = Guid.NewGuid(),
                Name = cardName,
                ManaCost = "{1}",
                TypeLine = "Artifact",
                OracleText = "{T}: Add {C}{C}.",
                Power = null,
                Toughness = null,
                ImageUris = new ImageUris { Normal = "https://example.com/solring.jpg" }
            };

            var mockResponse = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(JsonSerializer.Serialize(expectedResponse))
            };

            _httpMessageHandlerMock.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(mockResponse);

            var client = new ScryfallClient(_httpClientFactoryMock.Object);

            // Act
            var result = await client.GetCardByNameAsync(cardName);

            // Assert
            result.Should().NotBeNull();
            result.Name.Should().Be(cardName);
            result.ManaCost.Should().Be("{1}");
            result.TypeLine.Should().Be("Artifact");
        }

        [Fact]
        public async Task GetCardByName_CardNotFound_ThrowsNotFoundException()
        {
            // Arrange
            var cardName = "NonexistentCard";
            var mockResponse = new HttpResponseMessage(HttpStatusCode.NotFound);

            _httpMessageHandlerMock.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(mockResponse);

            var client = new ScryfallClient(_httpClientFactoryMock.Object);

            // Act & Assert
            await Assert.ThrowsAsync<NotFoundException>(() => client.GetCardByNameAsync(cardName));
        }

        [Fact]
        public async Task GetCardByName_ApiError_ThrowsScryfallException()
        {
            // Arrange
            var cardName = "Sol Ring";
            var mockResponse = new HttpResponseMessage(HttpStatusCode.InternalServerError);

            _httpMessageHandlerMock.Protected()
                .Setup<Task<HttpResponseMessage>>(
                    "SendAsync",
                    ItExpr.IsAny<HttpRequestMessage>(),
                    ItExpr.IsAny<CancellationToken>()
                )
                .ReturnsAsync(mockResponse);

            var client = new ScryfallClient(_httpClientFactoryMock.Object);

            // Act & Assert
            await Assert.ThrowsAsync<ScryfallException>(() => client.GetCardByNameAsync(cardName));
        }
    }
} 