import { createSlice } from '@reduxjs/toolkit'

export const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState: {
    value: "BTC"
  },
  reducers: {
    update: (state, action) => {
          state.value = action.payload
          
    }
  }
})

export const {update } = subscriptionSlice.actions

export default subscriptionSlice.reducer