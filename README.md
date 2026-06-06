# Dailee

Dailee is a personal diary and progress-tracking web app for recording daily technical and non-technical growth. It helps users save notes, attach images, review activity through a calendar, and generate weekly or monthly insights from their entries.

## Features

- Record daily technical and non-technical diary entries
- Upload images or capture photos directly on supported mobile devices
- View saved entries through an interactive calendar
- Generate monthly insights for a selected month
- Generate weekly insights based on the last 7 days of activity
- Export insight reports as PDF files
- Generate AI-powered summaries with Gemini
- Sign in with Google using Firebase Authentication
- Store user entries in Firestore with local fallback persistence
- Switch between light and dark themes
- Fully responsive interface for desktop and mobile

## Tech Stack

- React
- Vite
- Tailwind CSS
- Firebase Authentication
- Cloud Firestore
- Cloudinary
- Gemini API
- React Icons

## Getting Started

### Prerequisites

Install Node.js and npm before running the project.

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env` file in the project root and add the following values:

```env
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=

VITE_CLOUDINARY_CLOUD_NAME=
VITE_CLOUDINARY_UPLOAD_PRESET=

VITE_GEMINI_API_KEY=
VITE_GEMINI_MODEL=gemini-2.5-flash
```

Notes:

- Firebase values come from your Firebase project settings.
- Cloudinary requires an unsigned upload preset for browser uploads.
- `VITE_GEMINI_MODEL` is optional. If omitted, the app uses `gemini-2.5-flash`.

### Run Locally

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## Project Structure

```text
src/
  components/
    CalendarSection.jsx
    HeroSection.jsx
    Layout.jsx
    MonthlyInsights.jsx
    NotebookEntry.jsx
    Sidebar.jsx
  cloudinary.js
  firebase.js
  index.css
  main.jsx
```

## Deployment

Build the app with `npm run build` and deploy the generated `dist` folder to a static hosting platform such as Vercel, Netlify, Firebase Hosting, or GitHub Pages. Make sure the same environment variables are added to your hosting provider before deploying.

## Author

Created by Albin.
