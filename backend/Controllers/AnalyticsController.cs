using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Aero_comidas.Models;
using Aero_comidas.Data;

namespace Aero_comidas.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AnalyticsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<AnalyticsController> _logger;

    public AnalyticsController(ApplicationDbContext context, ILogger<AnalyticsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Retorna o ticket médio (valor médio por pedido)
    /// </summary>
    [HttpGet("average-ticket")]
    public async Task<IActionResult> GetAverageTicket([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        try
        {
            var query = _context.Orders.AsQueryable();

            if (startDate.HasValue)
                query = query.Where(o => o.CreatedAt.Date >= startDate.Value.Date);

            if (endDate.HasValue)
                query = query.Where(o => o.CreatedAt.Date <= endDate.Value.Date);

            var orders = await query.ToListAsync();

            if (!orders.Any())
            {
                return Ok(new { averageTicket = 0, totalOrders = 0 });
            }

            var averageTicket = orders.Average(o => o.TotalAmount);
            var totalOrders = orders.Count;
            var totalRevenue = orders.Sum(o => o.TotalAmount);

            return Ok(new
            {
                averageTicket = Math.Round(averageTicket, 2),
                totalOrders,
                totalRevenue = Math.Round(totalRevenue, 2),
                period = new
                {
                    start = startDate?.ToString("yyyy-MM-dd") ?? "início",
                    end = endDate?.ToString("yyyy-MM-dd") ?? "hoje"
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao calcular ticket médio");
            return StatusCode(500, new { message = "Erro ao calcular ticket médio" });
        }
    }

    /// <summary>
    /// Retorna os itens mais vendidos
    /// </summary>
    [HttpGet("top-selling-items")]
    public async Task<IActionResult> GetTopSellingItems([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate, [FromQuery] int limit = 10)
    {
        try
        {
            var query = _context.OrderItems
                .Include(oi => oi.Order)
                .AsQueryable();

            if (startDate.HasValue)
                query = query.Where(oi => oi.Order!.CreatedAt.Date >= startDate.Value.Date);

            if (endDate.HasValue)
                query = query.Where(oi => oi.Order!.CreatedAt.Date <= endDate.Value.Date);

            // Buscar dados do banco primeiro (client-side evaluation para decimal)
            var items = await query.ToListAsync();

            // Fazer agregação no cliente (memória) para evitar problema com decimal no SQLite
            var topItems = items
                .GroupBy(oi => oi.ProductName)
                .Select(g => new
                {
                    productName = g.Key,
                    totalQuantity = g.Sum(oi => oi.Quantity),
                    totalRevenue = g.Sum(oi => oi.Quantity * oi.UnitPrice),
                    orderCount = g.Select(oi => oi.OrderId).Distinct().Count()
                })
                .OrderByDescending(x => x.totalQuantity)
                .Take(limit)
                .ToList();

            return Ok(topItems);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar itens mais vendidos");
            return StatusCode(500, new { message = "Erro ao buscar itens mais vendidos" });
        }
    }

    /// <summary>
    /// Retorna o volume de vendas por hora (para identificar horários de pico)
    /// </summary>
    [HttpGet("sales-by-hour")]
    public async Task<IActionResult> GetSalesByHour([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        try
        {
            IQueryable<Order> query = _context.Orders;

            // Se não informar datas, busca TODOS os pedidos (todo período)
            if (startDate.HasValue)
                query = query.Where(o => o.CreatedAt.Date >= startDate.Value.Date);
            
            if (endDate.HasValue)
                query = query.Where(o => o.CreatedAt.Date <= endDate.Value.Date);

            var orders = await query.ToListAsync();

            var salesByHour = orders
                .GroupBy(o => o.CreatedAt.Hour)
                .Select(g => new
                {
                    hour = g.Key,
                    orderCount = g.Count(),
                    totalRevenue = Math.Round(g.Sum(o => o.TotalAmount), 2),
                    averageTicket = Math.Round(g.Average(o => o.TotalAmount), 2)
                })
                .OrderBy(x => x.hour)
                .ToList();

            // Preenche as horas sem vendas com valores zero
            var allHours = Enumerable.Range(0, 24).Select(hour => new
            {
                hour,
                orderCount = salesByHour.FirstOrDefault(s => s.hour == hour)?.orderCount ?? 0,
                totalRevenue = salesByHour.FirstOrDefault(s => s.hour == hour)?.totalRevenue ?? 0,
                averageTicket = salesByHour.FirstOrDefault(s => s.hour == hour)?.averageTicket ?? 0
            });

            // Define período para resposta
            var periodStart = startDate?.ToString("yyyy-MM-dd") ?? "início";
            var periodEnd = endDate?.ToString("yyyy-MM-dd") ?? "hoje";
            var dateLabel = startDate.HasValue && endDate.HasValue && startDate == endDate 
                ? startDate.Value.ToString("yyyy-MM-dd") 
                : $"{periodStart} até {periodEnd}";

            return Ok(new
            {
                date = dateLabel,
                hourlyData = allHours,
                peakHour = salesByHour.OrderByDescending(s => s.orderCount).FirstOrDefault()?.hour ?? 0,
                totalDayRevenue = Math.Round(orders.Sum(o => o.TotalAmount), 2),
                totalDayOrders = orders.Count
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar vendas por hora");
            return StatusCode(500, new { message = "Erro ao buscar vendas por hora" });
        }
    }

    /// <summary>
    /// Retorna estatísticas gerais do período
    /// </summary>
    [HttpGet("dashboard")]
    public async Task<IActionResult> GetDashboardStats([FromQuery] DateTime? startDate, [FromQuery] DateTime? endDate)
    {
        try
        {
            startDate ??= DateTime.UtcNow.Date.AddDays(-30);
            endDate ??= DateTime.UtcNow.Date;

            var orders = await _context.Orders
                .Include(o => o.Items)
                .Where(o => o.CreatedAt.Date >= startDate.Value.Date && o.CreatedAt.Date <= endDate.Value.Date)
                .ToListAsync();

            // Usar todos os pedidos para calcular métricas
            var totalRevenue = orders.Sum(o => o.TotalAmount);
            var totalOrders = orders.Count;
            var averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

            var dailyRevenue = orders
                .Select(o => new
                {
                    date = o.CreatedAt.ToString("o"),
                    revenue = Math.Round(o.TotalAmount, 2),
                    orderId = o.Id
                })
                .OrderBy(x => x.date)
                .ToList();

            var statusDistribution = orders
                .GroupBy(o => o.Status)
                .Select(g => new
                {
                    status = g.Key.ToString(),
                    count = g.Count(),
                    percentage = Math.Round((double)g.Count() / orders.Count * 100, 2)
                })
                .ToList();

            return Ok(new
            {
                period = new
                {
                    start = startDate.Value.ToString("yyyy-MM-dd"),
                    end = endDate.Value.ToString("yyyy-MM-dd")
                },
                summary = new
                {
                    totalRevenue = Math.Round(totalRevenue, 2),
                    totalOrders,
                    averageTicket = Math.Round(averageTicket, 2),
                    pendingOrders = orders.Count(o => o.Status == OrderStatus.EmAndamento),
                },
                dailyRevenue,
                statusDistribution
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao gerar estatísticas do dashboard");
            return StatusCode(500, new { message = "Erro ao gerar estatísticas" });
        }
    }

    /// <summary>
    /// Retorna dados para comparação de períodos
    /// </summary>
    [HttpGet("comparison")]
    public async Task<IActionResult> GetPeriodComparison()
    {
        try
        {
            var today = DateTime.UtcNow.Date;
            var yesterday = today.AddDays(-1);
            var thisWeekStart = today.AddDays(-(int)today.DayOfWeek);
            var lastWeekStart = thisWeekStart.AddDays(-7);
            var thisMonthStart = new DateTime(today.Year, today.Month, 1);
            var lastMonthStart = thisMonthStart.AddMonths(-1);

            var todayOrders = await GetOrdersInRange(today, today.AddDays(1));
            var yesterdayOrders = await GetOrdersInRange(yesterday, today);
            var thisWeekOrders = await GetOrdersInRange(thisWeekStart, today.AddDays(1));
            var lastWeekOrders = await GetOrdersInRange(lastWeekStart, thisWeekStart);
            var thisMonthOrders = await GetOrdersInRange(thisMonthStart, today.AddDays(1));
            var lastMonthOrders = await GetOrdersInRange(lastMonthStart, thisMonthStart);

            return Ok(new
            {
                daily = new
                {
                    today = CalculateMetrics(todayOrders),
                    yesterday = CalculateMetrics(yesterdayOrders),
                    change = CalculateChange(yesterdayOrders, todayOrders)
                },
                weekly = new
                {
                    thisWeek = CalculateMetrics(thisWeekOrders),
                    lastWeek = CalculateMetrics(lastWeekOrders),
                    change = CalculateChange(lastWeekOrders, thisWeekOrders)
                },
                monthly = new
                {
                    thisMonth = CalculateMetrics(thisMonthOrders),
                    lastMonth = CalculateMetrics(lastMonthOrders),
                    change = CalculateChange(lastMonthOrders, thisMonthOrders)
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao gerar comparação de períodos");
            return StatusCode(500, new { message = "Erro ao gerar comparação" });
        }
    }

    private async Task<List<Order>> GetOrdersInRange(DateTime start, DateTime end)
    {
        return await _context.Orders
            .Where(o => o.CreatedAt >= start &&
                       o.CreatedAt < end)
            .ToListAsync();
    }

    private object CalculateMetrics(List<Order> orders)
    {
        var totalRevenue = orders.Sum(o => o.TotalAmount);
        var totalOrders = orders.Count;
        var averageTicket = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        return new
        {
            revenue = Math.Round(totalRevenue, 2),
            orders = totalOrders,
            averageTicket = Math.Round(averageTicket, 2)
        };
    }

    private object CalculateChange(List<Order> oldPeriod, List<Order> newPeriod)
    {
        var oldRevenue = oldPeriod.Sum(o => o.TotalAmount);
        var newRevenue = newPeriod.Sum(o => o.TotalAmount);

        var revenueChange = oldRevenue > 0
            ? Math.Round((newRevenue - oldRevenue) / oldRevenue * 100, 2)
            : 0;

        var ordersChange = oldPeriod.Count > 0
            ? Math.Round((double)(newPeriod.Count - oldPeriod.Count) / oldPeriod.Count * 100, 2)
            : 0;

        return new
        {
            revenuePercentage = revenueChange,
            ordersPercentage = ordersChange,
            trend = revenueChange > 0 ? "up" : revenueChange < 0 ? "down" : "stable"
        };
    }
}
