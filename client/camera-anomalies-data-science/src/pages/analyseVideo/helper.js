
export const getImagePath = (detection) => {
    return `http://localhost:5000/processes/${detection.contextId}/${detection.detectionId}/getImage`
}