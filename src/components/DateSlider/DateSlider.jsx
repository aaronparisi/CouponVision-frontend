import React, { Component } from "react";
import { Slider, Rail, Handles, Tracks, Ticks } from "react-compound-slider";
import { SliderRail, Handle, Track, Tick } from "./components"; // example render components - source below
import { format } from "date-fns";
import { scaleTime } from "d3-scale";

const sliderStyle = {
  position: "relative",
  width: "100%"
};

function formatTick(ms) {
  return format(new Date(ms), "MMM yyyy");
}

class DateSlider extends Component {
  constructor({ minDate, maxDate, mode, dateReceivedCallback, values, step }) {
    super();

    this.state = {
      values: values,
      min: minDate,
      max: maxDate,
      mode: mode,
      step: step,
      dateReceivedCallback: dateReceivedCallback
    };
  }

  onChange = values => {
    this.setState({ values })
  }

  onUpdate = values => {
    this.setState({ values })

    this.state.dateReceivedCallback(values.map(val => new Date(val)))
  }

  renderDateTime(date, header) {
    return (
      <div
        style={{
          width: "100%",
          textAlign: "center",
          fontFamily: "Arial",
          margin: "0% 5%"
        }}
      >
        {/* <b>{header}:</b> */}
        <div style={{ fontSize: 12 }}>{format(date, "MMM yyyy")}</div>
      </div>
    );
  }

  render() {
    const { min, max, values, mode, step } = this.state;

    const dateTicks = scaleTime()
      .domain([min, max])
      .ticks(24)
      .map(d => +d);
    // debugger
    return (
      <div className="date-slider-wrapper" style={{ width: "100%" }}>
        <div className="date-range-render">
          <div style={{ fontSize: 24 }}>
            {
              values.map(val => (mode === 1) ? format(val, "MMM dd yyyy") : format(val, "MMM yyyy")).join("--")
            }
          </div>
        </div>
        <div style={{ margin: "0% 5%", height: 120, width: "90%" }}>
          <Slider
            mode={this.state.mode}
            step={step}
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