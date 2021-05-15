import {connect} from "react-redux"
import { INCREMENT, setContextId, setFilePath, setCurrentRoute} from "../../redux/actions"
import FileUpload from "./FileUpload"

const mapStateToProps = (state) => {
    return { 
        count: state.app.count, 
        contextId: state.app.contextId
    }
}
  
const mapDispatchToProps = dispatch => {
    return { 
        increment: () => dispatch({ type: INCREMENT }),
        setContextId: (contextId) => dispatch(setContextId(contextId)),
        setFilePath: (filePath) => dispatch(setFilePath(filePath)),
        setCurrentRoute: (currentRoute) => dispatch(setCurrentRoute(currentRoute))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FileUpload)
