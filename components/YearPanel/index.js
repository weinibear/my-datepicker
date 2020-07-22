import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

YearPanel.propTypes = {
  now: PropTypes.object,
  currentYears: PropTypes.Array,
  changeYearPanelEl: PropTypes.func,
};

function YearPanel({ now, currentYears, changeYearPanelEl }) {
  const getYearClasses = (v) => {
    if (now.getFullYear() === v) {
      return 'current';
    }
  };

  return (
    <div className='xw-calendar-years'>
      {currentYears.map((v) => (
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
