import { connect } from "react-redux"
import ProcessVideo  from "./processVideo"
import { setFinishProcessing, setCurrentRoute } from "../../redux/actions"

const mapStateToProps = (state) => {
    return {
        contextId: state.app.contextId,
        filePath: state.app.filePath
     }
}

const mapDispatchToProps = dispatch => {
    return { 
        setFinishProcessing: (isFinished) => dispatch(setFinishProcessing(isFinished)),
        setCurrentRoute: (currentRoute) => dispatch(setCurrentRoute(currentRoute))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProcessVideo)