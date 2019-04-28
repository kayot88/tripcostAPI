require('dotenv').config({ path: '.env' });
const express = require('express');
// const what = require('what');
const mongo = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017';
const port = process.env.PORT;

const app = express();
app.use(express.json());

let db, trips, expenses;

mongo.connect(url, (err, client) => {
  if (err) {
    console.error(err);
    return;
  }
  db = client.db('tripcost');
  trips = db.collection('trips');
  expenses = db.collection('expenses');
});

console.log(db);
app.post('/trip', (req, res) => {
  const name = req.body.name;
  // console.log(name);
  trips.insertOne({ name }, (err, result) => {
    if (err) {
      console.error(err);
      res.status(500).json({ err: err });
      return;
    }
    res.status(200).json({ ok: true });
  });
});

app.get('/trips', (req, res) => {
  trips.find().toArray((err, items) => {
    if (err) {
      res.status(500).json({ err: err });
    }
    res.status(200).json({ trips: items });
  });
});

app.get('/expenses', (req, res) => {
  expenses.find({ trip: req.body.trip }).toArray((err, items) => {
    if (err) {
      res.status(500).json({ err: err });
    }
    res.status(200).json({ trips: items });
  });
});

app.post('/expense', (req, res) => {
  expenses.insertOne(
    {
      trip: req.body.trip,
      date: req.body.date,
      amount: req.body.amount,
      category: req.body.category,
      desc: req.body.desc
    },
    (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).json({ err: err });
        return;
      }
      res.status(200).json({ ok: true });
    }
  );
});

app.listen(port, () => console.log(`Server ready on ${port}  port`));
