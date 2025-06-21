import React, { useState } from "react";
import axios from "axios";

const Itinerary = ({ city, days }) => {
  const [itinerary, setItinerary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateItinerary = async () => {
    if (!city) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    setError("");
    setItinerary("");

    try {
      const res = await axios.post("http://127.0.0.1:5000/generate-itinerary", {
        city,
        days: parseInt(days),
      });
      setItinerary(res.data.itinerary);
    } catch (err) {
      setError("Failed to generate itinerary.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={generateItinerary}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Generate Itinerary
      </button>

      {loading && <p className="mt-4 text-gray-600">Generating itinerary...</p>}

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {itinerary && (
        <div className="mt-6 whitespace-pre-wrap bg-white p-4 rounded shadow border border-gray-200">
          <h2 className="text-xl font-bold mb-2 text-indigo-700">Suggested Itinerary</h2>
          <p>{itinerary}</p>
        </div>
      )}
    </div>
  );
};

export default Itinerary;
