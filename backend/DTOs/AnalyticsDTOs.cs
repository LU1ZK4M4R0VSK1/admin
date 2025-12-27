namespace Aero_comidas.DTOs;

/// <summary>
/// DTO para dados de analytics por mesa - facilita segmentação de marketing
/// </summary>
public class TableAnalyticsDto
{
    public int TableId { get; set; }
    public int TableNumber { get; set; }
    public string? Location { get; set; }
    public int TotalOrders { get; set; }
    public decimal TotalRevenue { get; set; }
    public decimal AverageTicket { get; set; }
    public List<string> TopProducts { get; set; } = new();
    public DateTime? LastOrderDate { get; set; }
}

/// <summary>
/// DTO para período de análise
/// </summary>
public class DateRangeDto
{
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
}

/// <summary>
/// DTO para métricas do dashboard
/// </summary>
public class DashboardMetricsDto
{
    public decimal TotalRevenue { get; set; }
    public int TotalOrders { get; set; }
    public decimal AverageTicket { get; set; }
    public List<ProductSalesDto> TopProducts { get; set; } = new();
    public List<HourlySalesDto> HourlySales { get; set; } = new();
    public Dictionary<string, int> OrderStatusDistribution { get; set; } = new();
}

/// <summary>
/// DTO para vendas de produto
/// </summary>
public class ProductSalesDto
{
    public string ProductName { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public decimal Revenue { get; set; }
    public int OrderCount { get; set; }
}

/// <summary>
/// DTO para vendas por hora
/// </summary>
public class HourlySalesDto
{
    public int Hour { get; set; }
    public int OrderCount { get; set; }
    public decimal Revenue { get; set; }
}
