const payload = localStorage.getItem("payload");
const payload_parse = payload ? JSON.parse(payload) : null;
const logined_user_id = payload_parse ? parseInt(payload_parse.user_id) : null;

const logined_token = localStorage.getItem("access");

const room_name = new URLSearchParams(window.location.search).get('room');
const user_list = room_name.split("n");
const the_other_id = parseInt(user_list.filter(function (element) {
    return element !== logined_user_id.toString();
})[0]);


$(document).ready(function () {
    getMyNickname()
    getOtherNickname()
    chatConnect()
})
// profile/<int:user_id>/

function getMyNickname() {
    $.ajax({
        url: `${BACKEND_BASE_URL}/user/profile/${logined_user_id}/`,
        type: "GET",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + logined_token
        },
        success: function (response) {
            my_nickname = response['nickname']
            document.getElementById('my_nickname').innerText = my_nickname

            my_img = response['profile_img']
            let img_element = document.getElementById('my_img');
            img_element.onerror = function () {
                this.src = 'static/image/user.png';
            };
            img_element.src = my_img;

        },
        error: function () {
        }
    })
}

function getOtherNickname() {
    $.ajax({
        url: `${BACKEND_BASE_URL}/user/profile/${the_other_id}/`,
        type: "GET",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + logined_token
        },
        success: function (response) {
            other_nickname = response['nickname']
            document.getElementById('other_nickname').innerText = other_nickname

            other_img = response['profile_img']
            let img_element = document.getElementById('other_img');
            img_element.onerror = function () {
                this.src = 'static/image/user.png';
            };
            img_element.src = other_img;

        },
        error: function () {
        }
    })
}


function chatConnect() {
    const chatSocket = new ReconnectingWebSocket(
        WS_BACKEND_BASE_URL
        + '/ws/chat/'
        + room_name
        + '/?token='
        + logined_token
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
            scrollToBottom()
        } else if (data['command'] === 'new_message') {
            createMessage(data['message']);
            scrollToBottom()
        } else if (data['command'] === 'alert') {
            showAlert(data['message']);
        }
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
            'from': logined_user_id,
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
        imgTag.onerror = function () {
            this.src = 'static/image/user.png';
        };
        let pTag = document.createElement('p');
        pTag.textContent = data.content;

        if (author === my_nickname) {
            msgListTag.className = 'sent';
            imgTag.src = my_img;
        } else {
            msgListTag.className = 'replies';
            imgTag.src = other_img;
        }
        msgListTag.appendChild(imgTag);
        msgListTag.appendChild(pTag);
        document.querySelector('#chat-log').appendChild(msgListTag);
    }

    function scrollToBottom() {
        let messages_box = document.getElementById("messages_box");
        messages_box.scrollTop = messages_box.scrollHeight;
    }

    function showAlert(message) {
        alert(message);
        window.close()
    }
}



$(".messages").animate({ scrollTop: $(document).height() }, "fast");

$("#my_img").click(function () {
    $("#status-options").toggleClass("active");
});

$("#status-options ul li").click(function () {
    $("#my_img").removeClass();
    $("#status-online").removeClass("active");
    $("#status-away").removeClass("active");
    $("#status-busy").removeClass("active");
    $("#status-offline").removeClass("active");
    $(this).addClass("active");

    if ($("#status-online").hasClass("active")) {
        $("#my_img").addClass("online");
    } else if ($("#status-away").hasClass("active")) {
        $("#my_img").addClass("away");
    } else if ($("#status-busy").hasClass("active")) {
        $("#my_img").addClass("busy");
    } else if ($("#status-offline").hasClass("active")) {
        $("#my_img").addClass("offline");
    } else {
        $("#my_img").removeClass();
    };

    $("#status-options").removeClass("active");
});