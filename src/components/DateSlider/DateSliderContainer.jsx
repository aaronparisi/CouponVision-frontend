import { connect } from 'react-redux'
import { receiveDateRange } from '../../actions/active_coupons_over_time_actions'
import DateSlider from './DateSlider'

const mapStateToProps = (state, ownProps) => {
  return {
    minDate: ownProps.minDate,
    maxDate: ownProps.maxDate
  }
}

const mapDispatchToProps = dispatch => {
  return {
    receiveDateRange: date => dispatch(receiveDateRange(date))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DateSlider)