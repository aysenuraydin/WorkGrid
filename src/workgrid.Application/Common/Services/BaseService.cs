using Microsoft.EntityFrameworkCore;
using workgrid.Domain.Common;

namespace workgrid.Application.Common.Services;

public class BaseService<TEntity, TKey
> : IService<TEntity, TKey>
    where TEntity : class, IEntity<TKey>
{
    protected readonly IRepository<TEntity, TKey> _repository;

    public BaseService(IRepository<TEntity, TKey> repository)
    {
        _repository = repository;
    }

    public async Task<List<TEntity>> GetAll()
    {
        return await _repository.GetAll().ToListAsync();
    }

    public async Task<TEntity?> GetById(TKey id)
    {
        return await _repository.GetById(id);
    }

    public async Task Create(TEntity entity)
    {
        await _repository.Create(entity);
    }

    public async Task Update(TEntity entity)
    {
        await _repository.Update(entity);
    }

    public async Task Delete(TEntity entity)
    {
        await _repository.Delete(entity);
    }

    public async Task DeleteById(TKey id)
    {
        await _repository.DeleteById(id);
    }
}

// long Id kullanan entity’ler için kısaltma
public class BaseService<TEntity> : BaseService<TEntity, long>, IService<TEntity, long>
    where TEntity : class, IEntity<long>
{
    public BaseService(IRepository<TEntity, long> repository) : base(repository) { }
}