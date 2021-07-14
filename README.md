This project is a sample of data visualizations using D3 and React.

Attributions:

Murat Kemalder's [Using React (Hooks) with D3](https://dev.to/muratkemaldar/video-using-react-hooks-with-d3-the-basics-519k) series
Steve Hall's [React Compact Slider](https://codesandbox.io/s/rw97j317p)
data.world's [Grocery Store Data](https://data.world/usda/grocery-stores)

## My notes:

- app config

/////////////////////////////////////////////////////

- reducer structure / decisions
  - one reducer per data visualization
    - initially I thought visualizations would share data /
      that data would be heavily formateed on the frontend,
      but I think it's easier to do it on the backend within the query
      and response json itself
  - loading status was abstracted, could be added to other vis's, made prettier
  - date was initially abstracted but only one visualization uses it currently
    - if I had dates for savings by brand, it would only be a single date
      so I figure it would be easier to just handle dates in each vis
    - visualizations never use one another's dates

/////////////////////////////////////////////////////

- actions / api calls
  - currently nothing too exciting, one api endpoing per visualization
  - loading actions are frontend only, do not ping api
  - axios, thunk => mapStateToDispatch() in component containers

/////////////////////////////////////////////////////

  - useResizeObserver
    - receives a ref to a DIV, not an SVG
    - cleanup function unobserves the ref's current
    - allows us to re-render svgs on window resize
    
/////////////////////////////////////////////////////

  - visualization component structure
    - containers  
      - mapStateToProps
      - mapDispatchToProps
    - wrapper
      - renders headers, buttons, date sliders
      - ensures corresponding data is loaded
      - TODO - check dependency arrays, is it making api calls more often than necessary?
    - component
      - where SVG stuff happens
    - components have 2 refs:
      - svgRef => keeps track of SVG element for D3 selection
      - wrapperRef => keeps track of containing div for resize observer
    - TODO
      - I need to go back and memoize some of the props for the useEffect dep. arrays

/////////////////////////////////////////////////////

- active coupons over time
  - line chart
  - date slider, renders data within date range
  - two modes:
    - zoom mode: data always fills width of svg wrapper
    - non-zoom mode: data rendered proportionately to entire possible date range
  - local state of selected grocers, hovered color
  - color scale: sequential
  - y-scale: linear, from 0 to "maximum number of coupons for any of the grocers
    currently selected"
  - x-scale: time
  - lines: d3 line showing relationship between date and num active coupons on said date
    - visibleLines used for rendering, all lines used for y-scale
  - select and de-select all buttons that override local state for all grocers

/////////////////////////////////////////////////////

- coupon counts by brand
  - stacked bar
  - can see which grocers have the most NUMBER of coupons
  - can see per-grocer BREAKDOWN of coupon brands
  - hover over bar => tooltip showing count
  - hover over legend => highlight that brand across all grocers
  - stack keys are brand id's from database
  - a "layer" corresponds to all rectangles for a particular brand
    - I saved the brand name as an html data attribute, which feels clumsy
      but ultimately the rectangle, when hovered, only has
      information about its start and end coordinates,
      as well as the original data from which it was derived;
      it would be possible, I think, to infer the brand name from this, 
      but I figured it was just easier to slap a data attribute on it

/////////////////////////////////////////////////////

- savings by brand
  - treemap
    - different colored rectangles => a brand's total savings
    - sub-rectangles => total savings per state
  - data nesting for this was cumbersome, look into better way
  - could add date slider, although there wouldn't be anything visually to 
    represent when sub-rectangles appear or disappear
    (i.e. when coupon savings in a state become 0 or > 0),
  - there aren't any stark contrasts between total savings per brand,
    so this wasn't the most interesting one

/////////////////////////////////////////////////////

- handling colors
  - at first I generated colors using a package (distinct colors)
    - I saved the required number of colors in global app state
  - this was kind of clunky, and then I relized D3 can make a color scale for me
  - I don't love the colors as they are, they're hard to differentiate
  - that said, for active coupons over time, there are a lot of grocers

/////////////////////////////////////////////////////

- handling legends
  - initially I made legends with flexbox as regular react components
  - this was clunky - I was trying to make something that should have been
    intimately tied to the data, while also having severed the connection
    to the data
  - I don't love the look of the legends now, and I want to work on
    the hovering (there's a gap between the label and the color)

/////////////////////////////////////////////////////

  - date slider
    - I generalized a lot of the params so I could have
      both 2-date and 1-date versions for different visualizations
    - adding dates to savings by brand led me to see in a cool way
      how the coupons are all expired in all brands toward the endpoints

/////////////////////////////////////////////////////
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app), using the [Redux](https://redux.js.org/) and [Redux Toolkit](https://redux-toolkit.js.org/) template.

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
