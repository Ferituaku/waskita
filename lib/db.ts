import mysql from "mysql2/promise";

export const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "", // ganti password MySQL kamu
  database: "waskita",      // ganti sesuai nama DB
});
