if(localStorage.getItem("access")){
} else{
    alert("접근이 불가능합니다.")
    window.location.replace("index.html")
}
const logined_token = localStorage.getItem("access");


//비밀번호 변경
async function password_change() {
    const password_change_data = {
        confirm_password: document.getElementById("confirm_password").value,
        repassword: document.getElementById("repassword").value,
        password: document.getElementById("password").value,
    }

    const response = await fetch(`${BACKEND_BASE_URL}/user/password/change/`,{
        headers:{
            'Content-type':'application/json',
            "Authorization": "Bearer " + logined_token,
        },
        method: 'PUT',
        body: JSON.stringify(password_change_data)
    })

    const result = await response.json()
    
    if (response.status === 200) {
        alert(result['message'])
        handleLogout()
        window.location.replace('login.html')

    } else if (response.status === 400) {
        alert(result['message'])
    }
}