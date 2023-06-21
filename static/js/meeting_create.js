// ================================ 모임 게시글 작성 시작 ================================
async function createMeeting() {
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
    await fetch(`${BACKEND_BASE_URL}/meeting/`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData
    })
        .then((response) => {
            response.json().then((data) => {
                let meeting_id = data.id
                console.log(data)
                if (data.id) {
                    alert("작성 되었습니다.")
                    location.replace(`${FRONTEND_BASE_URL}/meeting_detail.html?id=` + meeting_id)
                } else {
                    alert("제목과 내용을 입력해주세요.")
                }
            }
            );
        });
}
function setThumbnail(event) {
    for (var image of event.target.files) {
        var reader = new FileReader();

        reader.onload = function (event) {
            var img = document.createElement("img");
            img.setAttribute("src", event.target.result);
            document.querySelector("div#image_box").appendChild(img);
        };

        console.log(image);
        reader.readAsDataURL(image);
    }
}
// ================================ 모임 게시글 작성 끝 ================================
