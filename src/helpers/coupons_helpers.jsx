export const couponIsActive = (coupon, aDate) => {
  return (
    (new Date(coupon.activation_date) <= aDate) &&
    (new Date(coupon.expiration_date) >= aDate)
  )
}