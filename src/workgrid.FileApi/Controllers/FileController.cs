using Microsoft.AspNetCore.Mvc;
using workgrid.FileApi.Modules;

namespace workgrid.FileApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FileController(IFileService fileService) : ControllerBase
{
    private readonly IFileService _fileService = fileService;

    [HttpPost]
    public async Task<IActionResult> UploadFiles(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest("Dosya boş veya mevcut değil.");

        var fileName = await _fileService.UploadFileAsync(file);
        return Ok(fileName);
    }

    [HttpGet("{fileName}")]
    public async Task<IActionResult> DownloadFiles(string fileName)
    {
        FileDto? file = await _fileService.DownloadFileAsync(fileName);
        if (file == null)
            return NotFound("Dosya mevcut değil.");

        return File(file.Data, file.ContentType, file.Name);
    }

    [HttpDelete("{fileName}")]
    public async Task<IActionResult> DeleteFiles(string fileName)
    {
        bool result = await _fileService.DeleteFileAsync(fileName);
        if (result)
            return Ok("Dosya başarıyla silindi.");

        return StatusCode(500, "Dosya silinirken bir hata oluştu.");
    }
}