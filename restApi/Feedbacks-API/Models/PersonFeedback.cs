using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Feedbacks_API.Models
{

    [BsonIgnoreExtraElements]

    public class PersonFeedback:FeedbackBase
    {
        public string FaceId { get; set; }
    }
}
