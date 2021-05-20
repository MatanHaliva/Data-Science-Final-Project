import { SET_LOGIN } from "./actions"

const initialState = { isLogged: false, loggedToken: '', loggedName: '', loggedEmail: ''}

const login = (state = initialState, action) => {
    switch (action.type) {
        case SET_LOGIN:
            const loginInfo = { 
                isLogged: action.payload.isLogged,
                loggedToken: action.payload.token,
                loggedName: `${action.payload.firstname} ${action.payload.lastname}`,
                loggedEmail: action.payload.email
            }
            localStorage.setItem("loginInfo", JSON.stringify(action.payload))

            return {
                ...state,
                ...loginInfo
            }
    }
    
    return state
}
export default login