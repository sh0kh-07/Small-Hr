// store/slices/auth.slice.js
import { createSlice } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';

const getInitialUser = () => {
    const user = Cookies.get('user');
    try {
        return user ? JSON.parse(user) : null;
    } catch (e) {
        return null;
    }
};

const initialState = {
    token: Cookies.get('token') || null,
    refresh_token: Cookies.get('refresh_token') || null,
    role: Cookies.get('role') || null,
    user: getInitialUser(),
    isAuthenticated: !!Cookies.get('token'),
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuth(state, action) {
            const { access_token, refresh_token, user } = action.payload;

            state.token = access_token;
            state.refresh_token = refresh_token;
            state.role = user.role;
            state.user = user;
            state.isAuthenticated = !!access_token;

            // Set Cookies
            Cookies.set('token', access_token, { expires: 7 });
            Cookies.set('refresh_token', refresh_token, { expires: 30 });
            Cookies.set('role', user.role, { expires: 7 });
            Cookies.set('us_nesw', user.id, { expires: 30 }); // Required for api.js refresh logic
            Cookies.set('user', JSON.stringify(user), { expires: 7 });
        },
        logout(state) {
            state.token = null;
            state.refresh_token = null;
            state.role = null;
            state.user = null;
            state.isAuthenticated = false;

            Cookies.remove('token');
            Cookies.remove('refresh_token');
            Cookies.remove('role');
            Cookies.remove('us_nesw');
            Cookies.remove('user');
        },
    },
});

export const { setAuth, logout } = authSlice.actions;
export default authSlice.reducer;
