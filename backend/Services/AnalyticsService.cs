using Microsoft.EntityFrameworkCore;
using Aero_comidas.Data;
using Aero_comidas.Models;
using Aero_comidas.DTOs;
using Aero_comidas.Repositories.Interfaces;

namespace Aero_comidas.Services;

/// <summary>
/// Serviço especializado em Analytics e BI
/// Processa dados de pedidos por mesa para fins de marketing e análise de negócio
/// </summary>
public class AnalyticsService
{
    private readonly ApplicationDbContext _context;
    private readonly IOrderRepository _orderRepository;
    private readonly ITableRepository _tableRepository;
    private readonly ILogger<AnalyticsService> _logger;

    public AnalyticsService(
        ApplicationDbContext context,
        IOrderRepository orderRepository,
        ITableRepository tableRepository,
        ILogger<AnalyticsService> logger)
    {
        _context = context;
        _orderRepository = orderRepository;
        _tableRepository = tableRepository;
        _logger = logger;
    }

    /// <summary>
    /// Retorna analytics agregados por mesa - útil para identificar mesas mais lucrativas
    /// </summary>
    public async Task<IEnumerable<TableAnalyticsDto>> GetTableAnalyticsAsync(DateTime? startDate, DateTime? endDate)
    {
        try
        {
            var query = _context.Orders
                .Include(o => o.Items)
                .AsQueryable();

            if (startDate.HasValue)
                query = query.Where(o => o.CreatedAt >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(o => o.CreatedAt <= endDate.Value);

            var ordersByTable = await query
                .GroupBy(o => o.TableId)
                .Select(g => new
                {
                    TableId = g.Key,
                    TotalOrders = g.Count(),
                    TotalRevenue = g.Sum(o => o.TotalAmount),
                    LastOrderDate = g.Max(o => o.CreatedAt),
                    TopProducts = g.SelectMany(o => o.Items)
                        .GroupBy(i => i.ProductName)
                        .OrderByDescending(pg => pg.Sum(i => i.Quantity))
                        .Take(3)
                        .Select(pg => pg.Key)
                        .ToList()
                })
                .ToListAsync();

            var result = new List<TableAnalyticsDto>();

            foreach (var data in ordersByTable)
            {
                var table = await _tableRepository.GetByIdAsync(data.TableId);
                if (table != null)
                {
                    result.Add(new TableAnalyticsDto
                    {
                        TableId = data.TableId,
                        TableNumber = table.TableNumber,
                        Location = table.Location,
                        TotalOrders = data.TotalOrders,
                        TotalRevenue = Math.Round(data.TotalRevenue, 2),
                        AverageTicket = Math.Round(data.TotalRevenue / data.TotalOrders, 2),
                        TopProducts = data.TopProducts,
                        LastOrderDate = data.LastOrderDate
                    });
                }
            }

            return result.OrderByDescending(r => r.TotalRevenue);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao calcular analytics por mesa");
            throw;
        }
    }

    /// <summary>
    /// Retorna métricas consolidadas para dashboard executivo
    /// </summary>
    public async Task<DashboardMetricsDto> GetDashboardMetricsAsync(DateTime? startDate, DateTime? endDate)
    {
        try
        {
            startDate ??= DateTime.UtcNow.AddDays(-30);
            endDate ??= DateTime.UtcNow;

            var orders = await _orderRepository.GetOrdersByDateRangeAsync(startDate.Value, endDate.Value);
            var ordersList = orders.ToList();

            var metrics = new DashboardMetricsDto
            {
                TotalRevenue = Math.Round(ordersList.Sum(o => o.TotalAmount), 2),
                TotalOrders = ordersList.Count,
                AverageTicket = ordersList.Any() 
                    ? Math.Round(ordersList.Average(o => o.TotalAmount), 2) 
                    : 0
            };

            // Top produtos
            metrics.TopProducts = ordersList
                .SelectMany(o => o.Items)
                .GroupBy(i => i.ProductName)
                .Select(g => new ProductSalesDto
                {
                    ProductName = g.Key,
                    Quantity = g.Sum(i => i.Quantity),
                    Revenue = Math.Round(g.Sum(i => i.Quantity * i.UnitPrice), 2),
                    OrderCount = g.Select(i => i.OrderId).Distinct().Count()
                })
                .OrderByDescending(p => p.Revenue)
                .Take(10)
                .ToList();

            // Vendas por hora
            metrics.HourlySales = ordersList
                .GroupBy(o => o.CreatedAt.Hour)
                .Select(g => new HourlySalesDto
                {
                    Hour = g.Key,
                    OrderCount = g.Count(),
                    Revenue = Math.Round(g.Sum(o => o.TotalAmount), 2)
                })
                .OrderBy(h => h.Hour)
                .ToList();

            // Distribuição por status
            metrics.OrderStatusDistribution = ordersList
                .GroupBy(o => o.Status.ToString())
                .ToDictionary(g => g.Key, g => g.Count());

            return metrics;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao calcular métricas do dashboard");
            throw;
        }
    }

    /// <summary>
    /// Identifica padrões de consumo por localização de mesa
    /// Útil para estratégias de marketing e otimização de layout
    /// </summary>
    public async Task<Dictionary<string, decimal>> GetRevenueByLocationAsync(DateTime? startDate, DateTime? endDate)
    {
        try
        {
            var query = _context.Orders
                .Include(o => o.Items)
                .AsQueryable();

            if (startDate.HasValue)
                query = query.Where(o => o.CreatedAt >= startDate.Value);

            if (endDate.HasValue)
                query = query.Where(o => o.CreatedAt <= endDate.Value);

            var ordersWithTables = await query
                .Join(_context.Tables,
                    order => order.TableId,
                    table => table.Id,
                    (order, table) => new { Order = order, Table = table })
                .ToListAsync();

            return ordersWithTables
                .GroupBy(x => x.Table.Location ?? "Não especificado")
                .ToDictionary(
                    g => g.Key,
                    g => Math.Round(g.Sum(x => x.Order.TotalAmount), 2)
                );
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao calcular receita por localização");
            throw;
        }
    }
}
