namespace FMCK.Trainer.Api.Endpoints.Health;

public static class HealthEndpoints
{
    public static void MapEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/health", () => Results.Ok(new { Status = "Healthy" }));
    }
}