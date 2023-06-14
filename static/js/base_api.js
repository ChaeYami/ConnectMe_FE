const BACKEND_BASE_URL = "http://127.0.0.1:8000"
const FRONTEND_BASE_URL = "http://127.0.0.1:5500"

const payload = localStorage.getItem("payload");
const payload_parse = payload ? JSON.parse(payload) : null;
const logined_user_id = payload_parse ? parseInt(payload_parse.user_id) : null;

document.addEventListener("DOMContentLoaded", function () {
    const bot_nav = document.querySelector('.bot-nav');
    const loginLogout = document.querySelector('.login-logout');
    if (payload) {
        bot_nav.style.display = 'grid'; // bot-nav 표시
        loginLogout.innerHTML = '<a onclick="logoutButton()">로그아웃</a>';
    } else {
        bot_nav.style.display = 'none'; // bot-nav 숨김
        loginLogout.innerHTML = '<a onclick="go_login()">로그인</a>';
    }
})


function go_home() {
    location.href = "index.html"

}
function go_login() {
    location.href = "login.html"
}

function go_signup() {
    location.href = "signup.html"
}

function go_findAccount() {
    location.href = "find_account.html"
}

function go_findPassword() {
    location.href = "find_password.html"
}

// 내 프로필로 가기
function go_myProfile() {
    location.href = `profile.html?user_id=${logined_user_id}`
}

// 다른 유저의 프로필로 가기
function go_profile(user_id) {
    location.href = `profile.html?user_id=${user_id}`
}

// 친구찾기 페이지로 가기
function go_recommend() {
    location.href = "recommend.html"

}

// 장소추천 페이지로 가기
function go_placeView() {
    location.href = "place_view.html"
}

// 모임 페이지로 가기
function go_meetingList() {
    location.href = "meeting_list.html"
}


//로그아웃
function logoutButton() {
    if (confirm("로그아웃하시겠습니까?")) {
        handleLogout();
    }
}
async function handleLogout() {
    localStorage.removeItem("access")
    localStorage.removeItem("refresh")
    localStorage.removeItem("payload")
    location.replace('/index.html')
    alert("로그아웃되었습니다.")
}