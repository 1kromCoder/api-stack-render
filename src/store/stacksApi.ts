import { API } from "@/hooks/getEnv";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE5NjY3MjQ4LTdiMDUtNGNjYS04M2IyLTcwZWU3YzdiOTcwMiIsInJvbGUiOiJBRE1JTiIsImlhdCI6MTc1MTU2MzU3MywiZXhwIjoxNzUyMTY4MzczfQ.zR2nNtgl53otxdVlMbKAJVSLRD_t_7PCurIOAsHcNP4";

export const stacksApi = createApi({
  reducerPath: "stacksApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API,
  }),
  tagTypes: ["stacks"],
  endpoints: (builder) => ({
    getAllStacks: builder.query({
      query: () => ({
        method: "get",
        url: "/stacks",
        headers: { Authorization: `Bearer ${token}` },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(() => ({ type: "stacks" as const })),
              { type: "stacks" },
            ]
          : [{ type: "stacks" }],
    }),
    deleteStack: builder.mutation({
      query: (id) => ({
        method: "delete",
        url: `/stacks/${id}`,
        headers: { Authorization: `Bearer ${token}` },
      }),
      invalidatesTags: ["stacks"],
    }),
    createStack: builder.mutation({
      query: (body) => ({
        method: "post",
        url: "/stacks",
        headers: { Authorization: `Bearer ${token}` },
        body: body,
      }),
      invalidatesTags: ["stacks"],
    }),
    updateStack: builder.mutation({
      query: ({ id, body }) => ({
        url: `/stacks/${id}`,
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body,
      }),
      invalidatesTags: ["stacks"], 
    }),
  }),
});

export const {
  useGetAllStacksQuery,
  useDeleteStackMutation,
  useCreateStackMutation,
  useUpdateStackMutation,
} = stacksApi;
