import React, { useRef, useState, useEffect } from "react";
import { uploadImage } from "../services/api";

export default function CameraCapture({ onResult }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [stream, setStream] = useState(null);
  const [loading, setLoading] = useState(false);
  const [facingMode, setFacingMode] = useState("environment");

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, [facingMode]);

  const startCamera = async () => {
    try {
      stopCamera();
      const s = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
        audio: false,
      });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
    } catch (err) {
      console.error("camera error", err);
      alert("Gagal akses kamera. Periksa izin browser.");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
  };

  const capture = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob(async (blob) => {
      if (!blob) return;
      setLoading(true);
      const file = new File([blob], "capture.jpg", { type: "image/jpeg" });
      try {
        const res = await uploadImage(file);
        onResult(res);
      } catch (e) {
        console.error(e);
        onResult({ score: 0, feedback: "Gagal mengirim foto." });
      } finally {
        setLoading(false);
      }
    }, "image/jpeg", 0.9);
  };

  const switchCamera = () => {
    setFacingMode((f) => (f === "environment" ? "user" : "environment"));
  };

  return (
    <div className="wp-card">
      <h4>📷 Kamera — Tangkap Tulisan</h4>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="wp-video"
      />
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="wp-btn-group">
        <button className="wp-btn primary" onClick={capture} disabled={loading}>
          📸 Tangkap
        </button>
        <button className="wp-btn secondary" onClick={switchCamera}>
          🔄 Ganti Kamera
        </button>
      </div>

      {loading && <div className="wp-loading">Mengirim & memeriksa...</div>}
    </div>
  );
}
