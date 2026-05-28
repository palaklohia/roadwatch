import { useState, useEffect } from "react";

const stats = [
  { value: "247", label: "Complaints Filed" },
  { value: "89", label: "Resolved" },
  { value: "12", label: "Repeat Offender Roads" },
  { value: "6", label: "Authorities Notified" },
];

const steps = [
  {
    icon: "📸",
    title: "Snap a Photo",
    desc: "See a pothole, broken streetlight, or road hazard? Take a photo on WhatsApp.",
  },
  {
    icon: "🤖",
    title: "AI Classifies It",
    desc: "Our AI instantly identifies the hazard type, severity, and the right authority.",
  },
  {
    icon: "📨",
    title: "Authority Notified",
    desc: "The complaint is auto-routed to PWD, NHAI, or Municipality — with a tracking ID.",
  },
];

const features = [
  { icon: "🗺️", title: "Live Hazard Map", desc: "Every complaint plotted in real-time across your district." },
  { icon: "🏆", title: "Repeat Offender Board", desc: "Worst roads and contractors exposed publicly." },
  { icon: "💰", title: "Budget Tracker", desc: "See how much was sanctioned vs actually spent on repairs." },
  { icon: "🔔", title: "Auto Escalation", desc: "Unresolved complaints escalate to higher authorities after 15 days." },
];

