using FluentValidation;
using TaskFlow.API.Filters;
using TaskFlow.API.Middleware;
using TaskFlow.Infrastructure.Hubs;
using TaskFlow.Application.Validators.Auth;
using TaskFlow.Infrastructure.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddSignalR();
builder.Services.AddControllers(options =>
{
    options.Filters.Add<ValidationActionFilter>();
});
builder.Services.AddValidatorsFromAssemblyContaining<RegisterRequestValidator>();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<TaskHub>("/hubs/tasks");

app.Run();
