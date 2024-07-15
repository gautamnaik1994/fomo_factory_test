import { createSlice } from '@reduxjs/toolkit'

export const priceSlice = createSlice({
  name: 'price',
  initialState: {
    value: {
      symbol: 'BTC',
      data: [{
        date: '2024-05-01',
        price: 10
      },
        {
          date: '2024-05-02',
          price: 20
      }]
    }
  },
  reducers: {
    update: (state, action) => {
      state.value.data = action.payload
    }
  }
})

export const {update } = priceSlice.actions

export default priceSlice.reducer