export default function Home() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ fontFamily: "'DM Sans', 'Segoe UI', sans-serif", color: "#1a2e14", background: "#fff" }}>

      {/* Google Font */}
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      {/* HERO */}
      <section style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #f0faea 0%, #fff 55%, #e8f5e1 100%)",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "100px 2rem 60px",
        position: "relative", overflow: "hidden",
      }}>
        {/* decorative circles */}
        <div style={{
          position: "absolute", top: -80, right: -80,
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, #c8edb8 0%, transparent 70%)",
          opacity: 0.5,
        }} />
        <div style={{
          position: "absolute", bottom: -60, left: -60,
          width: 300, height: 300, borderRadius: "50%",
          background: "radial-gradient(circle, #a8dba8 0%, transparent 70%)",
          opacity: 0.4,
        }} />

        <div style={{
          display: "inline-block", background: "#e6f5df",
          border: "1px solid #b3dcb3", borderRadius: 20,
          padding: "6px 16px", fontSize: 13, fontWeight: 500,
          color: "#2d7a1f", marginBottom: 24,
        }}>
          🚨 Civic Tech for Safer Indian Roads
        </div>

        <h1 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(2.4rem, 5vw, 4rem)",
          lineHeight: 1.15, fontWeight: 400,
          color: "#1a2e14", maxWidth: 720, margin: "0 auto 20px",
        }}>
          Report Road Hazards.<br />
          <span style={{ color: "#2d7a1f" }}>Hold Authorities Accountable.</span>
        </h1>

        <p style={{
          fontSize: 18, color: "#4a6741", maxWidth: 560,
          margin: "0 auto 40px", lineHeight: 1.7,
        }}>
          Snap a photo on WhatsApp. Our AI classifies the hazard and auto-routes the
          complaint to the right authority — with tracking, escalation, and a public shame board.
        </p>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center" }}>
          <a href="/classify" style={heroBtnPrimary}>Classify a Hazard →</a>
          <a href="/map" style={heroBtnSecondary}>View Live Map</a>
        </div>

        {/* Stats */}
        <div style={{
          display: "flex", gap: 0, marginTop: 72,
          background: "#fff", borderRadius: 16,
          border: "1px solid #d4edca",
          boxShadow: "0 4px 24px rgba(45,122,31,0.08)",
          overflow: "hidden",
        }}>
          {stats.map((s, i) => (
            <div key={i} style={{
              padding: "24px 36px", textAlign: "center",
              borderRight: i < stats.length - 1 ? "1px solid #d4edca" : "none",
            }}>
              <div style={{ fontSize: 32, fontWeight: 700, color: "#2d7a1f", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 13, color: "#6a8c5f", marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ padding: "80px 2rem", background: "#fff" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <p style={{ textAlign: "center", color: "#2d7a1f", fontWeight: 600, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
            How It Works
          </p>
          <h2 style={{ textAlign: "center", fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 400, color: "#1a2e14", marginBottom: 56 }}>
            Three steps to safer roads
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 32 }}>
            {steps.map((step, i) => (
              <div key={i} style={{
                background: "#f7fdf4",
                border: "1px solid #d4edca",
                borderRadius: 16, padding: "32px 28px",
                position: "relative",
              }}>
                <div style={{
                  position: "absolute", top: 20, right: 20,
                  fontSize: 12, fontWeight: 700, color: "#b3dcb3",
                }}>0{i + 1}</div>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{step.icon}</div>
                <h3 style={{ fontSize: 18, fontWeight: 600, color: "#1a2e14", marginBottom: 10 }}>{step.title}</h3>
                <p style={{ fontSize: 15, color: "#4a6741", lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "80px 2rem", background: "linear-gradient(180deg, #f0faea, #fff)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <p style={{ textAlign: "center", color: "#2d7a1f", fontWeight: 600, fontSize: 13, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
            What's Inside
          </p>
          <h2 style={{ textAlign: "center", fontFamily: "'DM Serif Display', serif", fontSize: "clamp(1.8rem, 3vw, 2.5rem)", fontWeight: 400, color: "#1a2e14", marginBottom: 56 }}>
            Built for real accountability
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24 }}>
            {features.map((f, i) => (
              <div key={i} style={{
                background: "#fff",
                border: "1px solid #d4edca",
                borderRadius: 14, padding: "28px 24px",
                transition: "box-shadow 0.2s",
              }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = "0 8px 32px rgba(45,122,31,0.12)"}
                onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
              >
                <div style={{ fontSize: 28, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "#1a2e14", marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#4a6741", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section style={{
        margin: "0 2rem 80px",
        background: "linear-gradient(135deg, #1a2e14, #2d7a1f)",
        borderRadius: 24, padding: "60px 40px",
        textAlign: "center",
        maxWidth: 960, marginLeft: "auto", marginRight: "auto",
      }}>
        <h2 style={{
          fontFamily: "'DM Serif Display', serif",
          fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
          fontWeight: 400, color: "#fff", marginBottom: 16,
        }}>
          Saw a hazard on your way today?
        </h2>
        <p style={{ color: "#b3dcb3", fontSize: 16, marginBottom: 32 }}>
          Report it in 30 seconds. We'll handle the rest.
        </p>
        <a href="/classify" style={{
          display: "inline-block",
          background: "#fff", color: "#1a2e14",
          padding: "14px 32px", borderRadius: 10,
          fontWeight: 600, fontSize: 16,
          textDecoration: "none",
          transition: "transform 0.15s",
        }}
          onMouseEnter={e => e.currentTarget.style.transform = "scale(1.03)"}
          onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
        >
          Classify a Hazard →
        </a>
      </section>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid #d4edca",
        padding: "32px 2rem",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 16,
        maxWidth: 960, margin: "0 auto",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontFamily: "'DM Serif Display', serif", fontSize: 18, color: "#1a2e14" }}>RoadWatch</span>
          <span style={{ color: "#6a8c5f", fontSize: 13 }}>— Civic accountability, built in public.</span>
        </div>
        <div style={{ display: "flex", gap: 20 }}>
          <a href="https://github.com" style={{ color: "#2d7a1f", fontSize: 13, textDecoration: "none" }}>GitHub</a>
          <a href="/map" style={{ color: "#2d7a1f", fontSize: 13, textDecoration: "none" }}>Live Map</a>
          <a href="/classify" style={{ color: "#2d7a1f", fontSize: 13, textDecoration: "none" }}>Classifier</a>
        </div>
      </footer>
    </div>
  );
}

const navLink = {
  color: "#1a2e14", textDecoration: "none",
  fontSize: 14, fontWeight: 500,
  padding: "8px 14px", borderRadius: 8,
  transition: "background 0.2s",
};

const heroBtnPrimary = {
  display: "inline-block",
  background: "#2d7a1f", color: "#fff",
  padding: "14px 28px", borderRadius: 10,
  fontWeight: 600, fontSize: 16,
  textDecoration: "none",
  boxShadow: "0 4px 16px rgba(45,122,31,0.3)",
  transition: "transform 0.15s",
};

const heroBtnSecondary = {
  display: "inline-block",
  background: "#fff", color: "#2d7a1f",
  border: "1.5px solid #2d7a1f",
  padding: "13px 28px", borderRadius: 10,
  fontWeight: 600, fontSize: 16,
  textDecoration: "none",
  transition: "transform 0.15s",
};
