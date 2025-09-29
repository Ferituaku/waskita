// import express, { Request, Response } from "express";
// import cors from "cors";
// import bodyParser from "body-parser";
// import mysql from "mysql2/promise";

// const app = express();
// const PORT = 3001; // backend jalan di port 3001

// app.use(cors());
// app.use(bodyParser.json());

// // koneksi pool ke database MySQL
// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   password: "yourpassword",
//   database: "waskita", // ganti sesuai nama DB kamu
// });

// // ==================== JUDUL ==================== //

// // GET semua judul
// app.get("/judul", async (req: Request, res: Response) => {
//   const [rows] = await pool.query("SELECT * FROM judul");
//   res.json(rows);
// });

// // POST judul baru
// app.post("/judul", async (req: Request, res: Response) => {
//   const { judul, jumlah_registrasi, cover } = req.body;
//   const [result] = await pool.query(
//     "INSERT INTO judul (judul, jumlah_registrasi, cover) VALUES (?, ?, ?)",
//     [judul, jumlah_registrasi || 0, cover || null]
//   );
//   res.json({ message: "Judul ditambahkan", result });
// });

// // UPDATE judul
// app.put("/judul/:id", async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { judul, jumlah_registrasi, cover } = req.body;
//   await pool.query(
//     "UPDATE judul SET judul=?, jumlah_registrasi=?, cover=? WHERE id_judul=?",
//     [judul, jumlah_registrasi, cover, id]
//   );
//   res.json({ message: "Judul diperbarui" });
// });

// // DELETE judul
// app.delete("/judul/:id", async (req: Request, res: Response) => {
//   const { id } = req.params;
//   await pool.query("DELETE FROM judul WHERE id_judul=?", [id]);
//   res.json({ message: "Judul dihapus" });
// });

// // ==================== SOAL ==================== //

// // GET soal berdasarkan judul
// app.get("/soal/:id_judul", async (req: Request, res: Response) => {
//   const { id_judul } = req.params;
//   const [rows] = await pool.query("SELECT * FROM soal WHERE id_judul=?", [
//     id_judul,
//   ]);
//   res.json(rows);
// });

// // POST soal baru
// app.post("/soal", async (req: Request, res: Response) => {
//   const { id_judul, pertanyaan } = req.body;
//   const [result] = await pool.query(
//     "INSERT INTO soal (id_judul, pertanyaan) VALUES (?, ?)",
//     [id_judul, pertanyaan]
//   );
//   res.json({ message: "Soal ditambahkan", result });
// });

// // UPDATE soal
// app.put("/soal/:id", async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { pertanyaan } = req.body;
//   await pool.query("UPDATE soal SET pertanyaan=? WHERE id_soal=?", [
//     pertanyaan,
//     id,
//   ]);
//   res.json({ message: "Soal diperbarui" });
// });

// // DELETE soal
// app.delete("/soal/:id", async (req: Request, res: Response) => {
//   const { id } = req.params;
//   await pool.query("DELETE FROM soal WHERE id_soal=?", [id]);
//   res.json({ message: "Soal dihapus" });
// });

// // ==================== JAWABAN ==================== //

// // GET jawaban per soal
// app.get("/jawaban/:id_soal", async (req: Request, res: Response) => {
//   const { id_soal } = req.params;
//   const [rows] = await pool.query("SELECT * FROM jawaban WHERE id_soal=?", [
//     id_soal,
//   ]);
//   res.json(rows);
// });

// // POST jawaban baru
// app.post("/jawaban", async (req: Request, res: Response) => {
//   const { id_soal, teks_jawaban, is_correct } = req.body;
//   const [result] = await pool.query(
//     "INSERT INTO jawaban (id_soal, teks_jawaban, is_correct) VALUES (?, ?, ?)",
//     [id_soal, teks_jawaban, is_correct || 0]
//   );
//   res.json({ message: "Jawaban ditambahkan", result });
// });

// // UPDATE jawaban
// app.put("/jawaban/:id", async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const { teks_jawaban, is_correct } = req.body;
//   await pool.query(
//     "UPDATE jawaban SET teks_jawaban=?, is_correct=? WHERE id_jawaban=?",
//     [teks_jawaban, is_correct, id]
//   );
//   res.json({ message: "Jawaban diperbarui" });
// });

// // DELETE jawaban
// app.delete("/jawaban/:id", async (req: Request, res: Response) => {
//   const { id } = req.params;
//   await pool.query("DELETE FROM jawaban WHERE id_jawaban=?", [id]);
//   res.json({ message: "Jawaban dihapus" });
// });

// // ==================== SERVER ==================== //
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });
