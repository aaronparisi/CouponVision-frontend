import {
  RECEIVE_LOADING_INFO
} from '../actions/loading_actions'

const _nullLoading = false

const loadingReducer = (state = _nullLoading, action) => {
  Object.freeze(state)
  switch(action.type) {
    case RECEIVE_LOADING_INFO:
      return action.loading
    default:
      return state;
  }
}

export default loadingReducer