using FluentValidation;

namespace workgrid.Application.Features.Relations.Commands.AddRelation;

public class AddRelationValidator : AbstractValidator<AddRelationCommand>
{
    public AddRelationValidator()
    {
        RuleFor(x => x.FromTable).NotEmpty().WithMessage("Kaynak tablo zorunludur.");
        RuleFor(x => x.ToTable).NotEmpty().WithMessage("Hedef tablo (toTable) zorunludur.");
    }
}
