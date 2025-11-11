import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileUser() {
  const [user, setUser] = useState(null);
  const [level, setLevel] = useState(localStorage.getItem("level") || "standar"); // ✅ state baru
  const nav = useNavigate();

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) {
      setUser({
        name: savedUser.user_metadata?.fullname || "Pengguna",
        email: savedUser.email,
        age: savedUser.user_metadata?.age || "-",
      });
    } else {
      nav("/login");
    }
  }, [nav]);

  // 🔹 Jika user ubah dropdown
  const handleLevelChange = (e) => {
    const newLevel = e.target.value;
    setLevel(newLevel); // update state
    localStorage.setItem("level", newLevel); // simpan ke localStorage
  };

  if (!user) return null;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <h2>👤 Profil Pengguna</h2>
        <p>
          <b>Nama:</b> {user.name}
        </p>
        <p>
          <b>Email:</b> {user.email}
        </p>
        <p>
          <b>Umur:</b> {user.age} tahun
        </p>

        {/* 🔹 Dropdown Toleransi */}
        <div style={{ marginTop: "20px" }}>
          <label><b>Tingkat Toleransi:</b></label>
          <select
            value={level}
            onChange={handleLevelChange}
            style={{ marginLeft: "10px" }}
          >
            <option value="pemula">Pemula (60)</option>
            <option value="standar">Standar (70)</option>
            <option value="intermediate">Intermediate (80)</option>
          </select>
        </div>

        <button className="back-btn" onClick={() => nav("/")}>
          ⬅️ Kembali
        </button>
      </div>
    </div>
  );
}
