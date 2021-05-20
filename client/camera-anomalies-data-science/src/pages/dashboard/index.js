import { connect } from "react-redux"
import Dashboard from "./dashboard"

const mapStateToProps = (state) => {
    return {
        processedVideos: [
            {id: 123, header: 'process 1', description: `ContextId: ${1234}`, width: 500, height: 380, path: '/files/input_video.mp4'}, 
            {id: 1234, header: 'process 1', description: `ContextId: ${1234}`, width: 500, height: 380, path: '/files/input_video.mp4'},
            {id: 1235, header: 'process 1', description: `ContextId: ${1234}`, width: 500, height: 380, path: '/files/input_video.mp4'}
        ]
     }
}

const mapDispatchToProps = dispatch => {
    return { 
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard)