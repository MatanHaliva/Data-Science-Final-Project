class DetectionDto:

    def __init__(self, contextId, detection_time, detection_type, description, accuracy ):
        self.ContextId = contextId
        self.DetectionTime = detection_time
        self.DetectionType = detection_type
        self.Description = description
        self.Accuracy = accuracy
    
    def tojson(self):
        return self.__dict__