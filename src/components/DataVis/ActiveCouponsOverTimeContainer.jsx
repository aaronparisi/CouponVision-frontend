import { connect } from 'react-redux'
import { getCouponsByBrandPerGrocer } from '../../actions/grocers_actions'
import ActiveCouponsOverTimeWrapper from './ActiveCouponsOverTimeWrapper'

const mapStateToProps = (state, ownProps) => {
  return {
    grocers: state.activeCouponsOverTime,
    curDate: state.date
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getCouponsByBrandPerGrocer: e => dispatch(getCouponsByBrandPerGrocer())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ActiveCouponsOverTimeWrapper)