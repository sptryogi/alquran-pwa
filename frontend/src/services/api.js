// const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
const API = "https://alquran-backend-jsscmo6pma-et.a.run.app"

/** Upload image file to backend */
export async function uploadImage(file) {
  const fd = new FormData();
  fd.append("file", file);
  // target_text optionally can be passed via form; for MVP backend uses default target
  const resp = await fetch(`${API}/scan-image`, {
    method: "POST",
    body: fd
  });
  if (!resp.ok) throw new Error("uploadImage failed");
  return resp.json();
}

/** Upload audio file to backend */
export async function uploadAudio(file) {
  const fd = new FormData();
  fd.append("file", file);
  const resp = await fetch(`${API}/scan-audio`, {
    method: "POST",
    body: fd
  });
  if (!resp.ok) throw new Error("uploadAudio failed");
  return resp.json();
}


import { supabase } from "./supabaseClient";


export async function saveProgress({ type, score }) {
  // Ambil user login
  const { data, error: userError } = await supabase.auth.getUser();
  if (userError) throw userError;

  const user = data?.user;
  if (!user) throw new Error("User not logged in");

  // Simpan progress
  const { error } = await supabase.from("progress").insert({
    user_id: user.id,   // foreign key ke auth.users
    type,
    score,
  });

  if (error) throw error;
  return true;
}

// Ambil progress user
export async function getProgress(userId) {
  // ambil semua progress milik user
  const { data, error } = await supabase
    .from("progress")
    .select("type, score")
    .eq("user_id", userId);

  if (error) throw error;

  if (!data || data.length === 0) {
    return { write: 0, read: 0, writeCount: 0, readCount: 0 };
  }

  // hitung rata-rata & jumlah
  let writeSum = 0, writeCount = 0, readSum = 0, readCount = 0;
  data.forEach(item => {
    if (item.type === "write") {
      writeSum += item.score;
      writeCount++;
    } else if (item.type === "read") {
      readSum += item.score;
      readCount++;
    }
  });

  return {
    write: writeCount ? writeSum / writeCount : 0,
    read: readCount ? readSum / readCount : 0,
    writeCount,
    readCount,
  };
}
