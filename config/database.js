// MYSQL2
const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const connection = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_NAME || "foodsnap",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
})

db.connect((err) => {
  if (err) throw err;
  console.log('Sampun Konek');
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