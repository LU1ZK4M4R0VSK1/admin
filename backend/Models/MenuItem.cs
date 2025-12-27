using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Aero_comidas.Models;

public class MenuItem
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string Name { get; set; } = string.Empty;

    [MaxLength(500)]
    public string? Description { get; set; }

    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Price { get; set; }

    [MaxLength(50)]
    public string? Category { get; set; }

    public string? ImageUrl { get; set; }

    public bool IsAvailable { get; set; } = true;

    public int PreparationTimeMinutes { get; set; } = 15;

    public DateTime CreatedAt { get; set; }

    public DateTime? UpdatedAt { get; set; }

    // Ingredientes/Alergênicos
    public string? Ingredients { get; set; }

    public string? Allergens { get; set; }

    // Popularidade
    public int TimesOrdered { get; set; } = 0;
}

public class MenuCategory
{
    public static readonly string[] Categories = new[]
    {
        "Entradas",
        "Pratos Principais",
        "Pizzas",
        "Massas",
        "Saladas",
        "Sobremesas",
        "Bebidas",
        "Vinhos"
    };
}
