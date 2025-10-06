import React, { useState } from "react";
import axios from "axios";

export default function Ask() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post(
        "https://alquran-backend-941267709419.asia-southeast2.run.app/ask",
        { question }
      );
      setAnswer(res.data.answer);
    } catch (err) {
      setAnswer("❌ Gagal mendapatkan jawaban. Coba lagi nanti.");
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h2>💬 Bertanya</h2>
      <p>
        Tanyakan apa saja seputar huruf hijaiyah, cara membaca, atau makna ayat
        Al-Qur’an.
      </p>

      <textarea
        placeholder="Tulis pertanyaan kamu di sini..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
      />

      <button onClick={handleAsk} disabled={loading}>
        {loading ? "Mengirim..." : "Kirim Pertanyaan"}
      </button>

      {answer && (
        <div className="answer-box">
          <h4>Jawaban:</h4>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}
