// src/components/HotelSuggestions.js
import React, { useState } from "react";
import axios from "axios";

const HotelSuggestions = () => {
  const [city, setCity] = useState("");
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [hotels, setHotels] = useState([]);

  const fetchHotels = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:5000/hotels", {
        params: {
          city,
          arrival_date: arrival,
          departure_date: departure,
        },
      });
      setHotels(res.data.hotels);
    } catch (err) {
      alert("Failed to fetch hotels");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-2">🏨 Hotel Suggestions</h2>
      <input
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="border p-2 rounded mb-2 w-full"
      />
      <input
        type="date"
        value={arrival}
        onChange={(e) => setArrival(e.target.value)}
        className="border p-2 rounded mb-2 w-full"
      />
      <input
        type="date"
        value={departure}
        onChange={(e) => setDeparture(e.target.value)}
        className="border p-2 rounded mb-2 w-full"
      />
      <button
        onClick={fetchHotels}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Find Hotels
      </button>

      {hotels.length > 0 && (
        <div className="mt-4 space-y-4">
          {hotels.map((hotel, i) => (
            <a
              key={i}
              href={hotel.booking_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block hover:scale-[1.02] transition-transform duration-200"
            >
              <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <h2 className="text-lg font-semibold">{hotel.name}</h2>
                <p className="text-sm text-gray-600">{hotel.address}</p>
                <p className="text-sm text-green-700 font-medium">
                  {hotel.price} {hotel.currency}
                </p>
                {hotel.photo && (
                  <img
                    src={hotel.photo}
                    alt={hotel.name}
                    className="mt-2 rounded-lg h-40 object-cover"
                  />
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelSuggestions;
