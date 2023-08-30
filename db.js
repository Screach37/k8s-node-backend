// config/db.js
// src/config/knexfile.js

 require('dotenv').config();


var knexConfig= {
    development: {
      client: 'mysql',
      connection: {
        host:process.env.db_hostname,
        user:process.env.db_user,
        password:process.env.db_password,
        database:process.env.db_name,
      },
      migrations: {
        directory: './migrations'
      },
    },
  };

const Knex = require('knex');

const { Model } = require('objection');
// console.log(process.env.db_hostname)
// console.log(process.env.db_user)
// console.log(process.env.db_password)
// console.log(process.env.db_name)


 const knex = Knex(knexConfig.development);

// // Attach the Knex instance to the Objection.js Model
 Model.knex(knex);
 module.exports = knex;

//const firebase = require("firebase");

// const { initializeApp } = require('firebase/app');
// const { getFirestore, collection } = require('firebase/firestore');

// const firebaseConfig = {
//   apiKey: "AIzaSyC4wmwWN3mysOqx3-MWHf-g8EOHffgxcE4",
//   authDomain: "k8s-nodejs-connect.firebaseapp.com",
//   projectId: "k8s-nodejs-connect",
//   storageBucket: "k8s-nodejs-connect.appspot.com",
//   messagingSenderId: "866860552836",
//   appId: "1:866860552836:web:b7ef013abfafff021e28d1",
//   measurementId: "G-XSQQWLXYVM"
// };

// const firebaseApp = initializeApp(firebaseConfig);
// const db = getFirestore(firebaseApp);
// const User = collection(db, "Users");
// module.exports = User;