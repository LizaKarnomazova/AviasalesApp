import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { onChangeCheckbox } from '../../store/filterSlice';

import Class from './filters.module.scss';

const Filters = () => {
  const labels = ['Все', 'Без пересадок', '1 пересадка', '2 пересадки', '3 пересадки'];

  const toggles = useSelector((state) => state.filters.filters);
  const dispatch = useDispatch();

  const filters = labels.map((label) => (
    <li key={label} className={Class.filter}>
      <input
        type="checkBox"
        id={label}
        className={Class.filterToggle}
        checked={toggles[label]}
        onChange={() => dispatch(onChangeCheckbox({ label }))}
      />
      <label htmlFor={label}>{label}</label>
    </li>
  ));

  return (
    <div className={Class.filterPanel}>
      <span className={Class.filterHeader}>КОЛИЧЕСТВО ПЕРЕСАДОК</span>
      <ul className={Class.filterList}>{filters}</ul>
    </div>
  );
};

export default Filters;
