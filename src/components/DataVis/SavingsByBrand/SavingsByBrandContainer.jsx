import { connect } from 'react-redux'
import { getSavingsByBrand } from '../../../actions/brands_actions'
import SavingsByBrandWrapper from './SavingsByBrandWrapper'

const mapStateToProps = (state, ownProps) => {
  return {
    brands: state.brands,
    // earlyDate: state.date[0],
    // lateDate: state.date[1],
    colors: state.colors.savingsByBrandColors,
    loading: state.loading
  }
}

const mapDispatchToProps = dispatch => {
  return {
    getSavingsByBrand: e => dispatch(getSavingsByBrand())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SavingsByBrandWrapper)