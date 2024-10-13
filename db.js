import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.PASS,
  database: "forex",
});

try {
  await connection.connect();
  console.log("Connected to the MySQL database");
} catch (err) {
  console.error("Error connecting to the database:", err);
}

export default connection;
