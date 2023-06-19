if (localStorage.getItem("payload")){
    window.location.replace("index.html")
    alert("접근이 불가합니다.")
} else {}


//휴대폰 인증번호 발송
async function phone_send() {
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
        alert("인증번호가 발송되었습니다. 확인부탁드립니다.")

    } else if (response.status === 400) {
        document.getElementById('alert-danger_1').style.display ="block"
        const alert_danger_1 = document.getElementById('alert-danger_1')
        alert_danger_1.innerText = `${result['message']}`

        
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
        document.getElementById('info_message').style.display ="block"
        const alert_danger_2 = document.getElementById('info_message')
        alert_danger_2.innerText = `${result['message']}`
        
    } else if (response.status === 400) {
        document.getElementById('alert-danger_2').style.display ="block"
        const alert_danger_2 = document.getElementById('alert-danger_2')
        alert_danger_2.innerText = `${result['message']}`
    }
}