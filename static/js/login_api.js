if (localStorage.getItem("kakao") || localStorage.getItem("google") || localStorage.getItem("naver") || localStorage.getItem("payload")) {
    window.location.replace("index.html")
    alert("로그인됨")
}


//로그인
async function Login() {
    const account = document.getElementById("account").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${BACKEND_BASE_URL}/user/login/`, {
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            "account": account,
            "password": password
        })
    })
    const response_json = await response.json()

    if (response.status === 200) {

        localStorage.setItem("access", response_json.access);
        localStorage.setItem("refresh", response_json.refresh);

        const base64Url = response_json.access.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(function (c) {
                return '%' + (
                    '00' + c.charCodeAt(0).toString(16)
                ).slice(-2);
            }).join('')
        );

        localStorage.setItem("payload", jsonPayload);
        go_api()
    } else if (response_json['non_field_errors']) {
        document.getElementById('alert-danger').style.display = "block"
        const alert_danger = document.getElementById('alert-danger')
        alert_danger.innerText = `${response_json['non_field_errors']}`
    }
    else {
        document.getElementById('alert-danger').style.display = "block"
        const alert_danger = document.getElementById('alert-danger')
        alert_danger.innerText = "아이디와 비밀번호를 확인해주세요"
    }
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


