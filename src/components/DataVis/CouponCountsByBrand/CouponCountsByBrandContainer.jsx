import { connect } from 'react-redux'
import { getCouponCountsByBrand } from '../../../actions/coupon_counts_by_brand_actions'
import CouponCountsByBrandWrapper from './CouponCountsByBrandWrapper'

const mapStateToProps = (state, ownProps) => {
  return {
    grocers: state.couponCountsByBrand.grocers,
    brands: state.couponCountsByBrand.brands
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getCouponCountsByBrand: () => dispatch(getCouponCountsByBrand())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CouponCountsByBrandWrapper)