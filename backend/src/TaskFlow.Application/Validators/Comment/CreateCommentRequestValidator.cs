using FluentValidation;
using TaskFlow.Application.DTOs.Comment;

namespace TaskFlow.Application.Validators.Comment;

public class CreateCommentRequestValidator : AbstractValidator<CreateCommentRequest>
{
    public CreateCommentRequestValidator()
    {
        RuleFor(x => x.Content)
            .NotEmpty().WithMessage("Yorum içeriği boş olamaz.");
    }
}
