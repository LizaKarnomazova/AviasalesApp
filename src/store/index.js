import { configureStore } from '@reduxjs/toolkit';

import filterReducer from './filterSlice';

export default configureStore({
  reducer: { filters: filterReducer },
});
