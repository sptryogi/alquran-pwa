import { useState, useRef } from "react";
import { uploadAudio } from "../services/api";

export default function AudioRecorder({ onResult }) {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef(null);
  const chunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      chunks.current = [];
      mediaRecorderRef.current.ondataavailable = (e) =>
        chunks.current.push(e.data);

      mediaRecorderRef.current.onstop = async () => {
        setLoading(true);
        const blob = new Blob(chunks.current, { type: "audio/webm" });
        const file = new File([blob], "recording.webm", { type: "audio/webm" });
        try {
          const res = await uploadAudio(file);
          onResult(res);
        } catch (err) {
          console.error(err);
          onResult({ score: 0, feedback: "Gagal memproses audio." });
        } finally {
          setLoading(false);
        }
      };

      mediaRecorderRef.current.start();
      setRecording(true);
    } catch (e) {
      alert("Izin mic ditolak atau tidak tersedia.");
      console.error(e);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) mediaRecorderRef.current.stop();
    setRecording(false);
  };

  return (
    <div className="readpractice-card recorder-card">
      <h4>🎙️ Rekam Bacaan</h4>
      <div className="recorder-actions">
        {!loading && (
          !recording ? (
            <button className="btn" onClick={startRecording}>
              ▶ Mulai Rekam
            </button>
          ) : (
            <button className="btn secondary" onClick={stopRecording}>
              ⏹ Stop
            </button>
          )
        )}
      </div>
      {loading && <div className="loading-text">⏳ Memproses audio...</div>}
    </div>
  );
}
