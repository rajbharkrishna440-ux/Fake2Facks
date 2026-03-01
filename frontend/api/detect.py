from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import re
import string
import numpy as np
import pandas as pd
import os

app = Flask(__name__)
CORS(app)

MODEL_PATH = os.path.join(os.path.dirname(__file__), 'fake_news_model.pkl')

try:
    with open(MODEL_PATH, 'rb') as f:
        model_data = pickle.load(f)
    model = model_data['model']
    tfidf = model_data['tfidf']
    model_name = model_data['model_name']
    model_accuracy = model_data['accuracy']
    print(f"Model loaded: {model_name}")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None
    tfidf = None


def clean_text(text):
    if not text or pd.isna(text):
        return ""
    text = text.lower()
    text = re.sub(r'http\S+|www\S+|https\S+', '', text, flags=re.MULTILINE)
    text = re.sub(r'<.*?>', '', text)
    text = re.sub(r'@\w+|#\w+', '', text)
    text = text.translate(str.maketrans('', '', string.punctuation))
    text = ' '.join(text.split())
    return text


@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'model_name': model_name if model else None,
        'model_accuracy': model_accuracy if model else None
    })


@app.route('/api/detect', methods=['POST'])
def detect_fake_news():
    if model is None or tfidf is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    data = request.get_json()
    if not data or 'text' not in data:
        return jsonify({'error': 'Please provide news text'}), 400
    
    news_text = data['text'].strip()
    if not news_text:
        return jsonify({'error': 'Please provide news text'}), 400
    
    cleaned_text = clean_text(news_text)
    text_tfidf = tfidf.transform([cleaned_text])
    prediction = model.predict(text_tfidf)[0]
    probabilities = model.predict_proba(text_tfidf)[0]
    
    confidence_fake = min(float(probabilities[0]) * 100, 100.0)
    confidence_real = min(float(probabilities[1]) * 100, 100.0)
    is_fake = bool(prediction == 0)
    result_label = "FAKE" if is_fake else "REAL"
    confidence = max(confidence_fake, confidence_real)
    
    return jsonify({
        'result': result_label,
        'is_fake': is_fake,
        'confidence': round(confidence, 2),
        'confidence_fake': round(confidence_fake, 2),
        'confidence_real': round(confidence_real, 2),
        'model_used': model_name,
        'model_accuracy': model_accuracy
    })


@app.route('/api/detect-url', methods=['POST'])
def detect_from_url():
    if model is None or tfidf is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({'error': 'Please provide URL'}), 400
    
    return jsonify({
        'error': 'URL detection not available in serverless mode'
    }), 400


@app.route('/api/detect-batch', methods=['POST'])
def detect_batch():
    if model is None or tfidf is None:
        return jsonify({'error': 'Model not loaded'}), 500
    
    data = request.get_json()
    if not data or 'texts' not in data:
        return jsonify({'error': 'Please provide texts array'}), 400
    
    texts = data['texts']
    results = []
    
    for news_text in texts:
        if not news_text or not news_text.strip():
            continue
        cleaned_text = clean_text(news_text)
        text_tfidf = tfidf.transform([cleaned_text])
        prediction = model.predict(text_tfidf)[0]
        probabilities = model.predict_proba(text_tfidf)[0]
        is_fake = bool(prediction == 0)
        confidence = max(float(probabilities[0]), float(probabilities[1])) * 100
        results.append({
            'text': news_text[:100] + '...' if len(news_text) > 100 else news_text,
            'result': "FAKE" if is_fake else "REAL",
            'is_fake': is_fake,
            'confidence': round(confidence, 2)
        })
    
    return jsonify({
        'results': results,
        'total_analyzed': len(results)
    })
