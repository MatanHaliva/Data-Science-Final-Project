using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Detections_API.Models;
using Detections_API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Detections_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DetectionsController : ControllerBase
    {
        private readonly DetectionService _detectionService;

        private readonly ILogger<DetectionsController> _logger;

        public DetectionsController(DetectionService  detection)
        {
            _detectionService = detection;
        }
        [HttpGet("GetAll")]
        public ActionResult<object> GetDetectionsById()
        {
            return JsonConvert.SerializeObject(_detectionService.Get());
        }

        [HttpGet("GetById/{id}")]
        public ActionResult<object> GetDetectionsById(string  id)
        {
            return JsonConvert.SerializeObject(_detectionService.Get(id));
        }

        [HttpGet("GetByType/{type}")]
        public ActionResult<object> GetDetectionsByType(DetectionType type)
        {
            return JsonConvert.SerializeObject(_detectionService.Get(type));
        }

        [HttpPost]
        public ActionResult<DetectionsBase> Create([FromBody] CarModel detection)
        {
            _detectionService.Create(detection);
            return Ok(detection);
        }

        [HttpPost("CreateAll")]
        public ActionResult<List<DetectionsBase>> CreateAll([FromBody] List<DetectionsBase> detections)
        {
            _detectionService.CreateAll(detections);
            return Ok(detections);
        }
    }
}
