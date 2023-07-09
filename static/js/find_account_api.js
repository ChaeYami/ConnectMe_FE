if (localStorage.getItem("payload")){
    window.location.replace("index.html")
    swal("접근이 불가합니다.",'','error')
} else {}



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



//휴대폰 인증번호 발송
async function phone_send() {
    if(document.getElementById("phone").value){
        const phone_send_data = {
            phone: document.getElementById("phone").value,
        }
    
        const response = await fetch(`${BACKEND_BASE_URL}/user/phone/send/account`,{
            headers:{
                'Content-type':'application/json',
            },
            method: 'POST',
            body: JSON.stringify(phone_send_data)
        })
    
        const result = await response.json()
        
        if (response.status === 200) {
            swal("인증번호가 발송되었습니다.",'문자메시지를 확인해주세요.')
            $("#auth-num-box").attr("style", "display:flex;");
            
    
        } else if (response.status === 400) {
            document.getElementById('alert-danger_1').style.display ="block"
            const alert_danger_1 = document.getElementById('alert-danger_1')
            alert_danger_1.innerText = `${result['message']}`
        }
    }else{
        swal("휴대폰 번호를 입력해주세요",'',"warning")
    }
    
}


//인증번호 확인
async function auth_number_confirm() {
    const auth_number_confirm_data = {
        phone: document.getElementById("phone").value,
        auth_number: document.getElementById("auth_number").value,
    }

    const response = await fetch(`${BACKEND_BASE_URL}/user/phone/confirm/account/`,{
        headers:{
            'Content-type':'application/json',
        },
        method: 'POST',
        body: JSON.stringify(auth_number_confirm_data)
    })

    const result = await response.json()
    
    if (response.status === 200) {
        document.getElementById('info_message').style.display ="flex"
        const alert_danger_2 = document.getElementById('info_message')
        alert_danger_2.innerText = `${result['message']}`
        
    } else if (response.status === 400) {
        document.getElementById('alert-danger_2').style.display ="block"
        const alert_danger_2 = document.getElementById('alert-danger_2')
        alert_danger_2.innerText = `${result['message']}`
    }
}

document.addEventListener("DOMContentLoaded", function () {

    document.getElementById("phone").addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            phone_send();startCountdown();
        }
    });

});