using workgrid.Domain.Entities;

namespace workgrid.Application.Services;

public partial class GridBaseService
{
    private static bool MatchesSearch(
        TableRow row, string? search,
        IReadOnlyList<TableColumn> columns, IReadOnlyList<string>? searchFields)
    {
        // 🔒 Hidden. Akış: searchFields verilmişse o kolonları, değilse tümünü hedefle →
        //   herhangi bir hücre değeri aranan metni içeriyorsa true.
        throw new NotImplementedException("Source available on request.");
    }
}
