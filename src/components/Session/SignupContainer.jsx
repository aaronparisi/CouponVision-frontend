import { connect } from 'react-redux'
import { createNewUser } from '../../actions/session_actions'
import Signup from './Signup'

// no state

const mapDispatchToProps = dispatch => {
  return {
    createNewUser: formUser => dispatch(createNewUser(formUser)),
  }
}

export default connect(null, mapDispatchToProps)(Signup)