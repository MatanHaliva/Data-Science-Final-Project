import {connect} from "react-redux"
import { setCurrentRoute} from "../../redux/actions"
import NavBar from "./NavBar"

const mapStateToProps = (state) => {
    return { 
        currentRoute: state.app.currentRoute, 
        loggedName: state.login.loggedName,
        isLogged: state.login.isLogged
    }
}
  
const mapDispatchToProps = dispatch => {
    return { 
        setCurrentRoute: (currentRoute) => dispatch(setCurrentRoute(currentRoute))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)
