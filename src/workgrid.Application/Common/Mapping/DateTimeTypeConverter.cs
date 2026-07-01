
using AutoMapper;

namespace workgrid.Application.Mapping;

public class DateTimeTypeConverter : ITypeConverter<string, DateOnly>
{
    public DateOnly Convert(string source, DateOnly destination, ResolutionContext context)
    {
        var d = System.Convert.ToDateTime(source);
        return DateOnly.FromDateTime(d);
    }
}