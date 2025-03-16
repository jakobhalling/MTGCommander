using Microsoft.EntityFrameworkCore;
using MTGCommander.Core.Entities;

namespace MTGCommander.Infrastructure.Database;

public class MTGCommanderDbContext : DbContext
{
    public MTGCommanderDbContext(DbContextOptions<MTGCommanderDbContext> options)
        : base(options)
    {
    }

    public DbSet<Card> Cards { get; set; } = null!;
    public DbSet<Deck> Decks { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configure entities
        modelBuilder.Entity<Card>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired();
            entity.Property(e => e.ScryfallId).IsRequired();
        });

        modelBuilder.Entity<Deck>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Name).IsRequired();
            entity.HasOne(e => e.Commander)
                  .WithMany()
                  .HasForeignKey(e => e.CommanderId)
                  .OnDelete(DeleteBehavior.Restrict);
        });
    }
} 