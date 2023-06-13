if (localStorage.getItem("kakao") || localStorage.getItem("google") || localStorage.getItem("naver") || localStorage.getItem("payload")) {
    window.location.replace("index.html")
    alert("로그인됨")
}

// 회원가입

async function signup() {
    const phone_front = document.getElementById("phone-front")
    const phone_front_value = (phone_front.options[phone_front.selectedIndex].value)
    const phone_1 = document.getElementById("phone-1").value
    const phone_2 = document.getElementById("phone-2").value

    const account = document.getElementById("account").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const nickname = document.getElementById("nickname").value

    const formData = new FormData();
    formData.append("account", account);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("nickname", nickname);
    formData.append("phone", phone_front_value + phone_1 + phone_2);

    const response = await fetch(`${BACKEND_BASE_URL}/user/`, {
        headers: {
        },
        method: 'POST',
        body: formData,
    });

    const result = await response.json()
    console.log(result)

    if (response.status === 201) {
        return response

    } else if (response.status === 400) {
        document.getElementById('alert-danger').style.display = "block"
        const key = Object.keys(result)[0];
        makeAlert(key, result[key][0]);

    }


    // if (response.ok) {
    //     return response
    // } else {
    //     // 에러 처리
    //     const errorData = await response.json();
    //     const errorArray = Object.entries(errorData);
    //     alert(errorArray[0][1]);
    // }
}

async function signupButton() {
    const response = await signup();

    if (response.status == 201) {
        alert("이메일 발송 완료. 이메일 인증 후 회원가입을 완료해주세요")
        window.location.replace(`login.html`)
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

