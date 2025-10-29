import { useState } from "react";
import { uploadImage } from "../services/api";

export default function ImageUpload({ onResult }) {
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setLoading(true);
    try {
      const data = await uploadImage(file);
      onResult(data);
    } catch (err) {
      console.error(err);
      onResult({ score: 0, feedback: "Terjadi kesalahan pada server." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="wp-card">
      <h4>📷 Upload Gambar</h4>
      {!loading && (
        <label className="wp-upload-btn">
          Pilih File
          <input type="file" accept="image/*" onChange={handleUpload} hidden />
        </label>
      )}
      {fileName && <div className="wp-filename">File: {fileName}</div>}
      {loading && <div className="wp-loading">⏳ Memproses gambar...</div>}
    </div>
  );
}
