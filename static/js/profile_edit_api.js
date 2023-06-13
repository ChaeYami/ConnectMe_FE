const user_id = parseInt(new URLSearchParams(window.location.search).get('user_id'));

window.onload = () => {
    existingProfile(user_id)
}

const logined_token = localStorage.getItem("access");
const logined_account = payload_parse.account;

// 입력폼에 기존 값 넣기
async function existingProfile(user_id) {
    const response = await fetch(`${BACKEND_BASE_URL}/user/profile/${user_id}/`, {
        headers: {
            'content-type': 'application/json',
            "Authorization": "Bearer " + logined_token
        },
        method: 'GET',
    })
    response_json = await response.json()

    document.getElementById('nickname').value = response_json.nickname
    document.getElementById('introduce').value = response_json.introduce
    document.getElementById('age').value = response_json.age
    document.getElementById('mbti').value = response_json.mbti

}
