import { connect } from 'react-redux'
import { getSavingsByBrand } from '../../../actions/savings_by_brand_actions'
import SavingsByBrandWrapper from './SavingsByBrandWrapper'

const mapStateToProps = (state, ownProps) => {
  return {
    brands: state.savingsByBrand,
    // earlyDate: state.earlyDate,
    // lateDate: state.lateDate,
    loading: state.loading
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getSavingsByBrand: e => dispatch(getSavingsByBrand())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SavingsByBrandWrapper)