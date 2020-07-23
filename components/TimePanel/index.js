import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

TimePanel.propTypes = {
  panelDate: PropTypes.object,
  minuteStep: PropTypes.number,
  changeTimePanelEl: PropTypes.func,
};

function TimePanel({ panelDate, minuteStep, changeTimePanelEl }) {
  const getTimeArray = (len, step = 1) => {
    const length = parseInt(len / step);
    return Array.apply(null, { length }).map((v, i) => i * step);
  };

  const getTimes = () => {
    const times = [getTimeArray(24, 1), getTimeArray(60, minuteStep || 1)];
    if (minuteStep === 0) {
      times.push(getTimeArray(60, 1));
    }
    return times;
  };

  const getTimeClasses = (type, num) => {
    const classes = 'xw-time-item';
    let otherClass = '';
    const h = panelDate.getHours();
    const m = panelDate.getMinutes();
    const s = panelDate.getSeconds();
    if (
      (type === 0 && num === h) ||
      (type === 1 && num === m) ||
      (type === 2 && num === s)
    ) {
      otherClass = 'cur-time';
    }
    return classNames(classes, otherClass);
  };

  const times = getTimes();

  return (
    <div className='xw-calendar-time'>
      {times.map((time, index) => (
        <div
          key={index}
          className='xw-time-list-wrapper'
          style={{ width: `${100 / times.length}%` }}
        >
          <ul className='xw-time-list'>
            {time.map((num) => (
              <li
                key={num}
                className={getTimeClasses(index, num)}
                onClick={() => changeTimePanelEl(index, num)}
              >
                {num}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default TimePanel;
