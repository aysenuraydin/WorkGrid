using Microsoft.EntityFrameworkCore;
using workgrid.Domain.Repositories;
using workgrid.Infrastructure.Persistence;
using workgrid.Infrastructure.Persistence.Common.Repositories;
using workgrid.Domain.Entities;

namespace workgrid.Infrastructure.Persistence.Repositories;

public class ProjectRepository : BaseRepository<Project, Guid>, IProjectRepository
{
    private readonly WorkGridDbContext _db;

    public ProjectRepository(WorkGridDbContext db) : base(db)
    {
        _db = db;
    }

    public async Task<IEnumerable<Project>> GetProjectsAsync(CancellationToken ct = default)
    {
        return await _db.Projects
            .Include(p => p.Members)
            .Include(p => p.Cards)
            .AsNoTracking()
            .ToListAsync(ct);
    }
    public async Task<IEnumerable<Project>> GetProjectsByUserAsync(string userId, CancellationToken ct = default)
    {
        return await _db.Projects
            .Include(p => p.Members)
            .Include(p => p.Cards)
            .Where(p => p.Members.Any(m => m.UserId == userId))
            .AsNoTracking()
            .ToListAsync(ct);
    }

    public async Task<Project?> GetByIdWithMembersAsync(Guid id, CancellationToken ct = default)
    {
        return await _db.Projects
            .Include(p => p.Members)
            .FirstOrDefaultAsync(p => p.Id == id, ct);
    }

    public async Task DeleteMembersByProjectIdAsync(Guid projectId, CancellationToken ct)
    {
        var members = await _db.ProjectMembers
            .Where(pm => pm.ProjectId == projectId)
            .ToListAsync(ct);

        foreach (var member in members)
            _db.ProjectMembers.Remove(member);
    }
    public async Task DeleteById(Guid projectId, CancellationToken ct)
    {
        var entity = await _db.Projects
            .IgnoreQueryFilters()
            .Where(pm => pm.Id == projectId)
            .FirstOrDefaultAsync(ct);


        if (entity != null)
        {
            entity.IsHardDelete = true;
            _db.Remove(entity);
        }
    }

    public async Task ExecuteDeleteMembersByProjectIdAsync(Guid projectId, CancellationToken ct)
    {
        await _db.ProjectMembers
            .Where(pm => pm.ProjectId == projectId)
            .ExecuteDeleteAsync(ct); // ⚡️ İşte sihirli SQL komutu! Interceptor'ı tamamen bypass eder.
    }

    // Yeni üyeleri eklemek için düz bir metot
    public async Task AddMemberAsync(ProjectMember member, CancellationToken ct)
    {
        await _db.ProjectMembers.AddAsync(member, ct);
    }
}