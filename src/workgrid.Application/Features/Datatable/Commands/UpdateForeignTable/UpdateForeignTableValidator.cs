
using FluentValidation;

namespace workgrid.Application.Features.Datatables.Commands.UpdateForeignTable;

public class UpdateForeignTableValidator : AbstractValidator<UpdateForeignTableCommand>
{
    public UpdateForeignTableValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Tasarımı güncellenecek kolon ID'si gereklidir.");
    }
}