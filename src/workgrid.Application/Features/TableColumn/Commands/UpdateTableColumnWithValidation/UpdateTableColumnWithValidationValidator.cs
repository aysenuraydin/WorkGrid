
using FluentValidation;
using workgrid.Application.Features.TableColumns.Commands.UpdateTableColumnWithValidation;

namespace workgrid.Application.Features.TableColumns.Commands.UpdateTableColumn;

public class UpdateTableColumnWithValidationValidator : AbstractValidator<UpdateTableColumnWithValidationCommand>
{
    public UpdateTableColumnWithValidationValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Güncellenecek kolon ID'si boş olamaz.");
    }
}