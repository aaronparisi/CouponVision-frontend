import React from 'react';

const Home = props => {
  const handleClick = e => {
    e.preventDefault()

    // props.getTotalStoreSavings()
    props.getCouponCountsByBrandPerGrocer()
  }

  return (
    <React.Fragment >
      <h1>👓 CouponVision 👓</h1>
      {/* <button onClick={e => handleClick(e)}>click me for JSON</button> */}
    </React.Fragment>
  );
}

export default Home;