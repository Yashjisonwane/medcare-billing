# Technical Environment & Setup Manual (tech.md)

This document provides developer guidelines for setting up, running, building, and maintaining the `MedPractice Pro` frontend application.

---

## 1. Project Overview & Quick Start

The frontend is a single-page application (SPA) built using **React**, **Vite** (for fast build times), and **Tailwind CSS** for responsive layout styling.

### 1.1 Prerequisites
Ensure you have the following installed on your machine:
* **Node.js** (Recommended: v18.0.0 or higher)
* **npm** (Recommended: v9.0.0 or higher)

### 1.2 Setup Instructions
1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install project dependencies:
   ```bash
   npm install
   ```
3. Start the Vite local development server:
   ```bash
   npm run dev
   ```
4. Access the application in your browser at:
   `http://localhost:5173`

---

## 2. Available Scripts & Commands

The following scripts are defined in `package.json`:

| Command | Action | Usage Scenario |
| :--- | :--- | :--- |
| `npm run dev` | Starts Vite local dev server with hot module replacement (HMR). | Daily frontend development and feature testing. |
| `npm run build` | Compiles and optimizes assets into the `dist/` directory. | Preparing code for hosting / production deployment. |
| `npm run lint` | Runs ESLint utility checks to analyze code formatting errors. | Code quality checks before committing or pushing code. |
| `npm run preview`| Serves the built files locally from the `dist/` folder. | Testing production build performance locally. |

---

## 3. Key Library Profiles

* **Vite**: Modern build runner replacing Webpack. Configured via [`vite.config.js`](file:///c:/Kiaan/medcare_billing/frontend/vite.config.js).
* **React Router DOM (v6)**: Handles frontend route changes and protected paths without page reloads.
* **Zustand**: Fast, boilerplate-free state manager used to manage global stores (`src/store/`).
* **Tailwind CSS**: Utility-first CSS framework configured via [`tailwind.config.js`](file:///c:/Kiaan/medcare_billing/frontend/tailwind.config.js).

---

## 4. Production Build & Deployment

To deploy the frontend-only application:
1. Generate the static asset bundle:
   ```bash
   npm run build
   ```
2. The output directory **`dist/`** will be generated in `frontend/`. This folder contains compiled index HTML, optimized JS bundles, and compiled CSS assets.
3. This static bundle can be hosted on services like Vercel (configured via [`vercel.json`](file:///c:/Kiaan/medcare_billing/frontend/vercel.json)), Netlify, AWS S3, or Cloudflare Pages.
