using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Aero_comidas.Data;
using Aero_comidas.Models;
using Aero_comidas.DTOs;

namespace Aero_comidas.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<OrdersController> _logger;

    public OrdersController(ApplicationDbContext context, ILogger<OrdersController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/orders
    [HttpGet]
    public async Task<ActionResult<IEnumerable<OrderResponseDto>>> GetOrders(
        [FromQuery] int? tableId = null,
        [FromQuery] int? status = null,
        [FromQuery] DateTime? startDate = null,
        [FromQuery] DateTime? endDate = null)
    {
        var query = _context.Orders
            .Include(o => o.Items)
            .Include(o => o.Table)
            .Include(o => o.StatusHistory)
            .AsQueryable();

        if (tableId.HasValue)
            query = query.Where(o => o.TableId == tableId.Value);

        if (status.HasValue)
            query = query.Where(o => (int)o.Status == status.Value);

        if (startDate.HasValue)
            query = query.Where(o => o.CreatedAt >= startDate.Value);

        if (endDate.HasValue)
            query = query.Where(o => o.CreatedAt <= endDate.Value);

        var orders = await query.OrderByDescending(o => o.CreatedAt).ToListAsync();

        return Ok(orders.Select(MapToDto));
    }

    // GET: api/orders/5
    [HttpGet("{id}")]
    public async Task<ActionResult<OrderResponseDto>> GetOrder(int id)
    {
        var order = await _context.Orders
            .Include(o => o.Items)
            .Include(o => o.Table)
            .Include(o => o.StatusHistory)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            return NotFound(new { message = "Pedido não encontrado" });

        return Ok(MapToDto(order));
    }

    // POST: api/orders
    [HttpPost]
    public async Task<ActionResult<OrderResponseDto>> CreateOrder(CreateOrderDto dto)
    {
        // Validar mesa
        var table = await _context.Tables.FindAsync(dto.TableId);
        if (table == null)
            return BadRequest(new { message = "Mesa não encontrada" });

        // Validar itens
        if (dto.Items == null || !dto.Items.Any())
            return BadRequest(new { message = "O pedido deve conter pelo menos um item" });

        var order = new Order
        {
            TableId = dto.TableId,
            Status = OrderStatus.EmAndamento,
            CreatedAt = DateTime.UtcNow,
            CustomerNotes = dto.CustomerNotes,
            Items = dto.Items.Select(i => new OrderItem
            {
                ProductName = i.ProductName,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                Notes = i.Notes
            }).ToList()
        };

        // Calcular total
        order.TotalAmount = order.Items.Sum(i => i.TotalPrice);

        _context.Orders.Add(order);

        // Criar primeiro registro no histórico
        var history = new OrderStatusHistory
        {
            Order = order,
            FromStatus = OrderStatus.EmAndamento,
            ToStatus = OrderStatus.EmAndamento,
            ChangedAt = DateTime.UtcNow,
            Notes = "Pedido criado"
        };
        _context.OrderStatusHistories.Add(history);

        // Atualizar status da mesa se estava disponível
        if (table.Status == TableStatus.Disponivel)
        {
            table.Status = TableStatus.Ocupada;
            table.OccupiedSince = DateTime.UtcNow;
            table.UpdatedAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();

        _logger.LogInformation("Pedido {OrderId} criado para mesa {TableId}", order.Id, order.TableId);

        // Recarregar com relacionamentos
        var createdOrder = await _context.Orders
            .Include(o => o.Items)
            .Include(o => o.Table)
            .Include(o => o.StatusHistory)
            .FirstAsync(o => o.Id == order.Id);

        return CreatedAtAction(nameof(GetOrder), new { id = order.Id }, MapToDto(createdOrder));
    }

    // PUT: api/orders/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateOrder(int id, UpdateOrderDto dto)
    {
        var order = await _context.Orders
            .Include(o => o.Items)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            return NotFound(new { message = "Pedido não encontrado" });

        // Verificar se pode editar (não pode se status for Pago)
        if (order.Status == OrderStatus.Pago)
            return BadRequest(new { message = "Pedido com status 'Pago' não pode ser editado" });

        // Atualizar itens se fornecido
        if (dto.Items != null)
        {
            // Remover itens antigos
            _context.OrderItems.RemoveRange(order.Items);

            // Adicionar novos itens
            order.Items = dto.Items.Select(i => new OrderItem
            {
                OrderId = order.Id,
                ProductName = i.ProductName,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                Notes = i.Notes
            }).ToList();

            // Recalcular total
            order.TotalAmount = order.Items.Sum(i => i.TotalPrice);
        }

        if (dto.CustomerNotes != null)
            order.CustomerNotes = dto.CustomerNotes;

        order.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Pedido {OrderId} atualizado", id);

        return NoContent();
    }

    // PATCH: api/orders/5/status
    [HttpPatch("{id}/status")]
    public async Task<IActionResult> ChangeOrderStatus(int id, ChangeOrderStatusDto dto)
    {
        var order = await _context.Orders
            .Include(o => o.StatusHistory)
            .FirstOrDefaultAsync(o => o.Id == id);

        if (order == null)
            return NotFound(new { message = "Pedido não encontrado" });

        // Verificar se pode alterar status (não pode se já estiver Pago)
        if (order.Status == OrderStatus.Pago)
            return BadRequest(new { message = "Pedido com status 'Pago' não pode ter o status alterado" });

        var oldStatus = order.Status;
        var newStatus = (OrderStatus)dto.NewStatus;

        // Validar transição de status
        if (!IsValidStatusTransition(oldStatus, newStatus))
            return BadRequest(new { message = $"Transição de '{oldStatus}' para '{newStatus}' não é permitida" });

        order.Status = newStatus;
        order.UpdatedAt = DateTime.UtcNow;

        // Atualizar timestamps específicos
        switch (newStatus)
        {
            case OrderStatus.Pago:
                order.PaidAt = DateTime.UtcNow;
                break;
            case OrderStatus.Cancelado:
                order.CancelledAt = DateTime.UtcNow;
                break;
            case OrderStatus.Entregue:
                order.DeliveredAt = DateTime.UtcNow;
                break;
        }

        // Criar registro no histórico
        var history = new OrderStatusHistory
        {
            OrderId = order.Id,
            FromStatus = oldStatus,
            ToStatus = newStatus,
            ChangedAt = DateTime.UtcNow,
            Notes = dto.Notes,
            ChangedBy = dto.ChangedBy
        };
        _context.OrderStatusHistories.Add(history);

        // Se o pedido foi pago ou cancelado, verificar se a mesa pode ser liberada
        if (newStatus == OrderStatus.Pago || newStatus == OrderStatus.Cancelado)
        {
            var hasActiveOrders = await _context.Orders
                .AnyAsync(o => o.TableId == order.TableId 
                            && o.Id != order.Id 
                            && o.Status != OrderStatus.Pago 
                            && o.Status != OrderStatus.Cancelado);

            if (!hasActiveOrders)
            {
                var table = await _context.Tables.FindAsync(order.TableId);
                if (table != null)
                {
                    table.Status = TableStatus.Disponivel;
                    table.OccupiedSince = null;
                    table.UpdatedAt = DateTime.UtcNow;
                }
            }
        }

        await _context.SaveChangesAsync();

        _logger.LogInformation("Status do pedido {OrderId} alterado de {OldStatus} para {NewStatus}", 
            id, oldStatus, newStatus);

        return NoContent();
    }

    // DELETE: api/orders/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteOrder(int id)
    {
        var order = await _context.Orders.FindAsync(id);

        if (order == null)
            return NotFound(new { message = "Pedido não encontrado" });

        // Não permitir excluir pedidos pagos
        if (order.Status == OrderStatus.Pago)
            return BadRequest(new { message = "Pedido com status 'Pago' não pode ser excluído. Use o cancelamento." });

        _context.Orders.Remove(order);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Pedido {OrderId} excluído", id);

        return NoContent();
    }

    // Método auxiliar para mapear Order para DTO
    private OrderResponseDto MapToDto(Order order)
    {
        return new OrderResponseDto
        {
            Id = order.Id,
            TableId = order.TableId,
            TableNumber = order.Table?.TableNumber.ToString() ?? "N/A",
            Status = order.Status.ToString(),
            CreatedAt = order.CreatedAt,
            UpdatedAt = order.UpdatedAt,
            PaidAt = order.PaidAt,
            CancelledAt = order.CancelledAt,
            DeliveredAt = order.DeliveredAt,
            TotalAmount = order.TotalAmount,
            CustomerNotes = order.CustomerNotes,
            CanEdit = order.Status != OrderStatus.Pago,
            Items = order.Items?.Select(i => new OrderItemDto
            {
                Id = i.Id,
                ProductName = i.ProductName,
                Quantity = i.Quantity,
                UnitPrice = i.UnitPrice,
                TotalPrice = i.TotalPrice,
                Notes = i.Notes
            }).ToList() ?? new(),
            StatusHistory = order.StatusHistory?.OrderBy(h => h.ChangedAt).Select(h => new OrderStatusHistoryDto
            {
                Id = h.Id,
                FromStatus = h.FromStatus.ToString(),
                ToStatus = h.ToStatus.ToString(),
                ChangedAt = h.ChangedAt,
                Notes = h.Notes,
                ChangedBy = h.ChangedBy
            }).ToList() ?? new()
        };
    }

    // Validar transições de status
    private bool IsValidStatusTransition(OrderStatus from, OrderStatus to)
    {
        // Não pode sair do status Pago
        if (from == OrderStatus.Pago)
            return false;

        // De EmAndamento pode ir para qualquer outro
        if (from == OrderStatus.EmAndamento)
            return true;

        // De Entregue pode ir para Pago ou Cancelado
        if (from == OrderStatus.Entregue)
            return to == OrderStatus.Pago || to == OrderStatus.Cancelado;

        // De Cancelado não pode mudar para nada
        if (from == OrderStatus.Cancelado)
            return false;

        return true;
    }
}
