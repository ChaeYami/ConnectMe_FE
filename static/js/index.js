if (localStorage.getItem("payload")) {

} else if (location.href.split("=")[1]) {
    let code = new URLSearchParams(window.location.search).get("code");
    let state = new URLSearchParams(window.location.search).get("state");
    let hashParams = new URLSearchParams(window.location.hash.substring(1));
    let google_token = hashParams.get("access_token");

    if (code) {
        if (state) {
            getNaverToken(code, state);
        } else {
            getKakaoToken(code);
        }
    } else if (google_token) {
        getGoogleToken(google_token);
    }

}

const logined_token = localStorage.getItem("access");

$(document).ready(function () {
    recommend('all')
});


function setLocalStorage(response) {
    if (response.status === 200) {
        localStorage.setItem("access", response_json.access);
        localStorage.setItem("refresh", response_json.refresh);
        const base64Url = response_json.access.split(".")[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(
            atob(base64).split('').map(function (c) {
                return '%' + (
                    '00' + c.charCodeAt(0).toString(16)
                ).slice(-2);
            }).join('')
        );
        localStorage.setItem("payload", jsonPayload);
        window.location.replace('index.html')
    } else {
        alert("으에에에엥");
        window.location.replace('login.html')
    }
}


async function getKakaoToken(kakao_code) {
    const response = await fetch(`${BACKEND_BASE_URL}/user/login/kakao/`, {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            code: kakao_code
        })
    });
    response_json = await response.json();
    setLocalStorage(response);
}

async function getGoogleToken(google_token) {
    const response = await fetch(`${BACKEND_BASE_URL}/user/login/google/`, {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            access_token: google_token
        })
    });
    response_json = await response.json();
    setLocalStorage(response);
}

async function getNaverToken(naver_code, state) {
    const response = await fetch(`${BACKEND_BASE_URL}/user/login/naver/`, {
        method: "POST",
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            naver_code: naver_code,
            state: state
        })
    });
    response_json = await response.json();
    setLocalStorage(response);
}


// 추천 유저목록
async function recommend(filter) {
    $('#list-section').empty()

    $.ajax({
        url: `${BACKEND_BASE_URL}/user/recommend/${filter}/`,
        type: "GET",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + logined_token
        },
        success: function (response) {
            const rows = response;

            for (let i = 0; i < rows.length; i++) {
                let user_pk = rows[i]['id']
                let user_nickname = rows[i]['nickname']
                let user_age = rows[i]['age']
                let user_profile_img = rows[i]['profile_img']
                if (user_profile_img==null){
                    user_profile_img = '/media/user.png'
                }

                let temp_html = `<a onclick="go_profile(${user_pk})"><div class="card">
                    <div class="image_box">
                        <img class="image" src="${BACKEND_BASE_URL}${user_profile_img}"alt="">
                    </div>
                    <div class="user_info">
                        <div class="user_nickname">
                            ${user_nickname}
                        </div>
                        <div class="ect">
                            ${user_age}
                        </div>

                    </div>
                </div></a>`

                $('#list-section').append(temp_html)
            }


        }, error: function () {
            alert(response.status);
        }
    })

}