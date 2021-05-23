using Detections_API.Models;
using MongoDB.Bson.IO;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace Detections_API.Services
{
    public class DetectionService
    {

        private readonly IMongoCollection<DetectionsBase> _detections;

        public DetectionService(DetectionsDatabaseSettings settings)
        {
            var client = new MongoClient(settings.ConnectionString);
            var database = client.GetDatabase(settings.DatabaseName);

            _detections = database.GetCollection<DetectionsBase>(settings.DetectionsCollectionName);
        }

        public List<DetectionsBase> Get() =>
            _detections.Find(d => true).ToList();

        public DetectionsBase Create(DetectionsBase detection)
        {
            try
            {
                _detections.InsertOne(detection);
                return detection;
            }
            catch (Exception)
            {

                return null;
            }
           
           
        }
        public object Get(string id)
        {
            try
            {
                return _detections.Find(d => d.ConxtextId == id).ToList();
            }
            catch (Exception e )
            {

                throw e ;
            }            
        }

        public object Get(DetectionType type)
        {
            try
            {
                return _detections.Find(d => d.DetectionType == type).ToList();
            }
            catch (Exception e )
            {
                throw e;
            }          
        }
         
    }
}
