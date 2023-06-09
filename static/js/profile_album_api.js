const user_id = parseInt(new URLSearchParams(window.location.search).get('user_id'));


$(document).ready(function () {
    showAlbum()
    if (user_id != logined_user_id) {
        const upload_btn = document.getElementById('upload-photo')
        upload_btn.style.display = 'none';
    }
});

async function showAlbum() {
    $.ajax({
        url: `${BACKEND_BASE_URL}/user/${user_id}/image/`,
        type: "GET",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + logined_token
        },
        success: function (response) {
            const rows = response;

            for (let i = 0; i < rows.length; i++) {
                temp_html = ``
                if (user_id != logined_user_id) {
                    temp_html = `
                <img src="${BACKEND_BASE_URL}${rows[i]['album_img']}">

                `

                    $('.images').append(temp_html)
                } else {
                    temp_html = `
                <img src="${BACKEND_BASE_URL}${rows[i]['album_img']}">
                <a id="del_photo_btn">
                    <img src="static/image/comment_delete.png" onclick="deletePhoto(${user_id}, ${rows[i]['id']})" style="width:20px;">
                </a>
                `
                    $('.images').append(temp_html)
                }
            }
        }
    })
}


function go_uploadPhoto() {
    location.href = 'profile_upload_photo.html'

}

// 이미지 삭제하기
async function deletePhoto(user_id, image_id) {


    swal({
        title: "삭제하시겠습니까?",
        text: "삭제한 사진은 되돌릴 수 없습니다.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then(async (willDelete) => {
            if (willDelete) {
                const response = await fetch(`${BACKEND_BASE_URL}/user/${user_id}/image/${image_id}/`, {
                    headers: {
                        Authorization: "Bearer " + logined_token,
                        'content-type': 'application/json'
                    },
                    method: "DELETE",

                })
                if (response.status == 200) {
                    swal("삭제 완료", '', 'success')
                        .then((value) => {
                            window.location.replace(`profile_album.html?user_id=${logined_user_id}`);
                        });
                }
                else {
                    swal("권한이 없습니다.", '', 'error')
                }
            }
        });


}