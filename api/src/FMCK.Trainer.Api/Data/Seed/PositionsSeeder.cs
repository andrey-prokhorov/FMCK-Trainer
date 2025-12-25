using System.Text.Json;
using FMCK.Trainer.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FMCK.Trainer.Api.Data.Seed;

public static class PositionsSeeder
{
    public static async Task SeedAsync(
        IServiceProvider services,
        IWebHostEnvironment env)
    {
        using var scope = services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

        // Ensure DB exists
        await db.Database.EnsureCreatedAsync();

        // Prevent double-seeding
        if (await db.Positions.AnyAsync())
            return;

        var filePath = Path.Combine(env.ContentRootPath, "Data", "Seed", "positions.json");

        if (!File.Exists(filePath))
            throw new FileNotFoundException(
                $"Seed file not found: {filePath}");

        var json = await File.ReadAllTextAsync(filePath);

        var positions = JsonSerializer.Deserialize<Position[]>(json,
            new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            }
        ) ?? Array.Empty<Position>();

        if (positions.Length == 0)
            return;

        db.Positions.AddRange(positions);
        await db.SaveChangesAsync();
    }
}