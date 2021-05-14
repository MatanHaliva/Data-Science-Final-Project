import { connect } from "react-redux"
import UploadVideo  from "./uploadVideo"

const mapStateToProps = (state) => {
    return {count: state.app.count }
}

export default connect(mapStateToProps, null)(UploadVideo)