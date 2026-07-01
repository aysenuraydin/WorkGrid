using AutoMapper;
using workgrid.Application.Common.Models;
using workgrid.Application.Common.Services;
using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Common;
using workgrid.Domain.Entities;

namespace workgrid.Application.Services;

public class TableCellService : BaseService<TableCell>, ITableCellService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    public TableCellService(IRepository<TableCell, long> repository, IUnitOfWork unitOfWork, IMapper mapper) : base(repository)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<List<TableCell>>> GetAll()
    {
        // 🔒 Hidden. Tüm hücreleri çekip DTO'ya map'ler.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<PaginatedResult<TableCell>> GetPaginatedNormal(PaginationRequest req)
    {
        // 🔒 Hidden. Akış: sayım → skip/take → map → sayfalı sonuç.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<PaginatedResult<TableCell>> GetPaginated(PaginationRequest req)
    {
        // 🔒 Hidden. AutoMapper ProjectTo ile sorgu düzeyinde sayfalama.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<Result<TableCell?>> GetById(long id)
    {
        // 🔒 Hidden. Id ile çek → yoksa Failure → map.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<Result<TableCell?>> GetFormById(long id)
    {
        // 🔒 Hidden. Form için tekil hücre getir.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<Result<long>> Create(TableCell dto)
    {
        // 🔒 Hidden. Map → ekle → Result.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<Result<bool>> Update(TableCell dto)
    {
        // 🔒 Hidden. Map → güncelle → commit → Result.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<Result<bool>> Delete(long id)
    {
        // 🔒 Hidden. Id ile sil → commit → Result.
        throw new NotImplementedException("Source available on request.");
    }
}