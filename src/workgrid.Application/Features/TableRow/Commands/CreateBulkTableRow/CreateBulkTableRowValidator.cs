
using FluentValidation;

namespace workgrid.Application.Features.TableRows.Commands.CreateTableRow;

public class CreateBulkTableRowValidator : AbstractValidator<CreateTableRowCommand>
{
    public CreateBulkTableRowValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Bir tablo Id seçilmelidir.");
    }
}