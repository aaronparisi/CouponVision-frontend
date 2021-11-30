import React from 'react';
import { Route } from 'react-router-dom'
import { Link } from 'react-router-dom'

import NavBarContainer from '../NavBar/NavBarContainer'
import Description from '../Description/Description'

import AnimatedBarChartWrapper from '../DataVis/AnimatedBar/AnimatedBarChartWrapper';
import BreakingBadTimelineWrapper from '../DataVis/BreakingBad/BreakingBadTimelineWrapper';
import RacingBarChartWrapper from '../DataVis/RacingBar/RacingBarChartWrapper';
import CurvedLineChartWrapper from '../DataVis/CurvedLine/CurvedLineChartWrapper';

import ActiveCouponsOverTimeContainer from '../DataVis/ActiveCouponsOverTime/ActiveCouponsOverTimeContainer'
import CouponCountsByBrandContainer from '../DataVis/CouponCountsByBrand/CouponCountsByBrandContainer'
import SavingsByBrandContainer from '../DataVis/SavingsByBrand/SavingsByBrandContainer'
import SavingsTiersByBrandContainer from '../DataVis/SavingsTiersByBrand/SavingsTiersByBrandContainer'

const App = props => {

  return (
    <React.Fragment >
      <Link to="/" ><h1 className="header">🧐 CouponVision 🧐</h1></Link>
        <Route path="/" component={NavBarContainer} />
        <Route exact path="/" component={Description} />
        <Route exact path="/curved-line" component={CurvedLineChartWrapper} />
        <Route exact path="/animated-bar" component={AnimatedBarChartWrapper} />
        <Route exact path="/breaking-bad" component={BreakingBadTimelineWrapper} />
        <Route exact path="/racing-bar" component={RacingBarChartWrapper} />
        <Route exact path="/active-over-time" component={ActiveCouponsOverTimeContainer} />
        <Route exact path="/coupon-counts" component={CouponCountsByBrandContainer} />
        <Route exact path="/savings-by-brand" component={SavingsByBrandContainer} />
        <Route exact path="/savings-tiers-by-brand" component={SavingsTiersByBrandContainer} />
    </React.Fragment>
  );
}

export default App;
