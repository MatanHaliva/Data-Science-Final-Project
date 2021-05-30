using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using System;
using System.Collections.Generic;

namespace Services
{
    public static class MongoService<T>
    {
        public static MongoHelper<T> GetInstance(DatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);
            var _detections = database.GetCollection<T>(settings.DetectionsCollectionName);

            return new MongoHelper<T>(client, database, _detections);
        }
        public static void RegisterMapIfNeeded<TClass>()
        {
            if (!BsonClassMap.IsClassMapRegistered(typeof(TClass)))
                BsonClassMap.RegisterClassMap<TClass>();

        }
    }
}

