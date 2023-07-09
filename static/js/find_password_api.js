//비밀번호 찾기
async function handleResetPassword() {
    const email = document.getElementById("reset_password").value

    const response = await fetch(`${BACKEND_BASE_URL}/user/password/email/`, {
        headers: {
            'content-type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({

            "email": email
        })
    })

    const response_json = await response.json()

    if (response.status === 200) {
        swal("비밀번호 재설정 이메일을 발송했습니다.", '메일을 확인하고 재설정을 진행해주세요.')
            .then((value) => {
                location.reload();
            });
    } else {
        if (response_json['email']) {
            swal(`${response_json['email']}`, '');

        } else {
            swal(`${response_json['message']}`, '');
        }
    }
}


//비밀번호 재설정
async function Set_Password() {

    const password = document.getElementById("new-password").value;
    const repassword = document.getElementById("new-password-confirm").value;
    const urlParams = new URLSearchParams(window.location.search);
    const uidb64 = urlParams.get('id');
    const token = urlParams.get('token');
    const response = await fetch(`${BACKEND_BASE_URL}/user/password/reset/`, {
        headers: {
            'Content-type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify({ "password": password, "repassword": repassword, "uidb64": uidb64, "token": token })
    })
    const result = await response.json()
    if (response.status === 200) {
        alert(result["message"])
        location.replace('login.html')

    } else if (response.status == 401) {
        alert("링크가 유효하지 않습니다.")

    } else {
        document.getElementById('alert-danger').style.display = "block"
        const key = Object.keys(result)[0];
        makeAlert(key, result[key][0]);
    }
}


document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("reset_password").addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            handleResetPassword();
        }
    });
});
