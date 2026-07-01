using workgrid.Application.Services.Interfaces;
using workgrid.Domain.Entities;
using workgrid.Domain.Enums;
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services;

public partial class GridBaseService
{
    private static IReadOnlyList<TableColumn> RealColumns(Datatable table)
    {
        // 🔒 Hidden. soft-delete'siz + RealColumnId==null kolonlar, TableOrder'a göre.
        throw new NotImplementedException("Source available on request.");
    }

    private static IReadOnlyList<ForeignColumnMeta> ForeignColumns(Datatable table)
    {
        // 🔒 Hidden. İlişki kolonlarını hedef tablo + çoklu-seçim bilgisiyle eşler.
        throw new NotImplementedException("Source available on request.");
    }

    private sealed record ForeignColumnMeta(TableColumn Column, string JsonKey, bool IsMultiSelect);

    private static IDictionary<string, object?> RowToJson(
        TableRow row, IReadOnlyList<TableColumn> columns, IReadOnlyList<ForeignColumnMeta> foreignColumns)
    {
        // 🔒 Hidden. Akış: her gerçek kolon için hücre → tip-cast → camelCase key;
        //   her foreign kolon için id/id-dizisi çöz → JSON anahtarı.
        throw new NotImplementedException("Source available on request.");
    }

    private static IDictionary<string, object?> ApplySelect(
        IDictionary<string, object?> row, SelectDescriptor? select)
    {
        // 🔒 Hidden. include/exclude moduna göre alanları süzer.
        throw new NotImplementedException("Source available on request.");
    }

    private static string ToCamelCase(string name) =>
        string.IsNullOrEmpty(name) ? name : char.ToLower(name[0]) + name[1..];

    private static string StripSpaces(string s) =>
        string.IsNullOrEmpty(s) ? s : new string(s.Where(ch => !char.IsWhiteSpace(ch)).ToArray());

    private static object? CastValue(string? raw, TableColumn column)
    {
        // 🔒 Hidden. Number/Boolean tiplerinde parse, aksi halde ham string.
        throw new NotImplementedException("Source available on request.");
    }

    private static object ParseNumber(string raw)
    {
        // 🔒 Hidden. long/decimal parse, aksi halde ham.
        throw new NotImplementedException("Source available on request.");
    }

    private static object ParseBool(string raw)
    {
        // 🔒 Hidden. true/1/on/yes/evet → true.
        throw new NotImplementedException("Source available on request.");
    }

    private static string ToCellString(object? value)
    {
        // 🔒 Hidden. null/bool/JsonElement/diğer → string.
        throw new NotImplementedException("Source available on request.");
    }

    private static string JsonElementToString(System.Text.Json.JsonElement je)
    {
        // 🔒 Hidden. JsonElement türüne göre string'e çevirir.
        throw new NotImplementedException("Source available on request.");
    }

    private static string ForeignValueToCell(object? value)
    {
        // 🔒 Hidden. Dizi → "id1,id2", sayı/string → ham, null → boş.
        throw new NotImplementedException("Source available on request.");
    }

    private static bool IsJsonNull(object? value)
    {
        // 🔒 Hidden. null ya da JsonValueKind.Null kontrolü.
        throw new NotImplementedException("Source available on request.");
    }
}
