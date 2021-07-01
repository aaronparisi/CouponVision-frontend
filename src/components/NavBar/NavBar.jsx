import React from 'react'
import { Link } from 'react-router-dom'

const NavBar = props => {

  return (
    <nav>
      <ul className="nav-links">
        <li className="nav-link">
          <Link to="/curved-line">Curved Line</Link>
        </li>
        <li className="nav-link">
          <Link to="/racing-bar">Racing Bar</Link>
        </li>
        <li className="nav-link">
          <Link to="/animated-bar">Animated Bar</Link>
        </li>
        <li className="nav-link">
          <Link to="/breaking-bad">Breaking Bad</Link>
        </li>
        <li className="nav-link">
          <Link to="/active-over-time">Coupons over Time</Link>
        </li>
        <li className="nav-link">
          <Link to="/coupon-counts">Coupon Counts by Brand</Link>
        </li>
        {/* <li className="nav-link">
          <Link to="/circles">Circles</Link>
        </li> */}

        {/* <SessionLinks /> */}
      </ul>
    </nav>
  )
}

export default NavBar