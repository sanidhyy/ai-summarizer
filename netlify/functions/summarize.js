const RAPIDAPI_HOST = "article-extractor-and-summarizer.p.rapidapi.com";
const SUMMARY_LENGTH = 3;

const jsonResponse = (body, status) =>
  Response.json(body, { status });

const isHttpUrl = (value) => {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
};

export default async (req) => {
  const articleUrl = new URL(req.url).searchParams.get("url");

  if (!articleUrl || !isHttpUrl(articleUrl)) {
    return jsonResponse({ error: "A valid article URL is required." }, 400);
  }

  const apiKey = process.env.RAPIDAPI_ARTICLE_KEY;

  if (!apiKey) {
    return jsonResponse({ error: "Summarizer is temporarily unavailable." }, 500);
  }

  try {
    const rapidApiUrl = new URL(`https://${RAPIDAPI_HOST}/summarize`);
    rapidApiUrl.searchParams.set("url", articleUrl);
    rapidApiUrl.searchParams.set("length", String(SUMMARY_LENGTH));

    const response = await fetch(rapidApiUrl, {
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": RAPIDAPI_HOST,
      },
    });

    const data = await response.json().catch(() => ({
      error: "Unable to parse summarizer response.",
    }));

    return jsonResponse(data, response.status);
  } catch {
    return jsonResponse({ error: "Unable to fetch article summary." }, 502);
  }
};

export const config = {
  path: "/api/summarize",
  method: "GET",
};
