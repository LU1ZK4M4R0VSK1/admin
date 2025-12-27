using Microsoft.EntityFrameworkCore;
using Aero_comidas.Data;
using Aero_comidas.Models;
using Aero_comidas.Services;
using Aero_comidas.Repositories;
using Aero_comidas.Repositories.Interfaces;
using Aero_comidas.Middlewares;

var builder = WebApplication.CreateBuilder(args);

// ========================================
// CONTROLLERS & JSON SERIALIZATION
// ========================================
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Previne erros de referência circular ao serializar entidades relacionadas
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// ========================================
// CORS CONFIGURATION
// ========================================
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

// ========================================
// DATABASE CONFIGURATION
// ========================================
// SQLite para desenvolvimento - facilmente substituível por MySQL em produção
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// ========================================
// DEPENDENCY INJECTION - REPOSITORIES
// ========================================
// Repository Pattern permite trocar implementação de BD sem afetar Controllers
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IMenuItemRepository, MenuItemRepository>();
builder.Services.AddScoped<ITableRepository, TableRepository>();

// ========================================
// DEPENDENCY INJECTION - SERVICES
// ========================================
builder.Services.AddScoped<OrderService>();
builder.Services.AddScoped<StripePaymentService>();
builder.Services.AddScoped<EmailReportService>();
builder.Services.AddScoped<AnalyticsService>();


var app = builder.Build();

// ========================================
// HTTP REQUEST PIPELINE
// ========================================
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Middleware customizado para logging de requisições
app.UseRequestLogging();

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();
