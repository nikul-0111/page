
const dotenv = require('dotenv');
dotenv.config();
const mongoose = require('mongoose');

const express = require('express');
const app = express();
const port = 3000; // Changed port number
const path = require("path");






app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CSS and JS files
app.use(express.static(path.join(__dirname, "public")));
function connectToDb() {
  mongoose.connect(process.env.DB_CONNECT, ).then(() => {
      console.log('Connected to MongoDB');
  }).catch((err) => {
      console.error('Error connecting to MongoDB:', err);
  });
}
connectToDb();

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/signup', (req, res) => {
  res.render("home");
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
          res.status(201).redirect('/home');
      })
      .catch(err => {
          res.status(500).send('Error registering user');
      });
});
 app.get("/login",(req,res)=>
{
  res.render("/mainpage");
})
app.post("/login",(req,res)=>
{
  
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
