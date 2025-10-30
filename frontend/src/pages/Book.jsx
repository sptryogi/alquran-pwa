import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Deteksi perangkat mobile sederhana
const isMobile = /Mobi|Android/i.test(navigator.userAgent);

export default function Book() {
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState("buku");
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);

  const chapters = [
    { id: 1, title: "Bab 1: Huruf Hijaiyah", file: "/pdf/Konten_BBA1.pdf", video: "https://www.youtube.com/embed/VIDEO_ID1" },
    { id: 2, title: "Bab 2: Mencoba Latihan Baca dan Tulis", file: "/pdf/Konten_BBA2.pdf", video: "https://www.youtube.com/embed/VIDEO_ID2" },
    { id: 3, title: "Bab 3: Mengenali Huruf Familiar", file: "/pdf/Konten_BBA3.pdf", video: "https://www.youtube.com/embed/VIDEO_ID2" },
    { id: 4, title: "Bab 4: Menguasai Huruf Hijaiyah", file: "/pdf/Konten_BBA4.pdf", video: "https://www.youtube.com/embed/VIDEO_ID2" },
    { id: 5, title: "Bab 5: Tajwid Dasar", file: "/pdf/Konten_BBA5.pdf", video: "https://www.youtube.com/embed/VIDEO_ID2" },
  ];

  // Tampilkan alert jika di mobile
  useEffect(() => {
    if (isMobile && selectedChapter) {
      alert("⚠️ Tampilan PDF mungkin tidak muncul di mode mobile.\nSilakan aktifkan Mode Desktop di browser Anda agar bisa membaca dengan benar.");
    }
  }, [selectedChapter]);

  return (
    <div className="container" style={{ position: "relative" }}>
      {/* === FULLSCREEN VIEWER === */}
      {fullscreen && selectedChapter && (
        <div
          className="fullscreen-viewer"
          style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100vw",
            height: "100vh",
            background: "#000",
            zIndex: 9999,
          }}
        >
          <button
            onClick={() => setFullscreen(false)}
            style={{
              position: "absolute",
              top: "10px",
              right: "10px",
              zIndex: 10000,
              background: "rgba(255,255,255,0.9)",
              border: "none",
              borderRadius: "6px",
              padding: "8px 12px",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            ❌ Tutup
          </button>

          <iframe
            src={`https://drive.google.com/viewerng/viewer?embedded=true&url=${window.location.origin}${selectedChapter.file}`}
            width="100%"
            height="100%"
            style={{ border: "none" }}
          />
        </div>
      )}

      {/* === HEADER === */}
      <div className="wp-topbar">
        <button className="wp-back-btn" onClick={() => nav("/")}>
          ⬅️ Kembali ke Home
        </button>
      </div>

      <h2 style={{ textAlign: "center", margin: "20px 0" }}>📚 Buku & Animasi</h2>

      {/* === TAB BUTTONS === */}
      <div className="tab-buttons" style={{ textAlign: "center", marginBottom: "20px" }}>
        <button onClick={() => setActiveTab("buku")} className={activeTab === "buku" ? "active" : ""}>Buku</button>
        <button onClick={() => setActiveTab("animasi")} className={activeTab === "animasi" ? "active" : ""}>Animasi</button>
      </div>

      {/* === TAB BUKU === */}
      {activeTab === "buku" && (
        <div className="chapter-list">
          {!selectedChapter ? (
            // 📖 Daftar Bab
            chapters.map(ch => (
              <div
                key={ch.id}
                className="chapter-card-konten"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedChapter(ch)}
              >
                <h3>{ch.title}</h3>
                <p>Klik untuk membuka isi bab</p>
              </div>
            ))
          ) : (
            // 📄 PDF Viewer dalam halaman
            <div className="pdf-viewer" style={{ textAlign: "center" }}>
              <button
                onClick={() => setSelectedChapter(null)}
                style={{
                  marginBottom: "10px",
                  padding: "8px 16px",
                  background: "#007bff",
                  color: "white",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                ⬅️ Kembali ke Daftar Bab
              </button>

              <div
                style={{
                  marginTop: "10px",
                  width: "100%",
                  height: "80vh",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  overflow: "hidden",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
                }}
              >
                <iframe
                  src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${window.location.origin}${selectedChapter.file}`}
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                />
              </div>

              {/* Tombol Fullscreen */}
              <button
                onClick={() => setFullscreen(true)}
                style={{
                  marginTop: "12px",
                  padding: "8px 14px",
                  background: "linear-gradient(135deg, #28a745, #218838)",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                🔍 Buka Layar Penuh
              </button>
            </div>
          )}
        </div>
      )}

      {/* === TAB ANIMASI === */}
      {activeTab === "animasi" && (
        <div className="chapter-list">
          {chapters.map(ch => (
            <div key={ch.id} className="chapter-card-konten">
              <h3>{ch.title}</h3>
              <iframe
                width="100%"
                height="200"
                src={ch.video}
                title={ch.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
