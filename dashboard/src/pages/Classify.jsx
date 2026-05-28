import { useState } from "react";

export default function Classify() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [description, setDescription] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError(null);
  };

  const handleSubmit = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("image", image);
    formData.append("description", description);

    try {
      const res = await fetch("http://localhost:3000/api/classify", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError("Could not reach the classifier server. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  const severityColor = (s) => {
    if (s <= 2) return "#22c55e";
    if (s === 3) return "#f59e0b";
    return "#ef4444";
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", padding: "0 20px", fontFamily: "sans-serif" }}>
      <h2>🔍 Hazard Classifier</h2>

      <input type="file" accept="image/*" onChange={handleImageChange} />

      {preview && (
        <img src={preview} alt="preview" style={{ width: "100%", marginTop: 12, borderRadius: 8 }} />
      )}

      <textarea
        placeholder="Optional: describe what you see..."
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ width: "100%", marginTop: 12, padding: 8, height: 80, borderRadius: 6, border: "1px solid #ccc" }}
      />

      <button
        onClick={handleSubmit}
        disabled={!image || loading}
        style={{
          marginTop: 12, padding: "10px 24px", background: "#2563eb",
          color: "#fff", border: "none", borderRadius: 6, cursor: "pointer",
          opacity: (!image || loading) ? 0.6 : 1
        }}
      >
        {loading ? "Classifying..." : "Classify Hazard"}
      </button>

      {error && (
        <div style={{ marginTop: 16, padding: 12, background: "#fee2e2", borderRadius: 6, color: "#b91c1c" }}>
          ❌ {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 20, padding: 16, border: "1px solid #e5e7eb", borderRadius: 8 }}>
          <h3 style={{ margin: "0 0 12px" }}>Classification Result</h3>
          <p><strong>Type:</strong> {result.type?.replace(/_/g, " ").toUpperCase()}</p>
          <p>
            <strong>Severity:</strong>{" "}
            <span style={{
              background: severityColor(result.severity),
              color: "#fff", padding: "2px 10px", borderRadius: 12, fontWeight: "bold"
            }}>
              {result.severity}/5
            </span>
          </p>
          <p><strong>Description:</strong> {result.description}</p>
          <p><strong>Authority:</strong> {result.suggested_authority?.replace(/_/g, " ")}</p>
          <p><strong>Urgent:</strong> {result.urgent ? "🚨 Yes" : "✅ No"}</p>
          <p><strong>Confidence:</strong> {Math.round(result.confidence * 100)}%</p>
        </div>
      )}
    </div>
  );
}