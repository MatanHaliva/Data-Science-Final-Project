
export const getImagePath = (detection) => {
    
    if (detection.DetectionType === 0) {
        return `http://localhost:5000/processes/${detection.ContextId}/${detection.Id}/getImage`
    } else if(detection.DetectionType === 1) {
        return `http://localhost:5009/processes/${detection.ContextId}/${detection.FaceId}/${detection.Id}/getImage`
    } else if(detection.DetectionType === 4) {
        return `http://localhost:8000/static/warning.png`
    }
}