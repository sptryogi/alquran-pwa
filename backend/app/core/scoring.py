# from rapidfuzz import fuzz
# from app.utils import normalize_arabic

# KKM = 75  # passing threshold

# def score_text(recognized: str, target: str):
#     rec_norm = normalize_arabic(recognized)
#     tgt_norm = normalize_arabic(target)
#     # if both empty
#     if not rec_norm and not tgt_norm:
#         return 0, "Tidak ada teks dikenali."
#     # compute similarity ratio (0..100)
#     ratio = int(fuzz.ratio(rec_norm, tgt_norm))
#     feedback = ""
#     if ratio >= KKM:
#         feedback = "Selamat! Lulus. Lanjutkan latihan berikutnya."
#     else:
#         feedback = suggest_feedback(rec_norm, tgt_norm)
#     return ratio, feedback

# def suggest_feedback(rec, target):
#     # very simple heuristics: show which characters differ
#     if not rec:
#         return "Tulisan/rekaman tidak terbaca. Coba foto/rekam lebih jelas."
#     # find some diffs (very basic)
#     if len(rec) < len(target):
#         return "Kurang lengkap — coba tulis/ucapkan seluruh potongan ayat."
#     return "Perhatikan huruf/ucapan yang berbeda. Latih pengucapan huruf yang mirip."
import pandas as pd
import random
from rapidfuzz import fuzz
import requests
from app.utils import normalize_arabic
import os

KKM = 75

DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")
DEEPSEEK_URL = "https://api.deepseek.com/v1/chat/completions"
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
EXCEL_PATH = os.path.join(BASE_DIR, "targets.xlsx")

# Load dataset target ayat
# targets_df = pd.read_excel(EXCEL_PATH)  # <-- file ayat Al-Qur'an

from rapidfuzz import process

# --- Tahap 1: Persiapan Data (Hanya dijalankan sekali saat modul di-load) ---
def load_and_normalize_targets():
    """
    Memuat data dari Excel dan melakukan normalisasi pada semua target ayat.
    Fungsi ini hanya dijalankan sekali.
    """
    print("Memuat dan menormalisasi target ayat dari Excel...")
    try:
        df = pd.read_excel(EXCEL_PATH)
        # Buat list kandidat yang sudah dinormalisasi
        normalized_list = [normalize_arabic(str(ayat)) for ayat in df["ayat_arab"]]
        print("Normalisasi target selesai.")
        return normalized_list
    except Exception as e:
        print(f"Error saat memuat file Excel: {e}")
        return []

# Variabel global untuk menyimpan target yang sudah dinormalisasi
NORMALIZED_TARGETS = load_and_normalize_targets()
# --------------------------------------------------------------------------


def find_best_target(recognized: str):
    """Cari ayat_arab paling mirip dari daftar yang sudah dinormalisasi."""
    # Tidak perlu normalisasi berulang kali di sini!
    # Langsung gunakan variabel global NORMALIZED_TARGETS
    if not NORMALIZED_TARGETS:
        return None, 0

    # Gunakan process.extractOne dengan scorer fuzz.ratio
    result = process.extractOne(recognized, NORMALIZED_TARGETS, scorer=fuzz.ratio)
    if result:
        match, score, idx = result
        return match, score
    return None, 0


# def score_text(recognized: str):
#     rec_norm = normalize_arabic(recognized)

#     # Kalau hasil OCR kosong, tetap coba kasih ke AI
#     if not rec_norm:
#         best_target, similarity = find_best_target(" ")  # pakai string kosong
#         if not best_target:
#             return 0, "OCR gagal total, tidak ada teks yang bisa dinilai."
#         return 0, f"Tidak ada teks dikenali dengan jelas. Mungkin maksudmu: {best_target}"

#     # Cari target paling mirip
#     best_target, similarity = find_best_target(rec_norm)

#     # Selalu kirim ke AI, meski similarity kecil
#     if not best_target:
#         return 0, "Tidak ada ayat di dataset untuk dibandingkan."

#     # Baseline skor
#     ratio = int(similarity)

