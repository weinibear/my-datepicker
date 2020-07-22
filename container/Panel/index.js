import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { cloneDeep } from 'loadsh';

import CalendarHeader from '../../components/CalendarHeader';
import DatePanel from '../../components/DatePanel';
import YearPanel from '../../components/YearPanel';
import MonthPanel from '../../components/MonthPanel';
import TimePanel from '../../components/TimePanel';

import { data } from '../data';
import './index.scss';

class Panel extends PureComponent {
  static propTypes = {
    type: PropTypes.string,
    firstDayOfWeek: PropTypes.number,
    format: PropTypes.string,
    minuteStep: PropTypes.number,
    panelVal: PropTypes.string, // 面板当前时间
    isPanelOpen: PropTypes.bool,
    handleClosePanel: PropTypes.func,
    handleChangePanelValue: PropTypes.func,
  };

  state = {
    currentPanel: 'date',
    now: new Date(this.props.panelVal), // currentPanel Time
  };

  componentDidMount() {}

  componentDidUpdate(preProps, preStates) {
    if (!preProps.isPanelOpen && this.props.isPanelOpen) {
      this.initPanel();
    }
    if (preProps.panelVal !== this.props.panelVal) {
      this.setState({
        now: new Date(this.props.panelVal),
      });
    }
  }

  initPanel = () => {
    this.changePanelType('date');
  };

  changeYear = (flag) => {
    const { now, currentPanel } = this.state;
    const date = new Date(now);
    const panelYear = currentPanel === 'year' ? 10 * flag : flag;
    date.setFullYear(date.getFullYear() + panelYear);
    this.setState({
      now: date,
    });
  };

  changeMonth = (flag) => {
    const date = new Date(this.state.now);
    date.setMonth(date.getMonth() + flag);
    this.setState({
      now: date,
    });
  };

  selectDate = ({ date }) => {
    const { now } = this.state;
    const { type } = this.props;
    const copyNow = cloneDeep(now);
    copyNow.setFullYear(date.getFullYear());
    copyNow.setMonth(date.getMonth());
    copyNow.setDate(date.getDate());
    if (type === 'dateTime') {
      this.setState({
        currentPanel: 'time',
      });
    } else {
      this.props.handleClosePanel();
    }
    this.setState({
      now: new Date(copyNow),
    });
    this.props.handleChangePanelValue(new Date(copyNow));
  };

  changePanelType = (type) => {
    this.setState({
      currentPanel: type,
    });
  };

  // 选择年份
  changeYearPanelEl = (e, year) => {
    const { now } = this.state;
    e.stopPropagation();
    console.log(now);
    const copyNow = cloneDeep(now);
    copyNow.setFullYear(year);
    this.setState({
      now: copyNow,
    });
    this.changePanelType('month');
    this.props.handleChangePanelValue(copyNow);
  };

  // 选择月份
  changeMonthPanelEl = (e, monthIndex) => {
    const { now } = this.state;
    e.stopPropagation();
    console.log(now);
    const copyNow = cloneDeep(now);
    copyNow.setMonth(monthIndex);
    this.setState({
      now: copyNow,
    });
    this.changePanelType('date');
    this.props.handleChangePanelValue(copyNow);
  };

  changeTimePanelEl = (type, num) => {
    const { now } = this.state;
    const copyNow = cloneDeep(now);
    if (type === 0) {
      copyNow.setHours(num);
    }
    if (type === 1) {
      copyNow.setMinutes(num);
    }
    if (type === 2) {
      copyNow.setSeconds(num);
    }
    this.setState({
      now: copyNow,
    });
    this.props.handleChangePanelValue(copyNow);
  };

  getCurrentYears = () => {
    const { now } = this.state;
    const firstYear = Math.floor(now.getFullYear() / 10) * 10;
    let years = [];
    for (let i = 0; i < 10; i++) {
      years.push(firstYear + i);
    }
    return years;
  };

  renderContent = () => {
    const { currentPanel, now } = this.state;
    const { firstDayOfWeek, minuteStep } = this.props;
    switch (currentPanel) {
      case 'date':
        return (
          <DatePanel
            firstDayOfWeek={firstDayOfWeek}
            now={now}
            days={data.weeks}
            selectDate={this.selectDate}
          />
        );
      case 'year':
        return (
          <YearPanel
            now={now}
            currentYears={this.getCurrentYears()}
            changeYearPanelEl={this.changeYearPanelEl}
          />
        );
      case 'month':
        return (
          <MonthPanel
            now={now}
            months={data.months}
            changeMonthPanelEl={this.changeMonthPanelEl}
          />
        );
      case 'time':
        return (
          <TimePanel
            now={now}
            minuteStep={minuteStep}
            changeTimePanelEl={this.changeTimePanelEl}
          />
        );

      default:
        return this.renderDatePanel();
    }
  };

  render() {
    const { now, currentPanel } = this.state;
    return (
      <div className='xw-calendar'>
        <CalendarHeader
          currentPanel={currentPanel}
          now={now}
          changePanelType={this.changePanelType}
          changeYear={this.changeYear}
          changeMonth={this.changeMonth}
        />
        <div className='xw-calendar-content'>{this.renderContent()}</div>
      </div>
    );
  }
}

export default Panel;
