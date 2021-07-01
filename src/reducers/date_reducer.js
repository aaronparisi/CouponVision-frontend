import {
  RECEIVE_DATE
} from '../actions/date_actions'

const _nullDate = null

const dateReducer = (state = _nullDate, action) => {
  Object.freeze(state)

  switch(action.type) {
    case RECEIVE_DATE:
      return action.data
    default:
      return state;
  }
}

export default dateReducer