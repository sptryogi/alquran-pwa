import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// import dynamic agar tidak error SSR Vercel
import dynamic from "next/dynamic";

const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false });

export default function Book() {
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState("buku");

  const chapters = [
    {
      id: 1,
      title: "Bab 1: Huruf Hijaiyah",
      pdf: "/pdf/Konten_BBA1.pdf",
      desc: "Pelajari huruf hijaiyah dengan latihan membaca dan menulis.",
    },
    {
      id: 2,
      title: "Bab 2: Harakat",
      pdf: "/pdf/Konten_BBA2.pdf",
      desc: "Pahami tanda harakat untuk bacaan panjang dan pendek.",
    },
  ];

  const [selectedPDF, setSelectedPDF] = useState(null);

  return (
    <div className="container">
      <div className="wp-topbar">
        <button className="wp-back-btn" onClick={() => nav("/")}>
          ⬅️ Kembali ke Home
        </button>
      </div>

      <h2 style={{ textAlign: "center", margin: "20px 0" }}>📚 Buku & Animasi</h2>

      {/* Tab Switcher */}
      <div style={{ textAlign: "center", marginBottom: 20 }}>
        <button onClick={() => setActiveTab("buku")} className={activeTab === "buku" ? "active" : ""}>Buku</button>
        <button onClick={() => setActiveTab("animasi")} className={activeTab === "animasi" ? "active" : ""}>Animasi</button>
      </div>

      {activeTab === "buku" && !selectedPDF && (
        <div className="chapter-list">
          {chapters.map(ch => (
            <div key={ch.id} className="chapter-card" onClick={() => setSelectedPDF(ch.pdf)}>
              <h3>{ch.title}</h3>
              <p>{ch.desc}</p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "buku" && selectedPDF && (
        <div className="pdf-viewer">
          <button
            onClick={() => setSelectedPDF(null)}
            style={{ marginBottom: 12 }}
          >
            ⬅️ Kembali ke Daftar Bab
          </button>
          <iframe
            src={`https://mozilla.github.io/pdf.js/web/viewer.html?file=${encodeURIComponent(selectedPDF)}`}
            width="100%"
            height="600px"
            title="PDF Viewer"
            style={{ border: "none" }}
          ></iframe>
        </div>
      )}

      {activeTab === "animasi" && (
        <div className="chapter-list">
          {chapters.map(ch => (
            <div key={ch.id} className="chapter-card">
              <h3>{ch.title}</h3>
              <iframe
                width="100%"
                height="200"
                src="https://www.youtube.com/embed/VIDEO_ID"
                title={ch.title}
                allowFullScreen
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
