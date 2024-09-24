const mysql = require('mysql');
require('dotenv').config();

class DB {
   constructor() {
      this.database = process.env.DB_NAME;
      this.username = process.env.DB_USERNAME;
      this.password = process.env.DB_PASSWORD;
      this.host = process.env.DB_HOST;
      this.port = process.env.DB_PORT;

      if(!this.database || !this.username || !this.host || !this.port) 
      {
         console.error("Database configuration is missing.");
         process.exit(1);
      }

      try 
      {
         this.connection = mysql.createConnection({
            host: this.host,
            user: this.username,
            password: this.password,
            database: this.database,
            port: this.port
         });
      }
      catch (error) 
      {
         console.error("Error connecting to the database: "+ error);
         process.exit(1);
      }
   }
}

module.exports = DB;