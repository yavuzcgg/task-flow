using FluentValidation;
using TaskFlow.Application.DTOs.TaskItem;

namespace TaskFlow.Application.Validators.TaskItem;

public class UpdateTaskRequestValidator : AbstractValidator<UpdateTaskRequest>
{
    public UpdateTaskRequestValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("Görev başlığı boş olamaz.")
            .MaximumLength(300).WithMessage("Görev başlığı en fazla 300 karakter olabilir.");

        RuleFor(x => x.Priority)
            .IsInEnum().WithMessage("Geçersiz öncelik değeri.");
    }
}
