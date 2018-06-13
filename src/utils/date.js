const allDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const allMonths = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct',
  'Nov', 'Dec'
];

const getMonthName = dateMonth => allMonths[dateMonth];

const getDaySuffix = day => {
  const dayString = `${day}`;
  const dayStringLength = dayString.length;
  switch (dayString[dayStringLength - 1]) {
    case '1':
      return 'st';
    case '2':
      return 'nd';
    case '3':
      return 'rd';
    default:
      return 'th'
  }
}

const getStringifiedTimeValue = value => value < 10 ? `0${value}` : `${value}`;

const generateDateString = (dateObject, onlyTimeString=false) => {
  const hours = dateObject.getHours();
  const minutes = dateObject.getMinutes();
  const timeString = hours > 12 ? `${getStringifiedTimeValue(hours % 12)}:${getStringifiedTimeValue(minutes)} pm` : `${getStringifiedTimeValue(hours)}:${getStringifiedTimeValue(minutes)} am`;
  if (onlyTimeString) {
    return timeString;
  }

  const day = dateObject.getDate();
  const daySuffix = getDaySuffix(day);
  const dayNumberInWeek = dateObject.getDay();
  const dayName = allDays[dayNumberInWeek];
  const month = dateObject.getMonth();
  const monthName = getMonthName(month);
  const year = dateObject.getFullYear();
  const dateString = `${dayName} ${monthName} ${day}${daySuffix} ${year}`;
  return `${dateString} at ${timeString}`;
};

export default generateDateString;
