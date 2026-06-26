# MealScaler (NutriNut) 🥦💪

MealScaler is a hilarious, slightly unhinged, yet highly accurate AI-powered recipe scaling application. Powered by Google's Gemini, it scales recipes dynamically to hit your exact target macros.

Guided by **Coach Brocc**—your virtual, sarcasm-loaded broccoli nutritionist chef—this app takes the guesswork out of meal planning.

---

## 🚀 Key Features

*   **Target-Driven Scaling:** Specify a food item and your exact target for a nutrient (Protein, Carbs, Fat, or Calories), and the AI will scale the recipe ingredients precisely to match your goal.
*   **Coach Brocc Mascot:** Get dynamic feedback and hilarious, sarcastic commentary depending on your nutrient targets.
*   **Structured AI Recipe Output:** Returns detailed recipes with precise ingredient amounts, macro breakdowns, and funny health effects.
*   **Full Stack Applet:** Powered by a React frontend and an Express backend server.

---

## 🛠️ Tech Stack

*   **Frontend:** React, Vite, Tailwind CSS, Motion (Framer Motion)
*   **Backend:** Node.js, Express, TypeScript
*   **AI Integration:** `@google/genai` (Gemini 2.5 Flash model)

---

## 🏃‍♂️ Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### 1. Set up Environment Variables
Create a `.env` file in the root directory (you can copy `.env.example` as a template) and add your Gemini API key:
```env
GEMINI_API_KEY="your-gemini-api-key-here"
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run the App Locally
```bash
npm run dev
```
Open your browser and navigate to **`http://localhost:3000`** to start scaling your meals!
