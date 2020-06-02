export const isObject = (obj) => {
  return obj !== null && typeof obj === 'object';
};

export const getCalendar = (time, firstday, length, classes) => {
  return Array.apply(null, { length }).map((v, i) => {
    // eslint-disable-line
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
