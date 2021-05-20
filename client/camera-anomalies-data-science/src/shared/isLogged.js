
export const isLogged = (state, dispatch, setLogin) => {
    if (state.login.isLogged) {
        return true
    }
    const loginInfo = JSON.parse(localStorage.getItem("loginInfo"))
    if (loginInfo && loginInfo.isLogged) {
        dispatch(setLogin({...loginInfo}))
        return true
    } else {
        return false
    }
}