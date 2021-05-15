import { connect } from "react-redux"
import AnalyseVideo  from "./analyseVideo"
import { setVideoCurrentTime } from "../../redux/actions"


const mapStateToProps = (state) => {
    return {
        contextId: state.app.contextId,
        filePath: state.app.filePath,
        videoCurrentTime: state.app.videoCurrentTime
     }
}

const mapDispatchToProps = dispatch => {
    return { 
        setVideoCurrentTime: (currentTime) => dispatch(setVideoCurrentTime(currentTime)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AnalyseVideo)