from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)

# Load the trained model and preprocessing data
MODEL_PATH = "house_price_model.pkl"
try:
    with open(MODEL_PATH, "rb") as file:
        model_data = joblib.load(file)
        model = model_data["model"]
        numerical_means = model_data["numerical_means"]
        categorical_modes = model_data["categorical_modes"]
        numerical_features = model_data["numerical_features"]
        categorical_features = model_data["categorical_features"]
        print("Model and preprocessing data loaded successfully.")
except FileNotFoundError:
    print("Model file not found!")
    model = None

@app.route('/predict', methods=['POST'])
@cross_origin()
def predict():
    if not model:
        return jsonify({"error": "Model not loaded. Train and save the model first."}), 500

    # Get the data from the request
    data = request.json

    # Convert JSON data to DataFrame
    input_data = pd.DataFrame([data])

    # Handle missing numerical values
    for col in numerical_features:
        if col not in input_data.columns:
            input_data[col] = numerical_means[col]  # Fill missing numerical features
        else:
            input_data[col] = input_data[col].fillna(numerical_means[col])

    # Handle missing categorical values
    for col in categorical_features:
        if col not in input_data.columns:
            input_data[col] = categorical_modes[col]  # Fill missing categorical features
        else:
            input_data[col] = input_data[col].fillna(categorical_modes[col])

    # Compute derived features
    input_data['TotalSF'] = input_data['TotalBsmtSF'] + input_data['1stFlrSF'] + input_data['2ndFlrSF']
    input_data['TotalBath'] = input_data['FullBath'] + 0.5 * input_data['HalfBath']
    input_data['HouseAge'] = input_data['YrSold'] - input_data['YearBuilt']
    input_data['Remodeled'] = np.where(input_data['YearRemodAdd'] != input_data['YearBuilt'], 1, 0)
    input_data['Qual*SF'] = input_data['OverallQual'] * input_data['GrLivArea']

    input_data = input_data[numerical_features + categorical_features]

    # Make prediction
    log_pred = model.predict(input_data)
    final_pred = np.expm1(log_pred)  # Reverse log transformation

    return jsonify({"predicted_price": float(final_pred[0])})

if __name__ == '__main__':
    app.run(debug=True)
