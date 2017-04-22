'use strict';
var firebase = require('firebase');
var config = {
    apiKey: "AIzaSyAq9bvmBhMUORLv4Uiu4YaTmSPDdT_ifFw",
    authDomain: "auctionplatform-c8e90.firebaseapp.com",
    databaseURL: "https://auctionplatform-c8e90.firebaseio.com",
    projectId: "auctionplatform-c8e90",
    storageBucket: "auctionplatform-c8e90.appspot.com",
    messagingSenderId: "693452962808"
    };

// Initialize the default app
var app = firebase.initializeApp(config, "other");
var db = app.database();

exports.getContracts = function(req, res) {
  db.ref('contracts/').orderByChild('cId').once('value').then(function(snapshot){
    res.json(snapshot.val());
  });
};

exports.addContract = function(req, res) {
  db.ref('count/').once('value').then(function(count){
    var postKey = db.ref('contracts/').push().key;
    var data = {
      asset : req.query.asset,
      price : req.query.price,
      time : req.query.time,
      date : Date.now(),
      qty : req.query.qty,
      cId : count.val()
    };
    var updates = {};
    updates[postKey] = data;
    db.ref('contracts/').update(updates);
    db.ref().update({"count" : count.val()+1});
    res.json({"uploaded data" : updates});
  });
};

exports.getContract = function(req, res) {
  db.ref('contracts/').orderByChild('cId').equalTo(Number.parseInt(req.header('cId'))).once('value').then(function(snapshot){
    res.json(snapshot.val());
  });
};

exports.bids = function(req, res) {
  db.ref('bids/').once('value').then(function(snapshot){
    res.json(snapshot.val());
  });
};

exports.bidById = function(req, res) {
  db.ref('bids/').orderByChild('cId').equalTo(Number.parseInt(req.header('cId'))).once('value').then(function(snapshot){
    res.json(snapshot.val());
  });
};

exports.addBid = function(req, res) {
  var postKey = db.ref('bids/').push().key;
  var data = {
    supplier : req.query.supplier,
    price : req.query.price,
    date : Date.now(),
    time : req.query.time,
    cId : Number.parseInt(req.query.cId)
  };
  var updates = {};
  updates[postKey] = data;
  db.ref('bids/').update(updates);
  res.json({"uploaded data" : updates});
}

exports.count = function(req, res) {
  db.ref('count/').once('value').then(function(snapshot){
    res.json(snapshot.val());
  });
};
