namespace workgrid.Domain.Entities;

public class CommerceConfig
{
    public int Id { get; set; }
    public string CurrencyCode { get; set; } = "₺";

    public string InvoiceNotes { get; set; } = string.Empty;

    public decimal DefaultShippingFee { get; set; }
}