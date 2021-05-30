using Feedbacks_API.Models;
using MongoDB.Driver;
using Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Feedbacks_API.Services
{
    public class FeedbackService
    {
        private readonly MongoHelper<FeedbackBase> _mongoHelper;
        public FeedbackService(DatabaseSettings settings)
        {
            _mongoHelper = MongoService<FeedbackBase>.GetInstance(settings);

        }

        public List<FeedbackBase> Get() =>
            _mongoHelper.Collection.Find(d => true).ToList();

        public object Get(string name)
        {
            try
            {
                return _mongoHelper.Collection.Find(d => d.PersonName == name).ToList();
            }
            catch (Exception e)
            {

                throw e;
            }
        }


        public object Get(FeedbackType type)
        {
            try
            {
                return _mongoHelper.Collection.Find(d => d.FeedbackType == type).ToList();
            }
            catch (Exception e)
            {
                throw e;
            }
        }

        public FeedbackBase Create(FeedbackBase feedback)
        {
            try
            {
                _mongoHelper.Collection.InsertOne(feedback);
                return feedback;
            }
            catch (Exception)
            {

                return null;
            }
        }

        public IEnumerable<FeedbackBase> CreateMany(IEnumerable<FeedbackBase> feedbacks)
        {
            try
            {
                _mongoHelper.Collection.InsertMany(feedbacks);
                return feedbacks;
            }
            catch (Exception)
            {

                return null;
            }


        }
  
    }
}
