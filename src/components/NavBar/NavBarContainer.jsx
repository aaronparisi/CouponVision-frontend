import { connect } from 'react-redux'
import { logout } from '../../actions/session_actions'
import NavBar from './NavBar'

const mapStateToProps = (state, ownProps) => {
  return {
    // currentUser: state.session.currentUser
  }
}

const mapDispatchToProps = dispatch => {
  return {
    logout: e => dispatch(logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NavBar)