import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

MonthPanel.propTypes = {
  panelDate: PropTypes.object,
  months: PropTypes.array,
  changeMonthPanelEl: PropTypes.func,
};

function MonthPanel({ panelDate, months, changeMonthPanelEl }) {
  const getMonthClasses = (monthIndex) => {
    if (panelDate.getMonth() === monthIndex) {
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
