import {
  RECEIVE_DATE
} from '../actions/date_actions'

const _nullDate = {
  earlyDate: new Date().setFullYear(new Date().getFullYear() - 2),
  lateDate: new Date()
}

const dateReducer = (state = _nullDate, action) => {
  Object.freeze(state)

  switch(action.type) {
    case RECEIVE_DATE:
      return {
        ...state,
        [action.data[0]]: action.data[1]
      }
    default:
      return state;
  }
}

export default dateReducer