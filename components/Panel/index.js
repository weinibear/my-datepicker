import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import { cloneDeep } from 'loadsh';

import CalendarHeader from '../CalendarHeader';
import DatePanel from '../DatePanel';
import YearPanel from '../YearPanel';
import MonthPanel from '../MonthPanel';
import TimePanel from '../TimePanel';

import './index.scss';

class Panel extends PureComponent {
  static propTypes = {
    style: PropTypes.object,
    langData: PropTypes.object,
    type: PropTypes.string,
    firstDayOfWeek: PropTypes.number,
    format: PropTypes.string,
    minuteStep: PropTypes.number,
    inputVal: PropTypes.string,
    panelDate: PropTypes.object, // 面板当前时间
    handleChangeDate: PropTypes.func, // 改变当前日期时间
    handleChangePanelDate: PropTypes.func,
    isPanelOpen: PropTypes.bool,
    handleClosePanel: PropTypes.func,
  };

  state = {
    currentPanel: 'date',
    currentPanelDate: this.props.panelDate, // 当前面板日期(年份面板使用,切换年份寻找年份不改变panelDate)
  };

  componentDidUpdate(preProps, preStates) {
    if (!preProps.isPanelOpen && this.props.isPanelOpen) {
      this.initPanel();
    }
    if (
      preStates.currentPanel !== 'year' &&
      this.state.currentPanel === 'year'
    ) {
      this.setState({
        currentPanelDate: this.props.panelDate,
      });
    }
  }

  initPanel = () => {
    this.changePanelType('date');
  };

  changePanelType = (type) => {
    this.setState({
      currentPanel: type,
    });
  };

  // 左右切换年份
  changeYear = (flag) => {
    const { currentPanelDate, currentPanel } = this.state;
    const { panelDate } = this.props;
    if (currentPanel === 'year') {
      const copyCurrentPanelDate = cloneDeep(currentPanelDate);
      copyCurrentPanelDate.setFullYear(
        currentPanelDate.getFullYear() + 10 * flag
      );
      this.setState({
        currentPanelDate: copyCurrentPanelDate,
      });
    } else {
      const copyPanelDate = cloneDeep(panelDate);
      copyPanelDate.setFullYear(panelDate.getFullYear() + flag);
      this.props.handleChangePanelDate(copyPanelDate);
    }
  };

  // 左右切换月份
  changeMonth = (flag) => {
    const { panelDate } = this.props;
    const copyPanelDate = cloneDeep(panelDate);
    copyPanelDate.setMonth(panelDate.getMonth() + flag);
    this.props.handleChangePanelDate(copyPanelDate);
  };

  // 点击选中日期
  selectDate = ({ date }) => {
    const { type, panelDate } = this.props;
    const copyPanelDate = cloneDeep(panelDate);
    copyPanelDate.setFullYear(date.getFullYear());
    copyPanelDate.setMonth(date.getMonth());
    copyPanelDate.setDate(date.getDate());
    if (type === 'dateTime') {
      this.setState({
        currentPanel: 'time',
      });
    } else {
      this.props.handleClosePanel();
    }
    this.props.handleChangeDate(copyPanelDate);
  };

  // 选择年份
  changeYearPanelEl = (e, year) => {
    const { panelDate } = this.props;
    const copyPanelDate = cloneDeep(panelDate);
    e.stopPropagation();
    copyPanelDate.setFullYear(year);
    this.changePanelType('month');
    this.props.handleChangeDate(copyPanelDate);
  };

  // 选择月份
  changeMonthPanelEl = (e, monthIndex) => {
    const { panelDate } = this.props;
    const copyPanelDate = cloneDeep(panelDate);
    e.stopPropagation();
    copyPanelDate.setMonth(monthIndex);
    this.changePanelType('date');
    this.props.handleChangeDate(copyPanelDate);
  };

  // 选择时间
  changeTimePanelEl = (type, num) => {
    const { panelDate } = this.props;
    const copyPanelDate = cloneDeep(panelDate);
    if (type === 0) {
      copyPanelDate.setHours(num);
    }
    if (type === 1) {
      copyPanelDate.setMinutes(num);
    }
    if (type === 2) {
      copyPanelDate.setSeconds(num);
    }
    this.props.handleChangeDate(copyPanelDate);
  };

  renderContent = () => {
    const { currentPanel, currentPanelDate } = this.state;
    const {
      langData,
      firstDayOfWeek,
      minuteStep,
      panelDate,
      inputVal,
    } = this.props;
    switch (currentPanel) {
      case 'date':
        return (
          <DatePanel
            firstDayOfWeek={firstDayOfWeek}
            days={langData.days}
            inputVal={inputVal}
            panelDate={panelDate}
            selectDate={this.selectDate}
          />
        );
      case 'year':
        return (
          <YearPanel
            panelDate={panelDate}
            currentPanelDate={currentPanelDate}
            changeYearPanelEl={this.changeYearPanelEl}
          />
        );
      case 'month':
        return (
          <MonthPanel
            panelDate={panelDate}
            months={langData.months}
            changeMonthPanelEl={this.changeMonthPanelEl}
          />
        );
      case 'time':
        return (
          <TimePanel
            panelDate={panelDate}
            minuteStep={minuteStep}
            changeTimePanelEl={this.changeTimePanelEl}
          />
        );

      default:
        return null;
    }
  };

  render() {
    const { currentPanel } = this.state;
    const { style, panelDate } = this.props;
    return (
      <div className='xw-calendar' style={style}>
        <CalendarHeader
          currentPanel={currentPanel}
          panelDate={panelDate}
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
