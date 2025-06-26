# Machine Learning-Based Resource Utilization Forecasting for DevOps Pipelines

This project implements a machine learning system that predicts the duration of CI/CD pipeline jobs, enabling better resource allocation and scheduling in DevOps environments. The system includes a trained LightGBM model, a Flask API backend, and a React frontend dashboard.

## Project Overview

### What It Does

- **Analyzes CI/CD Pipeline Data**: Uses historical data from Ruby on Rails CI/CD pipelines
- **Predicts Job Duration**: Estimates how long pipeline jobs will take to run
- **Provides Real-time Forecasts**: Web interface for instant predictions
- **Visualizes Performance**: Shows trends and model accuracy

### Key Features

- **ML-Powered Predictions**: LightGBM model with 75%+ accuracy
- **Real-time API**: RESTful API for predictions
- **Interactive Dashboard**: React-based visualization
- **Context-Aware**: Different predictions for PR vs regular builds
- **Time-Based Analysis**: Varies by hour and day of week

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend│    │  Node.js Server │    │  Flask API      │
│   (Dashboard)   │◄──►│  (Proxy)        │◄──►│  (ML Model)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Components

1. **Frontend**: React dashboard with prediction form and visualizations
2. **Backend**: Node.js server that proxies requests to Flask API
3. **ML API**: Flask API serving the trained LightGBM model
4. **Model**: LightGBM model trained on CI/CD pipeline data

## Model Performance

- **Algorithm**: LightGBM Gradient Boosting
- **Features**: Build type, hour of day, day of week
- **Target**: Pipeline duration (log-transformed)
- **Accuracy**: R² ≈ 0.75
- **MAE**: ~12.7 seconds

### Prediction Ranges

- **Pull Request builds**: 30 seconds to 3 minutes
- **Regular builds**: 1 minute to 5 minutes
- **Business hours**: 20-50% longer
- **Weekends**: 10-30% shorter

## Quick Start

### Prerequisites

- Python 3.8+
- Node.js 16+
- npm or yarn

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/NirajanMahato/DevOps-Pipeline-Forecasting
cd DevOps-Pipeline-Forecasting
```

2. **Install Python dependencies**

```bash
cd dashboard/server
pip install -r requirements.txt
```

3. **Install Node.js dependencies**

```bash
npm install
```

4. **Install React dependencies**

```bash
cd ../client
npm install
```

### Running the Application

1. **Start the Flask API** (Terminal 1)

```bash
cd dashboard/server
python app.py
```

The API will run on `http://localhost:5000`

2. **Start the Node.js server** (Terminal 2)

```bash
cd dashboard/server
npm run dev || npm start
```

The server will run on `http://localhost:5001`

3. **Start the React frontend** (Terminal 3)

```bash
cd dashboard/client
npm run dev
```

The frontend will run on `http://localhost:4002`

4. **Access the application**

- Open `http://localhost:4002` in your browser
- Click "View Dashboard" to access the prediction interface

##  Project Structure 📁

```
DevOps-Pipeline-Forecasting/
├── dashboard/
│   ├── client/                 # React frontend
│   │   ├── src/
│   │   │   ├── components/     # React components
│   │   │   ├── pages/          # Page components
│   │   │   └── ...
│   │   └── package.json
│   └── server/                 # Backend servers
│       ├── app.py              # Flask API
│       ├── server.js           # Node.js proxy
│       ├── requirements.txt    # Python dependencies
│       └── package.json
├── DevOps_Pipeline_Forecasting.ipynb  # Jupyter notebook for model training
├── pipeline_duration_model_v2.pkl     # Trained ML model
├── model_info_v2.json                 # Model metadata
├── dashboard_data.csv                 # Processed dataset
└── README.md
```

## API Endpoints

### Flask API (`http://localhost:5000`)

- `GET /api/health` - Health check
- `POST /api/predict` - Make predictions
- `GET /api/features` - Get model features
- `GET /api/sample-prediction` - Test prediction

### Node.js Server (`http://localhost:5001`)

- `GET /api/data` - Get historical data
- `POST /api/predict` - Proxy to Flask API
- `GET /api/health` - Health check
- `GET /api/features` - Get model features

### Example API Usage

```bash
# Make a prediction
curl -X POST http://localhost:5001/api/predict \
  -H "Content-Type: application/json" \
  -d '{
    "is_pull_request": true,
    "start_time": "2024-01-15T10:30:00"
  }'

# Get sample prediction
curl http://localhost:5001/api/sample-prediction
```

## Frontend Features

### Dashboard Components

1. **Prediction Form**: Input pipeline parameters and get predictions
2. **Statistics Cards**: Show total jobs, average durations, and model accuracy
3. **Weekly Trends**: Bar chart showing performance by day of week
4. **Accuracy Analysis**: Scatter plot of actual vs predicted durations

### Usage

1. **Set Start Time**: Choose when the pipeline will run
2. **Toggle Pull Request**: Check if it's a PR build
3. **Get Prediction**: Click "Predict Duration" for instant results
4. **View Results**: See duration in minutes/seconds with confidence

## Model Training

The model was trained using the Jupyter notebook (`DevOps_Pipeline_Forecasting.ipynb`):

1. **Data Collection**: Downloads CI/CD data from Ruby on Rails project
2. **Data Cleaning**: Handles missing values and outliers
3. **Feature Engineering**: Creates time-based features
4. **Model Training**: Trains LightGBM with cross-validation
5. **Model Export**: Saves model and metadata for API use

### Features Used

- `Build Pull Request`: Boolean (PR vs regular build)
- `start_hour_of_day`: Integer (0-23)
- `start_day_of_week`: Integer (0-6, Monday=0)

## Troubleshooting

### Common Issues

1. **Model not loading**

   - Ensure `pipeline_duration_model_v2.pkl` exists in project root
   - Check file permissions

2. **API connection errors**

   - Verify Flask API is running on port 5000
   - Check Node.js server is running on port 5001

3. **Frontend not loading**
   - Ensure all dependencies are installed
   - Check for port conflicts

### Debug Commands

```bash
# Check API health
curl http://localhost:5000/api/health

# Test prediction
curl http://localhost:5001/api/sample-prediction

# Check model info
curl http://localhost:5001/api/features
```

## Future Enhancements

- [ ] Add more features (test suite size, code complexity)
- [ ] Implement confidence intervals
- [ ] Add CI/CD system integrations
- [ ] Real-time data streaming
- [ ] Advanced model ensemble
- [ ] A/B testing framework

##  Author

[Nirajan Mahato] - DevOps Pipeline Forecasting Thesis Project

---

**Status**: Complete and Functional  
**Last Updated**: June 2025  
**Version**: 1.0.0
