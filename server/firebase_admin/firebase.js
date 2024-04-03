const firebase = require('firebase-admin');
const credehtials = require('./credentials');

firebase.initializeApp({
  credential: firebase.credential.cert(credehtials),
  databaseURL: "https://Firebase-admin-sdk-test.firebaseio.com",
});

module.exports = firebase;