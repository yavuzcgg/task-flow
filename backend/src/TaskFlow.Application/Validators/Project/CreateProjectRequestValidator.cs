using FluentValidation;
using TaskFlow.Application.DTOs.Project;

namespace TaskFlow.Application.Validators.Project;

public class CreateProjectRequestValidator : AbstractValidator<CreateProjectRequest>
{
    public CreateProjectRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Proje adı boş olamaz.")
            .MaximumLength(200).WithMessage("Proje adı en fazla 200 karakter olabilir.");
    }
}
