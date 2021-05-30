using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Detections_API.Models
{
    [BsonIgnoreExtraElements]
   
    public class CarModel:DetectionsBase
    {
        public string Color { get; set; }
        public string Manufacturer { get; set; }
        public string LicensePlate { get; set; }

    }
}
