namespace workgrid.FileApi.Modules;

public interface IFileService
{
    Task<string> UploadFileAsync(IFormFile file);
    Task<FileDto?> DownloadFileAsync(string fileName);
    Task<bool> DeleteFileAsync(string fileName);
}