import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// article
export const articleApi = createApi({
  reducerPath: "articleApi",
  // base query
  baseQuery: fetchBaseQuery({
    // url
    baseUrl: "https://article-extractor-and-summarizer.p.rapidapi.com/",
    // headers
    prepareHeaders: (headers) => {
      headers.set(
        "X-RapidAPI-Key",
        import.meta.env.VITE_RAPIDAPI_ARTICLE_KEY || "ndandad"
      );
      headers.set(
        "X-RapidAPI-Host",
        "article-extractor-and-summarizer.p.rapidapi.com"
      );

      return headers;
    },
  }),
  // endpoints
  endpoints: (builder) => ({
    getSummary: builder.query({
      query: (params) =>
        `/summarize?url=${encodeURIComponent(params.articleUrl)}&length=3`,
    }),
  }),
});

export const { useLazyGetSummaryQuery } = articleApi;
