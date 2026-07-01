namespace workgrid.DTO.DTOs;

public record GalleryItemDto(int Id, string Name, string Url);

public record GalleryItemCreateDto(string Name, string Url);

public record GalleryItemUpdateDto(string Name, string Url);

