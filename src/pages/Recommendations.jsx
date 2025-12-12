// src/pages/Recommendations.jsx
import { useState } from "react";
import axios from "axios";
import { getRecommendationsBatch, listRecommendations, downloadRecommendationsCSV } from "../api";

function Pill({ children, className = "" }) {
  return <span className={`px-2 py-1 rounded-full text-xs font-medium ${className}`}>{children}</span>;
}

export default function Recommendations() {
  const [input, setInput] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");

  const addKeywordsFromInput = () => {
    const parts = input.split(",").map(s => s.trim()).filter(Boolean);
    setKeywords(prev => {
      const uniq = [...new Set([...prev, ...parts])];
      return uniq.slice(0, 50);
    });
    setInput("");
  };

  const runBatch = async () => {
    if (!keywords.length) {
      setError("Add at least one keyword");
      return;
    }
    setError("");
    setLoading(true);
    setResults([]);
    try {
      const res = await getRecommendationsBatch(keywords);
      setResults(res.data || []);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.detail || err.message);
    } finally {
      setLoading(false);
    }
  };

  const removeKeyword = (kw) => setKeywords(prev => prev.filter(k => k !== kw));

  const downloadCSV = async (kw) => {
    try {
      const resp = await downloadRecommendationsCSV(kw || "");
      const url = window.URL.createObjectURL(new Blob([resp.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `recommendations_${kw || "all"}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) {
      console.error("CSV download failed", e);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="font-semibold text-lg mb-4">Batch Recommendations (Trend + Forecast + Sentiment)</h3>
        <div className="flex gap-3">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addKeywordsFromInput()}
            placeholder="Enter keywords separated by commas (e.g., AI, Bitcoin, Tesla)"
            className="flex-1 border rounded-lg px-3 py-2"
          />
          <button onClick={addKeywordsFromInput} className="bg-blue-600 text-white px-4 py-2 rounded-lg">Add</button>
          <button onClick={runBatch} disabled={loading} className="bg-purple-600 text-white px-4 py-2 rounded-lg">
            {loading ? "Processing…" : "Run Batch"}
          </button>
        </div>
        {error && <div className="mt-3 text-sm text-red-600">{error}</div>}
        <div className="mt-4 flex flex-wrap gap-2">
          {keywords.map(kw => (
            <div key={kw} className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded">
              <span className="font-medium">{kw}</span>
              <button onClick={() => removeKeyword(kw)} className="text-red-500">x</button>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold">Recommendations</h4>
          <div className="flex gap-2">
            <button onClick={() => downloadCSV("")} className="text-sm px-3 py-1 border rounded">Download All CSV</button>
          </div>
        </div>

        {!results.length && !loading && <div className="text-gray-500">No recommendations yet. Run a batch to see results.</div>}
        {loading && <div className="text-gray-600">Processing keywords, please wait…</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {results.map((r) => (
            <div key={r.keyword} className="border rounded-lg p-4 hover:shadow-md transition">
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="font-semibold text-lg">{r.keyword}</h5>
                  <div className="text-sm text-gray-500">Score: <strong>{(r.score*100).toFixed(1)}%</strong></div>
                </div>
                <div className="text-right">
                  <Pill className={`${
                    r.category === "Strong Opportunity" ? "bg-green-100 text-green-800" :
                    r.category === "Opportunity" ? "bg-emerald-100 text-emerald-800" :
                    r.category === "Monitor" ? "bg-yellow-100 text-yellow-800" :
                    r.category === "Reduce" ? "bg-orange-100 text-orange-800" :
                    "bg-red-100 text-red-800"
                  }`}>{r.category}</Pill>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-700">
                <div><strong>Action:</strong> {r.action}</div>
                <div className="mt-2">
                  <strong>Reasons:</strong>
                  <ul className="list-disc ml-5 mt-1">
                    {r.reasons.map((rs, idx) => <li key={idx}>{rs}</li>)}
                  </ul>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <button onClick={() => setSelected(r)} className="px-3 py-1 bg-blue-600 text-white rounded">View Details</button>
                <button onClick={() => downloadCSV(r.keyword)} className="px-3 py-1 border rounded text-sm">Download CSV</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl p-6 overflow-auto max-h-[90vh]">
            <div className="flex items-start justify-between">
              <h4 className="font-semibold text-lg">{selected.keyword} — Details</h4>
              <button onClick={() => setSelected(null)} className="text-gray-600">Close</button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-medium">Trend Metrics</h5>
                <pre className="text-xs bg-gray-50 p-3 rounded mt-2">{JSON.stringify(selected.details.trend, null, 2)}</pre>
              </div>
              <div>
                <h5 className="font-medium">Forecast Metrics</h5>
                <pre className="text-xs bg-gray-50 p-3 rounded mt-2">{JSON.stringify(selected.details.forecast, null, 2)}</pre>
              </div>
            </div>

            <div className="mt-4">
              <h5 className="font-medium">Sentiment Summary</h5>
              <pre className="text-xs bg-gray-50 p-3 rounded mt-2">{JSON.stringify(selected.details.sentiment, null, 2)}</pre>
            </div>

            {selected.details.forecast_chart && (
              <div className="mt-4">
                <h5 className="font-medium mb-2">Forecast Chart</h5>
                <div className="flex justify-center">
                  <img src={`data:image/png;base64,${selected.details.forecast_chart}`} alt="Forecast Chart" className="rounded-lg shadow-md max-w-full" />
                </div>
              </div>
            )}

            <div className="mt-4">
              <h5 className="font-medium">Score Breakdown</h5>
              <pre className="text-xs bg-gray-50 p-3 rounded mt-2">{JSON.stringify(selected.details.score_breakdown, null, 2)}</pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
