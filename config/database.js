// MYSQL2
const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

connection.getConnection((err, conn) => {
  if (err) {
    console.error("Error connecting to the database:", err.stack);
    return;
  }
  console.log("Sampun Konek");
  conn.release(); 
});

module.exports = connection.promise();

// MYSQL
// let mysql = require("mysql");

// let connection = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Fasya251513", //ganti pake password mysql klen
//   port: 3306,
//   database: "foodsnap",
// });

// connection.connect(function (err) {
//   if (!!err) {
//     console.log(err);
//   } else {
//     console.log("Connected");
//   }
// });

// module.exports = connection;
