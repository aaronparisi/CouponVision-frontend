import { connect } from 'react-redux'
import { getSavingsByBrand, receiveDate } from '../../../actions/savings_by_brand_actions'
import SavingsByBrandWrapper from './SavingsByBrandWrapper'

const mapStateToProps = (state, ownProps) => {
  return {
    brands: state.savingsByBrand.brands,
    loading: state.loading,
    curDate: state.savingsByBrand.date,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dateReceivedCallback: e => dispatch(receiveDate(e)),
    getSavingsByBrand: e => dispatch(getSavingsByBrand())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SavingsByBrandWrapper)