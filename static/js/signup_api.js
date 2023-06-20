if (localStorage.getItem("kakao") || localStorage.getItem("google") || localStorage.getItem("naver") || localStorage.getItem("payload")) {
    window.location.replace("index.html")
    alert("로그인됨")
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

    console.log(phone.length)
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

// 인증번호 발송
async function certifyPhoneSignup(){
    const phone = document.getElementById("phone").value

    $.ajax({
        url : `${BACKEND_BASE_URL}/user/phone/send/signup/`,
        type :"POST",
        dataType : "json",
        data: {
            "phone":phone
        },

        success: function(response){
            alert(response.message)
            $("#auth-num-box").attr("style", "display:flex;");

        }, error: function(response){
            alert(response.responseJSON.message)
        }
    })
}

// 인증번호 확인
async function ConfirmPhoneSignup(){
    const phone = document.getElementById("phone").value
    const auth_num = document.getElementById("auth-num").value

    $.ajax({
        url : `${BACKEND_BASE_URL}/user/phone/confirm/signup/`,
        type :"POST",
        dataType : "json",
        data: {
            "phone":phone,
            "auth_number" : auth_num
        },

        success: function(response){
            alert(response.message)
            $("#phone-front").prop("disabled", true);
            $("#phone").prop("disabled", true);

        }, error: function(response){
            alert(response.responseJSON.message)
        }
    })
}