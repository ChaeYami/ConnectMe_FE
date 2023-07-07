const KAKAO_API = '3611a3327df6a2e923777b26800f369d'
const KAKAO_JAVASCRIPT_API = '61771f77ccf8e5fb8aed8a7b26e8cfb1'

const payload = localStorage.getItem("payload");
const payload_parse = payload ? JSON.parse(payload) : null;
const logined_user_id = payload_parse ? parseInt(payload_parse.user_id) : null;

document.addEventListener("DOMContentLoaded", function () {
    const bot_nav = document.querySelector('.bot-nav');
    const loginLogout = document.querySelector('.login-logout');
    if (payload) {
        bot_nav.style.display = 'grid'; // bot-nav 표시

    } else {
        bot_nav.style.display = 'none'; // bot-nav 숨김
        loginLogout.innerHTML = `
            <a onclick="go_login()">로그인</a>
            <a onclick="go_signup()">회원가입</a>
        `;
    }
})


function go_home() {
    location.href = "/"

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

function go_createMeeting(info) {
    localStorage.setItem("dining", JSON.stringify(info));
    location.href = "meeting_create.html"
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
    location.href = `personal_book.html`
}

// 내 글 
function go_personal_create() {
    location.href = "/personal_create.html"
}

// 더보기
function go_personal_more(data) {
    location.href = `personal_more.html?id=${data}`
}

// 홈으로 보내고 api 실행
function go_api() {
    const redirectUrl = "index.html?showAPI=true";
    location.href = redirectUrl;
}

// 모임 페이지로 가기
function go_meetingList() {
    location.href = "meeting_list.html"
}

function go_meetingDetail(meeting_id) {
    location.href = `meeting_detail.html?id=${meeting_id}`
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

    swal({
        title: "로그아웃하시겠습니까?",
        text: "",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willLogout) => {
            if (willLogout) {
                handleLogout();
            }
        });
}

async function handleLogout() {
    swal("로그아웃되었습니다.", '', 'success')
        .then((value) => {
            localStorage.removeItem("access")
            localStorage.removeItem("refresh")
            localStorage.removeItem("payload")
            location.replace('/index.html')
        });
}

function go_requestList(me) {
    location.href = `request_list.html?me=${me}`
}


function SuccessLocation(data) {
    const lat = data['coords'].latitude;
    const lon = data['coords'].longitude;

    $.ajax({
        url: `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lon}&y=${lat}`,
        type: 'GET',
        headers: { 'Authorization': `KakaoAK ` + KAKAO_API },
        success: async function (position) {

            let full_address = position['documents'][0]['address'];
            let current_region1 = full_address['region_1depth_name'];
            let current_region2 = full_address['region_2depth_name'];
            let r3 = full_address['region_3depth_name'];

            const formdata = new FormData();
            formdata.append("user", logined_user_id)
            formdata.append("current_region1", current_region1)
            formdata.append("current_region2", current_region2)
            formdata.append("r3", r3)

            const response = await fetch(BACKEND_BASE_URL + `/user/region/`, {
                headers: {
                    Authorization: "Bearer " + logined_token,
                },
                method: "PATCH",
                body: formdata,
            });

            go_home()

        },
        error: function (error) {
            console.log(error);
        }
    });
}

function onGeoError() {
}

function go_meeting_join_list() {
    location.href = "meeting_join_list.html"
}
