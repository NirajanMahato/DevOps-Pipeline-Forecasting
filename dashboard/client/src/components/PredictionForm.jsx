import axios from "axios";
import { AlertCircle, CheckCircle, Clock } from "lucide-react";
import React, { useEffect, useState } from "react";

import {
  Brain,
  CalendarDays,
  GitBranch,
  Target,
  TestTube,
  Timer,
  Zap,
} from "lucide-react";

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    is_pull_request: false,
    start_time: new Date().toISOString().slice(0, 16),
    test_suite: "test/unit",
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [testSuites, setTestSuites] = useState([]);

  useEffect(() => {
    const fetchTestSuites = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5001/api/test-suites"
        );
        setTestSuites(response.data.test_suites);
        if (response.data.default) {
          setFormData((prev) => ({
            ...prev,
            test_suite: response.data.default,
          }));
        }
      } catch (err) {
        console.error("Failed to fetch test suites:", err);
        setTestSuites(["test/unit", "test/integration", "test/e2e"]);
      }
    };
    fetchTestSuites();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPrediction(null);

    try {
      const response = await axios.post(
        "http://localhost:5001/api/predict",
        formData
      );
      setPrediction(response.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to get prediction");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-white/90 backdrop-blur-lg rounded-3xl border border-white/50 p-8 shadow-lg">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-200/20 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-indigo-200/20 to-transparent rounded-full blur-2xl"></div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-lg">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 bg-clip-text text-transparent">
                Pipeline Predictor
              </h2>
              <p className="text-gray-600 mt-1 font-medium">
                Get instant ML-powered predictions for your CI/CD pipeline
                execution time
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                <CalendarDays className="w-4 h-4 text-blue-600" />
                <span>Pipeline Start Time</span>
              </label>
              <input
                type="datetime-local"
                name="start_time"
                value={formData.start_time}
                onChange={handleInputChange}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-900 font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-3">
                <TestTube className="w-4 h-4 text-green-600" />
                <span>Test Suite Type</span>
              </label>
              <select
                name="test_suite"
                value={formData.test_suite}
                onChange={handleInputChange}
                className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-green-500/20 focus:border-green-500 transition-all duration-300 bg-white/80 backdrop-blur-sm text-gray-900 font-medium"
              >
                {testSuites.map((suite) => (
                  <option key={suite} value={suite}>
                    {suite}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-3 p-4 bg-white/60 rounded-2xl border-2 border-gray-200 hover:border-blue-300 transition-all duration-300">
                <GitBranch className="w-5 h-5 text-indigo-600" />
                <input
                  type="checkbox"
                  name="is_pull_request"
                  checked={formData.is_pull_request}
                  onChange={handleInputChange}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded-lg"
                />
                <label className="text-sm font-semibold text-gray-700">
                  Pull Request Build
                </label>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-4 px-8 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 focus:ring-4 focus:ring-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.02] transform"
          >
            <div className="flex items-center justify-center space-x-3">
              {loading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Analyzing Pipeline...</span>
                </>
              ) : (
                <>
                  <Zap className="w-6 h-6" />
                  <span>Predict Duration</span>
                </>
              )}
            </div>
          </button>
        </form>

        {/* Enhanced Prediction Result */}
        {prediction && (
          <div className="mt-8 p-8 bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 border-2 border-green-200 rounded-3xl shadow-lg">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-green-500 rounded-2xl mr-4">
                <CheckCircle className="w-7 h-7 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-800">
                  Prediction Complete
                </h3>
                <p className="text-green-600 font-medium">
                  AI analysis successful
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-green-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center mb-3">
                  <Timer className="w-6 h-6 text-green-600 mr-3" />
                  <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                    Predicted Duration
                  </span>
                </div>
                <p className="text-4xl font-bold text-green-700 mb-2">
                  {prediction.prediction_minutes < 0.1
                    ? `${prediction.prediction_seconds.toFixed(1)}s`
                    : `${prediction.prediction_minutes.toFixed(1)} min`}
                </p>
                <p className="text-lg text-gray-600 font-medium">
                  {prediction.prediction_minutes < 0.1
                    ? `(${(prediction.prediction_minutes * 60).toFixed(
                        1
                      )} seconds)`
                    : `(${prediction.prediction_seconds.toFixed(0)} seconds)`}
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-blue-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center mb-3">
                  <Target className="w-6 h-6 text-blue-600 mr-3" />
                  <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">
                    Confidence Level
                  </span>
                </div>
                <p className="text-4xl font-bold text-blue-700 mb-2 capitalize">
                  {prediction.confidence}
                </p>
                <p className="text-lg text-gray-600 font-medium">
                  Model precision
                </p>
              </div>
            </div>

            <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-gray-200">
              <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-indigo-600" />
                Analysis Parameters
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-white/80 rounded-xl">
                  <GitBranch className="w-5 h-5 text-indigo-600" />
                  <div>
                    <span className="text-sm text-gray-500">Build Type:</span>
                    <span className="ml-2 font-bold text-gray-800">
                      {prediction.input_features["Build Pull Request"]
                        ? "Pull Request"
                        : "Regular"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/80 rounded-xl">
                  <TestTube className="w-5 h-5 text-green-600" />
                  <div>
                    <span className="text-sm text-gray-500">Test Suite:</span>
                    <span className="ml-2 font-bold text-gray-800">
                      {prediction.input_features["Test Suite"]}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/80 rounded-xl">
                  <Clock className="w-5 h-5 text-orange-600" />
                  <div>
                    <span className="text-sm text-gray-500">Time:</span>
                    <span className="ml-2 font-bold text-gray-800">
                      {new Date(
                        prediction.input_features.start_time || new Date()
                      ).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-white/80 rounded-xl">
                  <CalendarDays className="w-5 h-5 text-purple-600" />
                  <div>
                    <span className="text-sm text-gray-500">Day:</span>
                    <span className="ml-2 font-bold text-gray-800">
                      {
                        ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][
                          prediction.input_features.start_day_of_week
                        ]
                      }
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-8 p-6 bg-red-50 border-2 border-red-200 rounded-2xl">
            <div className="flex items-center">
              <AlertCircle className="w-6 h-6 text-red-600 mr-3" />
              <div>
                <h3 className="text-lg font-bold text-red-800">
                  Prediction Error
                </h3>
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PredictionForm;
