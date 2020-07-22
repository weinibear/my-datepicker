import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './index.scss';

class DatePanel extends PureComponent {
  static propTypes = {
    firstDayOfWeek: PropTypes.number,
    now: PropTypes.object,
    selectDate: PropTypes.func,
  };

  // 计算当前日期下面板数据
  // lastMonth  currentMonth  nextMonth
  getPanelDateArr = () => {
    const { firstDayOfWeek, now } = this.props;
    const time = new Date(now);
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

  getWeeks = () => {
    const { firstDayOfWeek, days } = this.props;
    return days.concat(days).slice(firstDayOfWeek, firstDayOfWeek + 7);
  };

  getDateClasses = (col) => {
    const { now } = this.props;
    const { classes, title } = col;
    let otherClass = '';
    if (new Date().toLocaleDateString() === title) {
      otherClass = 'today'; // 今天日期
    }
    if (classes === 'curMonth' && now.toLocaleDateString() === title) {
      otherClass = 'current'; // 当前活跃日期
    }
    return classNames(classes, otherClass);
  };

  render() {
    const { selectDate } = this.props;
    const panelDateArr = this.getPanelDateArr();
    const weeksHeader = this.getWeeks();

    return (
      <table className='xw-calendar-table'>
        <thead>
          <tr>
            {weeksHeader.map((v) => (
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
                  onClick={() => selectDate(col)}
                >
                  {col.day}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

export default DatePanel;
