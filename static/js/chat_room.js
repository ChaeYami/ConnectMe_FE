const payload = localStorage.getItem("payload");
const payload_parse = payload ? JSON.parse(payload) : null;
const logined_user_id = payload_parse ? parseInt(payload_parse.user_id) : null;

const nickname = payload_parse.nickname
document.getElementById('nickname').innerText = nickname

const room_name = new URLSearchParams(window.location.search).get('room');

const chatSocket = new ReconnectingWebSocket(
    WS_BACKEND_BASE_URL
    + '/ws/chat/'
    + room_name
    + '/'
);

chatSocket.onopen = function (e) {
    fetchMessages();
}

chatSocket.onmessage = function (e) {
    let data = JSON.parse(e.data);
    if (data['command'] === 'messages') {
        for (let i = 0; i < data['messages'].length; i++) {
            createMessage(data['messages'][i]);
        }
    } else if (data['command'] === 'new_message') {
        createMessage(data['message']);
    }
    scrollToBottom()
};

chatSocket.onclose = function (e) {
    console.error('Chat socket closed unexpectedly');
};

document.querySelector('#chat-message-input').onkeyup = function (e) {
    if (e.keyCode === 13) {  // enter, return
        document.querySelector('#chat-message-submit').click();
    }
};

document.querySelector('#chat-message-submit').onclick = function (e) {
    let messageInputDom = document.getElementById('chat-message-input');
    let message = messageInputDom.value;
    chatSocket.send(JSON.stringify({
        'command': 'new_message',
        'message': message,
        'from': nickname,
        'room_name': room_name
    }));

    messageInputDom.value = '';
};

function fetchMessages() {
    chatSocket.send(JSON.stringify({ 'command': 'fetch_messages', 'room_name': room_name }));
}

function createMessage(data) {
    let author = data['author'];
    let msgListTag = document.createElement('li');
    let imgTag = document.createElement('img');
    let pTag = document.createElement('p');
    pTag.textContent = data.content;
    imgTag.src = 'static/image/user.png';

    if (author === nickname) {
        msgListTag.className = 'sent';
    } else {
        msgListTag.className = 'replies';
    }
    msgListTag.appendChild(imgTag);
    msgListTag.appendChild(pTag);
    document.querySelector('#chat-log').appendChild(msgListTag);
}

function scrollToBottom() {
    let messages_box = document.getElementById("messages_box");
    messages_box.scrollTop = messages_box.scrollHeight;
}

$(".messages").animate({ scrollTop: $(document).height() }, "fast");

$("#profile-img").click(function () {
    $("#status-options").toggleClass("active");
});

$("#status-options ul li").click(function () {
    $("#profile-img").removeClass();
    $("#status-online").removeClass("active");
    $("#status-away").removeClass("active");
    $("#status-busy").removeClass("active");
    $("#status-offline").removeClass("active");
    $(this).addClass("active");

    if ($("#status-online").hasClass("active")) {
        $("#profile-img").addClass("online");
    } else if ($("#status-away").hasClass("active")) {
        $("#profile-img").addClass("away");
    } else if ($("#status-busy").hasClass("active")) {
        $("#profile-img").addClass("busy");
    } else if ($("#status-offline").hasClass("active")) {
        $("#profile-img").addClass("offline");
    } else {
        $("#profile-img").removeClass();
    };

    $("#status-options").removeClass("active");
});