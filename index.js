#!/usr/bin/env node

require('dotenv').config(); //loads the secrets set in the .env file, into process.env
const fs = require('fs');
const firebase = require('firebase');

firebase.initializeApp({
  projectId: process.env.PROJECTID,
  apiKey: process.env.APIKEY
});
const db = firebase.firestore();
let users = {};
users['users'] = {};

async function getAll(db) {
  console.log('please wait while the users are grabbed from firestore...');
  const usersFromFirestore = await db.collection('users').get();
  usersFromFirestore.forEach((doc) => {
    //console.log(doc.id, '=>', doc.data());
    users.users[doc.id] = doc.data();
  });
  console.log('exporting data as json');
  const data = JSON.stringify(users, null, 1); //strigify, but also human readable formatted;
  fs.writeFileSync('_users-exported.json', data);
}

getAll(db);


