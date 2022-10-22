import { configureStore } from '@reduxjs/toolkit'

import { reducer as userReducer } from './authentication'

const Store = configureStore({
    reducer: {
        user: userReducer,
    }
})

export default Store