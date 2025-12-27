using Aero_comidas.Models;
using Aero_comidas.Repositories.Interfaces;

namespace Aero_comidas.Services;

/// <summary>
/// Serviço de lógica de negócios para gerenciar pedidos
/// Coordena operações entre repositórios e aplica regras de negócio
/// </summary>
public class OrderService
{
    private readonly IOrderRepository _orderRepository;
    private readonly IMenuItemRepository _menuItemRepository;
    private readonly ITableRepository _tableRepository;
    private readonly ILogger<OrderService> _logger;

    public OrderService(
        IOrderRepository orderRepository,
        IMenuItemRepository menuItemRepository,
        ITableRepository tableRepository,
        ILogger<OrderService> logger)
    {
        _orderRepository = orderRepository;
        _menuItemRepository = menuItemRepository;
        _tableRepository = tableRepository;
        _logger = logger;
    }

    /// <summary>
    /// Cria um novo pedido com validações de negócio
    /// </summary>
    public async Task<Order> CreateOrderAsync(Order order)
    {
        try
        {
            // Validar se a mesa existe e está disponível
            var table = await _tableRepository.GetByIdAsync(order.TableId);
            if (table == null)
            {
                throw new InvalidOperationException($"Mesa {order.TableId} não encontrada");
            }

            // Validar itens do pedido
            if (order.Items == null || !order.Items.Any())
            {
                throw new InvalidOperationException("O pedido deve conter pelo menos um item");
            }

            // Calcular total do pedido
            decimal totalAmount = 0;
            foreach (var item in order.Items)
            {
                if (string.IsNullOrEmpty(item.ProductName))
                {
                    throw new InvalidOperationException("Nome do produto é obrigatório");
                }

                if (item.Quantity <= 0)
                {
                    throw new InvalidOperationException($"Quantidade inválida para {item.ProductName}");
                }

                if (item.UnitPrice <= 0)
                {
                    throw new InvalidOperationException($"Preço inválido para {item.ProductName}");
                }

                totalAmount += item.TotalPrice;
            }

            order.TotalAmount = totalAmount;
            order.QueuePosition = await _orderRepository.GetNextQueuePositionAsync();
            order.Status = OrderStatus.Pendente;
            order.CreatedAt = DateTime.UtcNow;

            var createdOrder = await _orderRepository.AddAsync(order);
            _logger.LogInformation("Pedido {OrderId} criado para a mesa {TableId} com valor total de {TotalAmount:C}",
                createdOrder.Id, order.TableId, order.TotalAmount);

            return createdOrder;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao criar pedido para a mesa {TableId}", order.TableId);
            throw;
        }
    }

    /// <summary>
    /// Atualiza o status de um pedido
    /// </summary>
    public async Task<Order> UpdateOrderStatusAsync(int orderId, OrderStatus newStatus)
    {
        try
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null)
            {
                throw new InvalidOperationException($"Pedido {orderId} não encontrado");
            }

            var oldStatus = order.Status;
            order.Status = newStatus;
            order.UpdatedAt = DateTime.UtcNow;

            if (newStatus == OrderStatus.Entregue || newStatus == OrderStatus.Cancelado)
            {
                order.CompletedAt = DateTime.UtcNow;
            }

            await _orderRepository.UpdateAsync(order);
            _logger.LogInformation("Status do pedido {OrderId} atualizado de {OldStatus} para {NewStatus}",
                orderId, oldStatus, newStatus);

            return order;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao atualizar status do pedido {OrderId}", orderId);
            throw;
        }
    }

    /// <summary>
    /// Obtém pedidos ativos (não entregues nem cancelados)
    /// </summary>
    public async Task<IEnumerable<Order>> GetActiveOrdersAsync()
    {
        try
        {
            return await _orderRepository.GetActiveOrdersAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar pedidos ativos");
            throw;
        }
    }

    /// <summary>
    /// Obtém pedido com todos os itens
    /// </summary>
    public async Task<Order?> GetOrderWithDetailsAsync(int orderId)
    {
        try
        {
            return await _orderRepository.GetOrderWithItemsAsync(orderId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar detalhes do pedido {OrderId}", orderId);
            throw;
        }
    }

    /// <summary>
    /// Cancela um pedido
    /// </summary>
    public async Task<bool> CancelOrderAsync(int orderId)
    {
        try
        {
            var order = await _orderRepository.GetByIdAsync(orderId);
            if (order == null)
            {
                return false;
            }

            if (order.Status == OrderStatus.Entregue)
            {
                throw new InvalidOperationException("Não é possível cancelar um pedido já entregue");
            }

            await UpdateOrderStatusAsync(orderId, OrderStatus.Cancelado);
            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao cancelar pedido {OrderId}", orderId);
            throw;
        }
    }

    /// <summary>
    /// Obtém pedidos de uma mesa específica
    /// </summary>
    public async Task<IEnumerable<Order>> GetOrdersByTableAsync(int tableId)
    {
        try
        {
            return await _orderRepository.GetOrdersByTableIdAsync(tableId);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao buscar pedidos da mesa {TableId}", tableId);
            throw;
        }
    }
}
