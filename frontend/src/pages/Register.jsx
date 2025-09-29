import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "../services/supabaseClient";

export default function Register() {
  const [nama, setNama] = useState("");
  const [umur, setUmur] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const nav = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMsg("");
  
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          fullname: nama,
          age: umur,
        },
      },
    });
  
    if (error) {
      setErrorMsg("❌ Gagal daftar: " + error.message);
    } else {
      const user = data.user;
  
      if (user) {
        await supabase.from("profiles").insert([
          {
            id: user.id,
            email: email,
            nama: nama,
            age: umur,
          },
        ]);
      }
  
      // ❌ hapus localStorage & redirect langsung ke Home
      // localStorage.setItem("user", JSON.stringify(data.user));
      // nav("/");
  
      // ✅ munculkan popup lalu redirect ke login
      alert("✅ Registrasi berhasil! Silakan login dengan akun Anda.");
      nav("/login");
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleRegister}>
        <h2>Register</h2>

        {errorMsg && <p style={{ color: "red", textAlign: "center" }}>{errorMsg}</p>}

        <input
          type="text"
          placeholder="Nama Lengkap"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Umur"
          value={umur}
          onChange={(e) => setUmur(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password (min. 6 karakter)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Daftar</button>
        <p>
          Sudah punya akun? <Link to="/login">Login di sini</Link>
        </p>
      </form>
    </div>
  );
}
