using workgrid.FileApi.Data;

namespace workgrid.FileApi.Modules;

public class FileService : IFileService
{
    private readonly IConfiguration _config;
    private readonly IWebHostEnvironment _env;
    private readonly FileDbContext _dbContext;

    public FileService(FileDbContext dbContext, IConfiguration config, IWebHostEnvironment env)
    {
        _config = config;
        _env = env;
        _dbContext = dbContext;
    }

    public async Task<string> UploadFileAsync(IFormFile file)
    {
        // 🔒 Hidden. Akış: stream'e kopyala → benzersiz ad (Guid) + uzantı üret →
        //   config'teki konuma diske yaz → FileEntity meta verisini DB'ye ekle →
        //   başarılıysa localName döndür.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<bool> DeleteFileAsync(string fileName)
    {
        // 🔒 Hidden. Akış: fiziksel dosyayı sil → DB kaydını bul ve kaldır →
        //   sonucu döndür.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<FileDto?> DownloadFileAsync(string fileName)
    {
        // 🔒 Hidden. Akış: config'teki konumdan yolu çöz → dosya yoksa null →
        //   DB meta verisini al → byte + content-type + orijinal adla FileDto döndür.
        throw new NotImplementedException("Source available on request.");
    }
}