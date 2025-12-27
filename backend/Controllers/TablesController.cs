using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Aero_comidas.Data;
using Aero_comidas.Models;
using Aero_comidas.DTOs;

namespace Aero_comidas.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TablesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<TablesController> _logger;

    public TablesController(ApplicationDbContext context, ILogger<TablesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/tables
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TableResponseDto>>> GetTables(
        [FromQuery] int? status = null)
    {
        var query = _context.Tables
            .Include(t => t.Orders!)
                .ThenInclude(o => o.Items)
            .Include(t => t.Orders!)
                .ThenInclude(o => o.StatusHistory)
            .AsQueryable();

        if (status.HasValue)
            query = query.Where(t => (int)t.Status == status.Value);

        var tables = await query.OrderBy(t => t.TableNumber).ToListAsync();

        return Ok(tables.Select(MapToDto));
    }

    // GET: api/tables/5
    [HttpGet("{id}")]
    public async Task<ActionResult<TableResponseDto>> GetTable(int id)
    {
        var table = await _context.Tables
            .Include(t => t.Orders!)
                .ThenInclude(o => o.Items)
            .Include(t => t.Orders!)
                .ThenInclude(o => o.StatusHistory)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (table == null)
            return NotFound(new { message = "Mesa não encontrada" });

        return Ok(MapToDto(table));
    }

    // GET: api/tables/number/5
    [HttpGet("number/{tableNumber}")]
    public async Task<ActionResult<TableResponseDto>> GetTableByNumber(int tableNumber)
    {
        var table = await _context.Tables
            .Include(t => t.Orders!)
                .ThenInclude(o => o.Items)
            .Include(t => t.Orders!)
                .ThenInclude(o => o.StatusHistory)
            .FirstOrDefaultAsync(t => t.TableNumber == tableNumber);

        if (table == null)
            return NotFound(new { message = "Mesa não encontrada" });

        return Ok(MapToDto(table));
    }

    // GET: api/tables/stats
    [HttpGet("stats")]
    public async Task<ActionResult<object>> GetTablesStats()
    {
        var total = await _context.Tables.CountAsync();
        var available = await _context.Tables.CountAsync(t => t.Status == TableStatus.Disponivel);
        var occupied = await _context.Tables.CountAsync(t => t.Status == TableStatus.Ocupada);
        var reserved = await _context.Tables.CountAsync(t => t.Status == TableStatus.Reservada);

        return Ok(new
        {
            total,
            available,
            occupied,
            reserved,
            occupancyRate = total > 0 ? Math.Round((double)occupied / total * 100, 2) : 0
        });
    }

    // POST: api/tables
    [HttpPost]
    public async Task<ActionResult<TableResponseDto>> CreateTable(CreateTableDto dto)
    {
        // Verificar se número da mesa já existe
        if (await _context.Tables.AnyAsync(t => t.TableNumber == dto.TableNumber))
            return BadRequest(new { message = "Já existe uma mesa com este número" });

        var table = new Table
        {
            TableNumber = dto.TableNumber,
            Capacity = dto.Capacity,
            Location = dto.Location,
            Status = TableStatus.Disponivel,
            CreatedAt = DateTime.UtcNow
        };

        _context.Tables.Add(table);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Mesa {TableNumber} criada", table.TableNumber);

        var createdTable = await _context.Tables
            .Include(t => t.Orders)
            .FirstAsync(t => t.Id == table.Id);

        return CreatedAtAction(nameof(GetTable), new { id = table.Id }, MapToDto(createdTable));
    }

    // PUT: api/tables/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTable(int id, UpdateTableDto dto)
    {
        var table = await _context.Tables.FindAsync(id);

        if (table == null)
            return NotFound(new { message = "Mesa não encontrada" });

        if (dto.Capacity.HasValue)
            table.Capacity = dto.Capacity.Value;

        if (dto.Status.HasValue)
        {
            var newStatus = (TableStatus)dto.Status.Value;
            
            // Se mudar para ocupada, definir timestamp
            if (newStatus == TableStatus.Ocupada && table.Status != TableStatus.Ocupada)
                table.OccupiedSince = DateTime.UtcNow;
            
            // Se liberar a mesa, limpar timestamp
            if (newStatus == TableStatus.Disponivel && table.Status != TableStatus.Disponivel)
                table.OccupiedSince = null;

            table.Status = newStatus;
        }

        if (dto.Location != null)
            table.Location = dto.Location;

        if (dto.CurrentWaiter != null)
            table.CurrentWaiter = dto.CurrentWaiter;

        table.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Mesa {TableNumber} atualizada", table.TableNumber);

        return NoContent();
    }

    // DELETE: api/tables/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTable(int id)
    {
        var table = await _context.Tables
            .Include(t => t.Orders)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (table == null)
            return NotFound(new { message = "Mesa não encontrada" });

        // Verificar se tem pedidos ativos
        if (table.Orders != null && table.Orders.Any(o => o.Status != OrderStatus.Pago && o.Status != OrderStatus.Cancelado))
            return BadRequest(new { message = "Não é possível excluir mesa com pedidos ativos" });

        _context.Tables.Remove(table);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Mesa {TableNumber} excluída", table.TableNumber);

        return NoContent();
    }

    // Método auxiliar para mapear Table para DTO
    private TableResponseDto MapToDto(Table table)
    {
        var allOrders = table.Orders ?? new List<Order>();
        var activeOrders = allOrders.Where(o => o.Status != OrderStatus.Pago && o.Status != OrderStatus.Cancelado).ToList();

        return new TableResponseDto
        {
            Id = table.Id,
            TableNumber = table.TableNumber,
            Capacity = table.Capacity,
            Status = table.Status.ToString(),
            Location = table.Location,
            OccupiedSince = table.OccupiedSince,
            CurrentWaiter = table.CurrentWaiter,
            TotalOrders = allOrders.Count,
            ActiveOrders = activeOrders.Select(o => new OrderSummaryDto
            {
                Id = o.Id,
                Status = o.Status.ToString(),
                CreatedAt = o.CreatedAt,
                TotalAmount = o.TotalAmount,
                ElapsedTime = DateTime.UtcNow - o.CreatedAt
            }).ToList(),
            OrderTimes = allOrders.Select(o => CalculateOrderTime(o)).ToList()
        };
    }

    // Calcular tempo do pedido e duração de cada status
    private OrderTimeDto CalculateOrderTime(Order order)
    {
        var openedAt = order.CreatedAt;
        var closedAt = order.Status == OrderStatus.Pago || order.Status == OrderStatus.Cancelado 
            ? (order.PaidAt ?? order.CancelledAt) 
            : null;

        var duration = closedAt.HasValue 
            ? closedAt.Value - openedAt 
            : DateTime.UtcNow - openedAt;

        var statusDurations = new List<StatusDurationDto>();

        if (order.StatusHistory != null && order.StatusHistory.Any())
        {
            var sortedHistory = order.StatusHistory.OrderBy(h => h.ChangedAt).ToList();

            for (int i = 0; i < sortedHistory.Count; i++)
            {
                var current = sortedHistory[i];
                var next = i < sortedHistory.Count - 1 ? sortedHistory[i + 1] : null;

                var startTime = current.ChangedAt;
                var endTime = next?.ChangedAt ?? (closedAt ?? DateTime.UtcNow);
                var statusDuration = endTime - startTime;

                statusDurations.Add(new StatusDurationDto
                {
                    Status = current.ToStatus.ToString(),
                    StartTime = startTime,
                    EndTime = next?.ChangedAt ?? closedAt,
                    Duration = statusDuration
                });
            }
        }

        return new OrderTimeDto
        {
            OrderId = order.Id,
            OpenedAt = openedAt,
            ClosedAt = closedAt,
            Duration = duration,
            StatusDurations = statusDurations
        };
    }
}
