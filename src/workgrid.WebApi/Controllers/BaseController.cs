using Asp.Versioning;
using Microsoft.AspNetCore.Mvc;
using workgrid.Domain.Common;

namespace workgrid.WebApi.Controllers;

[ApiController]
// [Route("api/[controller]")]
[ApiVersion("1.0")] // Bu controller v1.0'a ait
[Route("api/[controller]")]
// Eski yol (React için hala aktif)
[Route("api/v{version:apiVersion}/[controller]")]
// Yeni yol (Gelecek için hazır)  // URL: /api/v1/datatables

/* 
!API Versioning

Diyelim ki v1'de bir tablonun adını değiştirdin veya bir alanı zorunlu yaptın ama eski kullanıcıların (React v1) patlamasını istemiyorsun.

1. Adım: Yeni Controller Oluştur (v2)
Eski Controller'ına dokunmuyorsun! Onun yerine aynı isimde ama farklı bir namespace altında yeni bir Controller oluşturuyorsun.

Klasör Yapısı:

namespace workgrid.WebApi.Controllers.v2; // Namespace değişti!

[ApiController]
[ApiVersion("2.0")] // Artık bu v2.0
[Route("api/v{version:apiVersion}/[controller]")]
public class DatatablesController : BaseController<Datatable, Guid>

Controllers/v1/DatatablesController.cs (Eski kod burada kalsın)

Controllers/v2/DatatablesController.cs (Yeni kurallar burada olacak)

namespace workgrid.WebApi.Controllers.v2; // Namespace değişti!

[ApiController]
[ApiVersion("2.0")] // Artık bu v2.0
[Route("api/v{version:apiVersion}/[controller]")]
public class DatatablesController : BaseController<Datatable, Guid>
{
    * Burada v2'ye özel, yeni veritabanı yapısına uygun kodlarını yazabilirsin.
    * v1 hala eski veritabanı mantığıyla (veya bir mapleme ile) çalışmaya devam eder.
}

3. Adım: Swagger'da v2'yi Tanımla
DependencyInjection.cs içinde Swagger'a "Artık bir de v2 dökümantasyonumuz var" demen lazım:
option.SwaggerDoc("v2", new OpenApiInfo { Title = "WorkGrid API v2", Version = "v2" });

4. Adım: reactda gerekli endpointlere de apiden sonra version yazmamız lazım
'https://localhost:5001/api/v1'

*/

public class BaseController<TEntity, TKey> : ControllerBase
where TEntity : class, IEntity<TKey>
{
    protected readonly IService<TEntity, TKey> _service;
    public BaseController(IService<TEntity, TKey> service) => _service = service;

    #region

    // [HttpGet]
    // public virtual async Task<IActionResult> GetAllAsync() => Ok(await _service.GetAll());

    // [HttpGet("{id}")]
    // public virtual async Task<IActionResult> GetByIdAsync(TKey id) => Ok(await _service.GetById(id));

    // [HttpPost]
    // public virtual async Task<IActionResult> CreateAsync([FromBody] TEntity entity)
    // {
    //     await _service.Create(entity);
    //     return Ok(entity);
    // }

    // [HttpPut("{id}")]
    // public virtual async Task<IActionResult> UpdateAsync(TKey id, [FromBody] TEntity entity)
    // {
    //     if (id.Equals(entity.Id))
    //     {
    //         await _service.Update(entity);
    //     }
    //     return Ok(entity);
    // }

    // [HttpDelete("{id}")]
    // public virtual async Task<IActionResult> DeleteAsync(TKey id)
    // {
    //     await _service.DeleteById(id);
    //     return NoContent();
    // }

    // public void ViewBagMessage(string message)
    // {
    //     // TempData["ErrorMessage"] = null;
    //     // ViewBag.ErrorMessage = $"Error: {message}";
    // }
    // public void TempDataMessage(string message)
    // {
    //     // TempData["ErrorMessage"] = $"Error: {message}";
    // }

    #endregion
}