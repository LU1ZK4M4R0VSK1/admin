using System.Net;
using System.Net.Mail;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Aero_comidas.Data;

namespace Aero_comidas.Services;

public class EmailReportService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailReportService> _logger;
    private readonly ApplicationDbContext _context;

    public EmailReportService(
        IConfiguration configuration,
        ILogger<EmailReportService> logger,
        ApplicationDbContext context)
    {
        _configuration = configuration;
        _logger = logger;
        _context = context;
    }

    /// <summary>
    /// Envia relatório diário de vendas
    /// </summary>
    public async Task SendDailyReportAsync(string recipientEmail)
    {
        try
        {
            var today = DateTime.UtcNow.Date;
            var tomorrow = today.AddDays(1);

            var orders = await _context.Orders
                .Include(o => o.Items)
                .Where(o => o.CreatedAt >= today && o.CreatedAt < tomorrow)
                .ToListAsync();

            var completedOrders = orders.Where(o => o.Status == Models.OrderStatus.Entregue).ToList();

            var report = GenerateDailyReportHtml(completedOrders, today);

            await SendEmailAsync(
                recipientEmail,
                $"Relatório Diário de Vendas - {today:dd/MM/yyyy}",
                report
            );

            _logger.LogInformation($"Relatório diário enviado para {recipientEmail}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao enviar relatório diário");
            throw;
        }
    }

    /// <summary>
    /// Envia alerta de desempenho
    /// </summary>
    public async Task SendPerformanceAlertAsync(string recipientEmail, string alertType, object data)
    {
        try
        {
            var subject = alertType switch
            {
                "low_sales" => "⚠️ Alerta: Vendas Abaixo da Média",
                "high_sales" => "🎉 Parabéns: Vendas Acima da Média",
                "peak_hour" => "📊 Relatório: Horário de Pico Detectado",
                _ => "Alerta de Desempenho"
            };

            var body = GenerateAlertHtml(alertType, data);

            await SendEmailAsync(recipientEmail, subject, body);

            _logger.LogInformation($"Alerta de desempenho '{alertType}' enviado para {recipientEmail}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Erro ao enviar alerta de desempenho: {alertType}");
            throw;
        }
    }

    /// <summary>
    /// Envia relatório semanal
    /// </summary>
    public async Task SendWeeklyReportAsync(string recipientEmail)
    {
        try
        {
            var today = DateTime.UtcNow.Date;
            var weekStart = today.AddDays(-(int)today.DayOfWeek);
            var weekEnd = weekStart.AddDays(7);

            var orders = await _context.Orders
                .Include(o => o.Items)
                .Where(o => o.CreatedAt >= weekStart && o.CreatedAt < weekEnd)
                .ToListAsync();

            var report = GenerateWeeklyReportHtml(orders, weekStart, weekEnd);

            await SendEmailAsync(
                recipientEmail,
                $"Relatório Semanal - {weekStart:dd/MM} a {weekEnd.AddDays(-1):dd/MM/yyyy}",
                report
            );

            _logger.LogInformation($"Relatório semanal enviado para {recipientEmail}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Erro ao enviar relatório semanal");
            throw;
        }
    }

    /// <summary>
    /// Gera HTML do relatório diário
    /// </summary>
    private string GenerateDailyReportHtml(List<Models.Order> orders, DateTime date)
    {
        var totalRevenue = orders.Sum(o => o.TotalAmount);
        var orderCount = orders.Count;
        var averageTicket = orderCount > 0 ? totalRevenue / orderCount : 0;

        var topItems = orders
            .SelectMany(o => o.Items)
            .GroupBy(i => i.ProductName)
            .Select(g => new
            {
                Name = g.Key,
                Quantity = g.Sum(i => i.Quantity),
                Revenue = g.Sum(i => i.TotalPrice)
            })
            .OrderByDescending(x => x.Quantity)
            .Take(5)
            .ToList();

        var html = new StringBuilder();
        html.AppendLine("<!DOCTYPE html>");
        html.AppendLine("<html><head><meta charset='UTF-8'><style>");
        html.AppendLine("body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }");
        html.AppendLine(".container { background: white; max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 8px; }");
        html.AppendLine("h1 { color: #2196f3; border-bottom: 3px solid #2196f3; padding-bottom: 10px; }");
        html.AppendLine(".metric { background: #e3f2fd; padding: 15px; margin: 10px 0; border-radius: 5px; }");
        html.AppendLine(".metric-value { font-size: 24px; font-weight: bold; color: #1976d2; }");
        html.AppendLine("table { width: 100%; border-collapse: collapse; margin-top: 20px; }");
        html.AppendLine("th, td { text-align: left; padding: 10px; border-bottom: 1px solid #ddd; }");
        html.AppendLine("th { background-color: #2196f3; color: white; }");
        html.AppendLine("</style></head><body><div class='container'>");
        
        html.AppendLine($"<h1>📊 Relatório Diário - {date:dd/MM/yyyy}</h1>");
        
        html.AppendLine("<div class='metric'>");
        html.AppendLine("<div>Faturamento Total</div>");
        html.AppendLine($"<div class='metric-value'>{{R$}}{totalRevenue:F2}</div>");
        html.AppendLine("</div>");
        
        html.AppendLine("<div class='metric'>");
        html.AppendLine("<div>Total de Pedidos</div>");
        html.AppendLine($"<div class='metric-value'>{orderCount}</div>");
        html.AppendLine("</div>");
        
        html.AppendLine("<div class='metric'>");
        html.AppendLine("<div>Ticket Médio</div>");
        html.AppendLine($"<div class='metric-value'>{{R$}}{averageTicket:F2}</div>");
        html.AppendLine("</div>");

        html.AppendLine("<h2>🏆 Top 5 Itens Mais Vendidos</h2>");
        html.AppendLine("<table><thead><tr><th>Produto</th><th>Qtd</th><th>Receita</th></tr></thead><tbody>");
        
        foreach (var item in topItems)
        {
            html.AppendLine($"<tr><td>{item.Name}</td><td>{item.Quantity}</td><td>{{R$}}{item.Revenue:F2}</td></tr>");
        }
        
        html.AppendLine("</tbody></table>");
        html.AppendLine("</div></body></html>");

        return html.ToString();
    }

    /// <summary>
    /// Gera HTML do relatório semanal
    /// </summary>
    private string GenerateWeeklyReportHtml(List<Models.Order> orders, DateTime start, DateTime end)
    {
        var completedOrders = orders.Where(o => o.Status == Models.OrderStatus.Entregue).ToList();
        var totalRevenue = completedOrders.Sum(o => o.TotalAmount);
        var orderCount = completedOrders.Count;

        var dailyBreakdown = completedOrders
            .GroupBy(o => o.CreatedAt.Date)
            .Select(g => new
            {
                Date = g.Key,
                Revenue = g.Sum(o => o.TotalAmount),
                Orders = g.Count()
            })
            .OrderBy(x => x.Date)
            .ToList();

        var html = new StringBuilder();
        html.AppendLine("<!DOCTYPE html>");
        html.AppendLine("<html><head><meta charset='UTF-8'><style>");
        html.AppendLine("body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }");
        html.AppendLine(".container { background: white; max-width: 700px; margin: 0 auto; padding: 30px; border-radius: 8px; }");
        html.AppendLine("h1 { color: #4caf50; border-bottom: 3px solid #4caf50; padding-bottom: 10px; }");
        html.AppendLine(".summary { background: #e8f5e9; padding: 20px; margin: 20px 0; border-radius: 5px; }");
        html.AppendLine("table { width: 100%; border-collapse: collapse; margin-top: 20px; }");
        html.AppendLine("th, td { text-align: left; padding: 10px; border-bottom: 1px solid #ddd; }");
        html.AppendLine("th { background-color: #4caf50; color: white; }");
        html.AppendLine("</style></head><body><div class='container'>");
        
        html.AppendLine($"<h1>📈 Relatório Semanal</h1>");
        html.AppendLine($"<p>{start:dd/MM/yyyy} - {end.AddDays(-1):dd/MM/yyyy}</p>");
        
        html.AppendLine("<div class='summary'>");
        html.AppendLine($"<h3>Resumo da Semana</h3>");
        html.AppendLine($"<p><strong>Faturamento Total:</strong> {{R$}}{totalRevenue:F2}</p>");
        html.AppendLine($"<p><strong>Total de Pedidos:</strong> {orderCount}</p>");
        html.AppendLine($"<p><strong>Média Diária:</strong> {{R$}}{(totalRevenue / 7):F2}</p>");
        html.AppendLine("</div>");

        html.AppendLine("<h3>Detalhamento Diário</h3>");
        html.AppendLine("<table><thead><tr><th>Data</th><th>Pedidos</th><th>Faturamento</th></tr></thead><tbody>");
        
        foreach (var day in dailyBreakdown)
        {
            html.AppendLine($"<tr><td>{day.Date:dd/MM/yyyy}</td><td>{day.Orders}</td><td>{{R$}}{day.Revenue:F2}</td></tr>");
        }
        
        html.AppendLine("</tbody></table>");
        html.AppendLine("</div></body></html>");

        return html.ToString();
    }

    /// <summary>
    /// Gera HTML de alerta
    /// </summary>
    private string GenerateAlertHtml(string alertType, object data)
    {
        var html = new StringBuilder();
        html.AppendLine("<!DOCTYPE html>");
        html.AppendLine("<html><head><meta charset='UTF-8'><style>");
        html.AppendLine("body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }");
        html.AppendLine(".container { background: white; max-width: 600px; margin: 0 auto; padding: 30px; border-radius: 8px; }");
        html.AppendLine(".alert { padding: 20px; margin: 20px 0; border-radius: 5px; border-left: 5px solid; }");
        html.AppendLine(".alert-warning { background: #fff3cd; border-color: #ff9800; }");
        html.AppendLine(".alert-success { background: #d4edda; border-color: #4caf50; }");
        html.AppendLine(".alert-info { background: #d1ecf1; border-color: #2196f3; }");
        html.AppendLine("</style></head><body><div class='container'>");
        
        var alertClass = alertType switch
        {
            "low_sales" => "alert-warning",
            "high_sales" => "alert-success",
            _ => "alert-info"
        };

        html.AppendLine($"<div class='alert {alertClass}'>");
        html.AppendLine($"<h2>{GetAlertTitle(alertType)}</h2>");
        html.AppendLine($"<p>{System.Text.Json.JsonSerializer.Serialize(data)}</p>");
        html.AppendLine("</div>");
        
        html.AppendLine("</div></body></html>");

        return html.ToString();
    }

    private string GetAlertTitle(string alertType)
    {
        return alertType switch
        {
            "low_sales" => "⚠️ Vendas Abaixo da Média",
            "high_sales" => "🎉 Excelente Desempenho de Vendas",
            "peak_hour" => "📊 Horário de Pico Detectado",
            _ => "Alerta de Desempenho"
        };
    }

    /// <summary>
    /// Envia e-mail usando SMTP
    /// </summary>
    private async Task SendEmailAsync(string to, string subject, string htmlBody)
    {
        var smtpHost = _configuration["Email:SmtpHost"];
        var smtpPort = int.Parse(_configuration["Email:SmtpPort"] ?? "587");
        var smtpUser = _configuration["Email:SmtpUser"];
        var smtpPassword = _configuration["Email:SmtpPassword"];
        var fromEmail = _configuration["Email:FromEmail"];
        var fromName = _configuration["Email:FromName"] ?? "Aero_comidas";

        if (string.IsNullOrEmpty(smtpHost) || string.IsNullOrEmpty(smtpUser))
        {
            _logger.LogWarning("Configurações de e-mail não definidas");
            return;
        }

        using var message = new MailMessage();
        message.From = new MailAddress(fromEmail ?? smtpUser, fromName);
        message.To.Add(to);
        message.Subject = subject;
        message.Body = htmlBody;
        message.IsBodyHtml = true;

        using var client = new SmtpClient(smtpHost, smtpPort);
        client.Credentials = new NetworkCredential(smtpUser, smtpPassword);
        client.EnableSsl = true;

        await client.SendMailAsync(message);
    }
}
