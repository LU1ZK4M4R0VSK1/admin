using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Aero_comidas.Models;

/// <summary>
/// Histórico de mudanças de status dos pedidos
/// Mantém registro de todas as alterações com timestamps
/// </summary>
public class OrderStatusHistory
{
    [Key]
    public int Id { get; set; }

    [Required]
    public int OrderId { get; set; }

    [ForeignKey("OrderId")]
    public Order? Order { get; set; }

    [Required]
    public OrderStatus FromStatus { get; set; }

    [Required]
    public OrderStatus ToStatus { get; set; }

    [Required]
    public DateTime ChangedAt { get; set; } = DateTime.UtcNow;

    [MaxLength(500)]
    public string? Notes { get; set; }

    [MaxLength(100)]
    public string? ChangedBy { get; set; } // Usuário que fez a mudança
}
