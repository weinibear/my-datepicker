import React, { PureComponent } from 'react';
import classNames from 'classnames';
import { cloneDeep } from 'loadsh';
import { data } from '../data';
import './index.scss';

class Panel extends PureComponent {
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

  getCalendar = (time, firstday, length, classes) => {
    return Array.apply(null, { length }).map((v, i) => {
      let day = firstday + i;
      const date = new Date(time.getFullYear(), time.getMonth(), day, 0, 0, 0);
      date.setDate(day);
      return {
        title: date.toLocaleDateString(),
        date,
        day,
        classes,
      };
    });
  };

  // 计算当前日期下面板数据
  // lastMonth  currentMonth  nextMonth
  getPanelDateArr = () => {
    const { firstDayOfWeek } = this.props;
    const time = new Date(this.state.now);
    time.setDate(0); // 把时间切换到上个月最后一天

    const lastMonthLength = ((time.getDay() + 7 - firstDayOfWeek) % 7) + 1; // time.getDay() 0是星期天, 1是星期一 ...
    const lastMonthfirst = time.getDate() - (lastMonthLength - 1);
    const lastMonth = this.getCalendar(
      time,
      lastMonthfirst,
      lastMonthLength,
      'lastMonth'
    );

    time.setMonth(time.getMonth() + 2, 0); // 切换到这个月最后一天
    const curMonthLength = time.getDate();
    const curMonth = this.getCalendar(time, 1, curMonthLength, 'curMonth');

    time.setMonth(time.getMonth() + 1, 1);
    const nextMonthLength = 42 - (lastMonthLength + curMonthLength);
    const nextMonth = this.getCalendar(time, 1, nextMonthLength, 'nextMonth');

    // 分割数组
    let index = 0;
    let resIndex = 0;
    const arr = lastMonth.concat(curMonth, nextMonth);
    const result = new Array(6);
    while (index < 42) {
      result[resIndex++] = arr.slice(index, (index += 7));
    }
    return result;
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
    this.setState({
      now: new Date(date),
    });
    this.props.handleClosePanel();
    this.props.handleChangePanelValue(new Date(date));
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

  getDateClasses = (col) => {
    const { classes, title } = col;
    let otherClass = '';
    if (new Date().toLocaleDateString() === title) {
      otherClass = 'today'; // 今天日期
    }
    if (
      classes === 'curMonth' &&
      this.state.now.toLocaleDateString() === title
    ) {
      otherClass = 'current'; // 当前活跃日期
    }
    return classNames(classes, otherClass);
  };

  getMonthClasses = (monthIndex) => {
    const { now } = this.state;
    if (now.getMonth() === monthIndex) {
      return 'current';
    }
  };

  getYearClasses = (v) => {
    const { now } = this.state;
    if (now.getFullYear() === v) {
      return 'current';
    }
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

  getWeeks = () => {
    const { firstDayOfWeek } = this.props;
    const days = data.weeks;
    return days.concat(days).slice(firstDayOfWeek, firstDayOfWeek + 7);
  };

  renderDatePanel = () => {
    const panelDateArr = this.getPanelDateArr();
    const weeksHead = this.getWeeks();
    console.log(panelDateArr);
    return (
      <table className='xw-calendar-table'>
        <thead>
          <tr>
            {weeksHead.map((v) => (
              <td key={v}>{v}</td>
            ))}
          </tr>
        </thead>
        <tbody>
          {panelDateArr.map((row, i) => (
            <tr key={i}>
              {row.map((col, j) => (
                <td
                  key={j}
                  className={this.getDateClasses(col)}
                  onClick={() => this.selectDate(col)}
                >
                  {col.day}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  renderMonthPanel = () => {
    return (
      <div className='xw-calendar-months'>
        {data.months.map((v, i) => (
          <a
            key={v}
            className={this.getMonthClasses(i)}
            onClick={(e) => this.changeMonthPanelEl(e, i)}
          >
            {v}
          </a>
        ))}
      </div>
    );
  };

  renderYearPanel = () => {
    const currentYears = this.getCurrentYears();
    return (
      <div className='xw-calendar-years'>
        {currentYears.map((v) => (
          <a
            key={v}
            className={this.getYearClasses(v)}
            onClick={(e) => this.changeYearPanelEl(e, v)}
          >
            {v}
          </a>
        ))}
      </div>
    );
  };

  renderContent = () => {
    const { currentPanel } = this.state;
    switch (currentPanel) {
      case 'date':
        return this.renderDatePanel();

      case 'month':
        return this.renderMonthPanel();

      case 'year':
        return this.renderYearPanel();

      default:
        return this.renderDatePanel();
    }
  };

  render() {
    const { now, currentPanel } = this.state;
    return (
      <div className='xw-calendar'>
        <div className='xw-calendar-header'>
          <div>
            <a
              className='xw-calendar__prev-icon'
              onClick={() => this.changeYear(-1)}
            >
              &laquo;
            </a>
            {currentPanel === 'date' && (
              <a
                className='xw-calendar__prev-icon'
                onClick={() => this.changeMonth(-1)}
              >
                &lsaquo;
              </a>
            )}
          </div>
          <div>
            <a
              onClick={() => this.changePanelType('month')}
              style={{ marginRight: '5px' }}
            >
              {now.getMonth() + 1}
            </a>
            <a onClick={() => this.changePanelType('year')}>
              {now.getFullYear()}
            </a>
          </div>
          <div>
            {currentPanel === 'date' && (
              <a
                className='xw-calendar__next-icon'
                onClick={() => this.changeMonth(1)}
              >
                &rsaquo;
              </a>
            )}
            <a
              className='xw-calendar__next-icon'
              onClick={() => this.changeYear(1)}
            >
              &raquo;
            </a>
          </div>
        </div>
        <div className='xw-calendar-content'>{this.renderContent()}</div>
      </div>
    );
  }
}

export default Panel;
