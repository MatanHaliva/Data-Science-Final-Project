export const INCREMENT = 'INCREMENT'
export const SET_CONTEXT_ID = 'SET_CONTEXT_ID'
export const SET_FILE_PATH = 'SET_FILE_PATH'
export const FINISH_PROCESSING = 'FINISH_PROCESSING'

export const increment = () => ({
  type: INCREMENT
});

export const setContextId = (contextId) => ({
    type: SET_CONTEXT_ID, payload: contextId
});


export const setFilePath = (filePath) => ({
    type: SET_FILE_PATH, payload: filePath
});

export const setFinishProcessing = (isFinished) => ({
    type: FINISH_PROCESSING, payload: isFinished 
  });