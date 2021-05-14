import { INCREMENT, SET_CONTEXT_ID, SET_FILE_PATH } from "./actions"

const initialState = { count: 0, contextId: "", filePath: ""}

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
        default:
            return state
    }
  }


export default app