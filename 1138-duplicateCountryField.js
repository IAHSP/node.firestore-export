#!/usr/bin/env node

require('dotenv').config(); //loads the secrets set in the .env file, into process.env
const fs = require('fs');
const firebase = require('firebase');

firebase.initializeApp({
  projectId: process.env.PROJECTID,
  apiKey: process.env.APIKEY
});
const db = firebase.firestore();

let rawdata = fs.readFileSync('_users-exported.json');
let usersObj = JSON.parse(rawdata);
let users = usersObj.users;

let usersNEW = {};
usersNEW['users'] = {};

console.log('please wait, processing file and copying country field...');
Object.entries(users).forEach(entry => {
  const [key, data] = entry;
  //console.log("key: " + key);

  //console.log(data);

  if(data.hasOwnProperty('country')) {
    strCountry = data.country;
  } else {
    //country field wasn't set
    strCountry = "";
  }

  data['countryCustom'] = strCountry;

  usersNEW.users[key] = data;
});

console.log('exporting data as json');
const newData = JSON.stringify(usersNEW, null, 1); //strigify, but also human readable formatted
fs.writeFileSync('_users-with-countryCustom-field.json', newData);
