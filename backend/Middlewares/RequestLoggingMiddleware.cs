using System.Diagnostics;

namespace Aero_comidas.Middlewares;

/// <summary>
/// Middleware para logging de requisições HTTP
/// Facilita debug e monitoring em produção
/// </summary>
public class RequestLoggingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RequestLoggingMiddleware> _logger;

    public RequestLoggingMiddleware(RequestDelegate next, ILogger<RequestLoggingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var stopwatch = Stopwatch.StartNew();
        var requestPath = context.Request.Path;
        var requestMethod = context.Request.Method;

        try
        {
            _logger.LogInformation(
                "Iniciando requisição: {Method} {Path}",
                requestMethod,
                requestPath);

            await _next(context);

            stopwatch.Stop();

            _logger.LogInformation(
                "Requisição completada: {Method} {Path} - Status: {StatusCode} - Tempo: {ElapsedMs}ms",
                requestMethod,
                requestPath,
                context.Response.StatusCode,
                stopwatch.ElapsedMilliseconds);
        }
        catch (Exception ex)
        {
            stopwatch.Stop();

            _logger.LogError(ex,
                "Erro na requisição: {Method} {Path} - Tempo: {ElapsedMs}ms",
                requestMethod,
                requestPath,
                stopwatch.ElapsedMilliseconds);

            throw;
        }
    }
}

/// <summary>
/// Extension method para facilitar uso do middleware
/// </summary>
public static class RequestLoggingMiddlewareExtensions
{
    public static IApplicationBuilder UseRequestLogging(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<RequestLoggingMiddleware>();
    }
}
