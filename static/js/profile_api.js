const user_id = parseInt(new URLSearchParams(window.location.search).get('user_id'));

window.onload = () => {
    Profile(user_id);
}

const logined_token = localStorage.getItem("access");
const logined_account = payload_parse.account;

async function Profile(user_id){
    const response = await fetch(`${BACKEND_BASE_URL}/user/profile/${user_id}/`, {
        method:"GET",
    })
    response_json = await response.json()
    const user_id_int = parseInt(user_id)
    const profile_img_url = `${BACKEND_BASE_URL}${response_json.profile_img}`;
    const profile_img_element = document.getElementById("profile-img")
    if (response_json.profile_img === null) {
        profile_img_element.innerHTML=`<img src="static/image/user.png">`
    
    }else{
        profile_img_element.innerHTML=`<img src="${profile_img_url}">`
    }
    document.getElementById('nickname').innerHTML = `${response_json.nickname}&nbsp(${response_json.account})`
    document.getElementById('region').innerHTML = `${response_json.prefer_region}`
    document.getElementById('age').innerHTML = `${response_json.age}`
    document.getElementById('mbti').innerHTML = `${response_json.mbti}`
    document.getElementById('intro').innerHTML = `${response_json.introduce}`
}


async function addFriend(){
    const response = await fetch(`${BACKEND_BASE_URL}/user/friend/${user_id}/`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": "Bearer " + logined_token
        },
        method:"POST",
    });

    if(response.status == 201){
        alert("친구신청을 보냈습니다.")
    }else {
        const errorData = await response.json();
        const errorArray = Object.entries(errorData);
        alert(errorArray[0][1]);
    }
}

function go_profileEdit(){
    location.href = `profile_edit.html?user_id=${logined_user_id}`
}

function go_personalEdit(){
    location.href = 'personal_edit.html'
}