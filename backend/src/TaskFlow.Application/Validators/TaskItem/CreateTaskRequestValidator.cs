using FluentValidation;
using TaskFlow.Application.DTOs.TaskItem;

namespace TaskFlow.Application.Validators.TaskItem;

public class CreateTaskRequestValidator : AbstractValidator<CreateTaskRequest>
{
    public CreateTaskRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Görev başlığı boş olamaz.")
            .MaximumLength(300).WithMessage("Görev başlığı en fazla 300 karakter olabilir.");

        RuleFor(x => x.Priority)
            .IsInEnum().WithMessage("Geçersiz öncelik değeri.");
    }
}
