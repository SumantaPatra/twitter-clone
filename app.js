const express = require('express');
const app = express();
let session = require('express-session');
let mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/users')
const flash = require('connect-flash');
const path = require('path');
const isLoggedIn = require('./middleware').isLoggedIn;
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));
app.use(express.urlencoded({ extended: true }))
app.use(express.json());
const chat = require('./models/chat');
const http = require("http");
const server = http.createServer(app);
const socketio = require("socket.io");
const io = socketio(server);
mongoose.connect('mongodb://localhost:27017/twitter-clone',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));
app.use(session({
  secret: 'weneedabettersecret',
  resave: false,
  saveUninitialized: true
}))
app.use(session({
  secret: 'weneedabettersecret',
  resave: false,
  saveUninitialized: true
}))
app.use(flash());


// Routes

const authroutes = require('./routes/authroutes');
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(authroutes);
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});
const chartRoutes = require('./routes/chartroutes');
app.use(chartRoutes)

const postApiRoutes = require('./routes/api/postapi');
app.use(postApiRoutes);

const profileroutes = require('./routes/profile');
app.use(profileroutes);
io.on("connection", (socket) => {
  console.log("Connection Established");
  socket.on("send-msg", async (data) => {
    io.emit("recived-msg", {
      userName: data.user,
      msg: data.Msg,
    });
    await chat.create({ content: data.Msg, user: data.user })
  });
});
server.listen(3003, () => console.log('server started on http://localhost:3003'));
app.get('/', isLoggedIn, (req, res) => {
  const py = {
    userLoggedIn: req.session.user,
  }
  res.render('layouts/mainLayouts');
})
