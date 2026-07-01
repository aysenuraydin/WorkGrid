using System.Linq.Expressions;
namespace workgrid.Domain.Common;

public interface IService<TEntity, TKey> where TEntity : class, IEntity<TKey>
{
    Task<List<TEntity>> GetAll();
    Task<TEntity?> GetById(TKey id);
    Task Create(TEntity entity);
    Task Update(TEntity entity);
    Task Delete(TEntity entity);
    Task DeleteById(TKey id);
}

public interface IService<TEntity> : IService<TEntity, long> where TEntity : class, IEntity<long>
{

}
