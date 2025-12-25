namespace FMCK.Trainer.Api.Models;

using System.Text.Json.Serialization;

public class Wgs84Coordinates
{
    [JsonPropertyName("lat")] public double Lat { get; set; }

    [JsonPropertyName("lon")] public double Lon { get; set; }
}