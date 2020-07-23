import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

YearPanel.propTypes = {
  panelDate: PropTypes.object,
  currentPanelDate: PropTypes.object,
  changeYearPanelEl: PropTypes.func,
};

function YearPanel({ panelDate, currentPanelDate, changeYearPanelEl }) {
  const getCurrentYears = () => {
    const firstYear = Math.floor(currentPanelDate.getFullYear() / 10) * 10;
    let currentYears = [];
    for (let i = 0; i < 10; i++) {
      currentYears.push(firstYear + i);
    }
    return currentYears;
  };

  const getYearClasses = (v) => {
    if (panelDate.getFullYear() === v) {
      return 'current';
    }
  };

  return (
    <div className='xw-calendar-years'>
      {getCurrentYears().map((v) => (
        <a
          key={v}
          className={getYearClasses(v)}
          onClick={(e) => changeYearPanelEl(e, v)}
        >
          {v}
        </a>
      ))}
    </div>
  );
}

export default YearPanel;
