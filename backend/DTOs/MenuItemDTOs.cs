namespace Aero_comidas.DTOs;

/// <summary>
/// DTO para criação/atualização de item do cardápio
/// </summary>
public class MenuItemDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? Category { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsAvailable { get; set; } = true;
    public int PreparationTimeMinutes { get; set; } = 15;
    public string? Ingredients { get; set; }
    public string? Allergens { get; set; }
}

/// <summary>
/// DTO para resposta de item do cardápio
/// </summary>
public class MenuItemResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public decimal Price { get; set; }
    public string? Category { get; set; }
    public string? ImageUrl { get; set; }
    public bool IsAvailable { get; set; }
    public int PreparationTimeMinutes { get; set; }
    public string? Ingredients { get; set; }
    public string? Allergens { get; set; }
    public int TimesOrdered { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
}
