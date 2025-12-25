namespace FMCK.Trainer.Api.Models;

public class PositionDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public Wgs84Coordinates Coordinates { get; set; } = new();
    public Sweref99Coordinates Sweref99Coordinates { get; set; } = new();
    public string Address { get; set; } = string.Empty;
}