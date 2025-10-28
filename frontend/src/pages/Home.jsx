
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

        <div className="feature" onClick={() => nav("/book")}>
          <div>📚</div>
          <h4>Buku & Animasi</h4>
          <p>Baca teori dan lihat animasi belajar per bab.</p>
        </div>
        
        <div className="feature" onClick={() => nav("/ask")}>
          <div>💬</div>
          <h4>Bertanya</h4>
          <p>Tanyakan hal terkait pembelajaran Al-Qur’an dan bahasa Arab.</p>
        </div>

        <div
          className="feature"
          style={{ gridColumn: "1 / -1" }}
          onClick={() => nav("/progress")}>
        {/* <div className="feature" onClick={() => nav("/progress")}> */}
          <h4>📊 Progress Saya</h4>
          <p>Lihat perkembangan latihan menulis & membaca.</p>
        </div>
      </div>
    </div>
  );
}
