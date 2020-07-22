import React from 'react';

import DatePicker from '../container/DatePicker';

function Demo() {
  return (
    <div>
      <DatePicker firstDayOfWeek={1} editable={false} />
    </div>
  );
}

export default Demo;
