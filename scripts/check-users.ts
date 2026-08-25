import mysql from "mysql2/promise";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.production") });

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "4000", 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME || "stophiva",
  ssl: { rejectUnauthorized: false },
};

async function checkAndCreateAdmin() {
  console.log("📡 Connecting to TiDB Cloud...");
  try {
    const connection = await mysql.createConnection(dbConfig);
    console.log("✅ Connected successfully!");

    // List existing users
    const [users]: any = await connection.query("SELECT id, name, email, role, created_at FROM users");
    console.log("📋 Users in database:", users);

    // Create or Reset Admin Account
    const adminEmail = "admin@waskita.com";
    const adminPassword = "adminpassword123";
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const [existingAdmin]: any = await connection.query("SELECT * FROM users WHERE email = ?", [adminEmail]);

    if (existingAdmin.length === 0) {
      await connection.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        ["Admin Waskita", adminEmail, hashedPassword, "admin"]
      );
      console.log(`\n🎉 AKUN ADMIN BARU BERHASIL DIBUAT!`);
    } else {
      await connection.query(
        "UPDATE users SET password = ?, role = 'admin' WHERE email = ?",
        [hashedPassword, adminEmail]
      );
      console.log(`\n🎉 PASSWORD AKUN ADMIN BERHASIL DI-RESET!`);
    }

    console.log(`-----------------------------------`);
    console.log(`📧 Email Admin    : ${adminEmail}`);
    console.log(`🔑 Password Admin : ${adminPassword}`);
    console.log(`-----------------------------------`);

    await connection.end();
  } catch (error: any) {
    console.error("❌ Error checking/creating admin:", error.message);
  }
}

checkAndCreateAdmin();
