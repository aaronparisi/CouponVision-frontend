import { connect } from 'react-redux'
import { getCouponCountsByBrandPerGrocer } from '../../actions/grocers_actions'
import { getTotalStoreSavings } from '../../actions/stores_actions'
import Home from './Home'

const mapStateToProps = (state, ownProps) => {
  return {

  }
}

const mapDispatchToProps = dispatch => {
  return {
    getTotalStoreSavings: e => dispatch(getTotalStoreSavings()),
    getCouponCountsByBrandPerGrocer: e => dispatch(getCouponCountsByBrandPerGrocer())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home)