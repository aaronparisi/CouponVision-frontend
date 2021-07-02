import { connect } from 'react-redux'
import { getCouponCountsByBrandPerGrocer } from '../../actions/grocers_actions'
import CouponCountsByBrandWrapper from './CouponCountsByBrandWrapper'

const mapStateToProps = (state, ownProps) => {
  return {
    grocers: state.couponCountsByBrand,
    brands: state.brands,
    colors: state.colors.countsByBrandColors
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getCouponCounts: e => dispatch(getCouponCountsByBrandPerGrocer())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CouponCountsByBrandWrapper)