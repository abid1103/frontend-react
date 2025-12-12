import { useState } from "react";
import { fetchReddit, analyzeSentiment, getSentimentInsights } from "../api";
import {
  PieChart, Pie, Cell, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// ----------------------
// Spinner Component
// ----------------------
function Spinner() {
  return (
    <div className="w-14 h-14 border-4 border-blue-300 border-t-blue-600 rounded-full animate-spin" />
  );
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
const SENTIMENT_COLORS = {
  positive: '#10b981',
  negative: '#ef4444'
};

export default function Sentiment() {
  const [kw, setKw] = useState("");
  const [sentiment, setSentiment] = useState([]);
  const [detailedData, setDetailedData] = useState([]);
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function runAnalysis() {
    if (!kw.trim()) return;

    try {
      setIsLoading(true);

      // fetch posts and analyze sentiment
      await fetchReddit(kw);
      await analyzeSentiment();
      const res = await getSentimentInsights(kw);

      const allPosts = res.data.detailedSentiment || [];
      const filteredPosts = allPosts.filter(d => d.sentiment !== 'neutral');

      // Count positive and negative for charts
      const sentimentSummary = [
        { sentiment: 'positive', count: filteredPosts.filter(d => d.sentiment === 'positive').length },
        { sentiment: 'negative', count: filteredPosts.filter(d => d.sentiment === 'negative').length }
      ];

      setSentiment(sentimentSummary);
      setDetailedData(filteredPosts);

    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  const getSentimentOverview = () => {
    if (!sentiment.length) return null;

    const positive = sentiment.find(s => s.sentiment === 'positive')?.count || 0;
    const negative = sentiment.find(s => s.sentiment === 'negative')?.count || 0;
    const total = positive + negative;

    const positivePercent = total ? ((positive / total) * 100).toFixed(1) : 0;
    const negativePercent = total ? ((negative / total) * 100).toFixed(1) : 0;

    return {
      total,
      positivePercent,
      negativePercent,
      overallSentiment: positive >= negative ? "positive" : "negative",
      positiveCount: positive,
      negativeCount: negative
    };
  };

  const insights = getSentimentOverview();

  return (
    <div className="p-6 space-y-6 relative">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-40 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3">
            <Spinner />
            <div className="text-gray-700 font-medium">Processing…</div>
          </div>
        </div>
      )}

      {/* Control Panel */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Analyze Sentiment For
            </label>
            <input
              value={kw}
              onChange={(e) => setKw(e.target.value)}
              placeholder="Enter topic or brand name"
              className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-green-500"
            />
          </div>
          <button
            onClick={runAnalysis}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            Analyze Sentiment
          </button>
        </div>
        <div className="text-sm text-gray-600 mt-2">{msg}</div>
      </div>

      {/* Sentiment Overview */}
      {insights && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Overall Sentiment Card */}
          <div className={`bg-white rounded-xl shadow-lg p-6 border-l-4 ${
            insights.overallSentiment === 'positive' ? 'border-green-500' : 'border-red-500'
          }`}>
            <h3 className="font-semibold text-lg mb-4">Overall Sentiment</h3>
            <div className="text-center">
              <div className={`text-3xl font-bold ${
                insights.overallSentiment === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {insights.overallSentiment.toUpperCase()}
              </div>
              <div className="text-gray-600 mt-2">
                Based on {insights.total} analyzed posts
              </div>
            </div>
          </div>

          {/* Sentiment Distribution */}
          <div className="bg-white rounded-xl shadow-lg p-6 lg:col-span-2">
            <h3 className="font-semibold text-lg mb-4">Sentiment Distribution</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{insights.positivePercent}%</div>
                <div className="text-sm text-green-700">Positive</div>
                <div className="text-xs text-green-600">{insights.positiveCount} posts</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{insights.negativePercent}%</div>
                <div className="text-sm text-red-700">Negative</div>
                <div className="text-xs text-red-600">{insights.negativeCount} posts</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4">Sentiment Breakdown</h3>
          {sentiment.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={sentiment}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="count"
                  label={({ sentiment, percent }) => `${sentiment} ${(percent * 100).toFixed(0)}%`}
                >
                  {sentiment.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={SENTIMENT_COLORS[entry.sentiment]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              Run analysis to see sentiment breakdown
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4">Sentiment Intensity</h3>
          {sentiment.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={sentiment}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="sentiment" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {sentiment.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={SENTIMENT_COLORS[entry.sentiment]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-300 flex items-center justify-center text-gray-500">
              No sentiment data available
            </div>
          )}
        </div>
      </div>

      {/* Detailed Results */}
      {detailedData.length > 0 && (
        <div className="bg-white shadow rounded-xl p-6">
          <h3 className="font-semibold text-lg mb-4">Detailed Analysis</h3>
          <div className="space-y-3">
            {detailedData.slice(0, 10).map((item, idx) => (
              <div key={idx} className="flex justify-between items-center p-3 border-b">
                <div className="flex-1">
                  <p className="text-sm">{item.text}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  item.sentiment === 'positive'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {item.sentiment}
                </span>
                <span className="text-sm text-gray-500 ml-4">
                  {item.score?.compound !== undefined && `(${Math.round(item.score.compound * 100)}% confidence)`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
