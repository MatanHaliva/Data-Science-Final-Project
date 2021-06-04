using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Detections_API.Models
{

    [BsonIgnoreExtraElements]
    public class AnomalyModel: DetectionsBase
    {
        public Severity AnomalySeverity { get; set; }
    }

    public enum Severity
    {
        NORMAL,LOW,MEDIUM,HIGH,FATAL
    }
}
