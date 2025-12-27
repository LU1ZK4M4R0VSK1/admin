using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Aero_comidas.Data;
using Aero_comidas.Models;
using Aero_comidas.DTOs;

namespace Aero_comidas.Controllers;

[ApiController]
[Route("api/[controller]")]
public class MenuItemsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<MenuItemsController> _logger;

    public MenuItemsController(ApplicationDbContext context, ILogger<MenuItemsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    // GET: api/menuitems
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MenuItemResponseDto>>> GetMenuItems(
        [FromQuery] string? category = null,
        [FromQuery] bool? isAvailable = null,
        [FromQuery] string? search = null)
    {
        var query = _context.MenuItems.AsQueryable();

        if (!string.IsNullOrWhiteSpace(category))
            query = query.Where(m => m.Category == category);

        if (isAvailable.HasValue)
            query = query.Where(m => m.IsAvailable == isAvailable.Value);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(m => m.Name.Contains(search) || 
                                    (m.Description != null && m.Description.Contains(search)));

        var items = await query.OrderBy(m => m.Category).ThenBy(m => m.Name).ToListAsync();

        return Ok(items.Select(MapToDto));
    }

    // GET: api/menuitems/5
    [HttpGet("{id}")]
    public async Task<ActionResult<MenuItemResponseDto>> GetMenuItem(int id)
    {
        var item = await _context.MenuItems.FindAsync(id);

        if (item == null)
            return NotFound(new { message = "Item do cardápio não encontrado" });

        return Ok(MapToDto(item));
    }

    // GET: api/menuitems/categories
    [HttpGet("categories")]
    public ActionResult<IEnumerable<string>> GetCategories()
    {
        var categories = new[]
        {
            "Entradas",
            "Bebidas",
            "Pratos principais",
            "Sobremesa"
        };

        return Ok(categories);
    }

    // GET: api/menuitems/stats
    [HttpGet("stats")]
    public async Task<ActionResult<object>> GetMenuStats()
    {
        var total = await _context.MenuItems.CountAsync();
        var available = await _context.MenuItems.CountAsync(m => m.IsAvailable);
        var unavailable = total - available;

        var byCategory = await _context.MenuItems
            .GroupBy(m => m.Category)
            .Select(g => new { category = g.Key, count = g.Count() })
            .ToListAsync();

        return Ok(new
        {
            total,
            available,
            unavailable,
            byCategory
        });
    }

    // POST: api/menuitems
    [HttpPost]
    public async Task<ActionResult<MenuItemResponseDto>> CreateMenuItem(CreateMenuItemDto dto)
    {
        // Validar categoria
        var validCategories = new[] { "Entradas", "Bebidas", "Pratos principais", "Sobremesa" };
        if (!validCategories.Contains(dto.Category))
            return BadRequest(new { message = "Categoria inválida. Categorias válidas: " + string.Join(", ", validCategories) });

        // Verificar se já existe item com mesmo nome
        if (await _context.MenuItems.AnyAsync(m => m.Name == dto.Name))
            return BadRequest(new { message = "Já existe um item com este nome no cardápio" });

        var item = new MenuItem
        {
            Name = dto.Name,
            Description = dto.Description,
            Price = dto.Price,
            Category = dto.Category,
            ImageUrl = dto.ImageUrl,
            Ingredients = dto.Ingredients,
            IsAvailable = dto.IsAvailable,
            CreatedAt = DateTime.UtcNow
        };

        _context.MenuItems.Add(item);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Item do cardápio '{Name}' criado", item.Name);

        return CreatedAtAction(nameof(GetMenuItem), new { id = item.Id }, MapToDto(item));
    }

    // PUT: api/menuitems/5
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateMenuItem(int id, UpdateMenuItemDto dto)
    {
        var item = await _context.MenuItems.FindAsync(id);

        if (item == null)
            return NotFound(new { message = "Item do cardápio não encontrado" });

        // Verificar se novo nome já existe em outro item
        if (dto.Name != null && dto.Name != item.Name)
        {
            if (await _context.MenuItems.AnyAsync(m => m.Name == dto.Name && m.Id != id))
                return BadRequest(new { message = "Já existe outro item com este nome no cardápio" });
            
            item.Name = dto.Name;
        }

        if (dto.Description != null)
            item.Description = dto.Description;

        if (dto.Price.HasValue)
            item.Price = dto.Price.Value;

        if (dto.Category != null)
        {
            var validCategories = new[] { "Entradas", "Bebidas", "Pratos principais", "Sobremesa" };
            if (!validCategories.Contains(dto.Category))
                return BadRequest(new { message = "Categoria inválida. Categorias válidas: " + string.Join(", ", validCategories) });
            
            item.Category = dto.Category;
        }

        if (dto.ImageUrl != null)
            item.ImageUrl = dto.ImageUrl;

        if (dto.Ingredients != null)
            item.Ingredients = dto.Ingredients;

        if (dto.IsAvailable.HasValue)
            item.IsAvailable = dto.IsAvailable.Value;

        item.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Item do cardápio '{Name}' atualizado", item.Name);

        return NoContent();
    }

    // PATCH: api/menuitems/5/availability
    [HttpPatch("{id}/availability")]
    public async Task<IActionResult> ToggleAvailability(int id, [FromBody] bool isAvailable)
    {
        var item = await _context.MenuItems.FindAsync(id);

        if (item == null)
            return NotFound(new { message = "Item do cardápio não encontrado" });

        item.IsAvailable = isAvailable;
        item.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        _logger.LogInformation("Disponibilidade do item '{Name}' alterada para {IsAvailable}", 
            item.Name, isAvailable);

        return NoContent();
    }

    // DELETE: api/menuitems/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteMenuItem(int id)
    {
        var item = await _context.MenuItems.FindAsync(id);

        if (item == null)
            return NotFound(new { message = "Item do cardápio não encontrado" });

        _context.MenuItems.Remove(item);
        await _context.SaveChangesAsync();

        _logger.LogInformation("Item do cardápio '{Name}' excluído", item.Name);

        return NoContent();
    }

    // Método auxiliar para mapear MenuItem para DTO
    private MenuItemResponseDto MapToDto(MenuItem item)
    {
        return new MenuItemResponseDto
        {
            Id = item.Id,
            Name = item.Name,
            Description = item.Description,
            Price = item.Price,
            Category = item.Category ?? string.Empty,
            ImageUrl = item.ImageUrl,
            Ingredients = item.Ingredients,
            IsAvailable = item.IsAvailable,
            CreatedAt = item.CreatedAt,
            UpdatedAt = item.UpdatedAt
        };
    }
}
