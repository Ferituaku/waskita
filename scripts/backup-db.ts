import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

// Load production environment variables
dotenv.config({ path: path.join(process.cwd(), ".env.production") });

const dbConfig = {
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306", 10),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
};

async function exportDatabase() {
  console.log(`📡 Connecting to Railway database: ${dbConfig.host}:${dbConfig.port}/${dbConfig.database}...`);

  if (!dbConfig.host || !dbConfig.user || !dbConfig.database) {
    console.error("❌ Missing database credentials in .env.production");
    process.exit(1);
  }

  const pool = mysql.createPool({
    host: dbConfig.host,
    port: dbConfig.port,
    user: dbConfig.user,
    password: dbConfig.password,
    database: dbConfig.database,
    waitForConnections: true,
    connectionLimit: 5,
    queueLimit: 0,
    connectTimeout: 20000,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    const connection = await pool.getConnection();
    console.log("✅ Connected successfully!");

    let sqlDump = `-- Backup Database Waskita\n-- Exported on: ${new Date().toISOString()}\n\n`;
    sqlDump += `CREATE DATABASE IF NOT EXISTS \`${dbConfig.database}\`;\n`;
    sqlDump += `USE \`${dbConfig.database}\`;\n\n`;

    // Fetch all tables
    const [tablesRows] = await connection.query<any[]>("SHOW TABLES");
    const tableKey = `Tables_in_${dbConfig.database}`;
    const tables: string[] = tablesRows.map((row) => row[tableKey]);

    console.log(`📋 Found ${tables.length} tables: ${tables.join(", ")}`);

    for (const table of tables) {
      console.log(`🔄 Backing up table: ${table}...`);
      
      // Get CREATE TABLE statement
      const [createRows] = await connection.query<any[]>(`SHOW CREATE TABLE \`${table}\``);
      const createTableSql = createRows[0]["Create Table"];

      sqlDump += `\n-- Table structure for table \`${table}\` --\n`;
      sqlDump += `DROP TABLE IF EXISTS \`${table}\`;\n`;
      sqlDump += `${createTableSql};\n\n`;

      // Get Table Data
      const [rows] = await connection.query<any[]>(`SELECT * FROM \`${table}\``);
      if (rows.length > 0) {
        sqlDump += `-- Dumping data for table \`${table}\` --\n`;
        const columns = Object.keys(rows[0]).map((col) => `\`${col}\``).join(", ");

        for (const row of rows) {
          const values = Object.values(row)
            .map((val) => {
              if (val === null || val === undefined) return "NULL";
              if (typeof val === "number" || typeof val === "boolean") return val;
              if (val instanceof Date) return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`;
              if (Buffer.isBuffer(val)) return `0x${val.toString("hex")}`;
              // Escape string
              const escapedStr = String(val)
                .replace(/\\/g, "\\\\")
                .replace(/'/g, "\\'")
                .replace(/\n/g, "\\n")
                .replace(/\r/g, "\\r");
              return `'${escapedStr}'`;
            })
            .join(", ");

          sqlDump += `INSERT INTO \`${table}\` (${columns}) VALUES (${values});\n`;
        }
        sqlDump += "\n";
      }
    }

    connection.release();

    const outputPath = path.join(process.cwd(), "backup_waskita_db.sql");
    fs.writeFileSync(outputPath, sqlDump, "utf8");
    console.log(`\n🎉 Backup database berhasil diselesaikan!`);
    console.log(`📁 File tersimpan di: ${outputPath}`);

  } catch (error: any) {
    console.error("❌ Error backing up database:", error.message || error);
  } finally {
    await pool.end();
  }
}

exportDatabase();
