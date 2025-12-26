using FMCK.Trainer.Api.Data;
using FMCK.Trainer.Api.Models;
using FMCK.Trainer.Api.Services;

namespace FMCK.Trainer.Api.Endpoints.Positions;

using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

public static class PositionsEndpoints
{
    public static void MapEndpoints(this IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("/positions").WithTags("Positions");

        group.MapGet("/all", GetAll);
        group.MapGet("/{id:guid}", GetById);
        group.MapGet("/", GetRandomPosition);

        group.MapPost("/", CreatePosition);
        group.MapPost("/check", CheckPosition);
        group.MapPut("/{id:guid}", UpdatePosition);
        group.MapDelete("/{id:guid}", DeletePosition);
    }

    private record CreatePositionRequest(string Name, Wgs84Coordinates Coordinates, string Address);

    private record UpdatePositionRequest(string Name, Wgs84Coordinates Coordinates, string Address);

    private record CheckPositionRequest(Guid Id, string Name);

    private static async Task<IResult> GetAll([FromServices] AppDbContext db)
    {
        var positions = await db.Positions
            .AsNoTracking()
            .Select(p => new Position
            {
                Id = p.Id,
                Name = p.Name,
                Coordinates = p.Coordinates,
                Address = p.Address
            })
            .ToListAsync();

        return Results.Ok(positions);
    }

    private static async Task<IResult> GetById([FromServices] AppDbContext db, Guid id)
    {
        var pos = await db.Positions.AsNoTracking().FirstOrDefaultAsync(x => x.Id == id);
        return pos is null ? Results.NotFound() : Results.Ok(pos);
    }

    private static async Task<IResult> GetRandomPosition([FromServices] AppDbContext db)
    {
        var position = await db.Positions.AsNoTracking()
            .OrderBy(r => EF.Functions.Random())
            .FirstOrDefaultAsync();

        if (position is null)
            return Results.NotFound();

        var positionDto = new UppgiftPositionDto
        {
            Id = position.Id,
            Wgs84Coordinates = position.Coordinates,
            Sweref99Coordinates = CoordinateConverter.Convert(position.Coordinates),
            Address = position.Address
        };

        return Results.Ok(positionDto);
    }

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

    private static async Task<IResult> DeletePosition([FromServices] AppDbContext db, Guid id)
    {
        var entity = await db.Positions.FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null) return Results.NotFound();

        db.Positions.Remove(entity);
        await db.SaveChangesAsync();

        return Results.NoContent();
    }

    private static async Task<IResult> CheckPosition(
        [FromServices] AppDbContext db,
        [FromBody] CheckPositionRequest req)
    {
        var exists = await db.Positions.AnyAsync(p => p.Id == req.Id && p.Name == req.Name);
        return Results.Ok(new { Correct = exists });
    }
}