
using Microsoft.Extensions.Options;
using MongoDB.Driver;
using workgrid.Application.Common.Models;
using workgrid.Application.Services.Interfaces;

namespace workgrid.Application.Services;

public class MongoDbService : IMongoDbService
{
    private readonly IMongoDatabase _database;
    private readonly MongoDbSettings _options;
    private readonly IMongoCollection<MongoModel> _collection;
    public MongoDbService(IOptions<MongoDbSettings> options)
    {
        _options = options.Value;

        var client = new MongoClient(_options.ConnectionString);
        _database = client.GetDatabase(_options.DatabaseName);
        _collection = _database.GetCollection<MongoModel>(_options.CellsCollection);
    }

    public async Task<List<MongoModel>> GetAll()
    {
        return await _collection.Find(_ => true).ToListAsync();
    }
    public async Task<MongoModel> GetById(string id)
    {
        return await _collection.Find(e => e.Id == id).FirstOrDefaultAsync();
    }
    public async Task Create(MongoModel customer)
    {
        await _collection.InsertOneAsync(customer);
    }
    public async Task Update(string id, MongoModel customer)
    {
        await _collection.ReplaceOneAsync(e => e.Id == id, customer);
    }
    public async Task Delete(string id)
    {
        await _collection.DeleteOneAsync(e => e.Id == id);
    }
}
