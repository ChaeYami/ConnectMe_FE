//================================ 모임 게시글 수정 할 데이터 불러오기 API 시작 ================================ 
let meeting_id = new URLSearchParams(window.location.search).get('id');
fetch(`${BACKEND_BASE_URL}/meeting/` + meeting_id).then(res => res.json()).then(data => {
    title = data['title']
    content = data['content']

    $('#meeting_title').val(title)
    $('#meeting_content').val(content)

    images = data['meeting_image']
    images.forEach((each_image) => {
        let image = each_image['image']
        let id = each_image['id']
        let temp_html = `
                        <div class=update_image_box>
                        <img class=update_image src="${BACKEND_BASE_URL}${image}" alt="">
                        <a class=image_delete_btn> <img src="static/image/comment_delete.png" style="width: 30px;" onclick="deleteImage(${id})"> </a>
                        </div>
                        `
        $('#update_image_container').append(temp_html)
    }
    )
})
//================================ 모임 게시글 수정 할 데이터 불러오기 API 끝 ================================ 

//================================ 모임 게시글 수정 시 이미지 삭제 API 시작 ================================ 
async function deleteImage(id) {
    let token = localStorage.getItem("access")
    await fetch(`${BACKEND_BASE_URL}/meeting/${meeting_id}/meeting_image/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    window.location.reload()
}
//================================ 모임 게시글 수정 시 이미지 삭제 API 끝 ================================ 

//================================ 모임 게시글 수정 API 시작 ================================ 
async function updateMeeting() {
    let meeting_title = document.getElementById("meeting_title").value
    let meeting_content = document.getElementById("meeting_content").value
    let meeting_image = document.getElementById("meeting_image").files
    let token = localStorage.getItem("access")

    let formData = new FormData();
    formData.append("title", meeting_title);
    formData.append("content", meeting_content);

    for (let i = 0; i < meeting_image.length; i++) {
        let image = meeting_image[i]
        formData.append("image", image);
    }
    await fetch(`${BACKEND_BASE_URL}/meeting/${meeting_id}/`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData
    })
    await location.replace(`${FRONTEND_BASE_URL}/meeting_detail.html?id=` + meeting_id)
}
//================================ 모임 게시글 수정 API 끝 ================================ 
function setThumbnail(event) {
    for (var image of event.target.files) {
        var reader = new FileReader();

        reader.onload = function (event) {
            var img = document.createElement("img");
            img.className = 'show_img';
            img.setAttribute("src", event.target.result);
            document.querySelector("div#image_container").appendChild(img);
        };
        reader.readAsDataURL(image);
    }
}