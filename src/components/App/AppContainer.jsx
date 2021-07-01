import { connect } from 'react-redux'
import { fetchCurrentUser } from '../../actions/session_actions'
import App from './App'
// import { fetchCurrentUser } from '../../actions/session_actions'

const mapStateToProps = (state, ownProps) => {
  return {
    // currentUser: state.session.currentUser
    coupons: state.coupons
  }
}

const mapDispatchToProps = dispatch => {
  return {
    fetchCurrentUser: () => dispatch(fetchCurrentUser())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)