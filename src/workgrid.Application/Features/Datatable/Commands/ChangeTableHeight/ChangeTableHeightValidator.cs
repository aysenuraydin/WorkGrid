
using FluentValidation;
using workgrid.Application.Features.Datatables.Commands.ChangeTableHeight;

namespace workgrid.Application.Features.Tables.Commands.ChangeTableHeight;

public class ChangeTableHeightValidator : AbstractValidator<ChangeTableHeightCommand>
{
    public ChangeTableHeightValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Güncellenecek tablo kimliği (ID) boş olamaz.");

        RuleFor(x => x.ModalHeight)
            .NotEmpty().WithMessage("Yükseklik değeri belirtilmelidir.")
            .InclusiveBetween(100, 2000)
            .WithMessage("Tablo yüksekliği 100px ile 2000px arasında bir değer olmalıdır.");
    }
}