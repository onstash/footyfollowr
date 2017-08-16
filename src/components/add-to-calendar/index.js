import React from 'react';
// import AddToCalendar from 'react-add-to-calendar';

export default ({ event }) => {
  if (!event) {
    return <div />;
  }
  const calendarURL = [
    "https://calendar.google.com/calendar/render?action=TEMPLATE",
    `dates=${event.startTime}/${event.endTime}`,
    `text=${event.title}`,
  ].join('&');
  return (
    <a href={calendarURL} target="_blank">
      Add to Calendar
    </a>
  );
  // return (
  //   <AddToCalendar
  //     event={event}
  //     buttonLabel="(Add reminder)"
  //   />
  // );
};
