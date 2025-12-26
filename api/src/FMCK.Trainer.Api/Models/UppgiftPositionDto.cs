namespace FMCK.Trainer.Api.Models;

public class UppgiftPositionDto
{
    public Guid Id { get; set; }
    public Wgs84Coordinates Wgs84Coordinates { get; set; } = new();
    public Sweref99Coordinates Sweref99Coordinates { get; set; } = new();
    public string Address { get; set; } = string.Empty;
}