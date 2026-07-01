
using FluentValidation;

namespace workgrid.Application.Features.TableRows.Commands.CreateTableRow;

public class CreateTableRowValidator : AbstractValidator<CreateTableRowCommand>
{
    public CreateTableRowValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Bir tablo Id seçilmelidir.");
    }
}