require("dotenv").config();
const express = require("express");
const ejs = require("ejs");
const session = require("express-session");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 3000;
const uri =
  "mongodb+srv://learndb:learndb123@livetogetherdb.kvt5dai.mongodb.net/?retryWrites=true&w=majority&appName=LiveTogetherDB";

// database connection
// mongoose.connect(uri);
// const db = mongoose.connection;
// db.on("error", (error) => {
//   console.log(error);
// });

// db.once("open", () => {
//   console.log("Connected to the database");
// });

async function run() {
  try {
    const dboptions = {
      dbname: "nites",
    };
    await mongoose.connect(uri, dboptions);
    console.log("connected db");
  } catch (err) {
    res.status(500).send("error");
  }

run();

//Middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static("uploads"));

app.use(
  session({
    secret: "my-secret-key",
    saveUninitialized: true,
    resave: false,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

//set template engine ...
app.set("view engine", "ejs");
app.set("views", "./views");

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });

// route prefix
app.use("", require("./routes/routes"));

app.listen(PORT, () => {
  console.log("Server started at", PORT);
});
