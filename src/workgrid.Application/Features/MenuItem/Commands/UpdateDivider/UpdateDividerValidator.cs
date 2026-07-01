
using FluentValidation;

namespace workgrid.Application.Features.MenuItems.Commands.UpdateDivider;

public class UpdateDividerValidator : AbstractValidator<UpdateDividerCommand>
{
    public UpdateDividerValidator()
    {
        RuleFor(x => x.Label).NotEmpty().WithMessage("Menü başlığı boş olamaz.");
    }
}