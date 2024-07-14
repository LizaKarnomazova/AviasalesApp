import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Button, Skeleton } from 'antd';

import { addTickets } from '../../store/filterSlice';
import Ticket from '../ticket';

import Class from './list.module.scss';

const List = () => {
  const tickets = useSelector((state) => state.filters.tickets);
  const listLength = useSelector((state) => state.filters.listLength);
  const status = useSelector((state) => state.filters.status);
  const dispatch = useDispatch();

  const ticketList = tickets
    .filter((ticket) => !ticket.hide)
    .slice(0, listLength)
    .map((ticket) => {
      if (ticket.hide) return null;
      return (
        <li key={Date.now() * Math.random()}>
          <Ticket {...ticket} />
        </li>
      );
    });

  if (ticketList.length === 0 && status === 'resolved') {
    return (
      <div className={Class.listWrapper}>
        <span className={Class.warningLabel}>Рейсов, подходящих под заданные фильтры, не найдено</span>
      </div>
    );
  }

  return (
    <div className={Class.listWrapper}>
      {status === 'loading' ? <Skeleton active className={Class.sceleton} /> : <></>}
      <ul className={Class.listWrapper}>{ticketList}</ul>
      <Button type="primary" className={Class.buttonShowMore} onClick={() => dispatch(addTickets())}>
        ПОКАЗАТЬ ЕЩЕ 5 БИЛЕТОВ!
      </Button>
    </div>
  );
};
export default List;
