import mysql from "mysql2/promise";
import dotenv from "dotenv";
import path from "path";

// Load .env or .env.production
dotenv.config({ path: path.join(process.cwd(), ".env.production") });

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "4000", 10),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "waskita_db",
  ssl: {
    rejectUnauthorized: false,
  },
};

async function testConnection() {
  console.log(`📡 Menguji koneksi ke TiDB Cloud (${dbConfig.host}:${dbConfig.port})...`);
  try {
    // 1. Connect without selecting database first to ensure DB exists
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      ssl: dbConfig.ssl,
    });

    console.log("✅ Berhasil terhubung ke server TiDB Cloud!");
    await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`);
    console.log(`✅ Database '${dbConfig.database}' siap digunakan.`);
    await tempConnection.end();

    // 2. Connect to the specific database
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.query("SHOW TABLES;");
    console.log("📋 Tabel yang ada di database:", rows);

    await connection.end();
    console.log("🎉 Pengujian Koneksi Selesai Sempurna!");
  } catch (error: any) {
    console.error("❌ Koneksi Gagal:", error.message);
  }
}

testConnection();
