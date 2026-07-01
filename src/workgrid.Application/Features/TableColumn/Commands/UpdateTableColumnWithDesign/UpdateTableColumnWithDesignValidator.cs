
using FluentValidation;
using workgrid.Application.Features.TableColumns.Commands.UpdateTableColumnWithDesign;

namespace workgrid.Application.Features.TableColumns.Commands.UpdateTableColumn;

public class UpdateTableColumnWithDesignValidator : AbstractValidator<UpdateTableColumnWithDesignCommand>
{
    public UpdateTableColumnWithDesignValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Güncellenecek kolon ID'si boş olamaz.");
    }
}