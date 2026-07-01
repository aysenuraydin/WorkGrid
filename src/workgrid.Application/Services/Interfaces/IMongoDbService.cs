using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace workgrid.Application.Services.Interfaces;

public interface IMongoDbService
{
    Task<List<MongoModel>> GetAll();
    Task<MongoModel> GetById(string id);
    Task Create(MongoModel cell);
    Task Update(string id, MongoModel cell);
    Task Delete(string id);
}
public class MongoModel
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string Id { get; set; } = null!;

    [BsonElement("name")]
    public string Name { get; set; } = null!;
    [BsonElement("surname")]
    public string Surname { get; set; } = null!;

    [BsonElement("age")]
    public int Age { get; set; }
}
