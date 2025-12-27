using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Aero_comidas.Models;

public class Order
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int TableId { get; set; }

    [Required]
    public OrderStatus Status { get; set; } = OrderStatus.Pendente;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? UpdatedAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    public List<OrderItem> Items { get; set; } = new List<OrderItem>();

    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalAmount { get; set; }

    public string? CustomerNotes { get; set; }

    public int QueuePosition { get; set; }
}

public enum OrderStatus
{
    Pendente = 0,
    Preparando = 1,
    Pronto = 2,
    Entregue = 3,
    Cancelado = 4
}
