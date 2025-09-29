from PIL import Image
import pytesseract
import io
import cv2
import numpy as np
from app.utils import normalize_arabic

def preprocess_image_bytes(img_bytes: bytes) -> Image.Image:
    """
    Preprocess image untuk OCR:
    1. Deteksi dan perbaiki warna terbalik (teks terang di latar gelap).
    2. Konversi ke grayscale.
    3. Terapkan adaptive thresholding untuk mempertajam teks.
    """
    nparr = np.frombuffer(img_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # === LANGKAH PERBAIKAN 1: Deteksi & Inversi Warna ===
    # Jika rata-rata kecerahan gambar rendah (< 127), kemungkinan besar
    # ini adalah gambar dengan latar belakang gelap (inverted).
    if np.mean(gray) < 127:
        # Balikkan warnanya (hitam jadi putih, putih jadi hitam)
        gray = cv2.bitwise_not(gray)
    # ======================================================

    # Adaptive thresholding untuk meningkatkan kontras tulisan
    # Parameter ini umumnya bekerja dengan baik, bisa disesuaikan jika perlu
    th = cv2.adaptiveThreshold(
        gray, 255,
        cv2.ADAPTIVE_THRESH_GAUSSIAN_C,
        cv2.THRESH_BINARY, 31, 10 # Sedikit penyesuaian parameter
    )

    # Kembali ke format PIL agar bisa dipakai pytesseract
    pil_img = Image.fromarray(th)
    return pil_img

def do_ocr(img_bytes: bytes) -> str:
    """
    Menjalankan OCR pada gambar dengan konfigurasi yang dioptimalkan
    untuk satu baris teks Arab.
    """
    try:
        preprocessed_image = preprocess_image_bytes(img_bytes)

        # === LANGKAH PERBAIKAN 2: Konfigurasi Tesseract ===
        # --psm 7 memberitahu Tesseract untuk memperlakukan gambar sebagai satu baris teks.
        # Ini sangat meningkatkan akurasi untuk jenis gambar Anda.
        custom_config = r'--oem 3 --psm 7'
        text = pytesseract.image_to_string(preprocessed_image, lang="ara", config=custom_config)
        # ====================================================

        return normalize_arabic(text)
    except Exception as e:
        print(f"OCR error: {e}")
        return ""
