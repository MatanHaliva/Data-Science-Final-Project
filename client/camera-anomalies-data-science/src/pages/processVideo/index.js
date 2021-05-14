import { connect } from "react-redux"
import ProcessVideo  from "./processVideo"
import { setFinishProcessing } from "../../redux/actions"

const mapStateToProps = (state) => {
    return {
        contextId: state.app.contextId,
        filePath: state.app.filePath
     }
}

const mapDispatchToProps = dispatch => {
    return { 
        setFinishProcessing: (isFinished) => dispatch(setFinishProcessing(isFinished)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ProcessVideo)