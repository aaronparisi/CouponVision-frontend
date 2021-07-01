import { connect } from 'react-redux'
import { receiveDate } from '../../actions/date_actions'
import DateSlider from './DateSlider'

const mapStateToProps = (state, ownProps) => {
  return {
    minDate: ownProps.minDate,
    maxDate: ownProps.maxDate
  }
}

const mapDispatchToProps = dispatch => {
  return {
    receiveDate: date => dispatch(receiveDate(date))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DateSlider)