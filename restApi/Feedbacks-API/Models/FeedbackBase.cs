using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Feedbacks_API.Models
{
    [BsonIgnoreExtraElements]
    [BsonKnownTypes(typeof(PersonFeedback), typeof(CarFeedback))]
    public class FeedbackBase
    {
        public bool GoodDetection { get; set; }
        public FeedbackType FeedbackType { get; set; }
        public string PersonName { get; set; }

    }

    public enum FeedbackType
    {
        Car,Face,Mask
    }
}
