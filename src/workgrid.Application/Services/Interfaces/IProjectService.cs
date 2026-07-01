
using workgrid.Application.Kanban.DTOs;
namespace workgrid.Application.Kanban.Interfaces;

public interface IProjectService
{
    Task<IEnumerable<ProjectDto>> GetProjectsAsync(CancellationToken ct = default);
    Task<IEnumerable<ProjectDto>> GetUserProjectsAsync(string userId, CancellationToken ct = default);
    Task<ProjectDto> GetProjectByIdAsync(Guid id, CancellationToken ct = default);
    Task<ProjectDto> CreateProjectAsync(CreateProjectRequest req, CancellationToken ct = default);
    Task<ProjectDto> UpdateProjectAsync(Guid id, UpdateProjectRequest req, CancellationToken ct = default);
    Task DeleteProjectAsync(Guid id, CancellationToken ct = default);
}