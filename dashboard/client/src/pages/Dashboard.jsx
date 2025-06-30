import axios from "axios";
import {
  ArrowLeft,
  Calendar,
  Database,
  Target,
  Timer,
  TrendingUp,
  Zap,
} from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import PredictionForm from "../components/PredictionForm";

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/data")
      .then((response) => {
        // Parse numeric values as they come in as strings from CSV
        const parsedData = response.data.map((d) => ({
          ...d,
          "Test Suite Duration": parseFloat(d["Test Suite Duration"]),
          predicted_duration: parseFloat(d["predicted_duration"]),
          start_day_of_week: parseInt(d["start_day_of_week"], 10),
        }));
        setData(parsedData);
      })
      .catch((error) => {
        console.error("There was an error fetching the data!", error);
      });
  }, []);

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    if (data.length === 0)
      return { avgActual: 0, avgPredicted: 0, accuracy: 0, totalJobs: 0 };

    const avgActual =
      data.reduce((sum, d) => sum + d["Test Suite Duration"], 0) / data.length;
    const avgPredicted =
      data.reduce((sum, d) => sum + d.predicted_duration, 0) / data.length;
    const accuracy =
      (data.reduce((sum, d) => {
        const error =
          Math.abs(d["Test Suite Duration"] - d.predicted_duration) /
          d["Test Suite Duration"];
        return sum + (1 - error);
      }, 0) /
        data.length) *
      100;

    return {
      avgActual: Math.round(avgActual),
      avgPredicted: Math.round(avgPredicted),
      accuracy: Math.round(accuracy),
      totalJobs: data.length,
    };
  }, [data]);

  // Memoize the processed data for the bar chart to avoid recalculation on every render
  const weeklyChartData = useMemo(() => {
    if (data.length === 0) return [];

    const dayMap = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const weeklySummary = {};

    data.forEach((d) => {
      const day = d.start_day_of_week;
      if (!weeklySummary[day]) {
        weeklySummary[day] = {
          totalActual: 0,
          totalPredicted: 0,
          count: 0,
        };
      }
      weeklySummary[day].totalActual += d["Test Suite Duration"];
      weeklySummary[day].totalPredicted += d.predicted_duration;
      weeklySummary[day].count++;
    });

    return Object.keys(weeklySummary).map((day) => ({
      name: dayMap[day],
      "Avg Actual Duration":
        weeklySummary[day].totalActual / weeklySummary[day].count,
      "Avg Predicted Duration":
        weeklySummary[day].totalPredicted / weeklySummary[day].count,
    }));
  }, [data]);

  // Memoize the data for the scatter plot
  const scatterPlotData = useMemo(
    () =>
      data
        .map((d) => ({
          x: d["Test Suite Duration"],
          y: d.predicted_duration,
        }))
        .filter((d) => d.x < 1000 && d.y < 1000), // Filter outliers for better visualization
    [data]
  );

  const StatCard = ({
    title,
    value,
    subtitle,
    color = "blue",
    trend,
  }) => (
    <div className="group bg-white/70 backdrop-blur-sm rounded-2xl border border-white/50 p-6 hover:bg-white/90 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-blue-200/50">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-3">
            <p className="text-sm font-semibold text-gray-600 tracking-wide uppercase">
              {title}
            </p>
            {trend && (
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  trend.type === "up"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {trend.value}
              </div>
            )}
          </div>
          <p className="text-4xl font-bold text-gray-900 mb-2 group-hover:text-blue-800 transition-colors duration-300">
            {value}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500 font-medium">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Modern Header */}
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate("/")}
                className="group p-3 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                <ArrowLeft className="w-5 h-5 text-white group-hover:transform group-hover:-translate-x-1 transition-transform duration-200" />
              </button>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-blue-800 bg-clip-text text-transparent">
                  DevOps Pipeline Intelligence
                </h1>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Hero Section with Prediction Form */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-indigo-600/10 rounded-3xl"></div>
          <div className="relative">
            <PredictionForm />
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard
            title="Pipeline Jobs"
            value={summaryStats.totalJobs.toLocaleString()}
            subtitle="Total executions analyzed"
            color="blue"
            trend={{ type: "up", value: "+12%" }}
          />
          <StatCard
            title="Actual Duration"
            value={`${summaryStats.avgActual}s`}
            subtitle="Average execution time"
            color="emerald"
            trend={{ type: "down", value: "-5%" }}
          />
          <StatCard
            title="AI Prediction"
            value={`${summaryStats.avgPredicted}s`}
            subtitle="ML model forecast"
            color="violet"
            trend={{ type: "up", value: "+2%" }}
          />
          <StatCard
            title="Model Accuracy"
            value={`${summaryStats.accuracy}%`}
            subtitle="Prediction precision"
            color="orange"
            trend={{ type: "up", value: "+8%" }}
          />
        </div>

        {/* Analytics Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weekly Trends Chart */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl border border-white/50 p-8 hover:bg-white/90 hover:shadow-2xl transition-all duration-500">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Weekly Performance Insights
                </h2>
                <p className="text-gray-600 font-medium">
                  Duration patterns across weekdays
                </p>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
                <Calendar className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={weeklyChartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                barCategoryGap="20%"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="name"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <YAxis
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="Avg Actual Duration"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  name="Actual Duration"
                />
                <Bar
                  dataKey="Avg Predicted Duration"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  name="Predicted Duration"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Model Accuracy Analysis
                </h2>
                <p className="text-gray-600 mt-1">
                  Actual vs predicted duration correlation
                </p>
              </div>
              <div className="p-3 bg-violet-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-violet-600" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <ScatterChart
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid stroke="#f1f5f9" strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  dataKey="x"
                  name="Actual Duration"
                  unit="s"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <YAxis
                  type="number"
                  dataKey="y"
                  name="Predicted Duration"
                  unit="s"
                  tick={{ fill: "#64748b", fontSize: 12 }}
                  axisLine={{ stroke: "#e2e8f0" }}
                />
                <ZAxis type="number" range={[60, 60]} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Legend />
                <Scatter
                  name="Pipeline Jobs"
                  data={scatterPlotData}
                  fill="#8b5cf6"
                  fillOpacity={0.7}
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
