import {
  RECEIVE_DATE_RANGE
} from '../actions/date_actions'

const _nullDates = []

const dateReducer = (state = _nullDates, action) => {
  Object.freeze(state)
  switch(action.type) {
    case RECEIVE_DATE_RANGE:
      return action.data
    default:
      return state;
  }
}

export default dateReducer