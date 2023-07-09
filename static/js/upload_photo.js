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

    let response_json = await response.json();

    if (response.status == 200) {
        swal("사진 업로드 완료", '', 'success')
            .then((value) => {
                window.location.replace(`profile_album.html?user_id=${logined_user_id}`)

            })
    } else {
        swal(`${response_json['error']}`, '', 'warning')
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

