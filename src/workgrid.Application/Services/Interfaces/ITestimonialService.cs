
using workgrid.DTO.DTOs;

namespace workgrid.Application.Services.Interfaces;

public interface ITestimonialService
{
    Task<List<TestimonialDto>> GetAllAsync();
    Task<TestimonialDto> CreateAsync(TestimonialDto dto);
    Task<TestimonialDto?> UpdateAsync(string externalId, TestimonialDto dto);
    Task<bool> DeleteAsync(string externalId);
}
