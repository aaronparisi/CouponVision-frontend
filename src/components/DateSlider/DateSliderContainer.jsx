import { connect } from 'react-redux'
import { receiveDateRange } from '../../actions/date_actions'
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