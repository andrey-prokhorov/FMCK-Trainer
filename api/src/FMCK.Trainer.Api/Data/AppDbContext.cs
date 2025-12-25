using FMCK.Trainer.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace FMCK.Trainer.Api.Data;

public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Position> Positions => Set<Position>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Position>().HasKey(p => p.Id);
        modelBuilder.Entity<Position>().OwnsOne(p => p.Coordinates);
    }
}