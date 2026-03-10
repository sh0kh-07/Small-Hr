import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { authApi } from './services/auth.api';
import { categoryApi } from './services/category.api';
import { productApi } from './services/product.api';
import { contactApi } from './services/contact.api';
import { messagesApi } from './services/messages.api';
import authReducer from './slices/auth.slice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        [authApi.reducerPath]: authApi.reducer,
        [categoryApi.reducerPath]: categoryApi.reducer,
        [productApi.reducerPath]: productApi.reducer,
        [contactApi.reducerPath]: contactApi.reducer,
        [messagesApi.reducerPath]: messagesApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            authApi.middleware,
            categoryApi.middleware,
            productApi.middleware,
            contactApi.middleware,
            messagesApi.middleware
        ),
});

setupListeners(store.dispatch);
export default store;
