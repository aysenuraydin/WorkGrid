
using FluentValidation;
using workgrid.Application.Features.TableColumns.Commands.UpdateBulkTableColumnWithModal;

namespace workgrid.Application.Features.TableColumns.Commands.UpdateBulkTableColumn;

public class UpdateBulkTableColumnWithValidationValidator : AbstractValidator<UpdateBulkTableColumnWithModalDesignCommand>
{
    public UpdateBulkTableColumnWithValidationValidator()
    {
        RuleFor(x => x.TableId)
            .NotEmpty().WithMessage("Güncellenecek table ID'si boş olamaz.");
    }
}