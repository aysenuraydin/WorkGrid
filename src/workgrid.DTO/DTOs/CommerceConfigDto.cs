namespace workgrid.DTO.DTOs;

public record CommerceConfigDto(
    string CurrencyCode,
    string InvoiceNotes,
    decimal DefaultShippingFee
);