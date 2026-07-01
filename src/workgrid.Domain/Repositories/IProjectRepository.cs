using workgrid.Domain.Common;
using workgrid.Domain.Entities;
using workgrid.Domain.Enums;
using workgrid.Domain.Entities;

namespace workgrid.Domain.Repositories;

public interface IProjectRepository : IRepository<Project, Guid>
{
    Task<IEnumerable<Project>> GetProjectsAsync(CancellationToken ct = default);
    Task<IEnumerable<Project>> GetProjectsByUserAsync(string userId, CancellationToken ct = default);

    Task<Project?> GetByIdWithMembersAsync(Guid id, CancellationToken ct = default);

    Task DeleteMembersByProjectIdAsync(Guid projectId, CancellationToken ct);

    Task ExecuteDeleteMembersByProjectIdAsync(Guid projectId, CancellationToken ct);

    Task AddMemberAsync(ProjectMember member, CancellationToken ct);
}