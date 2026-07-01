using FluentValidation;

namespace workgrid.Application.Features.Tables.Commands.CreateTable;

public class CreateTableValidator : AbstractValidator<CreateTableCommand>
{
    public CreateTableValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Tablo adı boş olamaz.")
            .MaximumLength(100).WithMessage("Tablo adı çok uzun.");
    }
}
