if (process.env.NODE_ENV != "production") {
  require('dotenv').config();
}
process.noDeprecation = true;

const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const expressError = require("./utilities/expressError");
const listingRouter = require('./routes/listings')
const reviewRouter = require('./routes/reviews')
const userRouter = require('./routes/users')
const sessions = require('express-session')
const MongoStore = require('connect-mongo');
const flash = require('express-flash')
const passport = require('passport');
const localStrategy = require('passport-local')
const user = require('./models/user')

app.set("view engine", "ejs");  
app.set("views", path.join(__dirname, "views")); 
app.engine("ejs", ejsMate);

app.use(methodOverride("_method"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

let atlasUrl = process.env.ATLAS_URL;

const store = MongoStore.create({
  mongoUrl: atlasUrl,
  crypto:{
    secret: process.env.SECRET
  },
  touchAfter: 24 * 3600
})

store.on('error', () => {
  console.log('Error in mongo session store.')
})          

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60,
    httpOnly: true
  }   
}

main()
  .then((res) => {
    console.log("Connection is successful...");
  })
  .catch((err) => console.log(err));
async function main() {
  await mongoose.connect(atlasUrl);
}

app.use(sessions(sessionOptions))
app.use(flash())
 
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(user.authenticate()));

passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.currUser = req.user;
  next();
})

app.use('/listings', listingRouter)
app.use('/listings/:id/review', reviewRouter)
app.use('/', userRouter)

app.all("*", (req, res, next) => {
  next(new expressError(404, "Page not found."));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listings/error.ejs", { statusCode, message });
});

app.listen("3000", () => {
  console.log("Listening to port 3000...");
});