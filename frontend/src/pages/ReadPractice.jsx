import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AudioRecorder from "../components/AudioRecorder";
import ResultCard from "../components/ResultCard";
import { saveProgress } from "../services/api";

export default function ReadPractice() {
  const nav = useNavigate();
  const [result, setResult] = useState(null);

  const handleResult = async (res) => {
    setResult(res);
    try {
      await saveProgress({ type: "read", score: res.score });
    } catch (e) {
      console.warn("save progress failed", e);
    }
  };

  return (
    <div className="readpractice-container">
      {/* Tombol kembali */}
      {/* <button className="back-btn" onClick={() => nav("/")}>
        ⬅️ Kembali ke Home
      </button> */}
      <div className="wp-topbar">
        <button className="wp-back-btn" onClick={() => nav("/")}>
          ⬅️ Kembali ke Home
        </button>
      </div>

      <div className="readpractice-card">
        <h3>Latihan Membaca (Tilawah)</h3>
        <p className="small">
          Rekam bacaan dan dapatkan penilaian. Sistem menilai kemiripan teks hasil STT dengan teks target.
        </p>
      </div>

      <AudioRecorder onResult={handleResult} />
      <ResultCard result={result} />
    </div>
  );
}
