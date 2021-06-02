import { INCREMENT, SET_CONTEXT_ID, SET_CURRENT_ROUTE, SET_FILE_PATH, SET_VIDEO_CURRENT_TIME, FEEDBACK_CREATED_SUCCESSFULY, DELETE_FEEDBACK_CREATED_SUCCESSFULY} from "./actions"

const initialState = { count: 0, contextId: "", filePath: "", videoCurrentTime: 0, currentRoute: 0, feedbackResponses: []}

const app = (state = initialState, action) => {
    console.log(action.type)

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
            return {
                ...state, 
                videoCurrentTime: action.payload
            }
        case SET_CURRENT_ROUTE:
            return {
                ...state, 
                currentRoute: action.payload
            }
        case FEEDBACK_CREATED_SUCCESSFULY:
            return {
                ...state,
                feedbackResponses: [...state.feedbackResponses, action.payload]
            }
        case DELETE_FEEDBACK_CREATED_SUCCESSFULY:
            debugger
            const posElement = state.feedbackResponses.findIndex(feedbackResponses => feedbackResponses.timeStamp === action.payload.timeStamp)
            const dupArr = [...state.feedbackResponses]
            dupArr.splice(posElement, 1)
            return {
                ...state,
                feedbackResponses: dupArr
            }
        default:
            return state
    }
  }


export default app