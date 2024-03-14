import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { data as defaultData } from "~/lib/data";

type ItemDataType = {
  key: string;
  label: string;
  title: string;
  subtitle: string;
  description: string;
  source: string;
  bg: string;
};

export interface DataState {
  offset: number;
  selectedIndex: number;
  items: ItemDataType[];
}

// const store = configureStore({
//   reducer: dataSlice.reducer,
// });

const initialState: DataState = {
  offset: 0,
  selectedIndex: 0,
  items: defaultData,
};

export const dataSlice = createSlice({
  name: "data",
  initialState: initialState,
  reducers: {
    setOffset: (state, action: PayloadAction<number>) => {
      if (
        Math.floor(state.offset * state.items.length) !==
        Math.floor(action.payload * state.items.length)
      ) {
        return {
          ...state,
          offset: action.payload,
          selectedIndex: Math.floor(action.payload * state.items.length),
        };
      }
      return {
        ...state,
        offset: action.payload,
        // selectedIndex: Math.floor(action.payload * state.items.length),
      };
    },
    next: (state) => {
      if (state.selectedIndex === state.items.length - 1) return state;
      return { ...state, selectedIndex: state.selectedIndex + 1 };
    },
    previous: (state) => {
      if (state.selectedIndex === 0) return state;
      return { ...state, selectedIndex: state.selectedIndex - 1 };
    },
    set: (state, action: PayloadAction<number>) => {
      if (action.payload < 0 || action.payload > state.items.length - 1)
        return state;
      return { ...state, selectedIndex: action.payload };
    },
  },
});
export const { setOffset, next, previous, set } = dataSlice.actions;
export default dataSlice.reducer;
