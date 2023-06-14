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

    // 프로필 이미지 미리보기
    const profile_img = document.getElementById('profile_img');
    if (response_json.profile_img) {
        const imageUrl = `${BACKEND_BASE_URL}${response_json.profile_img}`;
        document.getElementById('profile_preview').src = imageUrl;
    }

}
function toggleFileInput() {
    const fileInput = document.getElementById("profile_img");
    if (fileInput.style.display === "none") {
        fileInput.style.display = "block";
    } else {
        fileInput.style.display = "none";
    }
}

// 이미지 미리보기
function previewImage() {
    const fileInput = document.getElementById('profile_img');
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onloadend = function () {
        const previewImg = document.getElementById('profile_preview');
        previewImg.src = reader.result;
    }

    if (file) {
        reader.readAsDataURL(file);
    }
}

// 수정완료 버튼 눌렀을 때
async function updateProfile() {
    const nickname = document.getElementById('nickname').value
    const introduce = document.getElementById('introduce').value
    const fileInput = document.getElementById('profile_img');
    const age = document.getElementById('age').value;
    const mbti = document.getElementById('mbti').value;
    const file = fileInput.files[0];
    const formData = new FormData();

    formData.append('nickname', nickname);
    formData.append('introduce', introduce);
    formData.append('age', age);
    formData.append('mbti', mbti);

    if (file) {
        formData.append('profile_img', file);
    } else {
        formData.set('profile_img', '');
    }


    const response = await fetch(`${BACKEND_BASE_URL}/user/profile/${user_id}/`, {
        headers: {
            "Authorization": "Bearer " + logined_token,
        },
        method: 'PATCH',
        body: formData
    });

    if (response.status == 200) {
        alert("수정 완료")
        window.location.replace(`/profile.html?user_id=${user_id}`)
    } else {
        alert('으엥에ㅔ에에')
    }
}

function deleteProfileImage() {
    $('#profile_img').val('');
    $('#profile_preview').attr('src', "/static/image/user.jpg")
}