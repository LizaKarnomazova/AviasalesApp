import React from 'react';

import TicketDetails from '../ticket-details';

import Class from './ticket.module.scss';

const Ticket = ({ price, segments, carrier }) => (
  <div className={Class.ticket}>
    <div className={Class.topSection}>
      <span
        className={Class.price}
      >{`${price.toString().slice(0, price.toString().length - 3)} ${price.toString().slice(-3)}`}</span>
      <img className={Class.logo} src={`https://pics.avs.io/100/36/${carrier}.png`} />
    </div>
    <TicketDetails segment={segments[0]} />
    <TicketDetails segment={segments[1]} />
  </div>
);
export default Ticket;
