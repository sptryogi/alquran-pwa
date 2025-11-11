import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImageUpload from "../components/ImageUpload";
import CameraCapture from "../components/CameraCapture";
import ResultCard from "../components/ResultCard";
import { saveProgress } from "../services/api";

export default function WritePractice() {
  const nav = useNavigate();
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState("upload");

  // Fungsi untuk me-reset hasil dan kembali ke mode input
  const handleTryAgain = () => {
    setResult(null); 
  };

  const handleResult = async (res) => {
    setResult(res);
    try {
      await saveProgress({
        type: "write",
        score: res.score,
        level: localStorage.getItem("level") || "standar"
      });
    } catch (e) {
      console.warn("save progress failed", e);
    }
  };

  return (
    <div className="wp-container">
      {/* Tombol kembali */}
      <div className="wp-topbar">
        <button className="wp-back-btn" onClick={() => nav("/")}>
          ⬅️ Kembali ke Home
        </button>
      </div>

      {/* Header */}
      <div className="wp-card">
        <h2 className="wp-title">✍️ Latihan Menulis Al-Qur'an</h2>
        <p className="wp-description">
          Pilih mode di bawah untuk mulai berlatih. Anda bisa mengunggah foto
          tulisan atau langsung menggunakan kamera untuk validasi otomatis.
        </p>

        {/* Mode Selector */}
        <div className="wp-mode-selector">
          <button
            className={`wp-btn ${mode === "upload" ? "active" : ""}`}
            onClick={() => { setMode("upload"); handleTryAgain(); }}
            disabled={!!result} // Disable saat hasil tampil
          >
            📁 Upload Gambar
          </button>
          <button
            className={`wp-btn ${mode === "camera" ? "active" : ""}`}
            onClick={() => { setMode("camera"); handleTryAgain(); }}
            disabled={!!result} // Disable saat hasil tampil
          >
            📷 Kamera Realtime
          </button>
        </div>
      </div>

      {/* Input Components */}
      {!result && mode === "upload" && <ImageUpload onResult={handleResult} />}
      {!result && mode === "camera" && <CameraCapture onResult={handleResult} />}

      {/* Hasil */}
      {/* Result Card dan Tombol Coba Lagi (Hanya tampil JIKA result ada) */}
      {result && (
        <>
          <ResultCard result={result} />
          <div className="wp-card"> 
            <button className="wp-btn primary" onClick={handleTryAgain}>
                🔁 Coba Lagi / Mulai Lagi
            </button>
          </div>
        </>
      )}
    </div>
  );
}
