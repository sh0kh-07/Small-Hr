import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../baseQuary/axiosBaseQuery';

export const categoryApi = createApi({
    reducerPath: 'categoryApi',
    baseQuery: axiosBaseQuery(),
    tagTypes: ['Category'],
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: (page = 1) => ({
                url: `/categories/paginate?page=${page}`,
                method: 'GET',
            }),
            providesTags: ['Category'],
        }),
        getAllCategories: builder.query({
            query: () => ({
                url: '/categories',
                method: 'GET',
            }),
            providesTags: ['Category'],
        }),
        createCategory: builder.mutation({
            query: (formData) => ({
                url: '/categories',
                method: 'POST',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }),
            invalidatesTags: ['Category'],
        }),
        updateCategory: builder.mutation({
            query: ({ id, formData }) => ({
                url: `/categories/${id}`,
                method: 'PUT',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }),
            invalidatesTags: ['Category'],
        }),
        getSubCategories: builder.query({
            query: ({ parentId, page = 1 }) => ({
                url: `/categories/parent?parentId=${parentId}&page=${page}`,
                method: 'GET',
            }),
            providesTags: ['Category'],
        }),
        deleteCategory: builder.mutation({
            query: (id) => ({
                url: `/categories/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Category'],
        }),
    }),
});

export const {
    useGetCategoriesQuery,
    useGetAllCategoriesQuery,
    useGetSubCategoriesQuery,
    useCreateCategoryMutation,
    useUpdateCategoryMutation,
    useDeleteCategoryMutation,
} = categoryApi;
