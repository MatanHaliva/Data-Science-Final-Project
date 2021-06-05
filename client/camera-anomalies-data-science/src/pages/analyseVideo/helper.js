
export const getImagePath = (detection) => {
    
    return detection.DetectionType === 0 ? `http://localhost:5000/processes/${detection.ContextId}/${detection.Id}/getImage` : `http://localhost:5009/processes/${detection.ContextId}/${detection.FaceId}/${detection.Id}/getImage`
}