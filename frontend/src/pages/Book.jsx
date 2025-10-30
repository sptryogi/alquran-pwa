import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Book() {
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState("buku");
  const [selectedChapter, setSelectedChapter] = useState(null);

  const chapters = [
    { id: 1, title: "Bab 1: Huruf Hijaiyah", file: "/pdf/Konten_BBA1.pdf", video: "https://www.youtube.com/embed/VIDEO_ID1" },
    { id: 2, title: "Bab 2: Mencoba Latihan Baca dan Tulis", file: "/pdf/Konten_BBA2.pdf", video: "https://www.youtube.com/embed/VIDEO_ID2" },
    { id: 3, title: "Bab 3: Mengenali Huruf Familiar", file: "/pdf/Konten_BBA3.pdf", video: "https://www.youtube.com/embed/VIDEO_ID2" },
    { id: 4, title: "Bab 4: Menguasai Huruf Hijaiyah", file: "/pdf/Konten_BBA4.pdf", video: "https://www.youtube.com/embed/VIDEO_ID2" },
    { id: 5, title: "Bab 5: Tajwid Dasar", file: "/pdf/Konten_BBA5.pdf", video: "https://www.youtube.com/embed/VIDEO_ID2" },
  ];

  return (
    <div className="container">
      {/* === TOP BAR === */}
      <div className="wp-topbar">
        <button className="wp-back-btn" onClick={() => nav("/")}>
          ⬅️ Kembali ke Home
        </button>
      </div>

      <h2 style={{ textAlign: "center", margin: "20px 0" }}>📚 Buku & Animasi</h2>

      {/* === TAB BUTTONS === */}
      <div className="tab-buttons" style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={() => setActiveTab("buku")}
          className={activeTab === "buku" ? "active" : ""}
        >
          Buku
        </button>
        <button
          onClick={() => setActiveTab("animasi")}
          className={activeTab === "animasi" ? "active" : ""}
        >
          Animasi
        </button>
      </div>

      {/* === TAB BUKU === */}
      {activeTab === "buku" && (
        <div className="chapter-list">
          {!selectedChapter ? (
            // Daftar Bab
            chapters.map((ch) => (
              <div
                key={ch.id}
                className="chapter-card-konten"
                style={{
                  cursor: "pointer",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}
                onClick={() => setSelectedChapter(ch)}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <h3>{ch.title}</h3>
                <p>Klik untuk membuka isi bab</p>
              </div>
            ))
          ) : (
            // Viewer PDF pakai embed
            <div className="pdf-viewer" style={{ textAlign: "center" }}>
              <button
                onClick={() => setSelectedChapter(null)}
                style={{
                  marginBottom: "10px",
                  padding: "8px 16px",
                  background: "#007bff",
                  color: "white",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  transition: "background 0.3s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#0056b3")}
                onMouseOut={(e) => (e.currentTarget.style.background = "#007bff")}
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
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              >
                <embed
                  src={selectedChapter.file}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* === TAB ANIMASI === */}
      {activeTab === "animasi" && (
        <div className="chapter-list">
          {chapters.map((ch) => (
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
                style={{
                  borderRadius: "10px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
