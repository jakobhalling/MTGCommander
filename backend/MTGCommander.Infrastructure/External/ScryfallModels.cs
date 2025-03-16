using System;
using System.Text.Json.Serialization;

namespace MTGCommander.Infrastructure.External
{
    public class ScryfallCard
    {
        [JsonPropertyName("id")]
        public Guid Id { get; set; }

        [JsonPropertyName("name")]
        public string Name { get; set; } = string.Empty;

        [JsonPropertyName("mana_cost")]
        public string? ManaCost { get; set; }

        [JsonPropertyName("type_line")]
        public string TypeLine { get; set; } = string.Empty;

        [JsonPropertyName("oracle_text")]
        public string? OracleText { get; set; }

        [JsonPropertyName("power")]
        public string? Power { get; set; }

        [JsonPropertyName("toughness")]
        public string? Toughness { get; set; }

        [JsonPropertyName("image_uris")]
        public ImageUris? ImageUris { get; set; }

        [JsonPropertyName("colors")]
        public string[]? Colors { get; set; }

        [JsonPropertyName("color_identity")]
        public string[]? ColorIdentity { get; set; }

        [JsonPropertyName("legalities")]
        public Legalities? Legalities { get; set; }

        [JsonPropertyName("set")]
        public string? Set { get; set; }

        [JsonPropertyName("set_name")]
        public string? SetName { get; set; }

        [JsonPropertyName("rarity")]
        public string? Rarity { get; set; }
    }

    public class ImageUris
    {
        [JsonPropertyName("small")]
        public string? Small { get; set; }

        [JsonPropertyName("normal")]
        public string? Normal { get; set; }

        [JsonPropertyName("large")]
        public string? Large { get; set; }

        [JsonPropertyName("png")]
        public string? Png { get; set; }

        [JsonPropertyName("art_crop")]
        public string? ArtCrop { get; set; }

        [JsonPropertyName("border_crop")]
        public string? BorderCrop { get; set; }
    }

    public class Legalities
    {
        [JsonPropertyName("standard")]
        public string? Standard { get; set; }

        [JsonPropertyName("modern")]
        public string? Modern { get; set; }

        [JsonPropertyName("legacy")]
        public string? Legacy { get; set; }

        [JsonPropertyName("vintage")]
        public string? Vintage { get; set; }

        [JsonPropertyName("commander")]
        public string? Commander { get; set; }

        [JsonPropertyName("pioneer")]
        public string? Pioneer { get; set; }
    }

    public class ScryfallException : Exception
    {
        public ScryfallException(string message) : base(message) { }
        public ScryfallException(string message, Exception innerException) : base(message, innerException) { }
    }

    public class NotFoundException : ScryfallException
    {
        public NotFoundException(string message) : base(message) { }
    }
} 