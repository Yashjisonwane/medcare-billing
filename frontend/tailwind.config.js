/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,html}",
    "./stitch_medcare_billing_clinical_platform/**/*.html"
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#0f172a",
        "on-primary": "#ffffff",
        "primary-container": "#1e293b",
        "on-primary-container": "#94a3b8",
        "secondary": "#0284c7",
        "on-secondary": "#ffffff",
        "secondary-container": "#0d9488",
        "on-secondary-container": "#ccfbf1",
        "tertiary": "#0f172a",
        "on-tertiary": "#ffffff",
        "tertiary-container": "#1e293b",
        "on-tertiary-container": "#94a3b8",
        "surface": "#f8fafc",
        "on-surface": "#0f172a",
        "on-surface-variant": "#475569",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f0fdfa",
        "surface-container": "#e2e8f0",
        "surface-container-high": "#cbd5e1",
        "surface-container-highest": "#94a3b8",
        "surface-variant": "#e0f2fe",
        "surface-dim": "#cbd5e1",
        "surface-bright": "#f8fafc",
        "outline": "#64748b",
        "outline-variant": "#e2e8f0",
        "error": "#e11d48",
        "on-error": "#ffffff",
        "error-container": "#ffe4e6",
        "on-error-container": "#9f1239",
        "success": "#10b981",
        "warning": "#f59e0b",
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "sm": "0.25rem",
        "md": "0.5rem",
        "lg": "0.75rem",
        "xl": "1rem",
        "full": "9999px"
      },
      spacing: {
        "unit": "4px",
        "xs": "4px",
        "sm": "8px",
        "md": "16px",
        "lg": "24px",
        "xl": "32px",
        "gutter": "16px",
        "container-max": "1440px"
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        tabular: ["Inter", "sans-serif"],
      }
    },
  },
  plugins: [],
};
