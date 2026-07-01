
using FluentValidation;

namespace workgrid.Application.Features.MenuItems.Commands.CreateMenuItem;

public class CreateMenuItemValidator : AbstractValidator<CreateMenuItemCommand>
{
    public CreateMenuItemValidator()
    {
        RuleFor(x => x.Label).NotEmpty().WithMessage("Menü başlığı boş olamaz.");
    }
}