using FluentValidation;

namespace workgrid.Application.Features.Comments.Commands.UpdateComment;

public class UpdateCommentValidator : AbstractValidator<UpdateCommentCommand>
{
    public UpdateCommentValidator()
    {
        RuleFor(x => x.Content).NotEmpty().WithMessage("Yorum boş olamaz.")
            .MaximumLength(2000).WithMessage("Yorum çok uzun.");
        RuleFor(x => x.Rating).InclusiveBetween(1, 5)
            .When(x => x.Rating.HasValue)
            .WithMessage("Puan 1-5 arası olmalı.");
    }
}