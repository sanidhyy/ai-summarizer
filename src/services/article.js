import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// article
export const articleApi = createApi({
  reducerPath: "articleApi",
  // base query
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),
  // endpoints
  endpoints: (builder) => ({
    getSummary: builder.query({
      query: (params) =>
        `/summarize?url=${encodeURIComponent(params.articleUrl)}`,
    }),
  }),
});

export const { useLazyGetSummaryQuery } = articleApi;
