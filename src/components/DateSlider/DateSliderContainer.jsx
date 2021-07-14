import { connect } from 'react-redux'
import DateSlider from './DateSlider'

const mapStateToProps = (state, ownProps) => {
  return {
    minDate: ownProps.minDate,
    maxDate: ownProps.maxDate,
    mode: ownProps.mode,
    values: ownProps.values
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    dateReceivedCallback: date => dispatch(ownProps.dateReceivedCallback(date))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DateSlider)