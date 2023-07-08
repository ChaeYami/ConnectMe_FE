const logined_token = localStorage.getItem("access");


let timer;
let isRunning = false;

// 인증번호 발송하고 타이머 함수 실행
function startCountdown(){
    	// 남은 시간
	let leftSec = 5* 60,
	display = document.querySelector('#countdown');
	// 이미 타이머가 작동중이면 중지
	if (isRunning){
	   clearInterval(timer);
	} else {
    	isRunning = true;
    }
     startTimer(leftSec, display);
}

function startTimer(count, display) {
        let minutes, seconds;
        timer = setInterval(function () {
        minutes = parseInt(count / 60, 10);
        seconds = parseInt(count % 60, 10);

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        // 타이머 끝
        if (--count < 0) {
	     clearInterval(timer);
	     display.textContent = "";
	     isRunning = false;
        }
    }, 1000);
}


// 인증번호 발송
async function certifyPhone() {
    const phone = document.getElementById("phone").value

    $.ajax({
        url: `${BACKEND_BASE_URL}/user/phone/send/signup/`,
        type: "POST",
        dataType: "json",
        data: {
            "phone": phone
        },

        success: function (response) {
            swal(`${response.message}`, '')
            $("#auth-num-box").attr("style", "display:flex;");

        }, error: function (response) {
            swal(`${response.responseJSON.message}`, '')
        }
    })

}


// 인증번호 확인
async function ConfirmPhone() {
    const phone = document.getElementById("phone").value
    const auth_num = document.getElementById("auth-num").value

    $.ajax({
        url: `${BACKEND_BASE_URL}/user/phone/confirm/signup/`,
        type: "POST",
        dataType: "json",
        data: {
            "phone": phone,
            "auth_number": auth_num
        },

        success: function (response) {
            swal(`${response.message}`, '')
                .then((value) => {
                    $("#phone").prop("disabled", true);
                    $("#submit-button").attr("style", "display:block;");
                });

        }, error: function (response) {
            swal(`${response.responseJSON.message}`, '')
        }
    })
}



async function editPhone() {
    const phone = document.getElementById("phone").value

    $.ajax({
        url: `${BACKEND_BASE_URL}/user/`,
        type: "PATCH",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + logined_token
        },
        data: {
            "phone": phone
        },

        success: function (response) {
            swal(`${response.message}`, '')
                .then((value) => {
                    location.replace("personal.html")
                });
        }, error: function (response) {
            swal(`${response.responseJSON.message}`, '')

        }
    })
}