#     # Kirim ke AI untuk analisis lebih pintar
#     feedback = get_ai_feedback(rec_norm, best_target, ratio)

#     return ratio, feedback

# def get_ai_feedback(rec: str, target: str, base_score: int):
#     if not DEEPSEEK_API_KEY:
#         return "⚠️ AI feedback tidak aktif (API key tidak ada)."

#     prompt = f"""
#     Kamu adalah asisten pengajar Al-Qur'an.
#     Berikut teks target ayat:
#     {target}

#     Berikut hasil siswa:
#     {rec}

#     Nilai awal kesamaan (fuzz ratio): {base_score}.

#     Tugasmu:
#     - Periksa apakah bacaan/tulisan benar.
#     - Beri penilaian 0–100 (boleh gunakan nilai awal sebagai acuan).  
#     - Jika bacaan berbeda ayat, cukup beri nilai rendah + saran singkat.
#     - Jika di atas 75 → katakan '✅ Lulus, lanjutkan belajar.'
#     - Jika di bawah itu → berikan saran detail bagian mana salah (huruf, panjang pendek, atau tajwid).
#     """

#     try:
#         r = requests.post(
#             DEEPSEEK_URL,
#             headers={"Authorization": f"Bearer {DEEPSEEK_API_KEY}", "Content-Type": "application/json"},
#             json={
#                 "model": "deepseek-chat",
#                 "messages": [{"role": "user", "content": prompt}],
#                 "temperature": 0.3
#             }
#         )
#         data = r.json()
#         return data["choices"][0]["message"]["content"].strip()
#     except Exception as e:
#         print("DeepSeek error:", e)
#         return "Feedback AI gagal, gunakan hasil Rapidfuzz saja."
def score_text(recognized: str):
    rec_norm = normalize_arabic(recognized)

    if not rec_norm:
        best_target, similarity = find_best_target(" ")
        if not best_target:
            return 0, "OCR gagal total, tidak ada teks yang bisa dinilai."
        return 0, f"Tidak ada teks dikenali dengan jelas. Mungkin maksudmu: {best_target}"

    # Cari target paling mirip
    best_target, similarity = find_best_target(rec_norm)

    if not best_target:
        return 0, "Tidak ada ayat di dataset untuk dibandingkan."

    # === Ambil skor & feedback dari AI ===
    ai_score, feedback = get_ai_feedback(rec_norm, best_target, similarity)

    return ai_score, feedback


def get_ai_feedback(rec: str, target: str, base_score: int):
    if not DEEPSEEK_API_KEY:
        return base_score, "⚠️ AI feedback tidak aktif (API key tidak ada)."

    prompt = f"""
    Kamu adalah asisten pengajar Al-Qur'an.
    Berikut teks target ayat:
    {target}

    Berikut hasil siswa:
    {rec}

    Nilai awal kesamaan (fuzz ratio): {base_score}.

    Tugasmu:
    - Periksa apakah bacaan/tulisan benar.
    - Beri penilaian akhir berupa angka 0–100.
    - Tulis hasil penilaian detail dengan format:
      Nilai: <angka>
      Penilaian: <teks saran>
    """

    try:
        r = requests.post(
            DEEPSEEK_URL,
            headers={
                "Authorization": f"Bearer {DEEPSEEK_API_KEY}",
                "Content-Type": "application/json"
            },
            json={
                "model": "deepseek-chat",
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.3
            }
        )
        data = r.json()
        raw_text = data["choices"][0]["message"]["content"].strip()

        # --- Ekstrak angka nilai ---
        import re
        match = re.search(r"(\d{1,3})", raw_text)
        ai_score = int(match.group(1)) if match else base_score

        # Bersihkan feedback (hapus angka nilai di depan, sisakan teks saran)
        feedback = re.sub(r"Nilai:\s*\d{1,3}", "", raw_text, flags=re.IGNORECASE).strip()

        return ai_score, feedback
    except Exception as e:
        print("DeepSeek error:", e)
        return base_score, "Feedback AI gagal, gunakan hasil Rapidfuzz saja."
