import mysql from "mysql2/promise";
import dotenv from "dotenv";

// Load .env.local untuk kredensial Railway
dotenv.config({ path: ".env.local" });

// Konfigurasi DB – baca dari .env.local
const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "waskita_db",
  // Fix SSL: undefined untuk lokal (no SSL), object untuk Railway
  ...(process.env.DB_HOST !== "localhost" ? { ssl: { rejectUnauthorized: false } } : {}),
};

async function insertDataQuiz() {
  let connection;
  try {
    // Log konfigurasi untuk debug (tanpa password)
    console.log("🔍 Konfigurasi DB:");
    console.log(`  Host: ${dbConfig.host}`);
    console.log(`  Port: ${dbConfig.port}`);
    console.log(`  User: ${dbConfig.user}`);
    console.log(`  Database: ${dbConfig.database}`);
    console.log(`  SSL: ${process.env.DB_HOST !== "localhost" ? 'Diaktifkan (Railway)' : 'Tidak digunakan (lokal)'}`);

    // Buat koneksi ke DB
    connection = await mysql.createConnection(dbConfig);
    console.log("✅ Berhasil terhubung ke MySQL");

    // 1. Tambahkan Judul Kuis
    const queryJudul = "INSERT INTO judul (judul, cover) VALUES (?, ?)";
    const [hasilJudul] = await connection.execute(queryJudul, [
      "Kuis Pengetahuan HIV/AIDS",
      "/hiv-awareness.png",
    ]);
    const idJudul = (hasilJudul as any).insertId;
    console.log(`✅ Judul kuis ditambahkan dengan ID: ${idJudul}`);

    // 2. Tambahkan Soal (5 pertanyaan)
    const dataSoal = [
      "Apa yang dimaksud dengan HIV?",
      "Bagaimana HIV menyebar?",
      "Apakah HIV dapat disembuhkan?",
      "Apa gejala awal infeksi HIV?",
      "Apakah penggunaan kondom dapat mencegah penyebaran HIV?",
    ];

    const querySoal = "INSERT INTO soal (id_judul, pertanyaan) VALUES (?, ?)";
    const idSoalArray: number[] = [];
    for (const pertanyaan of dataSoal) {
      const [hasilSoal] = await connection.execute(querySoal, [idJudul, pertanyaan]);
      const idSoal = (hasilSoal as any).insertId;
      idSoalArray.push(idSoal);
      console.log(`✅ Soal ditambahkan dengan ID: ${idSoal} - ${pertanyaan}`);
    }

    // 3. Tambahkan Jawaban (4 pilihan per soal, 1 benar)
    const dataJawaban = [
      // Soal 1
      { idSoal: idSoalArray[0], teks: "Human Immunodeficiency Virus, virus yang menyerang sistem kekebalan tubuh", benar: true },
      { idSoal: idSoalArray[0], teks: "Hepatitis Virus, virus yang menyerang hati", benar: false },
      { idSoal: idSoalArray[0], teks: "Human Immunoglobulin Virus, virus yang meningkatkan kekebalan", benar: false },
      { idSoal: idSoalArray[0], teks: "Hematology Virus, virus yang mempengaruhi darah", benar: false },

      // Soal 2
      { idSoal: idSoalArray[1], teks: "Melalui hubungan seksual tanpa kondom, berbagi jarum suntik, atau dari ibu ke anak saat kelahiran", benar: true },
      { idSoal: idSoalArray[1], teks: "Melalui udara atau bersalaman", benar: false },
      { idSoal: idSoalArray[1], teks: "Melalui makanan yang terkontaminasi", benar: false },
      { idSoal: idSoalArray[1], teks: "Melalui gigitan nyamuk", benar: false },

      // Soal 3
      { idSoal: idSoalArray[2], teks: "Tidak, tetapi dapat dikontrol dengan pengobatan antiretroviral (ARV)", benar: true },
      { idSoal: idSoalArray[2], teks: "Ya, dengan vaksin yang sudah ada", benar: false },
      { idSoal: idSoalArray[2], teks: "Ya, dengan antibiotik", benar: false },
      { idSoal: idSoalArray[2], teks: "Tidak, sama sekali tidak ada pengobatan", benar: false },

      // Soal 4
      { idSoal: idSoalArray[3], teks: "Demam, sakit tenggorokan, ruam kulit, dan pembengkakan kelenjar getah bening", benar: true },
      { idSoal: idSoalArray[3], teks: "Sakit kepala parah dan kehilangan penglihatan", benar: false },
      { idSoal: idSoalArray[3], teks: "Mual dan muntah terus-menerus", benar: false },
      { idSoal: idSoalArray[3], teks: "Nyeri dada dan sesak napas", benar: false },

      // Soal 5
      { idSoal: idSoalArray[4], teks: "Ya, jika digunakan dengan benar dan konsisten", benar: true },
      { idSoal: idSoalArray[4], teks: "Tidak, kondom tidak efektif sama sekali", benar: false },
      { idSoal: idSoalArray[4], teks: "Hanya untuk pria, tidak untuk wanita", benar: false },
      { idSoal: idSoalArray[4], teks: "Ya, tetapi hanya untuk hubungan heteroseksual", benar: false },
    ];

    const queryJawaban = "INSERT INTO jawaban (id_soal, teks_jawaban, is_correct) VALUES (?, ?, ?)";
    for (const jawaban of dataJawaban) {
      await connection.execute(queryJawaban, [jawaban.idSoal, jawaban.teks, jawaban.benar]);
      console.log(`✅ Jawaban ditambahkan untuk soal ID: ${jawaban.idSoal}`);
    }

    console.log("🎉 Semua data quiz berhasil ditambahkan ke database!");
  } catch (error: any) {
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error("❌ Error: Akses ditolak. Periksa username dan password di .env.local.");
    } else if (error.code === 'ENOTFOUND') {
      console.error("❌ Error: Host tidak ditemukan. Periksa DB_HOST di .env.local.");
    } else if (error.code === 'ECONNREFUSED') {
      console.error("❌ Error: Koneksi ditolak. Periksa port atau izinkan IP lokal di pengaturan Railway.");
    } else if (error.code === 'ER_NO_SUCH_TABLE') {
      console.error("❌ Error: Tabel tidak ditemukan. Pastikan tabel judul, soal, jawaban sudah dibuat di DB.");
    } else if (error.code === 'HANDSHAKE_NO_SSL_SUPPORT') {
      console.error("❌ Error: SSL tidak didukung. Pastikan DB_HOST adalah Railway (bukan localhost).");
    } else {
      console.error("❌ Error umum:", error.message);
      console.error("Kode error:", error.code);
    }
    if (error.sqlMessage) {
      console.error("Detail error SQL:", error.sqlMessage);
    }
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔌 Koneksi ke database ditutup");
    }
  }
}

// Jalankan script
insertDataQuiz();
