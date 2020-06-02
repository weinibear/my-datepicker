import React, { PureComponent } from 'react';

import { getCalendar } from '../utils';
import './index.scss';

class Panel extends PureComponent {
  state = {
    currentMonth: 1,
    currentYear: 2020,
    months: {},
    dates: [],
    now: new Date(),
  };

  componentWillReceiveProps(nextProps) {
    if (!this.props.show && nextProps.show) {
      this.updateNow();
      this.updateCalendar();
    }
  }

  // componentDidMount(){
  //   this.updateCalendar()
  // }

  updateNow = () => {
    const { value } = this.props;
    this.setState({
      now: value ? new Date(value) : new Date(),
    });
  };

  updateCalendar = () => {
    const { firstDayOfWeek } = this.props;
    const { now } = this.state;
    const time = new Date(now);
    time.setDate(0); // 把时间切换到上个月最后一天
    const lastMonthLength = ((time.getDay() + 7 - firstDayOfWeek) % 7) + 1; // time.getDay() 0是星期天, 1是星期一 ...
    const lastMonthfirst = time.getDate() - (lastMonthLength - 1);
    const lastMonth = getCalendar(
      time,
      lastMonthfirst,
      lastMonthLength,
      'lastMonth'
    );

    time.setMonth(time.getMonth() + 2, 0); // 切换到这个月最后一天
    const curMonthLength = time.getDate();
    const curMonth = getCalendar(time, 1, curMonthLength, 'curMonth');

    time.setMonth(time.getMonth() + 1, 1);
    const nextMonthLength = 42 - (lastMonthLength + curMonthLength);
    const nextMonth = getCalendar(time, 1, nextMonthLength, 'nextMonth');

    // 分割数组
    let index = 0;
    let resIndex = 0;
    const arr = lastMonth.concat(curMonth, nextMonth);
    const result = new Array(6);
    while (index < 42) {
      result[resIndex++] = arr.slice(index, (index += 7));
    }
    this.setState({
      dates: result,
    });
  };

  changeYear = () => {};

  changeMonth = () => {};

  showMonths = () => {};
  showYears = () => {};

  isDisabled = (date) => {
    const {
      startAt,
      endAt,
      disabledDays = [],
      notBefore,
      notAfter,
    } = this.props;
    const now = new Date(date).getTime();
    if (
      disabledDays.some((v) => new Date(v).setHours(0, 0, 0, 0) === now) ||
      (notBefore !== '' && now < new Date(notBefore).setHours(0, 0, 0, 0)) ||
      (notAfter !== '' && now > new Date(notAfter).setHours(0, 0, 0, 0)) ||
      (startAt && now < new Date(startAt).setHours(0, 0, 0, 0)) ||
      (endAt && now > new Date(endAt).setHours(0, 0, 0, 0))
    ) {
      return true;
    }
    return false;
  };

  getDateClasses = (cell) => {
    const { value, startAt, endAt } = this.props;
    const classes = [];
    const cellTime = new Date(cell.date).setHours(0, 0, 0, 0);
    const curTime = value ? new Date(value).setHours(0, 0, 0, 0) : 0;
    const startTime = startAt ? new Date(startAt).setHours(0, 0, 0, 0) : 0;
    const endTime = endAt ? new Date(endAt).setHours(0, 0, 0, 0) : 0;
    const today = new Date().setHours(0, 0, 0, 0);
    if (this.isDisabled(cellTime)) {
      return 'disabled';
    }
    classes.push(cell.classes);

    if (cellTime === today) {
      classes.push('today');
    }

    // range classes
    if (curTime) {
      if (cellTime === curTime) {
        classes.push('current');
      } else if (startTime && cellTime <= curTime) {
        classes.push('inrange');
      } else if (endTime && cellTime >= curTime) {
        classes.push('inrange');
      }
    }
    console.log(classes);
    return classes.join(' ');
  };

  selectDate = (cell) => {
    const { type, value, startAt, onInput } = this.props;
    const classes = this.getDateClasses(cell);
    if (classes.indexOf('disabled') !== -1) {
      return;
    }
    let date = new Date(cell.date);
    // datetime 跳转到 timepicker
    if (type === 'datetime') {
      // 保留时分秒
      if (value instanceof Date) {
        date.setHours(value.getHours(), value.getMinutes(), value.getSeconds());
      }
      if (startAt && date.getTime() < new Date(startAt).getTime()) {
        date = new Date(startAt);
      } else if (endAt && date.getTime() > new Date(endAt).getTime()) {
        date = new Date(endAt);
      }
      this.currentPanel = 'time';
      this.$nextTick(() => {
        Array.prototype.forEach.call(
          this.$el.querySelectorAll('.mx-time-list-wrapper'),
          (el) => {
            this.scrollIntoView(el, el.querySelector('.cur-time'));
          }
        );
      });
    }
    this.setState({
      now: date,
    });
    // this.$emit('input', date)
    onInput(date);
    // this.$emit('select');
  };

  render() {
    const { months, currentYear, dates } = this.state;
    const { translationData } = this.props;
    const { days } = translationData;
    return (
      <div className='mx-calendar'>
        <div className='mx-calendar-header'>
          <a
            className='mx-calendar__prev-icon'
            onClick={() => this.changeYear(-1)}
          >
            &laquo;
          </a>
          <a
            className='mx-calendar__prev-icon'
            onClick={() => this.changeMonth(-1)}
          >
            &lsaquo;
          </a>
          <a
            className='mx-calendar__next-icon'
            onClick={() => this.changeYear(1)}
          >
            &raquo;
          </a>
          <a
            className='mx-calendar__next-icon'
            onClick={() => this.changeMonth(1)}
          >
            &rsaquo;
          </a>
          <a onClick={this.showMonths}>{months.currentMonth}</a>
          <a onClick={this.showYears}>{currentYear}</a>
        </div>
        <div className='mx-calendar-content'>
          <table className='mx-calendar-table'>
            <thead>
              <tr>
                {days.map((day, index) => (
                  <th key={index}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dates.map((row, index) => (
                <tr key={index}>
                  {row.map((cell) => (
                    <td
                      className={this.getDateClasses(cell)}
                      title={cell.title}
                      onClick={() => this.selectDate(cell)}
                    >
                      {cell.day}
                    </td>
                  ))}
                </tr>
              ))}
              {/* <tr v-for="row in dates">
            <td v-for="cell in row" :title="cell.title" :class="getDateClasses(cell)" @click="selectDate(cell)">{{cell.day}}</td>
          </tr> */}
            </tbody>
          </table>
        </div>
        <div className='xw-panel-footer'></div>
      </div>
    );
  }
}

export default Panel;
