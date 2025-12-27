using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    // Relacionamento com pedidos
    public List<Order>? Orders { get; set; }

    // Propriedades calculadas (NotMapped para não criar colunas no DB)
    [NotMapped]
    public int TotalOrders => Orders?.Count ?? 0;

    [NotMapped]
    public List<Order> ActiveOrders => Orders?.Where(o => o.Status != OrderStatus.Pago && o.Status != OrderStatus.Cancelado).ToList() ?? new List<Order>();
}

public enum TableStatus
{
    Disponivel = 0,
    Ocupada = 1,
    Reservada = 2
}
