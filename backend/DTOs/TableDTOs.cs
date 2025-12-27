using Aero_comidas.Models;

namespace Aero_comidas.DTOs;

/// <summary>
/// DTO para criação/atualização de mesa
/// </summary>
public class TableDto
{
    public int TableNumber { get; set; }
    public int Capacity { get; set; }
    public string? Location { get; set; }
}

/// <summary>
/// DTO para resposta de mesa
/// </summary>
public class TableResponseDto
{
    public int Id { get; set; }
    public int TableNumber { get; set; }
    public int Capacity { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Location { get; set; }
    public DateTime? OccupiedSince { get; set; }
    public string? CurrentWaiter { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}

/// <summary>
/// DTO para atualização de status da mesa
/// </summary>
public class UpdateTableStatusDto
{
    public TableStatus Status { get; set; }
    public string? CurrentWaiter { get; set; }
}
