export const RECEIVE_DATE_RANGE = 'RECEIVE_DATE_RANGE'

export const receiveDateRange = data => {
  return {
    type: RECEIVE_DATE_RANGE,
    data
  }
}