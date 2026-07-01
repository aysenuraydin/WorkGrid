
using FluentValidation;
using workgrid.Application.Features.TableColumns.Commands.UpdateTableColumnWithOption;

namespace workgrid.Application.Features.TableColumns.Commands.UpdateTableColumn;

public class UpdateTableColumnWithOptionValidator : AbstractValidator<UpdateTableColumnWithOptionCommand>
{
    public UpdateTableColumnWithOptionValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Güncellenecek kolon ID'si boş olamaz.");
    }
}