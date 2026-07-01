using System.ComponentModel.DataAnnotations;

namespace workgrid.Infrastructure.ConfigModels;

public class AppConfigModel
{
    public bool IsMongoActive { get; set; } = default!;
    public bool IsRedisActive { get; set; } = default!;
    [Required]
    public string ClientUrls { get; set; } = default!;
    [Required]
    public string ApiUrls { get; set; } = default!;
}