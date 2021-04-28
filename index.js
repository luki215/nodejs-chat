const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const session = require('express-session');
const crypto = require("crypto");


const user_sessions = new Map();


app.set('view engine', 'ejs');
app.use(session({ secret: 'possimus-repudiandae-errorpossimus-repudiandae-error', cookie: { maxAge: 60000 }}))
app.use(express.urlencoded());

// on index show join or redirect to list of rooms
app.get('/', (req, res) => {
  // user already logged in
  if(req.session.id && user_sessions.has(req.session.id)) {
    res.redirect('/rooms')
  } else {
    res.render('pages/join');
  }
});

// join endpoint setting session ID
app.post('/join', (req, res) => {
  // user already logged in
  if(req.session.id && user_sessions.has(req.session.id)) {
    res.redirect('/')
  } else {
    req.session.id = crypto.randomBytes(16).toString('base64')
    req.session.nick = req.body.nick;
    user_sessions.set(req.session.id, {nick: req.session.nick})
    res.redirect('/rooms')
  }
})

// Rooms & users list
app.get('/rooms', (req, res) => {
  // user already logged in
  if(req.session.id && user_sessions.has(req.session.id)) {
    res.render('pages/rooms');
  } else {
    res.redirect('/');
  }
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});