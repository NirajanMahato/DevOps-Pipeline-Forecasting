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

model = None
model_info = None

def load_model_and_data():
    """Load the enhanced model and info"""
    global model, model_info
    try:
        base_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
        model_path = os.path.join(base_dir, 'pipeline_duration_model_enhanced.pkl')
        model_info_path = os.path.join(base_dir, 'model_info_enhanced.json')

        model = joblib.load(model_path)
        with open(model_info_path, 'r') as f:
            model_info = json.load(f)

        print(" Enhanced model loaded successfully.")
    except Exception as e:
        print(f" Error loading model: {e}")
        model = None
        model_info = None

# Load model on startup
load_model_and_data()

def get_default_test_suite():
    """Default simplified test suite"""
    return 'unit'

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'message': 'DevOps Pipeline Forecasting API is running',
        'model_version': model_info.get('model_version', 'unknown') if model_info else 'unknown',
        'features': model_info.get('features', []) if model_info else []
    })

@app.route('/api/predict', methods=['POST'])
def predict():
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500

    try:
        data = request.get_json()

        is_pull_request = data.get('is_pull_request', False)
        start_time = data.get('start_time', datetime.now().isoformat())
        test_suite = data.get('test_suite', get_default_test_suite())

        # Map simplified test suite to model-trained label
        suite_mapping = {
            'unit': 'test/unit',
            'integration': 'test/integration',
            'e2e': 'test/e2e'
        }
        test_suite_mapped = suite_mapping.get(test_suite, 'test/unit')

        start_datetime = pd.to_datetime(start_time)
        start_day_of_week = start_datetime.dayofweek
        start_hour_of_day = start_datetime.hour

        features = {
            'Build Pull Request': is_pull_request,
            'start_hour_of_day': start_hour_of_day,
            'start_day_of_week': start_day_of_week,
            'Test Suite': test_suite_mapped
        }

        df_input = pd.DataFrame([features])
        df_input['Test Suite'] = df_input['Test Suite'].astype('category')

        prediction_log = model.predict(df_input)[0]
        prediction_seconds = np.expm1(prediction_log)
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
    return jsonify({
        'features': model_info.get('features', []) if model_info else [],
        'categorical_features': model_info.get('categorical_features', []) if model_info else [],
        'target': model_info.get('target', '') if model_info else '',
        'model_version': model_info.get('model_version', 'unknown') if model_info else 'unknown',
        'performance': model_info.get('performance', {}) if model_info else {}
    })

@app.route('/api/test-suites', methods=['GET'])
def get_test_suites():
    return jsonify({
        'test_suites': ['unit', 'integration', 'e2e'],
        'default': get_default_test_suite()
    })

@app.route('/api/sample-prediction', methods=['GET'])
def sample_prediction():
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 500

    try:
        sample_data = {
            'is_pull_request': True,
            'start_time': datetime.now().isoformat(),
            'test_suite': 'unit'
        }

        # Apply mapping
        suite_mapping = {
            'unit': 'test/unit',
            'integration': 'test/integration',
            'e2e': 'test/e2e'
        }
        test_suite_mapped = suite_mapping.get(sample_data['test_suite'], 'test/unit')

        start_datetime = pd.to_datetime(sample_data['start_time'])
        features = {
            'Build Pull Request': sample_data['is_pull_request'],
            'start_hour_of_day': start_datetime.hour,
            'start_day_of_week': start_datetime.dayofweek,
            'Test Suite': test_suite_mapped
        }

        df_input = pd.DataFrame([features])
        df_input['Test Suite'] = df_input['Test Suite'].astype('category')

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
