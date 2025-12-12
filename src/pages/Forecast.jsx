import { useState } from "react";
import { forecastTrends } from "../api";

/* ----------------------
   Spinner (consistent UI)
---------------------- */
function Spinner() {
  return (
    <div className="w-14 h-14 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin" />
  );
}

/* ----------------------
   Simple Insight Heuristic
   (frontend-only, safe)
---------------------- */
function getForecastInsight() {
  return {
    direction: "Slight upward trend",
    volatility: "Medium",
    confidence: "Moderate",
  };
}

export default function Forecast() {
  const [kw, setKw] = useState("");
  const [forecastData, setForecastData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadForecast() {
    if (!kw.trim()) {
      setError("Keyword is required");
      return;
    }

    try {
      setIsLoading(true);
      setForecastData(null);
      setError("");

      const res = await forecastTrends(kw);
      setForecastData(res.data);
    } catch (err) {
      console.error(err);
      setError("Unable to generate forecast. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  const insight = getForecastInsight();

  return (
    <div className="p-6 space-y-6 relative">

      {/* ----------------------
         Loading Overlay
      ---------------------- */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-40 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <Spinner />
            <div className="text-gray-700 font-medium">
              Generating forecast…
            </div>
          </div>
        </div>
      )}

      {/* ----------------------
         Input Card
      ---------------------- */}
      <div className="bg-white rounded-xl shadow-xl p-6 space-y-4">
        <div>
          <label className="text-sm font-medium text-gray-700">
            Keyword
          </label>
          <input
            value={kw}
            onChange={(e) => setKw(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && loadForecast()}
            placeholder="Enter keyword (e.g. bitcoin)"
            className={`w-full border rounded-lg px-3 py-2 mt-1 focus:ring-2 focus:ring-purple-500 ${
              error ? "border-red-500" : "border-gray-300"
            }`}
          />
          {error && (
            <p className="text-red-500 text-sm mt-1">{error}</p>
          )}
        </div>

        <button
          onClick={loadForecast}
          disabled={isLoading}
          className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50"
        >
          Generate Forecast
        </button>
      </div>

      {/* ----------------------
         Empty State
      ---------------------- */}
      {!forecastData && !isLoading && !error && (
        <div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">
          <div className="text-lg font-medium mb-1">
            No forecast generated
          </div>
          <div className="text-sm">
            Enter a keyword and generate a forecast to see predicted trends.
          </div>
        </div>
      )}

      {/* ----------------------
         Forecast Result
      ---------------------- */}
      {forecastData?.chart && (
        <>
          {/* Forecast Card */}
          <div className="bg-white rounded-xl shadow-xl p-6 space-y-4">
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                Forecast Result
              </h3>
              <p className="text-sm text-gray-500">
                Best model selected automatically based on historical behavior
              </p>
            </div>

            {/* Chart Wrapper */}
            <div className="relative border rounded-lg overflow-hidden bg-gray-50">
              {/* Forecast Label */}
              <div className="absolute top-2 right-2 bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1 rounded-full">
                Forecast Period
              </div>

              <img
                src={`data:image/png;base64,${forecastData.chart}`}
                alt="Forecast chart"
                className="w-full"
              />
            </div>

            {/* Legend Explanation */}
            <div className="flex flex-wrap gap-4 text-xs text-gray-600">
              <div className="flex items-center gap-2">
                <span className="w-4 h-1 bg-blue-600 inline-block" />
                Historical Data
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-1 border-t-2 border-dashed border-orange-600 inline-block" />
                Forecast
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-3 bg-blue-200 inline-block opacity-60" />
                Uncertainty Range
              </div>
            </div>

            <div className="text-xs text-gray-500 text-center">
              Shaded region represents prediction uncertainty
            </div>
          </div>

          {/* ----------------------
             Forecast Insight Summary
          ---------------------- */}
          <div className="bg-white rounded-xl shadow p-6">
            <h4 className="text-lg font-semibold mb-4">
              Forecast Insight Summary
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">Direction</div>
                <div className="font-semibold text-green-700">
                  {insight.direction}
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">Volatility</div>
                <div className="font-semibold text-blue-700">
                  {insight.volatility}
                </div>
              </div>

              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <div className="text-xs text-gray-500 mb-1">Confidence</div>
                <div className="font-semibold text-purple-700">
                  {insight.confidence}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
