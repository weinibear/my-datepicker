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

export const formatDate = (date, fmt = 'yyyy-MM-dd HH:mm:ss') => {
  const hour = date.getHours();
  const map = {
    'M+': date.getMonth() + 1, // 月份
    '[Dd]+': date.getDate(), // 日
    'H+': hour, // 小时
    'h+': hour % 12 || 12, // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
    a: hour >= 12 ? 'pm' : 'am',
    A: hour >= 12 ? 'PM' : 'AM',
  };
  let str = fmt.replace(/[Yy]+/g, function (str) {
    return ('' + date.getFullYear()).slice(4 - str.length);
  });
  Object.keys(map).forEach((key) => {
    str = str.replace(new RegExp(key), function (str) {
      const value = '' + map[key];
      return str.length === 1 ? value : ('00' + value).slice(value.length);
    });
  });
  return str;
};

export const getTimeArray = (len, step = 1) => {
  const length = parseInt(len / step);
  return Array.apply(null, { length }).map((v, i) => i * step);
};
