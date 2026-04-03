using FluentValidation;
using TaskFlow.Application.DTOs.ProjectInvitation;
using TaskFlow.Domain.Enums;

namespace TaskFlow.Application.Validators.ProjectInvitation;

public class InviteToProjectRequestValidator : AbstractValidator<InviteToProjectRequest>
{
    public InviteToProjectRequestValidator()
    {
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("E-posta adresi boş olamaz.")
            .EmailAddress().WithMessage("Geçerli bir e-posta adresi giriniz.");

        RuleFor(x => x.Role)
            .IsInEnum().WithMessage("Geçersiz rol değeri.")
            .NotEqual(ProjectRole.Owner).WithMessage("Owner rolü atanamaz.");
    }
}
