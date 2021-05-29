using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Detections_API.Models
{
    [BsonIgnoreExtraElements]
    public class MotionModel:DetectionsBase
    {
        public double MovementLocation_X { get; set; }
        public double MovementLocation_Y { get; set; }
    }
}
