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

  const handleResult = async (res) => {
    setResult(res);
    try {
      await saveProgress({ type: "write", score: res.score });
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
          Pilih mode di bawah untuk mulai berlatih. Kamu bisa mengunggah foto
          tulisan atau langsung menggunakan kamera untuk validasi otomatis.
        </p>

        {/* Mode Selector */}
        <div className="wp-mode-selector">
          <button
            className={`wp-btn ${mode === "upload" ? "active" : ""}`}
            onClick={() => setMode("upload")}
          >
            📁 Upload Gambar
          </button>
          <button
            className={`wp-btn ${mode === "camera" ? "active" : ""}`}
            onClick={() => setMode("camera")}
          >
            📷 Kamera Realtime
          </button>
        </div>
      </div>

      {/* Input Components */}
      {mode === "upload" && <ImageUpload onResult={handleResult} />}
      {mode === "camera" && <CameraCapture onResult={handleResult} />}

      {/* Hasil */}
      <ResultCard result={result} />
    </div>
  );
}
