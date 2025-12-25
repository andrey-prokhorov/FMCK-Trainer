namespace FMCK.Trainer.Api.Models;

using System.Text.Json.Serialization;

public class Position
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("coordinates")]
    public Wgs84Coordinates Coordinates { get; set; } = new();
    

    [JsonPropertyName("address")]
    public string Address { get; set; } = string.Empty;
}

