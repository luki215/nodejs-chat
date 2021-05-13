const WebSocket = require('ws');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const session = require('express-session');
const crypto = require("crypto");


const user_sessions = new Map();


app.set('view engine', 'ejs');
app.use(session({ secret: 'possimus-repudiandae-errorpossimus-repudiandae-error', cookie: { maxAge: 1000*60*60*24 }}))
app.use(express.urlencoded());
app.use(express.static('public'))


//#region websockets

const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {

    //connection is up, let's add a simple simple event
    ws.on('message', (msg) => {
      const {userId, message} = JSON.parse(msg)
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          const data = {
            user: user_sessions.get(userId),
            message,
            mine: client === ws
          }
          client.send(JSON.stringify(data));
        }
      });
    });
});

//#endregion websockets


//#region route_definitions


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
    res.redirect('/chat-detail')
  }
})

// Rooms & users list
app.get('/chat-detail', (req, res) => {
  // user already logged in
  if(req.session.id && user_sessions.has(req.session.id)) {
    res.render('pages/chat-detail', {userId: req.session.id});
  } else {
    res.redirect('/');
  }
});

//#endregion route_definitions

server.listen(3000, () => {
  console.log('listening on *:3000');
});