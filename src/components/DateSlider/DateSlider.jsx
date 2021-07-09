import React, { Component } from "react";
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { SliderRail, Handle, Track, Tick } from "./components"; // example render components - source below
import { startOfToday, format } from "date-fns";
import { scaleTime } from "d3-scale";

const sliderStyle = {
  position: "relative",
  width: "100%"
};

function formatTick(ms) {
  return format(new Date(ms), "MMM yyyy");
}

const day = 1000 * 60 * 60 * 24;

class DateSlider extends Component {
  constructor({ minDate, maxDate, receiveDateRange }) {
    super();

    const today = startOfToday();

    this.state = {
      values: [minDate, today],
      min: minDate,
      max: maxDate,
      receiveDateRange: receiveDateRange
    };
  }

  onChange = values => {
    this.setState({ values })
  }

  onUpdate = values => {
    this.setState({ values })

    this.state.receiveDateRange(values.map(val => new Date(val)))
  }

  renderDateTime(date, header) {
    return (
      <div
        style={{
          width: "100%",
          textAlign: "center",
          fontFamily: "Arial",
          margin: 5
        }}
      >
        {/* <b>{header}:</b> */}
        <div style={{ fontSize: 12 }}>{format(date, "MMM yyyy")}</div>
      </div>
    );
  }

  render() {
    const { min, max, values } = this.state;

    const dateTicks = scaleTime()
      .domain([min, max])
      .ticks(24)
      .map(d => +d);

    return (
      <div className="date-slider-wrapper" style={{ width: "100%" }}>
        <div className="date-range-render">
          <div style={{ fontSize: 24 }}>{format(values[0], "MMM yyyy")}</div>
          <div style={{ fontSize: 24}}>--</div>
          <div style={{ fontSize: 24 }}>{format(values[1], "MMM yyyy")}</div>
        </div>
        <div style={{ margin: "5%", height: 120, width: "90%" }}>
          <Slider
            mode={2}
            step={day}
            domain={[+min, +max]}
            rootStyle={sliderStyle}
            onUpdate={this.onUpdate}
            onChange={this.onChange}
            values={values}
          >
            <Rail>
              {({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}
            </Rail>
            <Handles>
              {({ handles, getHandleProps }) => (
                <div>
                  {handles.map(handle => (
                    <Handle
                      key={handle.id}
                      handle={handle}
                      domain={[+min, +max]}
                      getHandleProps={getHandleProps}
                    />
                  ))}
                </div>
              )}
            </Handles>
            <Tracks left={false} right={false}>
              {({ tracks, getTrackProps }) => (
                <div>
                  {tracks.map(({ id, source, target }) => (
                    <Track
                      key={id}
                      source={source}
                      target={target}
                      getTrackProps={getTrackProps}
                    />
                  ))}
                </div>
              )}
            </Tracks>
            <Ticks values={dateTicks}>
              {({ ticks }) => (
                <div>
                  {ticks.map(tick => (
                    <Tick
                      key={tick.id}
                      tick={tick}
                      count={ticks.length}
                      format={formatTick}
                    />
                  ))}
                </div>
              )}
            </Ticks>
          </Slider>
        </div>
      </div>
    );
  }
}

export default DateSlider