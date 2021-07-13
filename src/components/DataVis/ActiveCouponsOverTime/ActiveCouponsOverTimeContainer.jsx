import { connect } from 'react-redux'
import { getActiveCouponsOverTime } from '../../../actions/active_coupons_over_time_actions'
import ActiveCouponsOverTimeWrapper from './ActiveCouponsOverTimeWrapper'

const mapStateToProps = (state, ownProps) => {
  return {
    grocers: state.activeCouponsOverTime.grocers,
    earlyDate: state.activeCouponsOverTime.earlyDate,
    lateDate: state.activeCouponsOverTime.lateDate,
    loading: state.loading
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getActiveCouponsOverTime: e => dispatch(getActiveCouponsOverTime())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActiveCouponsOverTimeWrapper)