
using FluentValidation;

namespace workgrid.Application.Features.MenuItems.Commands.updateMenuItemOrder;

public class updateMenuItemOrderValidator : AbstractValidator<updateMenuItemOrderCommand>
{
    public updateMenuItemOrderValidator()
    {
        RuleFor(x => x.Order)
            .NotEmpty().WithMessage("Sıra numarası boş olamaz.")
            .GreaterThanOrEqualTo(0).WithMessage("Sıra numarası negatif olamaz.");

        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Güncellenecek menü öğesi seçilmelidir.");
    }
}