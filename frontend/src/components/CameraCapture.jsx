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
    // Dimensi asli video
    const videoWidth = video.videoWidth;
    const videoHeight = video.videoHeight;

    // === LOGIKA CROPPING BARU ===
    const cropHeight = videoHeight * 0.35; // Ganti dari 0.20
    const cropWidth = videoWidth * 0.90; // Ambil 90% lebar
    const cropY = (videoHeight - cropHeight) / 2; // Posisi Y di tengah

    // Set canvas ke ukuran area yang akan di-crop (lebar penuh, tinggi ter-crop)
    canvas.width = videoWidth;
    canvas.height = cropHeight;

    const ctx = canvas.getContext("2d");
    // Gambar hanya area yang di-crop dari video ke canvas
    ctx.drawImage(
      video,
      0, // sx: mulai X sumber
      cropY, // sy: mulai Y sumber (pusat vertikal)
      videoWidth, // sWidth: lebar sumber
      cropHeight, // sHeight: tinggi sumber
      0, // dx: mulai X tujuan
      0, // dy: mulai Y tujuan
      videoWidth, // dWidth: lebar tujuan
      cropHeight // dHeight: tinggi tujuan
    );

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
      {/* NEW: Container untuk overlay panduan */}
      <div className="camera-viewport-container"> 
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="wp-video"
        />
        {/* NEW: Overlay Panduan (akan diatur di CSS) */}
        <div className="cropping-guide-overlay">
          <div className="cropping-line"></div>
        </div>
      </div>
      {/* END NEW */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      <div className="wp-btn-group camera-controls">
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
