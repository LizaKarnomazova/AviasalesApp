import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

async function fetchId() {
  const firstResponse = await fetch('https://aviasales-test-api.kata.academy/search');
  const searchId = await firstResponse.json();
  return searchId.searchId;
}

const id = fetchId();

export const fetchTickets = createAsyncThunk('tickets/fetchTickets', async () => {
  try {
    const resultId = await id.then((res) => res);
    const secondResponse = await fetch(
      `https://aviasales-test-api.kata.academy/tickets?searchId=${resultId}`
    );
    const data = await secondResponse.json();
    return data;
  } catch {
    return false;
  }
});

const filterSlice = createSlice({
  name: 'tickets',
  initialState: {
    tickets: [],
    dataStop: 0,
    status: null,
    error: null,
    listLength: 5,
    filters: {
      Все: true,
      'Без пересадок': true,
      '1 пересадка': true,
      '2 пересадки': true,
      '3 пересадки': true,
    },
  },
  reducers: {
    onChangeCheckbox(state, action) {
      state.filters = { ...state.filters, [action.payload.label]: !state.filters[action.payload.label] };

      if (action.payload.label === 'Все' && state.filters[action.payload.label] === true) {
        state.filters = {
          Все: true,
          'Без пересадок': true,
          '1 пересадка': true,
          '2 пересадки': true,
          '3 пересадки': true,
        };
      } else if (state.filters[action.payload.label] === false) {
        state.filters = {
          ...state.filters,
          Все: false,
        };
      }

      let values = Object.values(state.filters);

      for (let i = 0; i < values.length; i += 1) {
        if (values[i]) values[i] = i - 1;
        else values[i] = false;
      }

      values = values.filter((el) => typeof el === 'number');

      state.tickets.forEach((ticket) => {
        const res = [];

        ticket.segments.forEach((segment) => {
          res.push(values.includes(segment.stops.length));
        });

        if (res.filter((el) => el).length < 2) ticket.hide = true;
        else ticket.hide = false;
      });
    },
    addTickets(state) {
      state.listLength += 5;
    },
    onChangeTab(state, action) {
      if (action.payload.label === 'самый дешевый') {
        state.tickets.sort((a, b) => (a.price > b.price ? 1 : -1));
      } else if (action.payload.label === 'самый быстрый') {
        state.tickets.sort((a, b) =>
          a.segments[0].duration + a.segments[1].duration > b.segments[0].duration + b.segments[1].duration
            ? 1
            : -1
        );
      } else if (action.payload.label === 'оптимальный') {
        state.tickets.sort((a, b) =>
          a.price / 10 + a.segments[0].duration + a.segments[1].duration >
          b.price / 10 + b.segments[0].duration + b.segments[1].duration
            ? 1
            : -1
        );
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTickets.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        if (action.payload && !action.payload.stop) {
          state.tickets = [...state.tickets, ...action.payload.tickets];
          state.error = null;
        }
        state.tickets = state.tickets.sort((a, b) => (a.price > b.price ? 1 : -1));
        state.tickets.forEach((ticket) => {
          ticket.hide = false;
        });
        if ((!action.payload.stop || !action.payload) && state.dataStop !== true) {
          state.dataStop += 1;
        } else {
          state.status = 'resolved';
          state.dataStop = true;
        }
      });
  },
});

export const { onChangeCheckbox, addTickets, onChangeTab } = filterSlice.actions;

export default filterSlice.reducer;
