if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}
const express = require("express");
const app = express()
const path = require("path");
const mongoose = require('mongoose');
const ejsMate = require("ejs-mate");
const taskRouter = require("./routes/task");
const userRouter = require("./routes/user");
const methodOverride = require('method-override');
const { assert } = require("console");
const ExpressError = require("./ExpressError");
const session = require("express-session")
const cookieParser = require("cookie-parser");
const flash = require('connect-flash');
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");
const MongoStore = require('connect-mongo')

main()
.then(()=>{
    console.log("connection established");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(process.env.ATLAS_DB_URL);
}

app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'));
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"))
// mongoose.set('strictPopulate', false);


const store = MongoStore.create({
  mongoUrl: process.env.ATLAS_DB_URL,
  crypto: {
    secret: process.env.SECRET
  },
  touchAfter: 24*3600
})

store.on("error",()=>{
  throw new ExpressError(404,"ERROR IN MONGO SESSION STORE")
})

app.use(session({
  store: store,
  secret: 'keyboardSecret',
  resave: false,
  saveUninitialized: true,
  cookie: { 
    express: Date.now() + 7*24*60*60*1000,
    maxAge: 7*24*60*60*1000,
    httpOnly: true
   }
}))

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success");
  res.locals.failure = req.flash("failure");
  res.locals.currUser = req.user;
  next();
})

app.use("/tasks",taskRouter)
app.use("/",userRouter);
app.get("/",(req,res)=>{
  res.redirect("/tasks");
})
//if req do not match 
app.all("*",(req,res,next)=>{
  next(new ExpressError(404,"Page not found"));
})

app.listen(3000,()=>{
    console.log("Server is listening to port ", 3000);
})

app.use((err,req,res,next)=>{
  let { status=500,message="SOME ERROR OCCURED" } = err;
  res.status(status).send(message);
})