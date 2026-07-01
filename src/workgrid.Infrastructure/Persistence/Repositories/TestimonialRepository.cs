using Microsoft.EntityFrameworkCore;
using workgrid.Domain.Entities;
using workgrid.Domain.Repositories;

namespace workgrid.Infrastructure.Persistence.Repositories;

public class TestimonialRepository(WorkGridDbContext db) : ITestimonialRepository
{
    public Task<List<Testimonial>> GetAllAsync() =>
        db.Testimonials.ToListAsync();

    public Task<Testimonial?> GetByExternalIdAsync(string externalId) =>
        db.Testimonials.FirstOrDefaultAsync(x => x.ExternalId == externalId);

    public async Task AddAsync(Testimonial entity) =>
        await db.Testimonials.AddAsync(entity);

    public void Remove(Testimonial entity) =>
        db.Testimonials.Remove(entity);

    public Task SaveChangesAsync() =>
        db.SaveChangesAsync();
}


