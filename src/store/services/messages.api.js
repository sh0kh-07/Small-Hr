import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../baseQuary/axiosBaseQuery';

export const messagesApi = createApi({
    reducerPath: 'messagesApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Message'],
    endpoints: (builder) => ({
        // Barcha xabarlarni olish
        getMessages: builder.query({
            query: (page = 1) => ({
                url: `/messages/paginate?page=${page}`,
                method: 'GET',
            }),
            providesTags: (result) => {
                const records = result?.data?.records || result?.data || result || [];
                return [
                    ...(Array.isArray(records) ? records.map(({ id }) => ({ type: 'Message', id })) : []),
                    { type: 'Message', id: 'LIST' },
                ];
            },
        }),
        // Xabar yuborish
        createMessage: builder.mutation({
            query: (data) => ({
                url: '/messages',
                method: 'POST',
                data,
            }),
            invalidatesTags: [{ type: 'Message', id: 'LIST' }],
        }),
        // Xabarni o'chirish
        deleteMessage: builder.mutation({
            query: (id) => ({
                url: `/messages/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Message', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetMessagesQuery,
    useCreateMessageMutation,
    useDeleteMessageMutation,
} = messagesApi;
