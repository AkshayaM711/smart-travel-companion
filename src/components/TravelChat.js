import React, { useState } from "react";
import axios from "axios";

const TravelChat = () => {
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;
    setLoading(true);
    setReply("");

    try {
      const res = await axios.post("http://127.0.0.1:5000/chat", {
        message,
      });
      setReply(res.data.reply);
    } catch (err) {
      setReply("Sorry, I couldn't respond. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Ask me about your trip..."
        className="border p-2 rounded w-full mb-3"
      />
      <button
        onClick={sendMessage}
        className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
      >
        Ask Assistant
      </button>
      {loading && <p className="mt-3 text-gray-600">Thinking...</p>}
      {reply && (
        <div className="mt-4 bg-gray-100 p-4 rounded shadow border">
          <p>{reply}</p>
        </div>
      )}
    </div>
  );
};

export default TravelChat;
