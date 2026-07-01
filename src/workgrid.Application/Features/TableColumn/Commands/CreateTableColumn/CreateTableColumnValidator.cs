
using FluentValidation;

namespace workgrid.Application.Features.TableColumns.Commands.CreateTableColumn;

public class CreateTableColumnValidator : AbstractValidator<CreateTableColumnCommand>
{
    public CreateTableColumnValidator()
    {
        RuleFor(x => x.TableId)
            .NotEmpty().WithMessage("Bir tablo seçilmelidir.");

        RuleFor(x => x.Type)
            .IsInEnum().WithMessage("Geçersiz kolon tipi seçildi.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Kolon adı boş olamaz.")
            .MaximumLength(100).WithMessage("Kolon adı en fazla 100 karakter olabilir.");
    }
}