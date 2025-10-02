import React, { useState } from "react";

export default function Book() {
  const [activeTab, setActiveTab] = useState("buku");

  const chapters = [
    { id: 1, title: "Bab 1: Huruf Hijaiyah", text: "Penjelasan lengkap huruf hijaiyah ..." , video: "https://www.youtube.com/embed/VIDEO_ID1" },
    { id: 2, title: "Bab 2: Harakat", text: "Harakat menjelaskan panjang pendek bacaan ..." , video: "https://www.youtube.com/embed/VIDEO_ID2" },
  ];

  return (
    <div className="container">
      <h2>📚 Buku & Animasi</h2>
      
      {/* Tab Switcher */}
      <div className="tab-buttons">
        <button onClick={() => setActiveTab("buku")} className={activeTab==="buku" ? "active" : ""}>Buku</button>
        <button onClick={() => setActiveTab("animasi")} className={activeTab==="animasi" ? "active" : ""}>Animasi</button>
      </div>

      {/* Konten Buku */}
      {activeTab === "buku" && (
        <div className="chapter-list">
          {chapters.map(ch => (
            <div key={ch.id} className="chapter-card">
              <h3>{ch.title}</h3>
              <p>{ch.text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Konten Animasi */}
      {activeTab === "animasi" && (
        <div className="chapter-list">
          {chapters.map(ch => (
            <div key={ch.id} className="chapter-card">
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
