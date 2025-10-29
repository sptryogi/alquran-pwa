export default function ResultCard({ result }) {
  if (!result) return null;
  const isPass = result.score >= 75;

  // convert **text** → <b>text</b>
  const formatFeedback = (text) => {
    if (!text) return "";
    return text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");
  };

  return (
    <div className="wp-card">
      <h4>📊 Hasil Penilaian</h4>
      <div className="wp-result">
        <div className="wp-result-info">
          <p>Nilai</p>
          <h2>{result.score}%</h2>
          <p className={isPass ? "wp-pass" : "wp-fail"}>
            {isPass ? "✅ Lulus" : "❌ Belum lulus"}
          </p>
        </div>
        <div className="wp-circle">
          <svg viewBox="0 0 36 36">
            <path
              className="wp-bg"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              className="wp-bar"
              strokeDasharray={`${result.score}, 100`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>
        </div>
      </div>

      <div className="wp-feedback">
        <b>Saran:</b>
        {/* <p>{result.feedback}</p> */}
        {/* <p dangerouslySetInnerHTML={{ __html: result.feedback.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>") }}></p> */}
        const isArabic = /[\u0600-\u06FF]/.test(result.feedback);

        <p
          className={isArabic ? "arabic-text" : ""}
          dangerouslySetInnerHTML={{
            __html: result.feedback.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>")
          }}
        ></p>

        {/* Audio Player */}
        <audio 
          key={result.feedback} 
          controls 
          style={{ marginTop: "10px" }}
        >
          <source
            src={`https://alquran-backend-941267709419.asia-southeast2.run.app/feedback-tts?feedback=${encodeURIComponent(result.feedback)}`}
            type="audio/mpeg"
          />
          Browser kamu tidak mendukung audio.
        </audio>
      </div>
    </div>
  );
}
