import mysql from "mysql";

const db = mysql.createPool({
  host: "db",
  database: "ub2023",
  user: "root",
  password: "password",
});

db.getConnection((err) => {
  if (err) throw err;

  console.log("A kapcsolat létrejött az adatbázissal.");
});

export default db;
