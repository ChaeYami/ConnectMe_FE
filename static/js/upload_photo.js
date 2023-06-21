const logined_token = localStorage.getItem("access");

async function uploadPhoto() {

    const fileInput = document.getElementById('album_image');
    const formData = new FormData();
    for (let i = 0; i < fileInput.files.length; i++) {
        const file = fileInput.files[i];
        formData.append('album_img', file);

    }

    const response = await fetch(`${BACKEND_BASE_URL}/user/${logined_user_id}/image/`, {
        headers: {
            "Authorization": "Bearer " + logined_token,
        },
        method: 'POST',
        body: formData
    });

    if (response.status == 200) {
        alert("사진 업로드 완료")
        window.location.replace(`profile_album.html?user_id=${logined_user_id}`)
    } else {
        alert('으엥에ㅔ에에')
    }
}




//이미지 미리보기
function setThumbnail(event) {
    document.querySelector("#image_container").innerHTML = ``

    for (var image of event.target.files) {
        var reader = new FileReader();

        reader.onload = function (event) {
            var img = document.createElement("img");
            img.setAttribute("src", event.target.result);
            document.querySelector("#image_container").appendChild(img);
        };

        reader.readAsDataURL(image);
    }
}

