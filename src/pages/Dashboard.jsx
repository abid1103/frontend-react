import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  BarChart3, 
  MessageSquare, 
  TrendingUp,
  Search,
  ArrowRight,
} from "lucide-react";

export default function Dashboard() {
  const [recentAnalyses, setRecentAnalyses] = useState([]);

  useEffect(() => {
    // Load real data later — empty state for now
    setRecentAnalyses([]);
  }, []);

  const analyticsModules = [
    {
      title: "Trend Analysis",
      description: "Track search interest patterns and market direction",
      icon: TrendingUp,
      path: "/trends",
    },
    {
      title: "Sentiment Analysis",
      description: "Evaluate public emotions and opinions across sources",
      icon: MessageSquare,
      path: "/sentiment",
    },
    {
      title: "Market Forecast",
      description: "Predict future behavior using AI-based forecasting",
      icon: BarChart3,
      path: "/forecast",
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-8 py-14">

        {/* Welcome Section */}
        <div className="text-center mb-14">
          <h1 className="text-4xl font-light text-gray-900 mb-3">
            Welcome to BrandInsight Analytics
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Your centralized platform for market intelligence, trend monitoring, 
            sentiment evaluation, and AI-driven forecasting.
          </p>
        </div>

        {/* Analytics Modules */}
        <div className="mb-14">
          <h2 className="text-2xl font-light text-gray-900 mb-8">Analytics Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {analyticsModules.map((module, index) => (
              <Link
                key={index}
                to={module.path}
                className="group border border-gray-200 rounded-lg p-6 
                hover:border-blue-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                    <module.icon className="h-6 w-6 text-gray-600 group-hover:text-blue-600" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 
                  transform group-hover:translate-x-1 transition-transform" />
                </div>

                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {module.title}
                </h3>

                <p className="text-gray-600 leading-relaxed">
                  {module.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
