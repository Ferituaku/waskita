import mysql from 'mysql2/promise';

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'waskita_db',
};

const CREATE_DATABASE_SQL = `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;`;

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

const CREATE_ARTICLES_TABLE_SQL = `
CREATE TABLE IF NOT EXISTS \`articles\` (
  \`id\` INT NOT NULL AUTO_INCREMENT,
  \`title\` VARCHAR(255) NOT NULL,
  \`content\` TEXT NOT NULL,
  \`category\` VARCHAR(100) NOT NULL,
  \`image_url\` VARCHAR(255) NULL DEFAULT '/default-image.jpg',
  \`created_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  \`updated_at\` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (\`id\`)
);`;

// Singleton pattern to ensure DB initialization runs only once
let dbPromise: Promise<mysql.Pool> | null = null;
let isInitialized = false;

async function initializeDatabase(): Promise<mysql.Pool> {
  if (isInitialized && dbPromise) {
    return dbPromise;
  }

  try {
    console.log('🔄 Initializing database connection...');
    
    // 1. Connect to MySQL server without selecting a database
    const tempConnection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
    });
    
    console.log('✅ Connected to MySQL server');
    
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
    console.log('🔄 Creating tables...');
    
    await pool.query(CREATE_JUDUL_TABLE_SQL);
    console.log('✅ Table "judul" is ready');
    
    await pool.query(CREATE_SOAL_TABLE_SQL);
    console.log('✅ Table "soal" is ready');
    
    await pool.query(CREATE_JAWABAN_TABLE_SQL);
    console.log('✅ Table "jawaban" is ready');
    
    await pool.query(CREATE_ARTICLES_TABLE_SQL);
    console.log('✅ Table "articles" is ready');

    isInitialized = true;
    console.log('✅ Database and all tables are ready.');
    
    return pool;
  } catch (error) {
    console.error('❌ Failed to initialize database:', error);
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