using Detections_API.Models;
using MongoDB.Bson.IO;
using MongoDB.Driver;
using Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;

namespace Detections_API.Services
{
    public class DetectionService
    {
        private readonly MongoHelper<DetectionsBase> _mongoHelper;
        public DetectionService(DatabaseSettings settings)
        {

            _mongoHelper = MongoService<DetectionsBase>.GetInstance(settings);
        }

        public List<DetectionsBase> Get() =>
            _mongoHelper.Collection.Find(d => true).ToList();

        public DetectionsBase Create(DetectionsBase detection)
        {
            try
            {
                _mongoHelper.Collection.InsertOne(detection);
                return detection;
            }
            catch (Exception)
            {

                return null;
            }
        }
        public IEnumerable<DetectionsBase> CreateMany(IEnumerable<DetectionsBase> detections)
        {
            try
            {
                _mongoHelper.Collection.InsertMany(detections);
                return detections;
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
                return _mongoHelper.Collection.Find(d => d.ContextId == id).ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public object Get(DetectionType type)
        {
            try
            {
                return _mongoHelper.Collection.Find(d => d.DetectionType == type).ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }
 
    }
  

}
