using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Feedbacks_API.Models;
using Feedbacks_API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Feedbacks_API.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FeedbacksController : ControllerBase
    {
        private readonly FeedbackService _feedbackService;

        public FeedbacksController(FeedbackService service)
        {
            _feedbackService = service;
        }

        #region GET METHODS
        [HttpGet("GetAll")]
        public ActionResult<object> GetDetections()
        {
            return JsonConvert.SerializeObject(_feedbackService.Get());
        }

        [HttpGet("GetByPersonName/{name}")]
        public ActionResult<object> GetDetections(string name)
        {
            return JsonConvert.SerializeObject(_feedbackService.Get(name));
        }
        [HttpGet("GetByType/{type}")]
        public ActionResult<object> GetDetections(FeedbackType type)
        {
            return JsonConvert.SerializeObject(_feedbackService.Get(type));
        }
        #endregion

        #region POST METHODS

        [HttpPost("CreatePerson")]
        public ActionResult<FeedbackBase> Create([FromBody] IEnumerable<PersonFeedback> feedback)
        {
            _feedbackService.CreateMany(feedback);
            return Ok(feedback);
        }
        [HttpPost("CreateCar")]
        public ActionResult<FeedbackBase> Create([FromBody] IEnumerable<CarFeedback> feedback)
        {
            _feedbackService.CreateMany(feedback);
            return Ok(feedback);
        }

        #endregion
    }
}
