using Aero_comidas.Models;

namespace Aero_comidas.DTOs;

/// <summary>
/// DTO para criação de pedido - recebido do frontend
/// </summary>
public class CreateOrderDto
{
    public int TableId { get; set; }
    public string? CustomerNotes { get; set; }
    public List<CreateOrderItemDto> Items { get; set; } = new();
}

/// <summary>
/// DTO para item de pedido na criação
/// </summary>
public class CreateOrderItemDto
{
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public string? Notes { get; set; }
}

/// <summary>
/// DTO para resposta de pedido - enviado ao frontend
/// </summary>
public class OrderResponseDto
{
    public int Id { get; set; }
    public int TableId { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? CompletedAt { get; set; }
    public decimal TotalAmount { get; set; }
    public string? CustomerNotes { get; set; }
    public int QueuePosition { get; set; }
    public List<OrderItemResponseDto> Items { get; set; } = new();
}

/// <summary>
/// DTO para item de pedido na resposta
/// </summary>
public class OrderItemResponseDto
{
    public int Id { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
    public string? Notes { get; set; }
}

/// <summary>
/// DTO para atualização de status do pedido
/// </summary>
public class UpdateOrderStatusDto
{
    public OrderStatus Status { get; set; }
}
