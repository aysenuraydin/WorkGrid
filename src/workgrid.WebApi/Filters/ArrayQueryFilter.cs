using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace workgrid.WebApi.Filters;

public class ArrayQueryFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var arrayParams = operation.Parameters
            .Where(p => p.In == ParameterLocation.Query
                    && p.Schema.Type == "array")
            .ToList();

        foreach (var param in arrayParams)
        {
            param.Explode = true; // ?filter=a&filter=b formatı
            param.Style = ParameterStyle.Form;
        }
    }
}