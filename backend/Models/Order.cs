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
    public OrderStatus Status { get; set; } = OrderStatus.EmAndamento;

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    public DateTime? CompletedAt { get; set; }

    public List<OrderItem> Items { get; set; } = new List<OrderItem>();

    [Column(TypeName = "decimal(18,2)")]
    public decimal TotalAmount { get; set; }

    public string? CustomerNotes { get; set; }

    public int QueuePosition { get; set; }

    // Relacionamento com histórico de status
    public List<OrderStatusHistory>? StatusHistory { get; set; }

    // Navegação para mesa
    [ForeignKey("TableId")]
    public Table? Table { get; set; }

    // Timestamps específicos para cada status
    public DateTime? PaidAt { get; set; }
    public DateTime? CancelledAt { get; set; }
    public DateTime? DeliveredAt { get; set; }
}

public enum OrderStatus
{
    EmAndamento = 0,    // Status inicial automático
    Cancelado = 1,
    Entregue = 2,
    Pago = 3
}
