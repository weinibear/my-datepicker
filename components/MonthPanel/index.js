import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

MonthPanel.propTypes = {
  now: PropTypes.object,
  months: PropTypes.Array,
  changeMonthPanelEl: PropTypes.func,
};

function MonthPanel({ now, months, changeMonthPanelEl }) {
  const getMonthClasses = (monthIndex) => {
    if (now.getMonth() === monthIndex) {
      return 'current';
    }
  };

  return (
    <div className='xw-calendar-months'>
      {months.map((v, i) => (
        <a
          key={v}
          className={getMonthClasses(i)}
          onClick={(e) => changeMonthPanelEl(e, i)}
        >
          {v}
        </a>
      ))}
    </div>
  );
}

export default MonthPanel;
