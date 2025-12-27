using Microsoft.EntityFrameworkCore;
using Aero_comidas.Models;

namespace Aero_comidas.Data;

/// <summary>
/// Contexto do banco de dados - isolado para facilitar manutenção
/// Preparado para migração SQLite -> MySQL sem impacto no resto da aplicação
/// </summary>
public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    // DbSets para cada entidade
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<MenuItem> MenuItems { get; set; }
    public DbSet<Table> Tables { get; set; }
    public DbSet<OrderStatusHistory> OrderStatusHistories { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Configurações adicionais podem ser feitas aqui
        // Ex: índices, constraints, relações complexas
        
        modelBuilder.Entity<Order>()
            .HasIndex(o => o.TableId);
        
        modelBuilder.Entity<Order>()
            .HasIndex(o => o.Status);
        
        modelBuilder.Entity<Order>()
            .HasIndex(o => o.CreatedAt);

        modelBuilder.Entity<MenuItem>()
            .HasIndex(m => m.Category);

        modelBuilder.Entity<Table>()
            .HasIndex(t => t.TableNumber)
            .IsUnique();

        // Relacionamento Order -> Table
        modelBuilder.Entity<Order>()
            .HasOne(o => o.Table)
            .WithMany(t => t.Orders)
            .HasForeignKey(o => o.TableId)
            .OnDelete(DeleteBehavior.Restrict);

        // Relacionamento Order -> OrderStatusHistory
        modelBuilder.Entity<OrderStatusHistory>()
            .HasOne(h => h.Order)
            .WithMany(o => o.StatusHistory)
            .HasForeignKey(h => h.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<OrderStatusHistory>()
            .HasIndex(h => h.OrderId);
    }
}
