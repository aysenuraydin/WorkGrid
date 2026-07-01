
using FluentValidation;

namespace workgrid.Application.Features.TableColumns.Commands.UpdateTableColumn;

public class UpdateTableColumnValidator : AbstractValidator<UpdateTableColumnCommand>
{
    public UpdateTableColumnValidator()
    {
        RuleFor(x => x.Id)
            .NotEmpty().WithMessage("Güncellenecek kolon seçilmelidir.");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Geçersiz bir giriş tipi (InputType) seçildi.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Kolon adı boş bırakılamaz.")
            .MaximumLength(100).WithMessage("Kolon adı 100 karakterden uzun olamaz.");

        RuleFor(x => x.TableOrder)
            .GreaterThanOrEqualTo(0).WithMessage("Sıralama değeri negatif olamaz.");
    }
}