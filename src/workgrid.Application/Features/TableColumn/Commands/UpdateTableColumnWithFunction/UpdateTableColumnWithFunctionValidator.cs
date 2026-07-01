
using FluentValidation;
using workgrid.Application.Features.TableColumns.Commands.UpdateTableColumnWithFunction;

namespace workgrid.Application.Features.TableColumns.Commands.UpdateTableColumn;

public class UpdateTableColumnWithFunctionValidator : AbstractValidator<UpdateTableColumnWithFunctionCommand>
{
    public UpdateTableColumnWithFunctionValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Güncellenecek kolon ID'si boş olamaz.");
    }
}