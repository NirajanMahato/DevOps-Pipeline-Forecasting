import axios from "axios";
import { Activity, BarChart3, Clock, TrendingUp } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { FaArrowLeft } from "react-icons/fa";
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

const Dashboard = () => {
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

  const StatCard = ({ title, value, icon: Icon, subtitle, color = "blue" }) => (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        <div className={`p-4 bg-${color}-50 rounded-xl`}>
          <Icon className={`w-7 h-7 text-${color}-600`} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="p-2 bg-blue-600 rounded-xl">
              <FaArrowLeft
                onClick={() => navigate("/")}
                className="w-6 h-6 text-white"
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                DevOps Pipeline Performance
              </h1>
              <p className="text-gray-600">
                Monitor and analyze your CI/CD pipeline efficiency
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Jobs"
            value={summaryStats.totalJobs.toLocaleString()}
            icon={BarChart3}
            subtitle="Pipeline executions"
            color="blue"
          />
          <StatCard
            title="Avg Actual Duration"
            value={`${summaryStats.avgActual}s`}
            icon={Clock}
            subtitle="Average execution time"
            color="amber"
          />
          <StatCard
            title="Avg Predicted Duration"
            value={`${summaryStats.avgPredicted}s`}
            icon={TrendingUp}
            subtitle="ML model prediction"
            color="violet"
          />
          <StatCard
            title="Model Accuracy"
            value={`${summaryStats.accuracy}%`}
            icon={Activity}
            subtitle="Prediction accuracy"
            color="orange"
          />
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Weekly Performance Trends
                </h2>
                <p className="text-gray-600 mt-1">
                  Average job duration comparison by day of week
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
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
