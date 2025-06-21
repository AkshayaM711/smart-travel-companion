
## 🌍 Smart Travel Companion

The **Smart Travel Companion** is an AI-powered full-stack travel assistant that helps users plan trips with weather forecasts, flight and hotel suggestions, mood-based quotes, and an AI travel chat assistant.

---

### 🚀 Features

* 🔎 **City Search with IATA Code Autocomplete**
* 🌦️ **Real-time Weather Forecast** with local cuisine suggestions
* 🛫 **Flight Search** between two cities using IATA codes
* 🏨 **Hotel Suggestions** using geolocation
* 🤖 **AI Travel Assistant** via BlenderBot Chat
* 😀 **Sentiment Analysis** based on user mood input
---

### 📁 Project Structure

```
smart-travel-companion/
├── backend/
│   ├── app.py              # Flask backend with all endpoints
│   ├── data/
│   │   └── moods.csv       # Mood and sentiment logging
│   ├── requirements.txt
│   └── ...
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.js
│   │   └── ...
│   └── package.json
├── .gitignore
└── README.md
```

---

### 🔧 Tech Stack

* **Frontend**: React.js, Tailwind CSS
* **Backend**: Flask (Python)
* **APIs**:

  * `wttr.in` (Weather)
  * RapidAPI: Booking.com, IATACodes, Sky-Scrapper
  * AviationStack (Flights)
* **AI Tools**:

  * Hugging Face `facebook/blenderbot-400M-distill`
  * `distilbert-base-uncased-finetuned-sst-2-english` for Sentiment Analysis

---

### ✅ Prerequisites

* Python 3.8+
* Node.js 14+
* Git
* Virtualenv (optional)
* Internet access for API calls and model downloads

---

### ⚙️ Installation

#### Backend (Flask API)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
```

#### Frontend (React App)

```bash
cd frontend
npm install
```

---

### 🧪 Running Locally

#### 1. Start Backend (Flask)

```bash
cd backend
python app.py
```

> Runs on: `http://localhost:5000/`

#### 2. Start Frontend (React)

```bash
cd frontend
npm start
```

> Runs on: `http://localhost:3000/`

---

### 💬 Sentiment Analysis (Mood Tracker)

* Users can enter how they feel (e.g., "I am excited!")
* Backend returns:

  * Sentiment (Positive/Negative)
  * Confidence score
  * Emoji
  * A quote based on mood
* Logs input and result in `backend/data/moods.csv`

---

### 🤖 Travel Chat Assistant

* Asks questions like:

  * `"Where should I go for a solo trip in July?"`
  * `"What should I pack for Iceland?"`
* Powered by BlenderBot (`facebook/blenderbot-400M-distill`) running locally

---

### 📦 Environment Variables (Optional)

Create a `.env` file in `backend/` (optional) for API keys:

```
RAPIDAPI_KEY=your_key_here
AVIATIONSTACK_KEY=your_key_here
```

---

### 🧪 Testing

You can test the Flask backend using:

```bash
curl http://localhost:5000/weather?city=Delhi
curl http://localhost:5000/iata-code?city=Chennai
```

---

### 📌 TODOs / Enhancements

* [ ] Authentication with login/signup
* [ ] User history for trips and chats
* [ ] PWA support for offline access
* [ ] Save itineraries
* [ ] Add more moods/quotes

---

### 🌐 Deployment Instructions

1. Push to GitHub:

   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```


---

### 📷 Architecture Diagram

![image](https://github.com/user-attachments/assets/97b9193e-0690-40fb-b03e-d9d321e23e63)


---

### 🙌 Acknowledgements

* Hugging Face Transformers
* OpenWeather / wttr.in
* Booking.com API
* RapidAPI
* AviationStack API


