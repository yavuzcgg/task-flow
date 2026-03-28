using FluentValidation;
using TaskFlow.Application.DTOs.Common;

namespace TaskFlow.API.Filters;

public class ValidationFilter : IEndpointFilter
{
    public async ValueTask<object?> InvokeAsync(EndpointFilterInvocationContext context, EndpointFilterDelegate next)
    {
        return await next(context);
    }
}

// ActionFilter olarak MVC pipeline'ına bağlanır
public class ValidationActionFilter : Microsoft.AspNetCore.Mvc.Filters.IAsyncActionFilter
{
    private readonly IServiceProvider _serviceProvider;

    public ValidationActionFilter(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task OnActionExecutionAsync(
        Microsoft.AspNetCore.Mvc.Filters.ActionExecutingContext context,
        Microsoft.AspNetCore.Mvc.Filters.ActionExecutionDelegate next)
    {
        foreach (var argument in context.ActionArguments.Values)
        {
            if (argument == null) continue;

            var validatorType = typeof(IValidator<>).MakeGenericType(argument.GetType());
            var validator = _serviceProvider.GetService(validatorType) as IValidator;

            if (validator == null) continue;

            var validationContext = new ValidationContext<object>(argument);
            var result = await validator.ValidateAsync(validationContext);

            if (!result.IsValid)
            {
                var errors = result.Errors
                    .GroupBy(e => e.PropertyName)
                    .ToDictionary(
                        g => g.Key,
                        g => g.Select(e => e.ErrorMessage).ToArray());

                var errorResponse = new ErrorResponse
                {
                    StatusCode = StatusCodes.Status400BadRequest,
                    Message = "Validation hatası.",
                    Errors = errors
                };

                context.Result = new Microsoft.AspNetCore.Mvc.BadRequestObjectResult(errorResponse);
                return;
            }
        }

        await next();
    }
}
