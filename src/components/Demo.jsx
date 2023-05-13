import { useState, useEffect } from "react";
import { isWebUri } from "valid-url";
import { toast } from "react-toastify";

import { useLazyGetSummaryQuery } from "../services/article";
import { copy, linkIcon, loader, tick } from "../assets";
import {
  MAX_ARTICLE_HISTORY,
  INVALID_URL_MSG,
  ARTICLE_SUMMARISED_MSG,
  LOCALSTORAGE_ARTICLES_KEY,
} from "../constants";

import "react-toastify/dist/ReactToastify.css";

const Demo = () => {
  const [article, setArticle] = useState({
    url: "",
    summary: "",
  });
  const [allArticles, setAllArticles] = useState([]);
  const [copied, setCopied] = useState("");

  const [getSummary, { error, isFetching }] = useLazyGetSummaryQuery();

  useEffect(() => {
    const articlesFromLocalStorage = JSON.parse(
      localStorage.getItem(LOCALSTORAGE_ARTICLES_KEY)
    );

    if (articlesFromLocalStorage) {
      setAllArticles(articlesFromLocalStorage);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isFetching) return;

    if (!isWebUri(article.url)) {
      toast.error(INVALID_URL_MSG);
      return;
    }

    const { data } = await getSummary({ articleUrl: article.url });

    if (!data?.summary) return;

    const newArticle = { ...article, summary: data.summary };

    let updatedAllArticles = [newArticle, ...allArticles];

    setArticle(newArticle);

    // remove last element if articles are more than 4
    if (updatedAllArticles.length > MAX_ARTICLE_HISTORY) {
      updatedAllArticles.pop();
    }

    setAllArticles(updatedAllArticles);

    localStorage.setItem(
      LOCALSTORAGE_ARTICLES_KEY,
      JSON.stringify(updatedAllArticles)
    );

    toast.success(ARTICLE_SUMMARISED_MSG);
  };

  const handleCopy = (copyUrl) => {
    setCopied(copyUrl);
    navigator.clipboard.writeText(copyUrl);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <section className="mt-16 w-full max-w-xl">
      {/* Search */}
      <div className="flex flex-col w-full gap-2">
        <form
          className="relative flex justify-center items-center"
          onSubmit={handleSubmit}
          autoCapitalize="off"
          autoComplete="off"
          noValidate
        >
          <img
            src={linkIcon}
            alt="Link"
            className="absolute left-0 my-2 ml-3 w-5"
            draggable="false"
            loading="lazy"
          />

          <input
            type="url"
            placeholder="Paste the Article Link"
            title="Paste the Article Link"
            value={article.url}
            onChange={(e) => setArticle({ ...article, url: e.target.value })}
            className="url_input peer"
            required
          />

          {!isFetching && (
            <button
              type="submit"
              className="submit_btn peer-focus:border-gray-700 peer-focus:text-gray-700"
              title="Summarize Article"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="12"
                height="12"
                viewBox="0 0 20 20"
              >
                <path
                  fill="currentColor"
                  d="M19.3 0a.7.7 0 0 1 .7.7v8.278a6.7 6.7 0 0 1-6.699 6.698l-10.996-.001l3.131 3.13a.7.7 0 0 1-.99.99l-4.24-4.241a.7.7 0 0 1 0-.99l4.241-4.241a.7.7 0 1 1 .99.99l-2.965 2.963h10.83A5.299 5.299 0 0 0 18.6 8.978V.7a.7.7 0 0 1 .7-.7Z"
                />
              </svg>
            </button>
          )}
        </form>

        {/* Browse URL History */}
        {!isFetching && (
          <div className="flex flex-col gap-1 max-h-60 overflow-y-auto">
            {allArticles.map((article, i) => (
              <div className="link_card" key={`link-${i}`}>
                <button
                  type="button"
                  className="copy_btn"
                  onClick={() => handleCopy(article.url)}
                >
                  <img
                    src={copied === article.url ? tick : copy}
                    alt={
                      copied === article.url ? "Copied" : "Copy to Clipboard"
                    }
                    title={
                      copied === article.url ? "Copied" : "Copy to Clipboard"
                    }
                    className="w-[40%] h-[40%] object-contain"
                    loading="lazy"
                  />
                </button>

                <button
                  className="hover:underline flex flex-1 font-satoshi text-orange-500 font-medium text-sm truncate cursor-pointer"
                  onClick={() => setArticle(article)}
                  title={article.url}
                >
                  {article.url}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Display Results */}
      <div className="my-10 max-w-full flex justify-center items-center">
        {isFetching ? (
          <img
            src={loader}
            alt="Loading..."
            className="w-20 h-20 object-contain"
            loading="lazy"
          />
        ) : error ? (
          <p className="font-inter font-bold text-black text-center">
            Well, that wasn't supposed to happen...
            <br />
            <span className="font-satoshi font-normal text-gray-700">
              {error?.data?.error}
            </span>
          </p>
        ) : (
          article.summary && (
            <article className="flex flex-col gap-3">
              <h2 className="font-satoshi font-bold text-gray-600 text-xl">
                Article <span className="orange_gradient">Summary</span>
              </h2>

              <div className="summary_box">
                <p className="font-inter font-medium text-sm text-gray-700">
                  {article.summary}
                </p>
              </div>
            </article>
          )
        )}
      </div>
    </section>
  );
};

export default Demo;
