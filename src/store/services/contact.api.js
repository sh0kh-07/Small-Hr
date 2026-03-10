import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../baseQuary/axiosBaseQuery';

export const contactApi = createApi({
    reducerPath: 'contactApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Contact'],
    endpoints: (builder) => ({
        getContacts: builder.query({
            query: (productId) => ({
                url: `/contacts/${productId}`,
                method: 'GET',
            }),
            providesTags: (result) =>
                result
                    ? [...result.map(({ id }) => ({ type: 'Contact', id })), { type: 'Contact', id: 'LIST' }]
                    : [{ type: 'Contact', id: 'LIST' }],
        }),
        createContact: builder.mutation({
            query: (data) => ({
                url: '/contacts',
                method: 'POST',
                data,
            }),
            invalidatesTags: [{ type: 'Contact', id: 'LIST' }],
        }),
        updateContact: builder.mutation({
            query: ({ id, ...data }) => ({
                url: `/contacts/${id}`,
                method: 'PUT',
                data,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Contact', id }, { type: 'Contact', id: 'LIST' }],
        }),
        deleteContact: builder.mutation({
            query: (id) => ({
                url: `/contacts/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: [{ type: 'Contact', id: 'LIST' }],
        }),
    }),
});

export const {
    useGetContactsQuery,
    useCreateContactMutation,
    useUpdateContactMutation,
    useDeleteContactMutation,
} = contactApi;
