
using FluentValidation;

namespace workgrid.Application.Features.TableCells.Commands.UpdateTableCell;

public class UpdateTableCellValidator : AbstractValidator<UpdateTableCellCommand>
{
    public UpdateTableCellValidator()
    {
        RuleFor(x => x.CellId)
            .NotEmpty().WithMessage("Güncellenecek cell kimliği (ID) boş olamaz.");
    }
}