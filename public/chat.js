
const msgForm = document.getElementById("sendMsgForm");
const msgInput = document.getElementById("msgInput");
const messages = document.getElementById("messages");
const userId = document.getElementById("userId").value;

var s = new WebSocket('ws://localhost:3000');
s.addEventListener('error', function (m) { console.log("error"); });
s.addEventListener('open', function (m) { console.log("websocket connection open"); });
s.addEventListener('message', function (m) {

    const {user, message, mine} = JSON.parse(m.data);
    const messageEl = document.createElement("div");
    messageEl.className="message";
    if(mine) {
        messageEl.className="message mine";
    }
    const messageAuthorEl = document.createElement("div")
    const messageContentEl = document.createElement("div")
    messageAuthorEl.appendChild(document.createTextNode(user.nick))
    messageContentEl.appendChild(document.createTextNode(message))
    messageEl.appendChild(messageAuthorEl);
    messageEl.appendChild(messageContentEl);
    messages.appendChild(messageEl);
});


document.getElementById("sendMsgForm").addEventListener("submit", function(e) {
    console.log(msgInput.value);

    s.send(JSON.stringify({userId, message: msgInput.value }))

    msgInput.value = "";
    e.preventDefault();
})
