using workgrid.Domain.Common;
using workgrid.Domain.Repositories;
using workgrid.Application.Interfaces;
using workgrid.Application.Kanban.DTOs;
using workgrid.Application.Kanban.Interfaces;

namespace workgrid.Application.Services;

public class ProjectService : IProjectService
{
    private readonly IProjectRepository _projectRepo;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IIdentityService _identityService;

    public ProjectService(
        IProjectRepository projectRepo,
        IUnitOfWork unitOfWork,
        IIdentityService identityService)
    {
        _projectRepo = projectRepo;
        _unitOfWork = unitOfWork;
        _identityService = identityService;
    }

    public async Task<IEnumerable<ProjectDto>> GetUserProjectsAsync(string userId, CancellationToken ct = default)
    {
        // 🔒 Hidden. Akış: kullanıcının projelerini çek → üye id'lerini topla →
        //   Identity'den profil detaylarını al → DTO'ya harmanla.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<ProjectDto> GetProjectByIdAsync(Guid id, CancellationToken ct = default)
    {
        // 🔒 Hidden. Akış: projeyi üyeleriyle çek → Identity'den profilleri al → DTO.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<IEnumerable<ProjectDto>> GetProjectsAsync(CancellationToken ct = default)
    {
        // 🔒 Hidden. Akış: tüm projeler → üye profilleri → DTO harmanlama.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<ProjectDto> CreateProjectAsync(CreateProjectRequest req, CancellationToken ct = default)
    {
        // 🔒 Hidden. Akış: üye id'lerini doğrula → projeyi üyeleriyle oluştur → commit → DTO.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task<ProjectDto> UpdateProjectAsync(Guid id, UpdateProjectRequest req, CancellationToken ct = default)
    {
        // 🔒 Hidden. Akış: projeyi çek → alanları güncelle → eski üyeleri sil →
        //   yeni üyeleri ekle → commit → profillerle DTO.
        throw new NotImplementedException("Source available on request.");
    }

    public async Task DeleteProjectAsync(Guid id, CancellationToken ct = default)
    {
        // 🔒 Hidden. Akış: projeyi sil → commit.
        throw new NotImplementedException("Source available on request.");
    }
}