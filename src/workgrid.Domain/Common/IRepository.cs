
using System.Linq.Expressions;

namespace workgrid.Domain.Common;

public interface IRepository<TEntity, TKey>
 where TEntity : class, IEntity<TKey>
{
    IQueryable<TEntity> GetAll();
    IQueryable<TEntity> GetAll(params Expression<Func<TEntity, object>>[] includes);
    IQueryable<TEntity> GetAll(
        Expression<Func<TEntity, bool>>? predicate = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
        params Expression<Func<TEntity, object>>[] includes);

    Task<PaginatedEntities<TEntity>> GetAllByPage(
        Expression<Func<TEntity, bool>>? predicate = null,
        int page = 1, int pageCount = 10,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>>? orderBy = null,
        params Expression<Func<TEntity, object>>[] includes);

    Task<IEnumerable<TEntity>> GetList(bool hasTracking = false);

    Task<IEnumerable<TEntity>> GetList(
        Expression<Func<TEntity, bool>>? predicate = null,
        Expression<Func<TEntity, int>>? orderBy = null,
        bool hasTracking = false);

    Task<TEntity?> GetById(TKey id, bool hasTracking = false);
    Task Create(TEntity entity);
    Task Update(TEntity entity);
    Task Delete(TEntity entity);
    Task DeleteById(TKey id);
    Task DeleteAllByTableId(Expression<Func<TEntity, bool>>? predicate = null);
    Task<long> Count(Expression<Func<TEntity, bool>>? predicate = null);
}


public interface IRepository<TEntity> : IRepository<TEntity, long> where TEntity : class, IEntity<long>
{

}