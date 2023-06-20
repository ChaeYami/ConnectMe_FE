const logined_token = localStorage.getItem("access");


// 인증번호 발송
async function certifyPhone(){
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
async function ConfirmPhone(){
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
            $("#phone").prop("disabled", true);

        }, error: function(response){
            alert(response.responseJSON.message)
        }
    })
}



async function editPhone(){
    const phone = document.getElementById("phone").value

    $.ajax({
        url : `${BACKEND_BASE_URL}/user/`,
        type :"PATCH",
        dataType : "json",
        headers: {
            "Authorization": "Bearer " + logined_token
        },
        data: {
            "phone":phone
        },

        success: function(response){
            alert(response)
            location.replace("personal.html")
        }, error: function(response){
            alert(response.responseJSON.message)

        }
    })
}
