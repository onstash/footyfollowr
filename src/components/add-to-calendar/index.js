import React from 'react';
import AddToCalendar from 'react-add-to-calendar';

export default ({ event }) => {
  if (!event) {
    return <div />;
  }
  return (
    <AddToCalendar
      event={event}
      buttonLabel="(Add reminder)"
    />
  );
};
