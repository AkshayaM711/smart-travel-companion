import React, { useState } from "react";
import CitySearch from "./components/CitySearch";
import FlightSearch from "./components/FlightSearch";
import HotelSuggestions from "./components/HotelSuggestions";
import MoodCheck from "./components/MoodCheck";  // ✅ Import MoodCheck
import "./App.css";

const App = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [weather, setWeather] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatReply, setChatReply] = useState('');

  const fetchWeather = async (cityName) => {
    try {
      const res = await fetch(`http://localhost:5000/weather?city=${cityName}`);
      const data = await res.json();
      setWeather(data);
    } catch (error) {
      setWeather({ error: "Failed to fetch weather" });
    }
  };

  const askTravelChat = async () => {
    if (!chatMessage.trim()) return;
    setChatReply("Loading...");
    try {
      const res = await fetch(`http://localhost:5000/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: chatMessage })
      });
      const data = await res.json();
      setChatReply(data.reply || data.error || "Sorry, no response.");
    } catch (err) {
      setChatReply("Failed to get a response from assistant.");
    }
  };

  const handleCitySelect = (cityObj) => {
    setSelectedCity(cityObj);
    fetchWeather(cityObj.city);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-200 flex flex-col items-center justify-center px-4 py-10">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center mb-10">
        <h1 className="text-3xl font-extrabold text-indigo-700 mb-6 font-sans">
          🌍 Smart Travel Companion
        </h1>

        <CitySearch onSelectCity={handleCitySelect} />

        {selectedCity && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded">
            <h2 className="text-xl font-semibold text-blue-800">
              You selected: {selectedCity.city}, {selectedCity.country}
            </h2>
          </div>
        )}
      </div>

      {/* Weather Section */}
      {weather && !weather.error && (
        <div className="bg-white shadow p-6 rounded w-full max-w-lg mb-8">
          <h2 className="text-xl font-bold mb-2 text-blue-700">🌤️ Weather in {weather.city}</h2>
          <img src={weather.icon} alt="weather icon" width={64} className="mx-auto mb-2" />
          <p>{weather.description}</p>
          <p>🌡️ {weather.temperature}</p>
          <p>💧 Humidity: {weather.humidity}</p>
          <p>🌬️ Wind: {weather.wind_speed_kph}</p>
          <p>🌅 {weather.sunrise} | 🌇 {weather.sunset}</p>
          <p>🍽️ Local Cuisine: {weather.cuisine.join(', ')}</p>
        </div>
      )}

      {/* Flight Search */}
      <FlightSearch />

      {/* Hotel Suggestions */}
      <div className="w-full max-w-2xl mt-8">
        <HotelSuggestions selectedCity={selectedCity?.city} />
      </div>

      {/* Travel Assistant Chat */}
      <div className="w-full max-w-2xl mt-10 bg-white shadow p-6 rounded">
        <h2 className="text-2xl font-bold mb-4 text-indigo-700">💬 Travel Assistant Chat</h2>
        <input
          placeholder="Ask me anything about your trip..."
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          className="w-full p-2 border rounded mb-2"
        />
        <button
          onClick={askTravelChat}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
        >
          Ask
        </button>

        {chatReply && (
          <div className="mt-4 p-3 bg-indigo-50 border-l-4 border-indigo-400 rounded">
            <strong>AI Reply:</strong>
            <p className="whitespace-pre-wrap">{chatReply}</p>
          </div>
        )}
      </div>

      {/* Mood Check Component */}
      <div className="w-full max-w-2xl mt-10">
        <MoodCheck />
      </div>
    </div>
  );
};

export default App;
