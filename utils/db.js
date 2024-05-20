const mongoose = require('mongoose');

class Database {
    constructor() {
      this.connection = null;
    }
    
    static getInstance() {
      if (!Database.instance) {
        Database.instance = new Database();
      }
      return Database.instance; 
    }
  
    connect() {
        mongoose.connect('mongodb://127.0.0.1:27017/suratdesa1', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
        });
        this.connection = 'Connected'; 
    }
  }
  
  const db1 = Database.getInstance();
  const db2 = Database.getInstance();
  
  console.log(db1 === db2); // true
  
  db1.connect(); 
  
  console.log(db1.connection); // 'Connected'
  console.log(db2.connection); // 'Connected'