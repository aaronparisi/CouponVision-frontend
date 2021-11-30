import { connect } from 'react-redux'
import { getSavingsTiersByBrand, receiveDate } from '../../../actions/savings_tiers_by_brand_actions'
import SavingsTiersByBrandWrapper from './SavingsTiersByBrandWrapper'

const mapStateToProps = (state, ownProps) => {
  return {
    brands: state.savingsTiersByBrand.brands,
    tiers: state.savingsTiersByBrand.tiers,
    loading: state.loading,
    curDate: state.savingsTiersByBrand.date,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dateReceivedCallback: e => dispatch(receiveDate(e)),
    getSavingsTiersByBrand: e => dispatch(getSavingsTiersByBrand())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SavingsTiersByBrandWrapper)