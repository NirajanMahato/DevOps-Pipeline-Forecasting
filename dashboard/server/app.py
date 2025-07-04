import json
import os
from datetime import datetime

import joblib
import numpy as np
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Global variables for model and valid categories
model = None
model_info = None

def load_model_and_data():
    """Load the enhanced model and get valid test suite categories"""
    global model, model_info
    
    try:
        # Use the enhanced model with 4 features including Test Suite
        model_path = os.path.join(os.path.dirname(__file__), '..', '..', 'pipeline_duration_model_enhanced.pkl')
        model_info_path = os.path.join(os.path.dirname(__file__), '..', '..', 'model_info_enhanced.json')
        
        # Load model
        model = joblib.load(model_path)
        with open(model_info_path, 'r') as f:
            model_info = json.load(f)
        
        print("Enhanced model loaded successfully!")
        print(f"Model path: {model_path}")
        print(f"Model info path: {model_info_path}")
        print(f"Model features: {model_info.get('features', [])}")
        print(f"Model performance: {model_info.get('performance', {})}")
        
    except Exception as e:
        print(f"Error loading enhanced model: {e}")
        print(f"Current working directory: {os.getcwd()}")
        model = None
        model_info = None

# Load model on startup
load_model_and_data()

def get_default_test_suite():
    """Get a sensible default test suite for predictions"""
    # Common test suite types that are likely to be used
    default_suites = [
        'test/unit',
        'test/integration', 
        'test/e2e',
        'test/functional',
        'spec/unit',
        'spec/integration'
    ]
    return default_suites[0]  # Return the first one as default

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'message': 'DevOps Pipeline Forecasting API is running',
        'model_version': model_info.get('model_version', 'unknown') if model_info else 'unknown',
        'features': model_info.get('features', []) if model_info else []
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    """Predict pipeline duration based on input features"""
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        data = request.get_json()
        
        # Extract features from request
        is_pull_request = data.get('is_pull_request', False)
        start_time = data.get('start_time', datetime.now().isoformat())
        test_suite = data.get('test_suite', get_default_test_suite())  # New feature
        
        # Parse start time and create time-based features
        start_datetime = pd.to_datetime(start_time)
        start_day_of_week = start_datetime.dayofweek
        start_hour_of_day = start_datetime.hour
        
        # Create feature vector with all 4 features
        features = {
            'Build Pull Request': is_pull_request,
            'start_hour_of_day': start_hour_of_day,
            'start_day_of_week': start_day_of_week,
            'Test Suite': test_suite
        }
        
        # Convert to DataFrame
        df_input = pd.DataFrame([features])
        
        # Convert Test Suite to categorical type for LightGBM
        df_input['Test Suite'] = df_input['Test Suite'].astype('category')
        
        # Make prediction (model expects log-transformed target)
        prediction_log = model.predict(df_input)[0]
        
        # Convert back to original scale (seconds)
        prediction_seconds = np.expm1(prediction_log)
        
        # Convert to minutes for better readability
        prediction_minutes = prediction_seconds / 60
        
        return jsonify({
            'prediction_seconds': round(prediction_seconds, 2),
            'prediction_minutes': round(prediction_minutes, 2),
            'input_features': features,
            'confidence': 'high',
            'model_version': model_info.get('model_version', 'unknown')
        })
        
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return jsonify({'error': f'Prediction failed: {str(e)}'}), 400

@app.route('/api/features', methods=['GET'])
def get_features():
    """Get available features and their descriptions"""
    return jsonify({
        'features': model_info.get('features', []) if model_info else [],
        'categorical_features': model_info.get('categorical_features', []) if model_info else [],
        'target': model_info.get('target', '') if model_info else '',
        'model_version': model_info.get('model_version', 'unknown') if model_info else 'unknown',
        'performance': model_info.get('performance', {}) if model_info else {}
    })

@app.route('/api/test-suites', methods=['GET'])
def get_test_suites():
    """Get available test suite options"""
    test_suites = [
        'test/unit',
        'test/integration',
        'test/e2e', 
        'test/functional',
        'test/acceptance',
        'spec/unit',
        'spec/integration',
        'spec/features',
        'cypress/e2e',
        'jest/unit',
        'pytest/unit',
        'pytest/integration'
    ]
    return jsonify({
        'test_suites': test_suites,
        'default': get_default_test_suite()
    })

@app.route('/api/sample-prediction', methods=['GET'])
def sample_prediction():
    """Make a sample prediction for testing"""
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        sample_data = {
            'is_pull_request': True,
            'start_time': datetime.now().isoformat(),
            'test_suite': 'test/unit'
        }
        
        # Extract features
        is_pull_request = sample_data['is_pull_request']
        start_time = sample_data['start_time']
        test_suite = sample_data['test_suite']
        
        # Parse start time
        start_datetime = pd.to_datetime(start_time)
        start_day_of_week = start_datetime.dayofweek
        start_hour_of_day = start_datetime.hour
        
        # Create feature vector with all 4 features
        features = {
            'Build Pull Request': is_pull_request,
            'start_hour_of_day': start_hour_of_day,
            'start_day_of_week': start_day_of_week,
            'Test Suite': test_suite
        }
        
        # Convert to DataFrame
        df_input = pd.DataFrame([features])
        
        # Convert Test Suite to categorical type
        df_input['Test Suite'] = df_input['Test Suite'].astype('category')
        
        # Make prediction
        prediction_log = model.predict(df_input)[0]
        prediction_seconds = np.expm1(prediction_log)
        prediction_minutes = prediction_seconds / 60
        
        return jsonify({
            'sample_input': sample_data,
            'prediction_seconds': round(prediction_seconds, 2),
            'prediction_minutes': round(prediction_minutes, 2),
            'input_features': features,
            'model_version': model_info.get('model_version', 'unknown')
        })
        
    except Exception as e:
        print(f"Sample prediction error: {str(e)}")
        return jsonify({'error': f'Sample prediction failed: {str(e)}'}), 400

if __name__ == '__main__':
    print("Starting DevOps Pipeline Forecasting API...")
    print("Available endpoints:")
    print("- GET  /api/health")
    print("- POST /api/predict")
    print("- GET  /api/features")
    print("- GET  /api/test-suites")
    print("- GET  /api/sample-prediction")
    app.run(debug=True, port=5000)