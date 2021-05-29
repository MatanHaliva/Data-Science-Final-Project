using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Detections_API.Models
{
    [BsonIgnoreExtraElements]

    public class MaskModel:DetectionsBase
    {
        public bool WithMask { get; set; }
    }
}
