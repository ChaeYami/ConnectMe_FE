const BACKEND_BASE_URL = "http://127.0.0.1:8000"
const FRONTEND_BASE_URL = "http://127.0.0.1:5500"
const KAKAO_API = '3611a3327df6a2e923777b26800f369d'
const KAKAO_JAVASCRIPT_API = '61771f77ccf8e5fb8aed8a7b26e8cfb1'

// const logined_token = localStorage.getItem("access");
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
        loginLogout.innerHTML = `
            <a onclick="go_login()">로그인</a>
            <a onclick="go_signup()">회원가입</a>
        `;
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

// 핫플레이스 전체 페이지로 가기
function go_placeView() {
    location.href = "place_view.html"
}

// 핫플레이스 상세페이지로 가기
function go_placeDetailView(place_id) {
    location.href = `place_view.html?id=${place_id}`
}

// 핫플레이스 북마크
function go_placeBook() {
    location.href = `personal_book.html?id=${logined_user_id}`
}

// 모임 페이지로 가기
function go_meetingList() {
    location.href = "meeting_list.html"
}

function go_counsel() {
    location.href = "counsel_list.html"
}

function go_create_counsel() {
    location.href = "counsel_create.html"
}

function go_counselDetail(counsel_id) {
    location.href = `counsel_detail.html?counsel_id=${counsel_id}`
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

// navigator.geolocation.getCurrentPosition(SuccessLocation, onGeoError);
function SuccessLocation(data) {
    const lat = data['coords'].latitude;
    const lon = data['coords'].longitude;

    $.ajax({
        url: `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lon}&y=${lat}`,
        type: 'GET',
        headers: { 'Authorization': `KakaoAK ` + KAKAO_API },
        success: function (position) {
            let full_address = position['documents'][0]['address'];
            let address = full_address['address_name'];
            let r1 = full_address['region_1depth_name'];
            let r2 = full_address['region_2depth_name'];
            let r3 = full_address['region_3depth_name'];

            let current_region = `${r1} ${r2}`

            const formdata = new FormData();
            formdata.append("user", logined_user_id)
            formdata.append("current_region", current_region)
            formdata.append("address", address)
            formdata.append("r1", r1)
            formdata.append("r2", r2)
            formdata.append("r3", r3)

            const response = fetch(BACKEND_BASE_URL + `/user/region/`, {
                headers: {
                    Authorization: "Bearer " + logined_token,
                },
                method: "PATCH",
                body: formdata,
            });

        },
        error: function (e) {
            console.log(e);
        }
    });
}

function onGeoError() {
    alert("위치권한을 확인해주세요");
}