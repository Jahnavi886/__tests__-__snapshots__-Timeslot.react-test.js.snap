import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import CalendarJS from 'calendarjs';
import Month from './month.jsx';

export default class Calendar extends React.Component {
  constructor(props) {

    const startDateInputProps = {
      name: 'tsc-startDate',
      classes: 'tsc-hidden-input',
      type: 'hidden',
    };

    const endDateInputProps = {
      name: 'tsc-endDate',
      class: 'tsc-hidden-input',
      type: 'hidden',
    };

    super(props);

    this.inputProps = {
      startDate: Object.assign({}, startDateInputProps, this.props.startDateInputProps),
      endDate: Object.assign({}, endDateInputProps, this.props.endDateInputProps),
    };

    this.state = {
      currentDate: moment(props.initialDate),
      selectedTimeslots: [],
    };
  }

  render() {
    return (
      <div className = "tsc-calendar">
        { this.state.selectedTimeslots.map((timeslot) => {
          return timeslot.startDate.format('MMMM Do YYYY, h:mm:ss A');
        }) }
        { this._renderActions() }
        { this._renderMonth() }
        { this._renderInputs() }
      </div>
    );
  }

  _renderActions() {
    const {
      currentDate,
    } = this.state;

    const actionTitle = `${currentDate.format('MMMM - YYYY')}`;

    return (
      <div className = "tsc-calendar__actions">
        <div className = "tsc-calendar__action tsc-calendar__action-element tsc-calendar__action-element--left" onClick = { this._onGoToPrevMonth.bind(this) }>
          &#8249;
        </div>
        <div className = "tsc-calendar__action tsc-calendar__action-title">
          { actionTitle }
        </div>
        <div className = "tsc-calendar__action tsc-calendar__action-element tsc-calendar__action-element--right" onClick = { this._onGoToNextMonth.bind(this) }>
          &#8250;
        </div>
      </div>
    );
  }

  _renderMonth() {
    const {
      currentDate,
      selectedTimeslots,
    } = this.state;

    const {
      timeslots,
      initialDate,
    } = this.props;

    const cal = new CalendarJS(currentDate.year(), currentDate.month() + 1);
    const weeks = cal.generate();

    return (
      <Month
        currentDate = { currentDate }
        initialDate = { moment(initialDate) }
        weeks = { weeks }
        onWeekOutOfMonth = { this._onWeekOutOfMonth.bind(this) }
        onTimeslotClick = { this._onTimeslotClick.bind(this) }
        timeslots = { timeslots }
        selectedTimeslots = { selectedTimeslots }
      />
    );
  }

  _renderInputs() {
    const {
      selectedTimeslots,
    } = this.state;

    const {
      startDate,
      endDate,
    } = this.inputProps;

    //Determines if multiple input or single one.
    const inputPrefix = selectedTimeslots.length > 1 ? '[]' : '';

    return selectedTimeslots.map((timeslot, index) => {
      return (
        <div key = { index } >
          <input
            name = { startDate.name + inputPrefix }
            className = { startDate.class }
            type = { startDate.type }
            value = { timeslot.startDate.format('MMMM Do YYYY, h:mm:ss A') }
          />
          <input
            name = { endDate.name + inputPrefix }
            className = { endDate.class }
            type = { endDate.type }
            value = { timeslot.endDate.format('MMMM Do YYYY, h:mm:ss A') }
          />
        </div>
      );
    });
  }

  _onWeekOutOfMonth(updateDate) {
    this.setState({
      currentDate: updateDate,
    });

    return;
  }

  _onGoToNextMonth() {
    const {
      currentDate,
    } = this.state;

    let nextDate = currentDate.clone()
      .startOf('month')
      .add(1, 'months')
      .startOf('month');

    this.setState({
      currentDate: nextDate,
    });
  }

  _onGoToPrevMonth() {
    const {
      currentDate,
    } = this.state;

    let nextDate = currentDate.clone()
      .startOf('month')
      .subtract(1, 'months')
      .startOf('month');

    this.setState({
      currentDate: nextDate,
    });
  }

  _onTimeslotClick(newTimeslot) {
    const {
      selectedTimeslots,
    } = this.state;

    const {
      maxTimeslots,
    } = this.props;

    const newSelectedTimeslots = selectedTimeslots.slice();

    let existentTimeslotIndex = -1;
    const timeslotExists = newSelectedTimeslots.some((timeslot, index) => {
      existentTimeslotIndex = index;
      return newTimeslot.startDate.format() === timeslot.startDate.format();
    });

    if (timeslotExists) {
      newSelectedTimeslots.splice(existentTimeslotIndex, 1);
    }
    else {
      newSelectedTimeslots.push(newTimeslot);
    }

    if (newSelectedTimeslots.length > maxTimeslots) {
      newSelectedTimeslots.splice(0, 1);
    }

    this.setState({
      selectedTimeslots: newSelectedTimeslots,
    });
  }

}

Calendar.defaultProps = {
  maxTimeslots: 1,
  inputProps: {
    names: {},
  },
  startDateInputProps: {},
  endDateInputProps: {},
};

/**
 * @type {String} initialDate:  The initial date in which to place the calendar. Must be MomentJS parseable.
 * @type {Array} timeslots:  An array of timeslots to be displayed in each day.
 * @type {string} selectedTimeslot: Initial value for timeslot input.
 * @type {Integer} maxTimexlots: maximum ammount of timeslots to select.
 * @type {Object} startDateInputProps: properties for the startDate Inputs. Includes name, class, type (hidden, text...)
 * @type {Object} endDateInputProps: properties for the endDate Inputs. Includes name, class, type (hidden, text...)
 */
Calendar.propTypes = {
  initialDate: PropTypes.string.isRequired,
  timeslots: PropTypes.array.isRequired,
  selectedTimeslots: PropTypes.string,
  maxTimeslots: PropTypes.number,
  inputProps: PropTypes.object,
  startDateInputProps: PropTypes.object,
  endDateInputProps: PropTypes.object,
};