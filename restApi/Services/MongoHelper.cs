using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Text;

namespace Services
{
    public class MongoHelper<T>
    {
        public MongoClient Client { get; set; }
        public IMongoDatabase Database { get; set; }
        public IMongoCollection<T> Collection { get; set; }


        public MongoHelper(MongoClient client, IMongoDatabase db, IMongoCollection<T> collection)
        {
            this.Client = client;
            this.Database = db;
            this.Collection = collection;
        }
    }
}
