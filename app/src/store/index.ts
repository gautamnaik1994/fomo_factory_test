import { configureStore } from '@reduxjs/toolkit'
import socketSlice from '@/reducers/socketSlice'
import popupSlice  from '@/reducers/popupSlice'
// ...

export const store = configureStore({
  reducer: {
    socket: socketSlice,
    popup: popupSlice
  }
})

export type AppStore = typeof store
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']