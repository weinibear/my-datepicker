import React from 'react';
import PropTypes from 'prop-types';

import './index.scss';

CalendarHeader.propTypes = {
  currentPanel: PropTypes.string,
};

function CalendarHeader({
  currentPanel,
  now,
  changePanelType,
  changeYear,
  changeMonth,
}) {
  function renderContent() {
    if (currentPanel === 'time') {
      return (
        <a onClick={() => changePanelType('date')}>
          {now.toLocaleDateString()}
        </a>
      );
    }
    return (
      <>
        <div>
          <a className='xw-calendar__prev-icon' onClick={() => changeYear(-1)}>
            &laquo;
          </a>
          {currentPanel === 'date' && (
            <a
              className='xw-calendar__prev-icon'
              onClick={() => changeMonth(-1)}
            >
              &lsaquo;
            </a>
          )}
        </div>
        <div>
          <a
            onClick={() => changePanelType('month')}
            style={{ marginRight: '5px' }}
          >
            {now.getMonth() + 1}
          </a>
          <a onClick={() => changePanelType('year')}>{now.getFullYear()}</a>
        </div>
        <div>
          {currentPanel === 'date' && (
            <a
              className='xw-calendar__next-icon'
              onClick={() => changeMonth(1)}
            >
              &rsaquo;
            </a>
          )}
          <a className='xw-calendar__next-icon' onClick={() => changeYear(1)}>
            &raquo;
          </a>
        </div>
      </>
    );
  }

  return <div className='xw-calendar-header'>{renderContent()}</div>;
}

export default CalendarHeader;
