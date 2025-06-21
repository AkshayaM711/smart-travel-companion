from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
import csv
from datetime import datetime

# Transformers for chatbot
from transformers import BlenderbotTokenizer, BlenderbotForConditionalGeneration
import torch

app = Flask(__name__)
CORS(app)

# Load BlenderBot 400M model
model_name = "facebook/blenderbot-400M-distill"
tokenizer = BlenderbotTokenizer.from_pretrained(model_name)
model = BlenderbotForConditionalGeneration.from_pretrained(model_name)

# ---------- Logging ----------
LOG_PATH = os.path.join("data", "logs.csv")

def log_request(endpoint, city="", message=""):
    os.makedirs("data", exist_ok=True)
    file_exists = os.path.isfile(LOG_PATH)
    with open(LOG_PATH, "a", newline='', encoding='utf-8') as csvfile:
        writer = csv.writer(csvfile)
        if not file_exists:
            writer.writerow(["timestamp", "endpoint", "city", "message"])
        writer.writerow([datetime.now().isoformat(), endpoint, city, message])

# ---------- Home ----------
@app.route("/")
def home():
    return jsonify({"message": "Smart Travel Companion API is running"})

# ---------- Weather ----------
@app.route("/weather", methods=["GET"])
def get_weather():
    city = request.args.get("city")
    if not city:
        return jsonify({"error": "City parameter is required"}), 400

    log_request(endpoint="/weather", city=city)

    url = f"https://wttr.in/{city}?format=j1"
    try:
        response = requests.get(url, timeout=5)
        data = response.json()
        current = data["current_condition"][0]
        astronomy = data["weather"][0]["astronomy"][0]
        nearest = data.get("nearest_area", [{}])[0]
        lat = float(nearest.get("latitude", 0))
        lon = float(nearest.get("longitude", 0))

        icon_url = current.get("weatherIconUrl", [{}])[0].get("value", "") or \
                   "https://cdn-icons-png.flaticon.com/512/869/869869.png"

        cuisine_map = {
            "chennai": ["Dosa", "Sambar", "Filter Coffee"],
            "mumbai": ["Vada Pav", "Pav Bhaji", "Bombay Sandwich"],
            "delhi": ["Chole Bhature", "Butter Chicken", "Paratha"],
            "kolkata": ["Rasgulla", "Fish Curry", "Kathi Roll"]
        }
        local_cuisine = cuisine_map.get(city.lower(), ["Local food info not available"])

        return jsonify({
            "city": city.title(),
            "temperature": f"{current.get('temp_C', 'N/A')}°C",
            "description": current.get("weatherDesc", [{}])[0].get("value", "N/A"),
            "humidity": f"{current.get('humidity', 'N/A')}%",
            "wind_speed_kph": f"{current.get('windspeedKmph', 'N/A')} km/h",
            "sunrise": astronomy.get("sunrise", "N/A"),
            "sunset": astronomy.get("sunset", "N/A"),
            "icon": icon_url,
            "lat": lat,
            "lon": lon,
            "cuisine": local_cuisine
        })

    except Exception as e:
        return jsonify({"error": "API error", "message": str(e)}), 500

# ---------- IATA Code ----------
@app.route("/iata-code", methods=["GET"])
def get_iata_code():
    city = request.args.get("city")
    if not city:
        return jsonify({"error": "City parameter required"}), 400

    log_request(endpoint="/iata-code", city=city)

    url = "https://iatacodes.p.rapidapi.com/api/v6/autocomplete"
    headers = {
        "X-RapidAPI-Key": "53c8e14b7amsh5d16eba6835fe59p1358acjsnde95cc3953ca",
        "X-RapidAPI-Host": "iatacodes.p.rapidapi.com",
    }
    params = {"query": city}

    try:
        response = requests.get(url, headers=headers, params=params)
        data = response.json()
        cities = data.get("response", {}).get("cities", [])
        if not cities:
            return jsonify({"error": "City not found"}), 404

        return jsonify({"iata": cities[0].get("code")})

    except Exception as e:
        return jsonify({"error": "IATA fetch failed", "message": str(e)}), 500

