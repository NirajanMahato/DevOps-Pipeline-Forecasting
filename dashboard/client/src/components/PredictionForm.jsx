import axios from "axios";
import { AlertCircle, CheckCircle, Clock, TrendingUp } from "lucide-react";
import React, { useState } from "react";

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    is_pull_request: false,
    start_time: new Date().toISOString().slice(0, 16),
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    <div className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Pipeline Duration Predictor
          </h2>
          <p className="text-gray-600 mt-1">
            Get ML-powered predictions for your CI/CD pipeline execution time
          </p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg">
          <TrendingUp className="w-6 h-6 text-green-600" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Time
            </label>
            <input
              type="datetime-local"
              name="start_time"
              value={formData.start_time}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="flex items-center justify-center">
            <div className="flex items-center">
              <input
                type="checkbox"
                name="is_pull_request"
                checked={formData.is_pull_request}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-sm text-gray-700">
                This is a Pull Request build
              </label>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {loading ? "Getting Prediction..." : "Predict Duration"}
        </button>
      </form>

      {/* Prediction Result */}
      {prediction && (
        <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
            <h3 className="text-lg font-semibold text-green-800">
              Prediction Result
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <div className="flex items-center mb-2">
                <Clock className="w-5 h-5 text-green-600 mr-2" />
                <span className="text-sm font-medium text-gray-600">
                  Duration
                </span>
              </div>
              <p className="text-2xl font-bold text-green-700">
                {prediction.prediction_minutes.toFixed(1)} minutes
              </p>
              <p className="text-sm text-gray-500">
                ({prediction.prediction_seconds.toFixed(0)} seconds)
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-green-200">
              <div className="flex items-center mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                <span className="text-sm font-medium text-gray-600">
                  Confidence
                </span>
              </div>
              <p className="text-2xl font-bold text-blue-700 capitalize">
                {prediction.confidence}
              </p>
              <p className="text-sm text-gray-500">Model confidence</p>
            </div>
          </div>

          <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Input Features:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
              <div>
                <span className="text-gray-500">Pull Request:</span>
                <span className="ml-1 font-medium">
                  {prediction.input_features["Build Pull Request"]
                    ? "Yes"
                    : "No"}
                </span>
              </div>
              <div>
                <span className="text-gray-500">Hour:</span>
                <span className="ml-1 font-medium">
                  {prediction.input_features["start_hour_of_day"]}:00
                </span>
              </div>
              <div>
                <span className="text-gray-500">Day:</span>
                <span className="ml-1 font-medium">
                  {
                    ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][
                      prediction.input_features["start_day_of_week"]
                    ]
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-red-800 font-medium">Error: {error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
