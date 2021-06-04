using Detections_API.Models;
using Detections_API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;

namespace Detections_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class DetectionsController : ControllerBase
    {
        private readonly DetectionService _detectionService;

        public DetectionsController(DetectionService detection)
        {
            _detectionService = detection;
        }


        #region GET METHODS
        [HttpGet("GetAll")]
        public ActionResult<object> GetDetectionsById()
        {
            AddHeaders();
            return JsonConvert.SerializeObject(_detectionService.Get());
        }

        [HttpGet("GetById/{id}")]
        public ActionResult<object> GetDetectionsById(string id)
        {
            AddHeaders();

            return JsonConvert.SerializeObject(_detectionService.Get(id));
        }

        [HttpGet("GetByType/{type}")]
        public ActionResult<object> GetDetectionsByType(DetectionType type)
        {
            AddHeaders();

            return JsonConvert.SerializeObject(_detectionService.Get(type));
        }
        #endregion

        #region POST METHODS
        [HttpPost("CreateCars")]
        public ActionResult<IEnumerable<DetectionsBase>> Create([FromBody] IEnumerable<CarModel> detections)
        {
            if (ModelState.IsValid)
            {
                _detectionService.CreateMany(detections);
                return Ok(detections);
            }
            else
                return BadRequest();

        }

        [HttpPost("CreateFaces")]
        public ActionResult<IEnumerable<DetectionsBase>> Create([FromBody] IEnumerable<FaceModel> detections)
        {
            if (ModelState.IsValid)
            {
                _detectionService.CreateMany(detections);
                return Ok(detections);
            }
            else
                return BadRequest();

        }
        [HttpPost("CreateMasks")]
        public ActionResult<IEnumerable<DetectionsBase>> Create([FromBody] IEnumerable<MaskModel> detections)
        {
            if (ModelState.IsValid)
            {
                _detectionService.CreateMany(detections);
                return Ok(detections);
            }
            else
                return BadRequest();

        }
        [HttpPost("CreateMotions")]
        public ActionResult<IEnumerable<DetectionsBase>> Create([FromBody] IEnumerable<MotionModel> detections)
        {
            if (ModelState.IsValid)
            {
                _detectionService.CreateMany(detections);
                return Ok(detections);
            }
            else
                return BadRequest();
        }
        [HttpPost("CreateAnomalies")]
        public ActionResult<IEnumerable<DetectionsBase>> Create([FromBody] IEnumerable<AnomalyModel> detections)
        {
            if (ModelState.IsValid)
            {
                _detectionService.CreateMany(detections);
                return Ok(detections);
            }
            else
                return BadRequest();
        }
        #endregion
        private void AddHeaders()
        {
            Response.Headers.Add("Access-Control-Allow-Origin", "*");
            Response.Headers.Add("Access-Control-Allow-Headers", "*");
            Response.Headers.Add("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
        }
    }
}
