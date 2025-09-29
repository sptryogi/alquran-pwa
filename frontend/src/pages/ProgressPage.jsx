import React, { useEffect, useState } from "react";
import { getProgress } from "../services/api";
import { supabase } from "../services/supabaseClient";

export default function ProgressPage() {
  const [progress, setProgress] = useState({ write: 0, read: 0, writeCount: 0, readCount: 0 });
  const [greeting, setGreeting] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const p = await getProgress(user.id);
        setProgress(p);

        const avg = (p.write + p.read) / 2;
        if (avg >= 75) {
          setGreeting("🎉 Bagus! Tingkatkan belajar kamu, pertahankan prestasimu! 🚀");
        } else {
          setGreeting("💡 Terus belajar yang giat ya, konsistensi itu kuncinya. Semangat! 💪");
        }
      } catch (e) {
        console.warn(e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const writePercent = Math.round(progress.write);
  const readPercent = Math.round(progress.read);

  if (loading) {
    return <div className="container"><p>⏳ Memuat progress...</p></div>;
  }

  return (
    <div className="container">
      <div className="card center" style={{ padding: "20px", borderRadius: "12px", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
        <h2 style={{ marginBottom: "10px" }}>📊 Progress Latihan</h2>
        <p className="small">Ringkasan akumulasi skor rata-rata dari latihan menulis & membaca.</p>

        <div style={{ marginTop: 16, textAlign: "left", width: "100%" }}>
          <div style={{ marginBottom: 8 }}>
            ✍️ Menulis — Rata-rata: <b>{writePercent}%</b> ({progress.writeCount} latihan)
          </div>
          <div className="progress-bar">
            <div
              className={`progress-bar-inner progress-write`}
              style={{ width: `${writePercent}%` }}
            />
          </div>
          <div style={{ marginTop: 20, marginBottom: 8 }}>
            📖 Membaca — Rata-rata: <b>{readPercent}%</b> ({progress.readCount} latihan)
          </div>
          <div className="progress-bar">
            <div
              className={`progress-bar-inner progress-read`}
              style={{ width: `${readPercent}%` }}
            />
          </div>
        </div>

        <div style={{ marginTop: 24, fontStyle: "italic", color: "#444" }}>
          {greeting}
        </div>

        <button
          onClick={() => (window.location.href = "/")}
          style={{
            marginTop: 28,
            padding: "12px 20px",
            background: "linear-gradient(135deg, #4CAF50, #45a049)",
            color: "white",
            border: "none",
            borderRadius: "25px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
            transition: "transform 0.2s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          ⬅️ Kembali ke Home
        </button>
      </div>
    </div>
  );
}
