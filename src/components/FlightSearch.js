import React, { useState } from "react";
import axios from "axios";

const FlightSearch = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");

  const handleFlightSearch = async () => {
    setError("");
    setResults([]);

    if (!origin || !destination) {
      setError("Both origin and destination are required.");
      return;
    }

    try {
      const res = await axios.get("http://127.0.0.1:5000/flight-details", {
        params: {
          origin: origin.trim().toUpperCase(),
          destination: destination.trim().toUpperCase(),
        },
      });

      if (res.data.flights && res.data.flights.length > 0) {
        setResults(res.data.flights);
      } else {
        setError("No flights found.");
      }
    } catch (err) {
      setError("Error fetching flights.");
    }
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-100 to-sky-200 min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm">
        <h2 className="text-xl font-bold mb-4 text-center text-blue-700">✈️ Flight Search</h2>

        <input
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          placeholder="From (IATA code e.g., MAA)"
          className="w-full mb-2 p-2 border rounded"
        />

        <input
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          placeholder="To (IATA code e.g., DEL)"
          className="w-full mb-4 p-2 border rounded"
        />

        <button
          onClick={handleFlightSearch}
          className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
        >
          Search Flights
        </button>

        {error && <p className="text-red-500 mt-2">{error}</p>}

        {results.length > 0 && (
          <div className="mt-4 text-sm">
            <h3 className="font-semibold text-blue-700 mb-2">Flight Results:</h3>
            <ul className="text-left space-y-2">
              {results.map((flight, idx) => (
                <li key={idx} className="border p-2 rounded bg-blue-50">
                  <strong>{flight.airline}</strong> ({flight.flight_number})<br />
                  ✈️ Departs: {flight.departure}<br />
                  🛬 Arrives: {flight.arrival}<br />
                  📡 Status: {flight.status}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FlightSearch;
