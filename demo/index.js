import React from 'react';

import DatePicker from '../container/DatePicker';
import './index.scss';

function Demo() {
  return (
    <div>
      <section className='example'>
        <DatePicker firstDayOfWeek={1} editable={false} />
      </section>
      <section className='example'>
        <DatePicker
          firstDayOfWeek={1}
          type='dateTime'
          format='yyyy-MM-dd HH:mm:ss'
        />
      </section>
    </div>
  );
}

export default Demo;
