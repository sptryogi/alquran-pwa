import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Book() {
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState("buku");
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  const chapters = [
    { id: 1, title: "Bab 1: Huruf Hijaiyah", file: "/pdf/Konten_BBA1.pdf", video: "https://www.youtube.com/embed/VIDEO_ID1" },
    { id: 2, title: "Bab 2: Mencoba Latihan Baca dan Tulis", file: "/pdf/Konten_BBA2.pdf", video: "https://www.youtube.com/embed/VIDEO_ID2" },
    { id: 3, title: "Bab 3: Mengenali Huruf Familiar", file: "/pdf/Konten_BBA3.pdf", video: "https://www.youtube.com/embed/VIDEO_ID2" },
    { id: 4, title: "Bab 4: Menguasai Huruf Hijaiyah", file: "/pdf/Konten_BBA4.pdf", video: "https://www.youtube.com/embed/VIDEO_ID2" },
    { id: 5, title: "Bab 5: Tajwid Dasar", file: "/pdf/Konten_BBA5.pdf", video: "https://www.youtube.com/embed/VIDEO_ID2" },
  ];

  // ✅ Deteksi perangkat (mobile vs desktop)
  useEffect(() => {
    const checkMobile = window.innerWidth < 768;
    setIsMobile(checkMobile);
  }, []);

  // ✅ Jika mobile & chapter dipilih, langsung buka PDF fullscreen
  useEffect(() => {
    if (isMobile && selectedChapter) {
      window.location.href = selectedChapter.file;
    }
  }, [selectedChapter, isMobile]);

  // 🔹 Fungsi untuk membuka fullscreen manual (desktop)
  const openFullscreen = (file) => {
    const viewer = document.createElement("iframe");
    viewer.src = file;
    viewer.style.position = "fixed";
    viewer.style.top = "0";
    viewer.style.left = "0";
    viewer.style.width = "100vw";
    viewer.style.height = "100vh";
    viewer.style.zIndex = "9999";
    viewer.style.border = "none";
    viewer.style.backgroundColor = "white";

    // Tombol tutup di fullscreen
    const closeBtn = document.createElement("button");
    closeBtn.innerText = "✖ Tutup";
    closeBtn.style.position = "fixed";
    closeBtn.style.top = "10px";
    closeBtn.style.right = "10px";
    closeBtn.style.padding = "10px 14px";
    closeBtn.style.background = "#007bff";
    closeBtn.style.color = "white";
    closeBtn.style.border = "none";
    closeBtn.style.borderRadius = "8px";
    closeBtn.style.cursor = "pointer";
    closeBtn.style.zIndex = "10000";

    closeBtn.onclick = () => {
      viewer.remove();
      closeBtn.remove();
    };

    document.body.appendChild(viewer);
    document.body.appendChild(closeBtn);
  };

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
            // Viewer PDF untuk desktop
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
                }}
              >
                ⬅️ Kembali ke Daftar Bab
              </button>

              {/* Fullscreen Button */}
              {!isMobile && (
                <button
                  onClick={() => openFullscreen(selectedChapter.file)}
                  style={{
                    marginLeft: "10px",
                    padding: "8px 16px",
                    background: "#28a745",
                    color: "white",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  ⛶ Buka Fullscreen
                </button>
              )}

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
                <iframe
                  src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${window.location.origin}${selectedChapter.file}`}
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
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
