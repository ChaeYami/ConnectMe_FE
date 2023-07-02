const user_id = parseInt(new URLSearchParams(window.location.search).get('user_id'));
const logined_token = localStorage.getItem("access");
const logined_account = payload_parse.account;



window.onload = () => {
    Profile(user_id);
    if (payload_parse.user_id === user_id) {
        // 내프로필일때
        document.getElementById("requests").style.display = "block";
        document.getElementById("friends-list").style.display = "block";
        document.getElementById("album").style.display = "block";
        // 채팅하기, 친구추가 숨김
        document.getElementById("chat").style.display = "none";
        document.getElementById("addFriend").style.display = "none";

    } else {
        // 다른사람 프로필일때
        document.getElementById("addFriend").style.display = "block";
        document.getElementById("chat").style.display = "block";
        document.getElementById("album").style.display = "block";
        document.getElementById("my-buttons").style.display = "none";
        document.getElementById("report-button").style.display = "block";
    }
}

// 프로필 내용 가져오기
async function Profile(user_id) {
    const response = await fetch(`${BACKEND_BASE_URL}/user/profile/${user_id}/`, {
        method: "GET",
    })
    response_json = await response.json()
    const current_region = `${response_json.current_region1} ${response_json.current_region2}`

    const user_id_int = parseInt(user_id)
    const profile_img_url = `${BACKEND_BASE_URL}${response_json.profile_img}`;
    const profile_img_element = document.getElementById("profile-img")
    if (response_json.profile_img === null) {
        profile_img_element.innerHTML = `<img src="static/image/user.png">`

    } else {
        profile_img_element.innerHTML = `<img src="${profile_img_url}">`
    }
    if (response_json.introduce) {
        document.getElementById('intro').innerHTML = `${response_json.introduce}`
    } else {
        document.getElementById('intro').innerHTML = '<span style="color:gray;">등록된 소개가 없습니다.</span>'
    }
    document.getElementById('nickname').innerHTML = `${response_json.nickname}<br>(${response_json.account})`
    document.getElementById('region').innerHTML = `${response_json.prefer_region}`
    document.getElementById('age').innerHTML = `${response_json.age}`
    document.getElementById('mbti').innerHTML = `${response_json.mbti}`
}

// 친구신청 버튼 눌렀을 때
async function addFriend() {
    const response = await fetch(`${BACKEND_BASE_URL}/user/friend/${user_id}/`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": "Bearer " + logined_token
        },
        method: "POST",
    });

    if (response.status == 201) {
        alert("친구신청을 보냈습니다.")
    } else {
        const errorData = await response.json();
        const errorArray = Object.entries(errorData);
        alert(errorArray[0][1]);
    }
}

async function report() {
    if (confirm("해당 유저를 신고하시겠습니까? 신고 이후엔 취소할 수 없습니다.")) {
        const response = await fetch(`${BACKEND_BASE_URL}/user/report/${user_id}/`, {
            headers: {
                'content-type': 'application/json',
                "Authorization": "Bearer " + logined_token
            },
            method: "POST",
        });

        if (response.status == 200) {
            alert("신고 완료")
        } else {
            const errorData = await response.json();
            const errorArray = Object.entries(errorData);
            alert(errorArray[0][1]);
        }
    }
}

function go_profileEdit() {
    location.href = `profile_edit.html?user_id=${logined_user_id}`
}

function go_personal() {
    location.href = 'personal.html'
}

function go_requestList(me) {
    location.href = `request_list.html?me=${me}`
}

function go_friends() {
    location.href = 'friends_list.html'
}

function go_album() {
    location.href = `profile_album.html?user_id=${user_id}`

}


// 채팅방 이름 생성 요청 후 채팅방 입장
function getChatRoom() {
    $.ajax({
        url: `${BACKEND_BASE_URL}/chat/${user_id}/`,
        type: "POST",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + localStorage.getItem("access")
        },
        success: function (response) {
            room_name = response['room_name'];
            let chat_url = '/chat_room.html?room=' + room_name;
            window.open(chat_url);
        },
        error: function (xhr) {
            // const errorData = xhr.responseJSON;
            // const errorArray = Object.entries(errorData);
            // alert(errorArray[0][1]);
        }
    });
}