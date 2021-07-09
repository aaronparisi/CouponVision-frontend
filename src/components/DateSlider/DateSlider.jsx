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
  return format(new Date(ms), "MMM dd");
}

const halfHour = 1000 * 60 * 30;

class DateSlider extends Component {
  constructor({ minDate, maxDate, receiveDate }) {
    super();

    const today = startOfToday();

    this.state = {
      earlySelected: minDate,
      earlyUpdated: minDate,
      lateSelected: today,
      lateUpdated: today,
      min: minDate,
      max: maxDate,
      receiveDate: receiveDate
    };
  }

  onEarlyChange = ([ms]) => {
    this.setState({
      earlySelected: new Date(ms)
    });
  };

  onEarlyUpdate = ([ms]) => {
    this.setState({
      earlyUpdated: new Date(ms)
    });

    this.state.receiveDate([ "earlyDate", new Date(ms) ])
    // fixme make sure you adjust for if the sliders cross!!
  };

  onLateChange = ([ms]) => {
    this.setState({
      lateSelected: new Date(ms)
    });
  };

  onLateUpdate = ([ms]) => {
    this.setState({
      lateUpdated: new Date(ms)
    });

    this.state.receiveDate([ "lateDate", new Date(ms) ])
  };

  componentDidMount = () => {
    this.state.receiveDate(this.state.lateUpdated)
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
        <b>{header}:</b>
        <div style={{ fontSize: 12 }}>{format(date, "MMM dd h:mm a")}</div>
      </div>
    );
  }

  render() {
    const { min, max, earlySelected, lateSelected, earlyUpdated, lateUpdated } = this.state;

    const dateTicks = scaleTime()
      .domain([min, max])
      .ticks(8)
      .map(d => +d);

    return (
      <div className="date-slider-wrapper" style={{ width: "100%" }}>
        {/* {this.renderDateTime(selected, "Selected")} */}
        {this.renderDateTime(earlyUpdated, "Date")}
        - thru -
        {this.renderDateTime(lateUpdated, "Date")}
        <div style={{ margin: "5%", height: 120, width: "90%" }}>
          <Slider
            mode={1}
            step={halfHour}
            domain={[+min, +max]}
            rootStyle={sliderStyle}
            onUpdate={this.onEarlyUpdate}
            onChange={this.onEarlyChange}
            values={[+earlySelected]}
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
            <Tracks right={false}>
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

          <Slider
            mode={1}
            step={halfHour}
            domain={[+min, +max]}
            rootStyle={sliderStyle}
            onUpdate={this.onLateUpdate}
            onChange={this.onLateChange}
            values={[+lateSelected]}
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
            <Tracks right={false}>
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