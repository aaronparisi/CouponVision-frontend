export const RECEIVE_LOADING_INFO = 'RECEIVE_LOADING_INFO'

export const receiveLoadingInfo = loading => {
  return {
    type: RECEIVE_LOADING_INFO,
    loading: loading
  }
}