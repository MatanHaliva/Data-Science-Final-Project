using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Detections_API.Models
{
    public class AnomalyModel
    {
        public Severity AnomalySeverity { get; set; }
    }

    public enum Severity
    {
        NORMAL,LOW,MEDIUM,HIGH,FATAL
    }
}
