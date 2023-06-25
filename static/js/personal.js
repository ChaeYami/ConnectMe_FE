
const logined_token = localStorage.getItem("access");
$(document).ready(function () {
    personal()
});

// 내정보보기 
async function personal(){
    $.ajax({
        url : `${BACKEND_BASE_URL}/user/`,
        type : "GET",
        dataType : "json",
        headers:{
            "Authorization": "Bearer " + logined_token
        },
        success: function(response){
            phone = response.phone
            email = response.email
            joined_at = response.joined_at

            $('#phone').text(phone)
            $('#email').text(email)
            $('#joined-at').text(joined_at)

        }
    })
}

// 회원탈퇴
async function deactivation() {
    const delConfirm = confirm("정말 탈퇴하시겠습니까?")
    const token = localStorage.getItem("access")
    const password = document.getElementById("password").value
    if (delConfirm) {
        const response = await fetch(`${backend_base_url}/user/${user_id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token,
                'content-type': 'application/json',
            },
            body: JSON.stringify({
                "password": password
            })
        })
        if (response.status == 204) {
            handleLogout()
        } else {
            alert("비밀번호를 확인해주세요")
        }
    }
}

function go_editphone(){
    location.href = 'edit_phone.html'
}



function go_passwordChange(){
    location.href = "password_change.html"

}

