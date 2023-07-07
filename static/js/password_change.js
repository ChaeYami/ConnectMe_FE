if (localStorage.getItem("access")) {
} else {
    swal("로그인된 사용자는 접근할 수 없습니다.", '', 'error')
        .then((value) => {
            window.location.replace("index.html")
        });

}
const logined_token = localStorage.getItem("access");


//비밀번호 변경
async function password_change() {
    const password_change_data = {
        confirm_password: document.getElementById("confirm_password").value,
        repassword: document.getElementById("repassword").value,
        password: document.getElementById("password").value,
    }

    const response = await fetch(`${BACKEND_BASE_URL}/user/password/change/`, {
        headers: {
            'Content-type': 'application/json',
            "Authorization": "Bearer " + logined_token,
        },
        method: 'PUT',
        body: JSON.stringify(password_change_data)
    })

    const result = await response.json()

    if (response.status === 200) {
        swal(`${result['message']}`, '', 'success')
            .then((value) => {
                handleLogout()
                window.location.replace('login.html')
            });


    } else if (response.status === 400) {

        if (result.confirm_password) {
            swal(`${result.confirm_password}`, '', 'warning')
        } else if (result.password) {
            swal(`${result.password}`, '', 'warning')
        } else if (result.repassword) {
            swal(`${result.repassword}`, '', 'warning')
        }

    }
}