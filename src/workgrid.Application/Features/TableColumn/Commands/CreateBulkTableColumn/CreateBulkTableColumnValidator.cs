
using FluentValidation;

namespace workgrid.Application.Features.TableColumns.Commands.CreateBulkTableColumn;

public class CreateBulkTableColumnValidator : AbstractValidator<CreateBulkTableColumnCommand>
{
    public CreateBulkTableColumnValidator()
    {
        RuleFor(x => x.TableId)
            .NotEmpty().WithMessage("Bir tablo seçilmelidir.");
    }
}