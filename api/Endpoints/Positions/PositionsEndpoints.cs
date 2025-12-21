using FMCK.Trainer.Api.Data;
using FMCK.Trainer.Api.Models;

namespace FMCK.Trainer.Api.Endpoints.Positions;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public static class PositionsEndpoints
{
    public static void MapEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/positions").WithTags("Positions");

        group.MapPost("/", CreatePosition);
        group.MapPut("/{id:guid}", UpdatePosition);
        group.MapDelete("/{id:guid}", DeletePosition);

        // handy reads
        group.MapGet("/all", GetAll);
        group.MapGet("/{id:guid}", GetById);
        group.MapGet("/", GetRandomPosition);
    }

    // DTOs (recommended to avoid over-posting)
    public record CreatePositionRequest(string Name, Coordinates Coordinates, string Address);
    public record UpdatePositionRequest(string Name, Coordinates Coordinates, string Address);

    private static async Task<IResult> GetAll([FromServices] AppDbContext db)
        => Results.Ok(await db.Positions.AsNoTracking().ToListAsync());

    private static async Task<IResult> GetById([FromServices] AppDbContext db, Guid id)
    {
        var pos = await db.Positions.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        return pos is null ? Results.NotFound() : Results.Ok(pos);
    }
    
    private static async Task<IResult> GetRandomPosition([FromServices] AppDbContext db)
    {
        var pos = await db.Positions.AsNoTracking()
            .OrderBy(r => EF.Functions.Random())
            .FirstOrDefaultAsync();

        return pos is null ? Results.NotFound() : Results.Ok(pos);
    }

    // ADD
    private static async Task<IResult> CreatePosition(
        [FromServices] AppDbContext db,
        [FromBody] CreatePositionRequest req)
    {
        var entity = new Position
        {
            Id = Guid.NewGuid(),
            Name = req.Name,
            Coordinates = req.Coordinates,
            Address = req.Address
        };

        db.Positions.Add(entity);
        await db.SaveChangesAsync();

        return Results.Created($"/positions/{entity.Id}", entity);
    }

    // UPDATE
    private static async Task<IResult> UpdatePosition(
        [FromServices] AppDbContext db,
        Guid id,
        [FromBody] UpdatePositionRequest req)
    {
        var entity = await db.Positions.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return Results.NotFound();

        entity.Name = req.Name;
        entity.Address = req.Address;
        entity.Coordinates.Lat = req.Coordinates.Lat;
        entity.Coordinates.Lon = req.Coordinates.Lon;

        await db.SaveChangesAsync();
        return Results.Ok(entity);
    }

    // DELETE
    private static async Task<IResult> DeletePosition([FromServices] AppDbContext db, Guid id)
    {
        var entity = await db.Positions.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return Results.NotFound();

        db.Positions.Remove(entity);
        await db.SaveChangesAsync();

        return Results.NoContent();
    }
}
