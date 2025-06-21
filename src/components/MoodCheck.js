// src/components/MoodCheck.js
import React, { useState } from "react";

const MoodCheck = () => {
  const [text, setText] = useState("");
  const [res, setRes] = useState(null);

  const analyze = async () => {
    const r = await fetch("http://localhost:5000/sentiment", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({ text })
    });
    const data = await r.json();
    setRes(data);
  };

  return (
    <div className="p-4 border rounded bg-white mb-8">
      <h3 className="font-bold mb-2">Check Your Mood</h3>
      <textarea
        rows="3"
        className="w-full border p-2 rounded"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="I'm feeling..."
      />
      <button onClick={analyze} className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded">
        Analyze Mood
      </button>

      {res && (
        <div className="mt-4">
          <p>Your mood is <strong>{res.label}</strong> {res.emoji}</p>
          <p>Confidence: {Math.round(res.score * 100)}%</p>
          <blockquote className="italic border-l-4 pl-4 text-gray-600">
            {res.quote}
          </blockquote>
        </div>
      )}
    </div>
  );
};

export default MoodCheck;
