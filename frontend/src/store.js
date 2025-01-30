import {configureStore} from '@reduxjs/toolkit';
import userlocationReducer  from './redux/features/userlocationSlice';
import fetchgroundReducer from './redux/features/fetchgroundSlice';
import groundReducer from './redux/features/groundSlice';
import bookingReducer from './redux/features/bookingSlice';
export const store = configureStore({
    reducer: {
        userLocation: userlocationReducer,
        fetchGrounds: fetchgroundReducer,
        ground:  groundReducer,
        bookingdetails: bookingReducer,
    },
})