import { INCREMENT, SET_CONTEXT_ID, SET_FILE_PATH, SET_VIDEO_CURRENT_TIME } from "./actions"

const initialState = { count: 0, contextId: "", filePath: "", videoCurrentTime: 0}

const app = (state = initialState, action) => {
    switch (action.type) {
        case INCREMENT:
            return {
                ...state,
                count: state.count + 1
            }
        case SET_CONTEXT_ID:
            return {
                ...state,
                contextId: action.payload
            }
        case SET_FILE_PATH:
            return {
                ...state,
                filePath: action.payload
            }
        case SET_VIDEO_CURRENT_TIME: 
            console.log("video current time: ", action.payload)
            return {
                ...state, 
                videoCurrentTime: action.payload
            }
        default:
            return state
    }
  }


export default app