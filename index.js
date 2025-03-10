const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');
const session = require('express-session');
const userModel = require('./models/userModels'); // Assuming the user model is in the models directory

const express = require('express');
const app = express();
const port = 3000; // Changed port number
const path = require("path");

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true if using HTTPS
}));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CSS and JS files
app.use(express.static(path.join(__dirname, "public")));

function connectToDb() {
  mongoose.connect(process.env.DB_CONNECT).then(() => {
      console.log('Connected to MongoDB');
  }).catch((err) => {
      console.error('Error connecting to MongoDB:', err);
  });
}
connectToDb();

app.get('/', (req, res) => {
  res.render('start.ejs');
});

app.get('/signup', (req, res) => {
  res.render("signup.ejs");
});

app.post('/signup', (req, res) => {
  let { firstname, lastname, email, password } = req.body;
  userModel.create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      password: password
  })
      .then(user => {
          req.session.user = user;
          res.status(201).redirect('/mainpage');
      })
      .catch(err => {
          res.status(500).send('Error registering user');
      });
});

app.get('/login', (req, res) => {
  res.render("login.ejs");
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  validateLogin(email, password)
    .then(user => {
      if (user) {
        req.session.user = user;
        res.status(200).redirect('/mainpage');
      } else {
        res.status(401).send('Invalid email or password');
      }
    })
    .catch(err => {
      res.status(500).send('Error logging in');
    });
});

app.get("/mainpage", (req, res) => {
  if (req.session.user) {
    res.render("mainpage", { user: req.session.user });
  } else {
    res.redirect('/login');
  }
});

function validateLogin(email, password) {
  return userModel.findOne({ email: email, password: password });
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});