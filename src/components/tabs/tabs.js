import React from 'react';
import { useDispatch } from 'react-redux';
import { Radio } from 'antd';

import { onChangeTab, onChangeTabTickets } from '../../store/filterSlice';

import Class from './tabs.module.scss';

const Tabs = () => {
  const dispatch = useDispatch();
  const labels = ['самый дешевый', 'самый быстрый', 'оптимальный'];

  const tabs = labels.map((label) => (
    <Radio.Button
      key={label}
      value={label}
      className={Class.tab}
      onClick={() => {
        dispatch(onChangeTab({ label }));
        dispatch(onChangeTabTickets());
      }}
    >
      {label.toUpperCase()}
    </Radio.Button>
  ));

  return (
    <Radio.Group defaultValue="самый дешевый" buttonStyle="solid" className={Class.tabPanel}>
      {tabs}
    </Radio.Group>
  );
};
export default Tabs;
