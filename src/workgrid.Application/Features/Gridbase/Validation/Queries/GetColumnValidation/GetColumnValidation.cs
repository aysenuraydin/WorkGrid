using MediatR;
using workgrid.Application.Common.Models;
using workgrid.Application.Services.Interfaces;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Features.Validation.Queries.GetColumnValidation;

public record GetColumnValidationQuery(string TableName, string ColumnName)
    : IRequest<Result<ColumnValidationResponse>>;
public class GetColumnValidationQueryHandler : IRequestHandler<GetColumnValidationQuery, Result<ColumnValidationResponse>>
{
    private readonly IGridBaseService _service;
    public GetColumnValidationQueryHandler(IGridBaseService service) => _service = service;

    public async Task<Result<ColumnValidationResponse>> Handle(GetColumnValidationQuery request, CancellationToken cancellationToken)
    {
        // 🔒 Hidden. Akış: motor servisinden kolonun doğrulama ayarını getir →
        //   yoksa NotFound → Success.
        throw new NotImplementedException("Source available on request.");
    }
}