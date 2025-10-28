import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Document, Page, pdfjs } from "react-pdf";

// ✅ agar PDF bisa dirender di browser (wajib)
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

export default function Book() {
  const nav = useNavigate();
  const [activeTab, setActiveTab] = useState("buku");
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [numPages, setNumPages] = useState(null);

  const chapters = [
    {
      id: 1,
      title: "BAB 1: MENGENAL HURUF & BUNYI DASAR",
      pdf: "/pdf/Konten_BBA1.pdf",
      desc: "Huruf Arab disebut huruf Hijaiyah. Setiap huruf memiliki bentuk khas yang ketika
            ditulis berdiri sendiri disebut isolat (terpisah). Nanti kita akan belajar bentuknya ketika disambung.",
    },
    {
      id: 2,
      title: "BAB 2: MENULIS KATA-KATA FAMILIAR",
      pdf: "/pdf/Konten_BBA2.pdf",
      desc: "Pahami Kata-Kata yang familiar dalam bahasa Arab khususnya di bacaan Al Quran.",
    },
    {
      id: 3,
      title: "BAB 3: MELANGKAH KE AYAT AL-QURAN",
      pdf: "/pdf/Konten_BBA3.pdf",
      desc: "Pelajari Ayat Al Quran dengan latihan membaca dan menulis.",
    },
    {
      id: 4,
      title: "BAB 4: MENGUASAI SELURUH HURUF",
      pdf: "/pdf/Konten_BBA4.pdf",
      desc: "Kuasi Seluruh Huruf yang ada agar makin mahir dalam membaca maupun menulis Al Quran.",
    },
    {
      id: 1,
      title: "BAB 5: HUKUM TAJWID DASAR",
      pdf: "/pdf/Konten_BBA5.pdf",
      desc: "Pelajari Tajwid dari Hukum Nun maupun Hukum Mim.",
    },
  ];

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  const nextPage = () => setPageNumber(p => Math.min(p + 1, numPages));
  const prevPage = () => setPageNumber(p => Math.max(p - 1, 1));

  return (
    <div className="container">
      <div className="wp-topbar">
        <button className="wp-back-btn" onClick={() => nav("/")}>
          ⬅️ Kembali ke Home
        </button>
      </div>

      <h2 style={{ textAlign: "center", margin: "20px 0" }}>📚 Buku & Animasi</h2>

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
            // 📄 Viewer PDF
            <div className="pdf-viewer" style={{ textAlign: "center" }}>
              <button
                onClick={() => setSelectedChapter(null)}
                style={{
                  marginBottom: "10px",
                  padding: "8px 16px",
                  background: "#eee",
                  borderRadius: "6px",
                  cursor: "pointer"
                }}
              >
                ⬅️ Kembali ke Daftar Bab
              </button>

              <div style={{ margin: "10px 0" }}>
                <Document
                  file={selectedChapter.file}
                  onLoadSuccess={onDocumentLoadSuccess}
                  loading={<p>📥 Memuat buku...</p>}
                >
                  <Page pageNumber={pageNumber} renderTextLayer={false} renderAnnotationLayer={false} scale={1.2} />
                </Document>
                <p>
                  Halaman {pageNumber} dari {numPages || "?"}
                </p>
                <div>
                  <button onClick={prevPage} disabled={pageNumber <= 1}>⬅️ Sebelumnya</button>
                  <button onClick={nextPage} disabled={pageNumber >= numPages} style={{ marginLeft: "10px" }}>Berikutnya ➡️</button>
                </div>
              </div>
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

