import React from 'react';

import Class from './ticket-details.module.scss';

const TicketDetails = ({ segment }) => {
  function timeFormat(number) {
    if (number < 10) return `0${number}`;
    return number;
  }

  function time(date, duration) {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    const dateStart = new Date(date);
    const travelStart = `${timeFormat(dateStart.getHours())}:${timeFormat(dateStart.getMinutes())}`;
    const hoursEnd = timeFormat((dateStart.getHours() + hours) % 24);
    const minutesEnd = timeFormat((dateStart.getMinutes() + minutes) % 60);
    const travelEnd = `${hoursEnd}:${minutesEnd}`;
    const travelTime = `${timeFormat(hours)}ч ${timeFormat(minutes)}м`;
    return [`${travelStart} - ${travelEnd}`, travelTime];
  }

  function transfer(stops) {
    let stopsLabel;
    if (stops.length === 0) stopsLabel = 'Без пересадок';
    else if (stops.length === 1) stopsLabel = '1 пересадка';
    else if (stops.length === 2) stopsLabel = '2 пересадки';
    else if (stops.length === 3) stopsLabel = '3 пересадки';
    return [stopsLabel.toUpperCase(), stops.join(', ')];
  }

  const sections = {
    [`${segment.origin} – ${segment.destination}`]: time(segment.date, segment.duration)[0],
    'В ПУТИ': time(segment.date, segment.duration)[1],
    [transfer(segment.stops)[0]]: transfer(segment.stops)[1],
  };
  const details = Object.entries(sections).map((section) => (
    <div key={section[0]} className={Class.section}>
      <span className={Class.title}>{section[0]}</span>
      <br />
      <span className={Class.info}>{section[1]}</span>
    </div>
  ));

  return <div className={Class.wrapper}>{details}</div>;
};

export default TicketDetails;
