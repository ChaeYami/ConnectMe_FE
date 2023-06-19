
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

function go_editphone(){
    window.open('edit_phone.html')
}










function go_passwordChange(){
    location.href = "password_change.html"

}

