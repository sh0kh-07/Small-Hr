import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../baseQuary/axiosBaseQuery';

export const productApi = createApi({
    reducerPath: 'productApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Product'],
    endpoints: (builder) => ({
        getProducts: builder.query({
            query: ({ categoryId, page = 1 }) => ({
                url: `/products/paginate?categoryId=${categoryId}&page=${page}`,
                method: 'GET',
            }),
            providesTags: ['Product'],
        }),
        createProduct: builder.mutation({
            query: (formData) => ({
                url: '/products',
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }),
            invalidatesTags: ['Product'],
        }),
        updateProduct: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/products/${id}`,
                method: 'PUT',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }),
            invalidatesTags: ['Product'],
        }),
        getProduct: builder.query({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'GET',
            }),
            providesTags: (result, error, id) => [{ type: 'Product', id }],
        }),
        deleteProduct: builder.mutation({
            query: (id) => ({
                url: `/products/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Product'],
        }),
    }),
});

export const {
    useGetProductsQuery,
    useGetProductQuery,
    useCreateProductMutation,
    useUpdateProductMutation,
    useDeleteProductMutation,
} = productApi;
