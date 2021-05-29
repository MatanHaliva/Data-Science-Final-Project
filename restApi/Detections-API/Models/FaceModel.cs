using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Detections_API.Models
{
    [BsonIgnoreExtraElements]
    public class FaceModel:DetectionsBase
    {
        public string FaceId { get; set; }
        public List<Double> FaceLocation { get; set; }
        public double[] FaceEmbeddingVector { get; set; }
    }
}
