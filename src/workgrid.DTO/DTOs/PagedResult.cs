public record PagedResult(
    int Page,
    int PageSize,
    int TotalCount,
    int TotalPages,
    IReadOnlyList<IDictionary<string, object?>> Data
);
