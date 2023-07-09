if (localStorage.getItem("kakao") || localStorage.getItem("google") || localStorage.getItem("naver") || localStorage.getItem("payload")) {
    window.location.replace("index.html")
    alert("로그인됨")
}

let timer;
let isRunning = false;

// 인증번호 발송하고 타이머 함수 실행
function startCountdown(){
    	// 남은 시간
	let leftSec = 5* 60,
	display = document.querySelector('#countdown');
	// 이미 타이머가 작동중이면 중지
	if (isRunning){
	   clearInterval(timer);
	} else {
    	isRunning = true;
    }
     startTimer(leftSec, display);
}

function startTimer(count, display) {
        let minutes, seconds;
        timer = setInterval(function () {
        minutes = parseInt(count / 60, 10);
        seconds = parseInt(count % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        // 타이머 끝
        if (--count < 0) {
	     clearInterval(timer);
	     display.textContent = "";
	     isRunning = false;
        }
    }, 1000);
}



// 회원가입

async function signup() {
    const phone = document.getElementById("phone").value
    const account = document.getElementById("account").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const nickname = document.getElementById("nickname").value

    const formData = new FormData();
    formData.append("account", account);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("nickname", nickname);
    formData.append("phone", phone);

    const response = await fetch(`${BACKEND_BASE_URL}/user/`, {
        headers: {
        },
        method: 'POST',
        body: formData,
    });

    const result = await response.json()

    if (response.status === 201) {
        return response

    } else if (response.status === 400) {
        document.getElementById('alert-danger').style.display = "block"
        const key = Object.keys(result)[0];
        makeAlert(key, result[key][0]);

    }

}
// 엔터키 처리
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("nickname").addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            signup();
        }
    });

    document.getElementById("phone").addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            certifyPhoneSignup();startCountdown();
        }
    });

});

async function signupButton() {
    const response = await signup();

    if (response.status == 201) {
        swal("이메일 발송 완료", "이메일 인증 후 회원가입을 완료해주세요")
            .then((value) => {
                window.location.replace(`login.html`)
            })
    }
}

//알람 뜨게
function makeAlert(key, errorText) {
    if (document.getElementsByClassName("alert-danger")[0]) {
        const alert_div = document.getElementsByClassName("alert-danger")[0];
        alert_div.innerText = `${errorText}`
    } else {
        const alert_div = document.createElement("div");
        const signup_form = document.getElementsByClassName("signup")[0];
        alert_div.setAttribute("class", "alert-danger");
        alert_div.innerText = `${errorText}`;
        const signup_button = signup_form.childNodes[8];
        signup_form.insertBefore(alert_div, signup_button);
    }
}

// 인증번호 발송
async function certifyPhoneSignup() {
    const phone = document.getElementById("phone").value

    $.ajax({
        url: `${BACKEND_BASE_URL}/user/phone/send/signup/`,
        type: "POST",
        dataType: "json",
        data: {
            "phone": phone
        },

        success: function (response) {
            swal("인증번호가 발송되었습니다.",'문자메시지를 확인해주세요.')
            $("#auth-num-box").attr("style", "display:flex;");

        }, error: function (response) {
            swal(`${response.responseJSON.message}`, '', 'warning')
        }
    })
}

// 인증번호 확인
async function ConfirmPhoneSignup() {
    const phone = document.getElementById("phone").value
    const auth_num = document.getElementById("auth-num").value

    $.ajax({
        url: `${BACKEND_BASE_URL}/user/phone/confirm/signup/`,
        type: "POST",
        dataType: "json",
        data: {
            "phone": phone,
            "auth_number": auth_num
        },

        success: function (response) {
            swal(`${response.message}`, '')
                .then((value) => {
                    $("#phone-front").prop("disabled", true);
                    $("#phone").prop("disabled", true);
                });
        }, error: function (response) {
            swal(`${response.responseJSON.message}`, '')
        }
    })
}

// 카카오로그인
async function kakaoLogin() {
    const response = await fetch(`${BACKEND_BASE_URL}/user/login/kakao/`, {
        method: "GET"
    })
    const kakao_id = await response.json()
    const redirect_uri = `${FRONTEND_BASE_URL}/index.html`
    const scope = 'profile_nickname account_email age_range'
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${kakao_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}`

}

// 네이버로그인
async function naverLogin() {
    const response = await fetch(`${BACKEND_BASE_URL}/user/login/naver/`, {
        method: "GET"
    });
    const naver_id = await response.json();
    const redirect_uri = `${FRONTEND_BASE_URL}/index.html`
    const state = new Date().getTime().toString(36); // 랜덤 state : 현재 시간을 36진수로 변환, CSRF 공격 방지
    window.location.href = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${naver_id}&redirect_uri=${redirect_uri}&state=${state}`;

}



// 구글로그인
async function googleLogin() {
    const response = await fetch(`${BACKEND_BASE_URL}/user/login/google/`, {
        method: "GET"
    });
    const google_id = await response.json();
    const redirect_uri = `${FRONTEND_BASE_URL}/index.html`
    const scope = `https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile`
    const param = `scope=${scope}&include_granted_scopes=true&response_type=token&state=pass-through value&prompt=consent&client_id=${google_id}&redirect_uri=${redirect_uri}`
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${param}`
}


