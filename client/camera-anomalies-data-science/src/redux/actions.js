export const INCREMENT = 'INCREMENT'
export const SET_CONTEXT_ID = 'SET_CONTEXT_ID'
export const SET_FILE_PATH = 'SET_FILE_PATH'
export const FINISH_PROCESSING = 'FINISH_PROCESSING'
export const SET_VIDEO_CURRENT_TIME = 'SET_VIDEO_CURRENT_TIME'
export const SET_CURRENT_ROUTE = 'SET_CURRENT_ROUTE'
export const SET_LOGIN = 'SET_LOGIN'

export const increment = () => ({
  type: INCREMENT
})

export const setContextId = (contextId) => ({
    type: SET_CONTEXT_ID, payload: contextId
})

export const setFilePath = (filePath) => ({
    type: SET_FILE_PATH, payload: filePath
})

export const setFinishProcessing = (isFinished) => ({
    type: FINISH_PROCESSING, payload: isFinished 
})


export const setVideoCurrentTime = (currentTime) => ({
    type: SET_VIDEO_CURRENT_TIME, payload: currentTime 
})

export const setCurrentRoute = (routeNum) => ({
    type: SET_CURRENT_ROUTE, payload: routeNum 
})

export const setLogin = (payload) => ({
    type: SET_LOGIN, payload: payload 
})