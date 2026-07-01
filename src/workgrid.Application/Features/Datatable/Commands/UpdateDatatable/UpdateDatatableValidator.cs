
using FluentValidation;

namespace workgrid.Application.Features.Datatables.Commands.UpdateDatatable;

public class UpdateDatatableValidator : AbstractValidator<UpdateDatatableCommand>
{
    public UpdateDatatableValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tablo adı boş bırakılamaz.")
            .MaximumLength(100).WithMessage("Tablo adı en fazla 100 karakter olabilir.");

        RuleFor(x => x.ViewType)
            .NotNull().WithMessage("Lütfen bir görünüm tipi (Grid/Table) seçiniz.");

        RuleFor(x => x.ModalSize)
            .NotNull().WithMessage("Lütfen bir görünüm tipi Modal Size seçiniz.");
    }
}