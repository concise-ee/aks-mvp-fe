import { Coordinate } from 'ol/coordinate';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MapState {
  clickCoordinate: Coordinate | null;
}

const initialState: MapState = {
  clickCoordinate: null,
};

export const mapSlice = createSlice({
  name: 'mapSlice',
  initialState,
  reducers: {
    setClickCoordinate: (state, action: PayloadAction<Coordinate | null>) => {
      state.clickCoordinate = action.payload;
    },
  },
});

export const { setClickCoordinate } = mapSlice.actions;

export default mapSlice.reducer;
