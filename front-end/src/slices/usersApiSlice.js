import { USERS_URL } from "../constants.js";
import { apiSlice } from "./apiSlice.js";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        // mutation pour requette envoyé
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth`,
                method: "POST",
                body: data,
            }),
            keepUnusedDataFor: 5,
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`,
                method: "POST",
                body: data,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: "POST",
            }),
        }),
        profile: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profil`,
                method: "PUT",
                body: data,
            }),
        }),
        // query pour récupérer les données
        getUsers: builder.query({
            query: () => ({
                url: USERS_URL,
            }),
            providesTags: ["users"],
            keepUnusedDataFor: 5,
        }),
        delete: builder.mutation({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}`,
                method: "DELETE",
            }),
        }),
        getUserById: builder.query({
            query: (id) => ({
                url: `${USERS_URL}/${id}`,
            }),
            keepUnusedDataFor: 5,
        }),
        updateUser: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/${data.userId}`,
                method: "PUT",
                body: data,
            }),
            providesTags: ["user"],
        }),
    }),
});

export const {
    useLoginMutation,
    useRegisterMutation,
    useLogoutMutation,
    useProfileMutation,
    useGetUsersQuery,
    useDeleteMutation,
    useGetUserByIdQuery,
    useUpdateUserMutation,
} = usersApiSlice;
