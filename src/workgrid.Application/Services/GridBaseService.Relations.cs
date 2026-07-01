using workgrid.Domain.Entities;

namespace workgrid.Application.Services;

public partial class GridBaseService
{
    private static string BuildLinkColumnName(string toTableName, bool isMultiSelect)
    {
        // 🔒 Hidden. "WG" + boşluksuz tablo adı + (Ids/Id).
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<IReadOnlyList<RelationInfo>> GetRelationsAsync(
        string fromTable, CancellationToken ct = default)
    {
        // 🔒 Hidden. Akış: yetki → kaynak tabloyu çöz → foreign kayıtları → hedef adlarıyla DTO.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task AddRelationAsync(
        string fromTable, string toTable, bool isMultiSelect, CancellationToken ct = default)
    {
        // 🔒 Hidden. Akış: yetki → from/to tabloları çöz → mevcut ilişkiyi güncelle
        //   ya da yeni ForeignTable ekle → bağ kolonunu upsert et → kaydet.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<bool> RemoveRelationAsync(
        string fromTable, string toTable, CancellationToken ct = default)
    {
        // 🔒 Hidden. Akış: yetki → ilişkiyi bul → kaldır → bağ kolonlarını
        //   hücreleriyle hard-delete → kaydet.
        throw new NotImplementedException("Source available on request.");
    }

    // ── Bağ kolonu oluştur/güncelle + mevcut satırlara boş hücre aç ──
    private async Task UpsertLinkColumnAsync(
        long fromTableId, long toTableId, string toTableName, bool isMultiSelect, CancellationToken ct)
    {
        // 🔒 Hidden. Akış: bağ kolon adını üret → varsa adını güncelle, yoksa
        //   CreateForeignLink ile ekle → mevcut satırlara boş hücre aç.
        throw new NotImplementedException("Source available on request.");
    }
}

// ── DTO ──
public class RelationInfo
{
    public string ToTable { get; set; } = null!;
    public bool IsMultiSelect { get; set; }
}
