import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { fetchTickets, onChangeTabTickets, onChangeFilterTickets } from '../../store/filterSlice';
import Filters from '../filters';
import Tabs from '../tabs';
import List from '../list';
import ErrorIndicator from '../error-indicator';

import logo from './logo.svg';
import Class from './app.module.scss';

const App = () => {
  const dataStop = useSelector((state) => state.filters.dataStop);
  const status = useSelector((state) => state.filters.status);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchTickets());
    dispatch(onChangeFilterTickets());
    dispatch(onChangeTabTickets());
  }, [dataStop]);

  if (status === 'rejected') {
    return (
      <main className={Class.app}>
        <ErrorIndicator />
      </main>
    );
  }

  return (
    <main className={Class.app}>
      <div className={Class.logo}>
        <img src={logo} alt="Логотип" />
      </div>
      <div className={Class.appWrapper}>
        <div className={Class.filters}>
          <Filters />
        </div>
        <div className={Class.tabs}>
          <Tabs />
        </div>
        <div className={Class.list}>
          <List />
        </div>
      </div>
    </main>
  );
};

export default App;
