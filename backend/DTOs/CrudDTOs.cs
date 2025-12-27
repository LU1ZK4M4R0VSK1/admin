namespace Aero_comidas.DTOs;

// ========== ORDER DTOs ==========

public class CreateOrderDto
{
    public int TableId { get; set; }
    public List<CreateOrderItemDto> Items { get; set; } = new();
    public string? CustomerNotes { get; set; }
}

public class CreateOrderItemDto
{
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public string? Notes { get; set; }
}

public class UpdateOrderDto
{
    public List<CreateOrderItemDto>? Items { get; set; }
    public string? CustomerNotes { get; set; }
}

public class ChangeOrderStatusDto
{
    public int NewStatus { get; set; }
    public string? Notes { get; set; }
    public string? ChangedBy { get; set; }
}

public class OrderResponseDto
{
    public int Id { get; set; }
    public int TableId { get; set; }
    public string TableNumber { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public DateTime? PaidAt { get; set; }
    public DateTime? CancelledAt { get; set; }
    public DateTime? DeliveredAt { get; set; }
    public decimal TotalAmount { get; set; }
    public string? CustomerNotes { get; set; }
    public List<OrderItemDto> Items { get; set; } = new();
    public List<OrderStatusHistoryDto> StatusHistory { get; set; } = new();
    public bool CanEdit { get; set; }
}

public class OrderItemDto
{
    public int Id { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal UnitPrice { get; set; }
    public decimal TotalPrice { get; set; }
    public string? Notes { get; set; }
}

public class OrderStatusHistoryDto
{
    public int Id { get; set; }
    public string FromStatus { get; set; } = string.Empty;
    public string ToStatus { get; set; } = string.Empty;
    public DateTime ChangedAt { get; set; }
    public string? Notes { get; set; }
    public string? ChangedBy { get; set; }
}

// ========== TABLE DTOs ==========

public class CreateTableDto
{
    public int TableNumber { get; set; }
    public int Capacity { get; set; }
    public string? Location { get; set; }
}

public class UpdateTableDto
{
    public int? Capacity { get; set; }
    public int? Status { get; set; }
    public string? Location { get; set; }
    public string? CurrentWaiter { get; set; }
}

public class TableResponseDto
{
    public int Id { get; set; }
    public int TableNumber { get; set; }
    public int Capacity { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Location { get; set; }
    public DateTime? OccupiedSince { get; set; }
    public string? CurrentWaiter { get; set; }
    public int TotalOrders { get; set; }
    public List<OrderSummaryDto> ActiveOrders { get; set; } = new();
    public List<OrderTimeDto> OrderTimes { get; set; } = new();
}

public class OrderSummaryDto
{
    public int Id { get; set; }
    public string Status { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public decimal TotalAmount { get; set; }
    public TimeSpan ElapsedTime { get; set; }
}

public class OrderTimeDto
{
    public int OrderId { get; set; }
    public DateTime OpenedAt { get; set; }
    public DateTime? ClosedAt { get; set; }
    public TimeSpan Duration { get; set; }
    public List<StatusDurationDto> StatusDurations { get; set; } = new();
}

public class StatusDurationDto
{
    public string Status { get; set; } = string.Empty;
    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public TimeSpan Duration { get; set; }
}

// ========== MENU ITEM DTOs ==========

public class CreateMenuItemDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string Category { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? Ingredients { get; set; }
    public bool IsAvailable { get; set; } = true;
}

public class UpdateMenuItemDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public string? Category { get; set; }
    public string? ImageUrl { get; set; }
    public string? Ingredients { get; set; }
    public bool? IsAvailable { get; set; }
}

public class MenuItemResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string Category { get; set; } = string.Empty;
    public string? ImageUrl { get; set; }
    public string? Ingredients { get; set; }
    public bool IsAvailable { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
