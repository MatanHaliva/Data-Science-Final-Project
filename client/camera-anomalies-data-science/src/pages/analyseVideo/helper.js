
export const getImagePath = (detection) => {
    return `http://localhost:5000/processes/${detection.ContextId}/${detection.Id}/getImage`
}