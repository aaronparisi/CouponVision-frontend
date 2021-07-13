import { connect } from 'react-redux'
import { getCouponCountsByBrand } from '../../../actions/grocers_actions'
import CouponCountsByBrandWrapper from './CouponCountsByBrandWrapper'

const mapStateToProps = (state, ownProps) => {
  return {
    grocers: state.couponCountsByBrand.grocers,
    brands: state.couponCountsByBrand.brands,
    colors: state.colors.countsByBrandColors
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getCouponCountsByBrand: e => dispatch(getCouponCountsByBrand())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(CouponCountsByBrandWrapper)