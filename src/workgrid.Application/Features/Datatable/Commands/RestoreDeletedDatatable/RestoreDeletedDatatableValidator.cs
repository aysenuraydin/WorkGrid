
using FluentValidation;

namespace workgrid.Application.Features.Datatables.Commands.RestoreDeletedDatatable;

public class RestoreDeletedDatatableValidator : AbstractValidator<RestoreDeletedDatatableCommand>
{
    public RestoreDeletedDatatableValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Tasarımı güncellenecek kolon ID'si gereklidir.");
    }
}