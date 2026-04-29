import React, { useEffect, useState } from "react";

const weatherDescriptions = {
  0: { text: "Clear Sky", icon: "☀️" },
  1: { text: "Mainly Clear", icon: "🌤️" },
  2: { text: "Partly Cloudy", icon: "⛅" },
  3: { text: "Overcast", icon: "☁️" },
  45: { text: "Foggy", icon: "🌫️" },
  48: { text: "Icy Fog", icon: "🌫️" },
  51: { text: "Light Drizzle", icon: "🌦️" },
  53: { text: "Moderate Drizzle", icon: "🌦️" },
  55: { text: "Dense Drizzle", icon: "🌧️" },
  61: { text: "Slight Rain", icon: "🌧️" },
  63: { text: "Moderate Rain", icon: "🌧️" },
  65: { text: "Heavy Rain", icon: "🌧️" },
  80: { text: "Slight Showers", icon: "🌦️" },
  81: { text: "Moderate Showers", icon: "🌧️" },
  82: { text: "Heavy Showers", icon: "🌧️" },
  95: { text: "Thunderstorm", icon: "⛈️" },
};

function App() {
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=13.08&longitude=80.27" +
          "&current_weather=true" +
          "&hourly=relative_humidity_2m,apparent_temperature,visibility,precipitation_probability" +
          "&timezone=Asia/Kolkata&forecast_days=1"
        );
        const data = await response.json();
        setWeather(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchWeather();
  }, []);

  if (loading) return (
    <div style={styles.centered}>
      <div style={styles.spinner}></div>
      <p style={styles.loadingText}>Fetching weather...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (error) return (
    <div style={styles.centered}>
      <p style={{ color: "#e53e3e" }}>⚠️ Error: {error}</p>
    </div>
  );

  const current = weather.current_weather;
  const hourly = weather.hourly;

  // ✅ Match current hour to API's hourly time array
  const currentTimeStr = current.time; // e.g. "2026-04-29T20:00"
  const currentIndex = hourly.time.findIndex(t => t === currentTimeStr);
  const safeIndex = currentIndex !== -1 ? currentIndex : new Date().getHours();

  const now = new Date();
  const condition = weatherDescriptions[current.weathercode] || { text: "Unknown", icon: "🌡️" };

  const stats = [
    { label: "Humidity",    value: `${hourly.relative_humidity_2m[safeIndex]}%`,                    icon: "💧" },
    { label: "Wind",        value: `${current.windspeed} km/h`,                                     icon: "💨" },
    { label: "Rain Chance", value: `${hourly.precipitation_probability[safeIndex]}%`,               icon: "🌂" },
    { label: "Visibility",  value: `${(hourly.visibility[safeIndex] / 1000).toFixed(1)} km`,        icon: "👁️" },
    { label: "Wind Dir",    value: `${current.winddirection}°`,                                     icon: "🧭" },
    { label: "Feels Like",  value: `${hourly.apparent_temperature[safeIndex]}°C`,                   icon: "🌡️" },
  ];

  return (
    <div style={styles.page}>
      <div style={styles.card}>

        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.city}>📍 Chennai</h1>
            <p style={styles.region}>Tamil Nadu, India</p>
            <p style={styles.time}>
              {now.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
              {" · "}{now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
          <div style={styles.iconBox}>
            <span style={styles.weatherIcon}>{condition.icon}</span>
          </div>
        </div>

        {/* Temperature */}
        <div style={styles.tempSection}>
          <h2 style={styles.temp}>{current.temperature}°C</h2>
          <p style={styles.condition}>{condition.text}</p>
        </div>

        <hr style={styles.divider} />

        {/* Stats Grid */}
        <div style={styles.grid}>
          {stats.map((s) => (
            <div key={s.label} style={styles.statCard}>
              <span style={styles.statIcon}>{s.icon}</span>
              <p style={styles.statValue}>{s.value}</p>
              <p style={styles.statLabel}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Debug: show matched time */}
        <p style={styles.debugText}>
          Data time: {currentTimeStr} · Index: {safeIndex}
        </p>

      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 480px) {
          .stat-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
    padding: "20px",
    fontFamily: "'Segoe UI', sans-serif",
    boxSizing: "border-box",
  },
  card: {
    background: "rgba(255,255,255,0.07)",
    backdropFilter: "blur(20px)",
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.15)",
    padding: "32px",
    width: "100%",
    maxWidth: "420px",
    color: "#fff",
    boxSizing: "border-box",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "20px",
  },
  city: {
    fontSize: "clamp(20px, 5vw, 26px)",
    fontWeight: "700",
    margin: 0,
  },
  region: {
    fontSize: "14px",
    color: "rgba(255,255,255,0.6)",
    margin: "4px 0 2px",
  },
  time: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.5)",
    margin: 0,
  },
  iconBox: {
    background: "rgba(255,255,255,0.1)",
    borderRadius: "16px",
    padding: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  weatherIcon: { fontSize: "40px", lineHeight: 1 },
  tempSection: { marginBottom: "20px" },
  temp: {
    fontSize: "clamp(48px, 12vw, 72px)",
    fontWeight: "300",
    margin: "0 0 4px",
    lineHeight: 1,
  },
  condition: {
    fontSize: "18px",
    color: "rgba(255,255,255,0.75)",
    margin: 0,
  },
  divider: {
    border: "none",
    borderTop: "1px solid rgba(255,255,255,0.1)",
    margin: "20px 0",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "12px",
  },
  statCard: {
    background: "rgba(255,255,255,0.07)",
    borderRadius: "14px",
    padding: "14px 10px",
    textAlign: "center",
    border: "1px solid rgba(255,255,255,0.08)",
  },
  statIcon: { fontSize: "20px", display: "block", marginBottom: "6px" },
  statValue: { fontSize: "clamp(13px, 3vw, 15px)", fontWeight: "600", margin: "0 0 3px" },
  statLabel: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.5)",
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  centered: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "#1a1a2e",
    color: "#fff",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "3px solid rgba(255,255,255,0.2)",
    borderTop: "3px solid #fff",
    borderRadius: "50%",
    animation: "spin 0.8s linear infinite",
  },
  loadingText: { marginTop: "16px", color: "rgba(255,255,255,0.6)" },
  debugText: {
    marginTop: "16px",
    fontSize: "11px",
    color: "rgba(255,255,255,0.3)",
    textAlign: "center",
  },
};

export default App;