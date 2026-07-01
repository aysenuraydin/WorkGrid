using FluentValidation;

namespace workgrid.Application.Features.Comments.Commands.CreateComment;

public class CreateCommentValidator : AbstractValidator<CreateCommentCommand>
{
    public CreateCommentValidator()
    {
        RuleFor(x => x.ItemId).NotEmpty().WithMessage("ItemId boş olamaz.");
        RuleFor(x => x.Content).NotEmpty().WithMessage("Yorum boş olamaz.")
            .MaximumLength(2000).WithMessage("Yorum çok uzun.");

        When(x => x.ItemType == CommentItemTypeEnum.Product && x.ParentId == null, () =>
        {
            RuleFor(x => x.Rating).NotNull().WithMessage("Puan zorunlu.")
                .InclusiveBetween(1, 5).WithMessage("Puan 1-5 arası olmalı.");
        });

        When(x => x.ParentId != null, () =>
        {
            RuleFor(x => x.Rating).Null().WithMessage("Cevaplara puan verilemez.");
        });
    }
}