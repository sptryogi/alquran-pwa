import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    nav("/login");
  };

  return (
    <div className="container">
      {/* Header dengan tombol di kanan atas */}
      <div className="header">
        <h1>📖 Belajar Qur'an Interaktif</h1>
        <p>
          Latihan mandiri: menulis & membaca Al-Qur'an dengan validasi otomatis
        </p>
        <div className="header-buttons">
          <button className="profile-btn" onClick={() => nav("/profile")}>
            Profile
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="card">
        <h3>Selamat datang!</h3>
        <p className="small">
          Aplikasi ini membantu siswa belajar menulis huruf hijaiyah dan
          berlatih membaca (tilawah). Pilih fitur di bawah untuk memulai.
        </p>
      </div>

      <div className="feature-grid">
        <div className="feature" onClick={() => nav("/write")}>
          <div>✍️</div>
          <h4>Latihan Menulis</h4>
          <p>Scan tulisan huruf / potongan ayat untuk validasi.</p>
        </div>

        <div className="feature" onClick={() => nav("/read")}>
          <div>🔊</div>
          <h4>Latihan Membaca</h4>
          <p>Rekam bacaan ayat, sistem akan menilai pelafalan.</p>
        </div>

        <div
          className="feature"
          style={{ gridColumn: "1 / -1" }}
          onClick={() => nav("/progress")}
        >
          <h4>📊 Progress Saya</h4>
          <p>Lihat perkembangan latihan menulis & membaca.</p>
        </div>
      </div>
    </div>
  );
}
