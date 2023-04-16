import mysql from "mysql";

const db = mysql.createPool({
  host: "db",
  database: "ub2023",
  user: "root",
  password: "password",
});

db.getConnection((err) => {
  if (err) throw err;

  console.log("The connection to the database has been established.");
});

export default db;
