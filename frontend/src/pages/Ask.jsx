import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
  
export default function Ask() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const nav = useNavigate();

  const BACKEND_URL = "https://alquran-backend-941267709419.asia-southeast2.run.app";

  // 🔹 Fungsi untuk kirim pertanyaan ke AI
  const handleAsk = async (inputText) => {
    const finalQuestion = inputText || question;
    if (!finalQuestion.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post(`${BACKEND_URL}/ask`, { question: finalQuestion });
      const aiAnswer = res.data.answer || "Tidak ada jawaban.";
      setAnswer(aiAnswer);
      setQuestion(""); // 🔹 Hapus teks setelah dikirim

      // 🔹 TTS otomatis setelah AI menjawab
      const ttsUrl = `${BACKEND_URL}/feedback-tts?feedback=${encodeURIComponent(aiAnswer)}`;
      setAudioUrl(ttsUrl);
    } catch (err) {
      setAnswer("❌ Gagal mendapatkan jawaban. Coba lagi nanti.");
    }
    setLoading(false);
  };

  // 🎙️ Rekam suara & kirim ke STT
  const handleRecord = async () => {
    if (recording) {
      mediaRecorder.stop();
      setRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      let chunks = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = async () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        const formData = new FormData();
        formData.append("file", blob, "voice.webm");

        try {
          // 🔹 Kirim ke backend STT
          const res = await axios.post(`${BACKEND_URL}/scan-audio`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
          const textResult = res.data.text || "";
          if (textResult) {
            setQuestion(textResult);
            handleAsk(textResult); // langsung kirim ke AI
          }
        } catch (err) {
          console.error(err);
          alert("Gagal mengenali suara.");
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setRecording(true);
    } catch (err) {
      alert("Mikrofon tidak tersedia atau izin ditolak.");
    }
  };

  return (
    <div className="container">
      <div className="wp-topbar">
        <button className="wp-back-btn" onClick={() => nav("/")}>
          ⬅️ Kembali ke Home
        </button>
      </div>
      <h2 style={{ textAlign: "center" }}>💬 Bertanya</h2>
      <p>
        Tanyakan apa saja seputar huruf hijaiyah, cara membaca, atau makna ayat
        Al-Qur’an.
      </p>

      <textarea
        placeholder="Tulis pertanyaan kamu di sini..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
        <button onClick={() => handleAsk()} disabled={loading}>
          {loading ? "Mengirim..." : "Kirim Pertanyaan"}
        </button>
        <button
          onClick={handleRecord}
          style={{
            backgroundColor: recording ? "#e74c3c" : "#2ecc71",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "8px 14px",
          }}
        >
          {recording ? "⏹️ Stop" : "🎤 Rekam"}
        </button>
      </div>

      {answer && (
        <div className="answer-box" style={{ marginTop: "20px" }}>
          <h4>Jawaban:</h4>
          <p dangerouslySetInnerHTML={{ __html: answer.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") }}></p>
          {audioUrl && (
            <audio controls style={{ marginTop: "10px" }}>
              <source src={audioUrl} type="audio/mpeg" />
              Browser kamu tidak mendukung audio.
            </audio>
          )}
        </div>
      )}
    </div>
  );
}
