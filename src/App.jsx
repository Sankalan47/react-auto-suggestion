import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

const FAILURE_COUNT = 10;
const LATENCY = 200;

function getRandomBool(n) {
  const threshold = 1000;
  if (n > threshold) n = threshold;
  return Math.floor(Math.random() * threshold) % n === 0;
}

function getSuggestions(text) {
  var pre = "Something Related to ";
  var post = " pro max";
  var results = [];
  if (getRandomBool(2)) {
    results.push(pre + text);
  }
  if (getRandomBool(2)) {
    results.push(text);
  }
  if (getRandomBool(2)) {
    results.push(text + post);
  }
  if (getRandomBool(2)) {
    results.push(pre + text + post);
  }
  return new Promise((resolve, reject) => {
    const randomTimeout = Math.random() * LATENCY;
    setTimeout(() => {
      if (getRandomBool(FAILURE_COUNT)) {
        reject();
      } else {
        resolve(results);
      }
    }, randomTimeout);
  });
}

function App() {
  const inputRef = useRef();
  const suggestionAreaRef = useRef();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestionList, setSuggestionList] = useState([]);
  const [showSuggestionArea, setShowSuggestionArea] = useState(false);

  const handleInputChange = (e) => {
    const { value } = e.target;
    setSearchQuery(value);
    fetchApiCall(value);
  };

  const fetchApiCall = async (query) => {
    try {
      let response = await getSuggestions(query);
      setSuggestionList(response);
    } catch (error) {
      setSuggestionList([]);
      console.error("Error while fetching suggestions", error);
    }
  };

  useEffect(() => {
    window.addEventListener("click", (e) => {
      if (e.target !== inputRef.current && e.target !== suggestionAreaRef.current) {
        setShowSuggestionArea(false);
      }
    });

    return () => {
      window.removeEventListener("click", () => {});
    };
  });

  return (
    <main className="mt-5 mx-auto max-w-2xl">
      <div className="hero-content text-center">
        <h1 className="text-4xl font-bold">Auto Suggestion</h1>
      </div>

      <label className="input input-bordered flex items-center gap-2">
        <input
          ref={inputRef}
          type="text"
          className="grow"
          placeholder="Search"
          onFocus={() => setShowSuggestionArea(true)}
          onChange={handleInputChange}
          value={searchQuery}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          className="w-4 h-4 opacity-70"
        >
          <path
            fillRule="evenodd"
            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
            clipRule="evenodd"
          />
        </svg>
      </label>

      {showSuggestionArea && (
        <>
          <div
            id="suggestion-area"
            className="bg-base-200 min-h-56 max-h-80 mt-5 rounded-lg p-4 overflow-y-auto"
            ref={suggestionAreaRef}
          >
            {suggestionList &&
              suggestionList.length > 0 &&
              suggestionList.map((suggestion) => (
                <div
                  key={suggestion}
                  onClick={() => {
                    setSearchQuery(suggestion);
                  }}
                >
                  <p className="text-base font-semibold text-gray-600">{suggestion}</p>
                  <div className="divider"></div>
                </div>
              ))}
          </div>
        </>
      )}
    </main>
  );
}

export default App;
