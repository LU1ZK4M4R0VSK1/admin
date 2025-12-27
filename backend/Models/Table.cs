using System.ComponentModel.DataAnnotations;

namespace Aero_comidas.Models;

public class Table
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int TableNumber { get; set; }

    [Required]
    public int Capacity { get; set; }

    public TableStatus Status { get; set; } = TableStatus.Disponivel;

    public string? Location { get; set; } // Ex: "Janela", "Varanda", "Interno"

    public DateTime? OccupiedSince { get; set; }

    public string? CurrentWaiter { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    // Relacionamento com pedidos
    public List<Order>? Orders { get; set; }
}

public enum TableStatus
{
    Disponivel = 0,
    Ocupada = 1,
    Reservada = 2,
    Limpeza = 3
}
