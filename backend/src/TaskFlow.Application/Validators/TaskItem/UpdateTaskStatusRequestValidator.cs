using FluentValidation;
using TaskFlow.Application.DTOs.TaskItem;

namespace TaskFlow.Application.Validators.TaskItem;

public class UpdateTaskStatusRequestValidator : AbstractValidator<UpdateTaskStatusRequest>
{
    public UpdateTaskStatusRequestValidator()
    {
        RuleFor(x => x.Status)
            .IsInEnum().WithMessage("Geçersiz durum değeri.");
    }
}
