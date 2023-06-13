if (localStorage.getItem("payload")){

} else if (location.href.split("=")[1]){
    let code = new URLSearchParams(window.location.search).get("code");
    let state = new URLSearchParams(window.location.search).get("state");
    let hashParams = new URLSearchParams(window.location.hash.substring(1));
    let google_token = hashParams.get("access_token");
    console.log(code)
    console.log(state)

    if(code){
        if (state){
            getNaverToken(code,state);
        }else{
            getKakaoToken(code);
        }
    }else if(google_token){
        getGoogleToken(google_token);
    }

}

function setLocalStorage(response){
    if (response.status === 200){
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
    }else{
        console.log(response)
        alert("으에에에엥");
        window.location.replace('login.html')
    }
}


async function getKakaoToken(kakao_code){
    const response = await fetch(`${BACKEND_BASE_URL}/user/login/kakao/`, {
        method : "POST",
        headers : {
            'content-type': 'application/json'
        },
        body : JSON.stringify({
            code : kakao_code
        })
    });
    response_json = await response.json();
    setLocalStorage(response);
}

async function getGoogleToken(google_token){
    const response = await fetch(`${BACKEND_BASE_URL}/user/login/google/`, {
        method : "POST",
        headers : {
            'content-type': 'application/json'
        },
        body : JSON.stringify({
            access_token : google_token
        })
    });
    response_json = await response.json();
    setLocalStorage(response);
}

async function getNaverToken(naver_code, state){
    const response = await fetch(`${BACKEND_BASE_URL}/user/login/naver/`, {
        method : "POST",
        headers : {
            'content-type': 'application/json'
        },
        body : JSON.stringify({
            naver_code : naver_code,
            state : state
        })
    });
    response_json = await response.json();
    setLocalStorage(response);
}