import { connect } from 'react-redux'
import { getActiveCouponsOverTime } from '../../../actions/grocers_actions'
import ActiveCouponsOverTimeWrapper from './ActiveCouponsOverTimeWrapper'

const mapStateToProps = (state, ownProps) => {
  return {
    grocers: state.activeCouponsOverTime,
    curDate: state.date,
    colors: state.colors.activeCouponsOverTimeColors
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getActiveCouponsOverTime: e => dispatch(getActiveCouponsOverTime())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActiveCouponsOverTimeWrapper)