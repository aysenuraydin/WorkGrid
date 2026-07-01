using workgrid.Domain.Entities;

namespace workgrid.Infrastructure.Persistence.Repositories;

public partial class GridBaseRepository
{
    public async Task<IEnumerable<Datatable>> GetAllTablesAsync(CancellationToken ct)
    {
        // 🔒 Hidden. Akış: soft-delete filtresi → kolon ve satırları include → id'ye göre sırala.
        throw new NotImplementedException("Source available on request.");
    }

    public Task<IEnumerable<Datatable>> GetAllTablesAsync(long projectId, CancellationToken ct)
    {
        // 🔒 Hidden. Akış: projeye göre filtrele → ilişkileriyle getir.
        throw new NotImplementedException("Source available on request.");
    }

    public Task<Datatable?> GetTableByIdAsync(long tableId, CancellationToken ct)
    {
        // 🔒 Hidden. Akış: id + soft-delete → kolon/satır/hücre include → ilkini döndür.
        throw new NotImplementedException("Source available on request.");
    }

    public Task<bool> TableNameExistsAsync(string name, CancellationToken ct)
    {
        // 🔒 Hidden. Ad + soft-delete filtresiyle varlık kontrolü.
        throw new NotImplementedException("Source available on request.");
    }

    public Task<bool> TableNameExistsAsync(string name, long projectId, CancellationToken ct)
    {
        // 🔒 Hidden. Ad + projectId + soft-delete filtresiyle varlık kontrolü.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task AddTableAsync(Datatable table, CancellationToken ct)
    {
        // 🔒 Hidden. Yeni tabloyu context'e ekler.
        throw new NotImplementedException("Source available on request.");
    }

    public void RemoveTable(Datatable table)
    {
        // 🔒 Hidden. Tabloyu context'ten kaldırır.
        throw new NotImplementedException("Source available on request.");
    }
}