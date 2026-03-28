using FluentValidation;
using TaskFlow.Application.DTOs.Project;

namespace TaskFlow.Application.Validators.Project;

public class UpdateProjectRequestValidator : AbstractValidator<UpdateProjectRequest>
{
    public UpdateProjectRequestValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Proje adı boş olamaz.")
            .MaximumLength(200).WithMessage("Proje adı en fazla 200 karakter olabilir.");
    }
}
