import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "waskita_db",
};

const CREATE_DATABASE_SQL = `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`;

const CREATE_USERS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`users\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`name\` VARCHAR(100) NOT NULL,
  \`email\` VARCHAR(100) NOT NULL UNIQUE,
  \`password\` VARCHAR(255) NULL,
  \`role\` ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  \`phone_number\` VARCHAR(20) NULL,
  \`profile_picture\` VARCHAR(255) NULL DEFAULT '/default-profile.jpg',
  \`status\` ENUM('active', 'inactive', 'banned') NOT NULL DEFAULT 'active',
  \`google_id\` VARCHAR(255) NULL,
  \`email_verified\` BOOLEAN NOT NULL DEFAULT 0,
  \`last_login\` DATETIME NULL,
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
);`;

const CREATE_JUDUL_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`judul\` (
  \`id_judul\` INT NOT NULL AUTO_INCREMENT,
  \`judul\` VARCHAR(255) NOT NULL,
  \`tanggal_terbuat\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`jumlah_registrasi\` INT NOT NULL DEFAULT 0,
  \`cover\` VARCHAR(255) NULL,
  PRIMARY KEY (\`id_judul\`)
);`;

const CREATE_SOAL_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`soal\` (
  \`id_soal\` INT NOT NULL AUTO_INCREMENT,
  \`id_judul\` INT NOT NULL,
  \`pertanyaan\` TEXT NOT NULL,
  PRIMARY KEY (\`id_soal\`),
  INDEX \`fk_soal_judul_idx\` (\`id_judul\` ASC),
  CONSTRAINT \`fk_soal_judul\`
    FOREIGN KEY (\`id_judul\`)
    REFERENCES \`judul\` (\`id_judul\`)
    ON DELETE CASCADE
);`;

const CREATE_JAWABAN_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`jawaban\` (
  \`id_jawaban\` INT NOT NULL AUTO_INCREMENT,
  \`id_soal\` INT NOT NULL,
  \`teks_jawaban\` TEXT NOT NULL,
  \`is_correct\` BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (\`id_jawaban\`),
  INDEX \`fk_jawaban_soal_idx\` (\`id_soal\` ASC),
  CONSTRAINT \`fk_jawaban_soal\`
    FOREIGN KEY (\`id_soal\`)
    REFERENCES \`soal\` (\`id_soal\`)
    ON DELETE CASCADE
);`;

// UPDATED: Added user_id column and foreign key to users table
const CREATE_HASIL_KUIS_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`hasil_kuis\` (
  \`id_hasil\` INT NOT NULL AUTO_INCREMENT,
  \`id_judul\` INT NOT NULL,
  \`user_id\` INT NULL,
  \`nama_peserta\` VARCHAR(255) NOT NULL,
  \`nilai\` INT NOT NULL,
  \`tanggal_pengerjaan\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id_hasil\`),
  INDEX \`fk_hasil_judul_idx\` (\`id_judul\` ASC),
  INDEX \`fk_hasil_user_idx\` (\`user_id\` ASC),
  CONSTRAINT \`fk_hasil_judul\`
    FOREIGN KEY (\`id_judul\`)
    REFERENCES \`judul\` (\`id_judul\`)
    ON DELETE CASCADE,
  CONSTRAINT \`fk_hasil_user\`
    FOREIGN KEY (\`user_id\`)
    REFERENCES \`users\` (\`id\`)
    ON DELETE SET NULL
);`;

const CREATE_ARTICLES_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`articles\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`title\` VARCHAR(255) NOT NULL,
  \`content\` TEXT NOT NULL,
  \`category\` ENUM('HIV', 'AIDS') NOT NULL,
  \`file_type\` ENUM('text', 'pdf') NOT NULL DEFAULT 'text',
  \`file_url\` VARCHAR(500) NULL,
  \`image_url\` VARCHAR(255) NULL DEFAULT '/default-image.jpg',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
);`;

// Migration script to add user_id column if it doesn't exist
const MIGRATE_HASIL_KUIS_SQL = `
ALTER TABLE \`hasil_kuis\`
ADD COLUMN IF NOT EXISTS \`user_id\` INT NULL AFTER \`id_judul\`,
ADD INDEX IF NOT EXISTS \`fk_hasil_user_idx\` (\`user_id\` ASC),
ADD CONSTRAINT IF NOT EXISTS \`fk_hasil_user\`
  FOREIGN KEY (\`user_id\`)
  REFERENCES \`users\` (\`id\`)
  ON DELETE SET NULL;
`;

// Singleton pattern to ensure DB initialization runs only once
let dbPromise: Promise<mysql.Pool> | null = null;
let isInitialized = false;

async function initializeDatabase(): Promise<mysql.Pool> {
  if (isInitialized && dbPromise) {
    return dbPromise;
  }

  try {
    console.log("🔄 Initializing database connection...");

    // 1. Connect to MySQL server without selecting a database
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });

    console.log("✅ Connected to MySQL server");

    // 2. Create the database if it doesn't exist
    await tempConnection.query(CREATE_DATABASE_SQL);
    console.log(`✅ Database '${dbConfig.database}' is ready`);

    await tempConnection.end();

    // 3. Create a connection pool to the specific database
    const pool = mysql.createPool({
      ...dbConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // 4. Create tables if they don't exist (SYNCHRONOUSLY)
    console.log("🔄 Creating tables...");

    // IMPORTANT: Create users table first (it's referenced by hasil_kuis)
    await pool.query(CREATE_USERS_TABLE_SQL);
    console.log('✅ Table "users" is ready');

    await pool.query(CREATE_JUDUL_TABLE_SQL);
    console.log('✅ Table "judul" is ready');

    await pool.query(CREATE_SOAL_TABLE_SQL);
    console.log('✅ Table "soal" is ready');

    await pool.query(CREATE_JAWABAN_TABLE_SQL);
    console.log('✅ Table "jawaban" is ready');

    await pool.query(CREATE_HASIL_KUIS_TABLE_SQL);
    console.log('✅ Table "hasil_kuis" is ready');

    // Try to run migration for existing databases
    try {
      await pool.query(MIGRATE_HASIL_KUIS_SQL);
      console.log('✅ Migration for "hasil_kuis" completed (if needed)');
    } catch {
      // Migration might fail if constraints already exist, that's okay
      console.log("ℹ️ Migration skipped or already applied");
    }

    await pool.query(CREATE_ARTICLES_TABLE_SQL);
    console.log('✅ Table "articles" is ready');

    isInitialized = true;
    console.log("✅ Database and all tables are ready.");

    return pool;
  } catch (error) {
    console.error("❌ Failed to initialize database:", error);
    dbPromise = null;
    isInitialized = false;
    throw error;
  }
}

export function getDb(): Promise<mysql.Pool> {
  if (!dbPromise) {
    dbPromise = initializeDatabase();
  }
  return dbPromise;
}