# ---------- Flight Details ----------
@app.route("/flight-details", methods=["GET"])
def get_flight_details():
    origin = request.args.get("origin")
    destination = request.args.get("destination")
    date = request.args.get("date")  # Optional

    if not origin or not destination:
        return jsonify({"error": "origin and destination are required"}), 400

    log_request(endpoint="/flight-details", city=origin, message=f"to {destination}")

    url = "http://api.aviationstack.com/v1/flights"
    params = {
        "access_key": "055d2349af4b5c287acbe98650af31d8",
        "dep_iata": origin,
        "arr_iata": destination
    }

    try:
        response = requests.get(url, params=params)
        data = response.json()

        if "data" not in data or len(data["data"]) == 0:
            return jsonify({"error": "No flight data found"}), 404

        flights = []
        for f in data["data"][:5]:
            flights.append({
                "flight_number": f["flight"]["iata"],
                "airline": f["airline"]["name"],
                "departure": f["departure"]["airport"],
                "arrival": f["arrival"]["airport"],
                "departure_time": f["departure"]["scheduled"],
                "arrival_time": f["arrival"]["scheduled"]
            })

        return jsonify({"flights": flights})

    except Exception as e:
        return jsonify({"error": "Flight API error", "message": str(e)}), 500

# ---------- Hotel Suggestions ----------
@app.route("/hotels", methods=["GET"])
def get_hotels():
    city = request.args.get("city")
    arrival = request.args.get("arrival_date")
    departure = request.args.get("departure_date")

    if not all([city, arrival, departure]):
        return jsonify({"error": "city, arrival_date, and departure_date are required"}), 400

    log_request(endpoint="/hotels", city=city, message=f"{arrival} to {departure}")

    try:
        weather_resp = requests.get(f"https://wttr.in/{city}?format=j1", timeout=5)
        data = weather_resp.json()
        nearest = data.get("nearest_area", [{}])[0]
        lat = float(nearest.get("latitude", 0))
        lon = float(nearest.get("longitude", 0))
        bbox = f"{lat-0.2},{lat+0.2},{lon-0.2},{lon+0.2}"

        booking_url = "https://apidojo-booking-v1.p.rapidapi.com/properties/list-by-map"
        headers = {
            "X-RapidAPI-Key": "53c8e14b7amsh5d16eba6835fe59p1358acjsnde95cc3953ca",
            "X-RapidAPI-Host": "apidojo-booking-v1.p.rapidapi.com"
        }
        params = {
            "arrival_date": arrival,
            "departure_date": departure,
            "room_qty": 1,
            "guest_qty": 1,
            "bbox": bbox,
            "search_id": "none",
            "price_filter_currencycode": "USD",
            "categories_filter": "class::1,class::2,class::3",
            "languagecode": "en-us",
            "travel_purpose": "leisure",
            "order_by": "popularity",
            "offset": 0
        }

        hotel_resp = requests.get(booking_url, headers=headers, params=params)
        hotels = hotel_resp.json().get("result", [])

        hotel_list = [{
            "name": h.get("name"),
            "address": h.get("address"),
            "price": h.get("min_total_price"),
            "currency": h.get("currencycode"),
            "stars": h.get("class"),
            "photo": h.get("main_photo_url"),
            "booking_url": h.get("url") or h.get("deep_link")
        } for h in hotels if h.get("url") or h.get("deep_link")]

        return jsonify({"hotels": hotel_list})

    except Exception as e:
        return jsonify({"error": "Hotel fetch failed", "message": str(e)}), 500

# ---------- Travel Chat ----------
@app.route("/chat", methods=["POST"])
def travel_chat():
    data = request.json
    user_input = data.get("message")

    if not user_input:
        return jsonify({"error": "Message is required"}), 400

    log_request(endpoint="/chat", message=user_input)

    try:
        inputs = tokenizer(user_input, return_tensors="pt")
        reply_ids = model.generate(**inputs)
        reply = tokenizer.decode(reply_ids[0], skip_special_tokens=True)
        return jsonify({"reply": reply})

    except Exception as e:
        print(f"[Local BlenderBot Error]: {e}")
        return jsonify({"error": str(e)}), 500


# backend/app.py (add this below existing imports)
from transformers import pipeline

sentiment_analyzer = pipeline("sentiment-analysis")

@app.route("/sentiment", methods=["POST"])
def sentiment_check():
    data = request.json
    text = data.get("text", "")
    if not text:
        return jsonify({"error": "Text is required"}), 400

    result = sentiment_analyzer(text[:512])[0]  # truncate to 512 tokens
    label = result["label"]  # POSITIVE / NEGATIVE
    score = float(result["score"])

    emoji = "😊" if label == "POSITIVE" else "😞"
    quotes = {
        "POSITIVE": "“The world is but a canvas to your imagination.”",
        "NEGATIVE": "“Every adversity carries with it the seed of equal or greater benefit.”"
    }
    quote = quotes[label]

    return jsonify({
        "label": label,
        "score": round(score, 2),
        "emoji": emoji,
        "quote": quote
    })

if __name__ == "__main__":
    app.run(debug=True)
