﻿using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace Detections_API.Models
{
    [BsonIgnoreExtraElements]
    [BsonKnownTypes(typeof(CarModel), typeof(MaskModel),typeof(MotionModel),typeof(AnomalyModel),typeof(FaceModel))]
    public  class DetectionsBase
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [Required]
        public string ContextId { get; set; }

        [Required]
        public DetectionType DetectionType { get; set; }
        public double DetectionTime { get; set; }
        public string Description { get; set; }
        public double Accuracy { get; set; }

        public DetectionsBase()
        {
            Id = Guid.NewGuid().ToString();
        }
    }


    public enum DetectionType
    {
        Car, Face, Mask, Motion, Anomaly
    }
}

