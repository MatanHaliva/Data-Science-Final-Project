using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Detections_API.Models
{
    [BsonIgnoreExtraElements]
    [BsonKnownTypes(typeof(CarModel), typeof(MaskModel))]
    public  class DetectionsBase
    {

        public string ConxtextId { get; set; }
        public DetectionType DetectionType { get; set; }
        public double DetectionTime { get; set; }
        public string Description { get; set; }
        public double Accuracy { get; set; }
    }


    public enum DetectionType
    {
        Car, Face, Mask, Motion, Anomaly
    }
}

