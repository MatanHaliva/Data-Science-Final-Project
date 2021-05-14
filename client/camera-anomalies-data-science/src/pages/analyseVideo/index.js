import { connect } from "react-redux"
import AnalyseVideo  from "./analyseVideo"

const mapStateToProps = (state) => {
    return {
        contextId: state.app.contextId,
        filePath: state.app.filePath
     }
}

export default connect(mapStateToProps, null)(AnalyseVideo)