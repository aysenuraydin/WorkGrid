using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using workgrid.Domain.Common;
namespace workgrid.Infrastructure.Persistence.Common.Repositories;

public class BaseRepository<TEntity, TKey> : IRepository<TEntity, TKey>
    where TEntity : class, IEntity<TKey>
{
    private readonly WorkGridDbContext _context;
    private readonly DbSet<TEntity> _table;
    public BaseRepository(WorkGridDbContext context)
    {
        _context = context;
        _table = _context.Set<TEntity>();
    }

    public IQueryable<TEntity> GetAll()
    {
        return _table;
    }

    public IQueryable<TEntity> GetAll(params Expression<Func<TEntity, object>>[] includes)
    {
        IQueryable<TEntity> query = GetAll();
        return includes.Aggregate(query, (current, includeProperty) => current.Include(includeProperty));
    }

    public IQueryable<TEntity> GetAll(
        Expression<Func<TEntity, bool>>? predicate = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
        params Expression<Func<TEntity, object>>[] includes)
    {
        IQueryable<TEntity> query = GetAll();

        if (predicate != null) query = query.Where(predicate);

        if (orderBy != null) query = orderBy(query);

        return includes.Aggregate(query, (current, includeProperty) => current.Include(includeProperty));
    }

    public async Task<PaginatedEntities<TEntity>> GetAllByPage(
        Expression<Func<TEntity, bool>>? predicate = null,
        int page = 1, int pageCount = 10,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
        params Expression<Func<TEntity, object>>[] includes)
    {
        var entities = GetAll(predicate, orderBy, includes);

        return new PaginatedEntities<TEntity>
        {
            Count = entities.Count(),
            Entities = await entities
                .Skip((page - 1) * pageCount)
                .Take(pageCount)
                .ToListAsync()
        };
    }

    public async Task<IEnumerable<TEntity>> GetList(bool hasTracking = false)
    {
        if (!hasTracking)
            return await _table.AsNoTracking().ToListAsync();

        return await _table.ToListAsync();
    }
    public async Task<IEnumerable<TEntity>> GetList(
        Expression<Func<TEntity, bool>>? predicate = null,
        Expression<Func<TEntity, int>>? orderBy = null,
        bool hasTracking = false)
    {
        IQueryable<TEntity> query = GetAll();
        if (predicate != null) query = query.Where(predicate);
        if (orderBy != null) query = query.OrderBy(orderBy);

        if (!hasTracking)
            return await query.AsNoTracking().ToListAsync();

        return await query.ToListAsync();
    }

    public async Task<TEntity?> GetById(TKey id, bool hasTracking = false)
    {
        if (!hasTracking)
        {
            var entity = _table.Find(id);
            if (entity != null)
                _context.Entry(entity).State = EntityState.Detached;

            return entity;
        }
        return await _table.FindAsync(id);
    }
    public async Task Create(TEntity entity)
    {
        _table.Add(entity);
    }
    public Task Update(TEntity entity)
    {
        var entry = _context.Entry(entity);
        if (entry.State == EntityState.Detached)
        {
            _table.Attach(entity);
            entry.State = EntityState.Modified;
        }
        return Task.CompletedTask;
    }
    public async Task Delete(TEntity entity)
    {
        _table.Remove(entity);
    }

    public async Task DeleteById(TKey id)
    {
        var entity = await _table.FindAsync(id);
        if (entity != null)
        {
            _table.Remove(entity);
        }
    }
    public async Task DeleteAllByTableId(Expression<Func<TEntity, bool>>? predicate = null)
    {
        IQueryable<TEntity> query = GetAll();
        if (predicate != null) query = query.Where(predicate);

        var entities = await query.ToListAsync();

        _table.RemoveRange(entities);
    }

    public async Task<IEnumerable<TEntity>> GetList3(
        Expression<Func<TEntity, bool>>? predicate = null)
    {
        IQueryable<TEntity> query = GetAll();
        if (predicate != null) query = query.Where(predicate);

        return await query.ToListAsync();
    }

    public async Task<long> Count(Expression<Func<TEntity, bool>>? predicate = null)
    {
        IQueryable<TEntity> query = GetAll();
        if (predicate != null) query = query.Where(predicate);

        return await query.CountAsync();
    }
    private async Task CheckCreated(TEntity entity)
    {
        var dbEntity = await _table.AsNoTracking().FirstOrDefaultAsync(e => e.Id.Equals(entity.Id));
        if (dbEntity != null && dbEntity.GetType().IsAssignableTo(typeof(IAuditableEntity)))
        {
            var dbEntityItem = dbEntity as IAuditableEntity;
            if (dbEntityItem != null)
            {
                if ((entity as IAuditableEntity).CreatedAt.Ticks == 0 && dbEntityItem.CreatedAt.Ticks > 0)
                    (entity as IAuditableEntity).CreatedAt = dbEntityItem.CreatedAt;

                if ((entity as IAuditableEntity).CreatedBy == null && dbEntityItem.CreatedBy != null)
                    (entity as IAuditableEntity).CreatedBy = dbEntityItem.CreatedBy;
            }
        }
    }
}

public class BaseRepository<TEntity> : BaseRepository<TEntity, long>
    where TEntity : class, IEntity
{
    public BaseRepository(WorkGridDbContext context) : base(context)
    {
    }
}
