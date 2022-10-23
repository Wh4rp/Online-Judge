import { createSlice } from '@reduxjs/toolkit'

const userSlice = createSlice({
    name: 'user',
    initialState: {
        loggedIn: false,
        name: null,
        username: null,
    },
    reducers: {
        login: (state, action) => {
            state.loggedIn = true
            state.username = action.payload.username
        },
        logout: state => {
            state.loggedIn = false
            state.username = null
        }
    }
})

export const { login, logout } = userSlice.actions
export const { reducer } = userSlice