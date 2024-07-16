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
    return { error: true };
  }
});

const filterSlice = createSlice({
  name: 'tickets',
  initialState: {
    tickets: [],
    dataStop: 0,
    status: null,
    error: 0,
    listLength: 5,
    filters: {
      Все: true,
      'Без пересадок': true,
      '1 пересадка': true,
      '2 пересадки': true,
      '3 пересадки': true,
    },
    tabs: {
      'самый дешевый': true,
      'самый быстрый': false,
      оптимальный: false,
    },
  },
  reducers: {
    onChangeCheckbox(state, action) {
      state.filters = { ...state.filters, [action.payload.label]: !state.filters[action.payload.label] };

      if (action.payload.label === 'Все') {
        state.filters = {
          Все: state.filters[action.payload.label],
          'Без пересадок': state.filters[action.payload.label],
          '1 пересадка': state.filters[action.payload.label],
          '2 пересадки': state.filters[action.payload.label],
          '3 пересадки': state.filters[action.payload.label],
        };
      } else if (!state.filters[action.payload.label]) {
        state.filters = {
          ...state.filters,
          Все: false,
        };
      } else if (
        state.filters[action.payload.label] &&
        Object.values(state.filters).filter((el) => el).length === 4
      ) {
        state.filters = {
          ...state.filters,
          Все: true,
        };
      }
    },
    onChangeFilterTickets(state) {
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
        state.tabs = {
          'самый дешевый': true,
          'самый быстрый': false,
          оптимальный: false,
        };
      } else if (action.payload.label === 'самый быстрый') {
        state.tabs = {
          'самый дешевый': false,
          'самый быстрый': true,
          оптимальный: false,
        };
      } else if (action.payload.label === 'оптимальный') {
        state.tabs = {
          'самый дешевый': false,
          'самый быстрый': false,
          оптимальный: true,
        };
      }
    },
    onChangeTabTickets(state) {
      if (state.tabs['самый дешевый']) {
        state.tickets.sort((a, b) => (a.price > b.price ? 1 : -1));
      } else if (state.tabs['самый быстрый']) {
        state.tickets.sort((a, b) =>
          a.segments[0].duration + a.segments[1].duration > b.segments[0].duration + b.segments[1].duration
            ? 1
            : -1
        );
      } else if (state.tabs['оптимальный']) {
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
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        if (Array.isArray(action.payload.tickets)) {
          state.tickets = [...state.tickets, ...action.payload.tickets];

          state.tickets.forEach((ticket) => {
            ticket.hide = false;
          });
          state.error = 0;
        }

        if (!action.payload.stop && state.dataStop !== true) {
          state.dataStop += 1;
        } else {
          state.status = 'resolved';
          state.dataStop = true;
        }

        if (action.payload.error) {
          state.error += 1;
          if (state.error >= 3) {
            state.status = 'rejected';
            state.dataStop = true;
          }
        }
      });
  },
});

export const { onChangeCheckbox, onChangeFilterTickets, addTickets, onChangeTab, onChangeTabTickets } =
  filterSlice.actions;

export default filterSlice.reducer;
