# 💰 PLN Tracker

A sophisticated personal finance management application for tracking PLN expenses with intelligent categorization, visual analytics, and easy account sharing. Powered by **Google Gemini 3**.

## 🚀 Quick Start

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Set Up API Key**:
   The app requires a `process.env.API_KEY` for Gemini AI features. You can set this in your environment or via a `.env` file for local development.

3. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🏗️ Deployment

### To Vercel / Netlify
1. Push this repository to GitHub/GitLab.
2. Connect the repository to your hosting provider.
3. Set the build command to: `npm run build`
4. Set the publish directory to: `dist`
5. Add your `API_KEY` to the environment variables section of the provider.

## 🛠️ Features
- **Intelligent Tracking**: 10 distinct categories with visual icons.
- **AI Advice**: Automated financial tips based on your spending habits.
- **Privacy First**: Local storage persistence with session-based "Last Account" login.
- **Universal Sharing**: Account state is shared via Base64 encoded URL hashes—no database required for sharing view-only access.

## 📦 Tech Stack
- React 19 + TypeScript
- Tailwind CSS (UI)
- Recharts (Data Visualization)
- Google GenAI (Gemini AI)
- Vite (Build Tool)