import React from 'react';
import { Route } from 'react-router-dom'

import AnimatedBarChartWrapper from '../DataVis/AnimatedBarChartWrapper';
import BreakingBadTimelineWrapper from '../DataVis/BreakingBadTimelineWrapper';
import RacingBarChartWrapper from '../DataVis/RacingBarChartWrapper';

import ActiveCouponsOverTimeContainer from '../DataVis/ActiveCouponsOverTimeContainer'
import CouponCountsByBrandContainer from '../DataVis/CouponCountsByBrandContainer'

// import HomeContainer from '../Home/HomeContainer';
import NavBarContainer from '../NavBar/NavBarContainer'
import Description from '../Description/Description'
import CurvedLineChartWrapper from '../DataVis/CurvedLineChartWrapper';

const App = props => {

  return (
    <React.Fragment >
      <h1>👓 CouponVision 👓</h1>
        <Route path="/" component={NavBarContainer} />
        <Route exace path="/" component={Description} />
        <Route exact path="/curved-line" component={CurvedLineChartWrapper} />
        <Route exact path="/animated-bar" component={AnimatedBarChartWrapper} />
        <Route exact path="/breaking-bad" component={BreakingBadTimelineWrapper} />
        <Route exact path="/racing-bar" component={RacingBarChartWrapper} />
        <Route exact path="/active-over-time" component={ActiveCouponsOverTimeContainer} />
        <Route exact path="/coupon-counts" component={CouponCountsByBrandContainer} />
    </React.Fragment>
  );
}

export default App;
