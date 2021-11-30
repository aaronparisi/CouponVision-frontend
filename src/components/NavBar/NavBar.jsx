import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = props => {
  const loc = props.location.pathname
  
  return (
    <nav>
      <ul className="nav-links">
        <li className="nav-link" id={ new RegExp(/curved-line/).test(props.location.pathname) ? "selected-nav-link" : ""}>
          <Link to="/curved-line">Curved Line</Link>
        </li>
        <li className="nav-link" id={ new RegExp(/racing-bar/).test(props.location.pathname) ? "selected-nav-link" : ""}>
          <Link to="/racing-bar">Racing Bar</Link>
        </li>
        <li className="nav-link" id={ new RegExp(/animated-bar/).test(props.location.pathname) ? "selected-nav-link" : ""}>
          <Link to="/animated-bar">Animated Bar</Link>
        </li>
        <li className="nav-link" id={ new RegExp(/breaking-bad/).test(props.location.pathname) ? "selected-nav-link" : ""}>
          <Link to="/breaking-bad">Breaking Bad</Link>
        </li>
        <li className="nav-link" id={ new RegExp(/active-over-time/).test(props.location.pathname) ? "selected-nav-link" : ""}>
          <Link to="/active-over-time">Active Coupons Over Time</Link>
        </li>
        <li className="nav-link" id={ new RegExp(/coupon-counts/).test(props.location.pathname) ? "selected-nav-link" : ""}>
          <Link to="/coupon-counts">Coupon Counts by Brand</Link>
        </li>
        <li className="nav-link" id={ new RegExp(/savings-by-brand/).test(props.location.pathname) ? "selected-nav-link" : ""}>
          <Link to="/savings-by-brand">Savings By Brand</Link>
        </li>
        <li className="nav-link" id={ new RegExp(/savings-tiers-by-brand/).test(props.location.pathname) ? "selected-nav-link" : ""}>
          <Link to="/savings-tiers-by-brand">Savings Tiers By Brand</Link>
        </li>
        {/* <li className="nav-link" id={ new RegExp(/).test(props.location.pathname) ? "selected-nav-link" : ""}>
          <Link to="/circles">Circles</Link>
        </li> */}

        {/* <SessionLinks /> */}
      </ul>
    </nav>
  )
}

export default NavBar