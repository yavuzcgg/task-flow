using System.Text.Json;
using TaskFlow.Application.DTOs.Common;
using TaskFlow.Application.Exceptions;

namespace TaskFlow.API.Middleware;

public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger, IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, message) = exception switch
        {
            NotFoundException => (StatusCodes.Status404NotFound, exception.Message),
            ConflictException => (StatusCodes.Status409Conflict, exception.Message),
            UnauthorizedException => (StatusCodes.Status401Unauthorized, exception.Message),
            BadRequestException => (StatusCodes.Status400BadRequest, exception.Message),
            _ => (StatusCodes.Status500InternalServerError, "Beklenmeyen bir hata oluştu.")
        };

        // 500 hatalarını logla (diğerleri beklenen iş mantığı hataları)
        if (statusCode == StatusCodes.Status500InternalServerError)
            _logger.LogError(exception, "Beklenmeyen hata: {Message}", exception.Message);

        var response = new ErrorResponse
        {
            StatusCode = statusCode,
            Message = message,
            Detail = _env.IsDevelopment() && statusCode == 500 ? exception.StackTrace : null
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;

        var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        await context.Response.WriteAsync(JsonSerializer.Serialize(response, jsonOptions));
    }
}
