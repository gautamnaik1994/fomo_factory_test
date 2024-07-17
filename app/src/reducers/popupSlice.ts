import { createSlice } from '@reduxjs/toolkit'


export const popupSlice = createSlice({
  name: 'popup',
  initialState: {
    open:false
  },
  reducers: {
    togglePopup: (state) => {
      state.open = !state.open;
    }
  },
})

export const { togglePopup } = popupSlice.actions
export default popupSlice.reducer
