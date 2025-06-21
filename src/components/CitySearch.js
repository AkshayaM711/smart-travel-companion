import React, { useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet icon bug
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const API_KEY = "53c8e14b7amsh5d16eba6835fe59p1358acjsnde95cc3953ca";
const API_HOST = "wft-geo-db.p.rapidapi.com";

const CitySearch = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");

  const handleInputChange = async (e) => {
    const value = e.target.value;
    setQuery(value);
    setWeather(null);
    if (value.length >= 2) {
      try {
        const res = await axios.get(`https://${API_HOST}/v1/geo/cities`, {
          headers: {
            "X-RapidAPI-Key": API_KEY,
            "X-RapidAPI-Host": API_HOST,
          },
          params: { namePrefix: value, limit: 5 },
        });
        setSuggestions(res.data.data.map((c) => `${c.name}, ${c.countryCode}`));
      } catch {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
    }
  };

  const fetchWeather = async () => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/weather?city=${query}`);
      setWeather(res.data);
      setError("");
      setSuggestions([]);
    } catch {
      setError("Unable to fetch weather data");
      setWeather(null);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-sky-200 p-6 font-sans">
      <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-4 text-blue-700">
          Smart Travel Companion 🌍
        </h1>
        <div className="flex items-center gap-2">
          <input
            value={query}
            onChange={handleInputChange}
            placeholder="Start typing a city..."
            className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={fetchWeather}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Search
          </button>
        </div>

        {suggestions.length > 0 && (
          <ul className="border mt-2 rounded-lg bg-white shadow-lg max-h-40 overflow-y-auto">
            {suggestions.map((c, i) => (
              <li
                key={i}
                onClick={() => setQuery(c.split(",")[0])}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
              >
                {c}
              </li>
            ))}
          </ul>
        )}

        {error && <p className="text-red-500 mt-2">{error}</p>}

        {weather && (
          <div className="mt-6 text-center">
            <img src={weather.icon} className="mx-auto w-16" alt="weather icon" />
            <h2 className="text-xl font-semibold text-blue-600 mb-2">{weather.city}</h2>
            <p>🌥️ {weather.description}</p>
            <p>🌡️ {weather.temperature}</p>
            <p>💧 Humidity: {weather.humidity}</p>
            <p>💨 Wind: {weather.wind_speed_kph}</p>
            <p>🌅 Sunrise: {weather.sunrise}</p>
            <p>🌇 Sunset: {weather.sunset}</p>

            <div className="mt-4 text-left">
              <h3 className="text-md font-semibold text-blue-700 mb-1">🍽️ Local Cuisine:</h3>
              <ul className="list-disc list-inside">
                {weather.cuisine.map((dish, i) => (
                  <li key={i}>{dish}</li>
                ))}
              </ul>
            </div>

            {weather.lat && weather.lon && (
              <div className="mt-6">
                <h3 className="font-semibold text-blue-700 mb-2">🗺️ Map Location:</h3>
                <MapContainer center={[weather.lat, weather.lon]} zoom={11} style={{ height: "300px", width: "100%" }}>
                  <TileLayer attribution='&copy; OpenStreetMap' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker position={[weather.lat, weather.lon]}>
                    <Popup>{weather.city}</Popup>
                  </Marker>
                </MapContainer>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CitySearch;
