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
        console.log(id)
        let temp_html = `<img src="${BACKEND_BASE_URL}${image}" alt="">
                <button onclick="deleteImage(${id})">삭제</button>`
        $('#image_box').append(temp_html)
    }

    )
})
//================================ 모임 게시글 수정 할 데이터 불러오기 API 끝 ================================ 

//================================ 모임 게시글 수정 시 이미지 삭제 API 시작 ================================ 
async function deleteImage(id) {
    await fetch(`${BACKEND_BASE_URL}/meeting/${meeting_id}/meeting_image/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjg2ODc3Mjg5LCJpYXQiOjE2ODY3OTA4ODksImp0aSI6IjJmYzA3YjBjYjUzNzRkNWM5MWRlNWM1YTQyZGQ2ODAwIiwidXNlcl9pZCI6MSwiZW1haWwiOiJuYnYxNDQzQGdtYWlsLmNvbSIsImFjY291bnQiOiJuYnYxNDQzIiwicGhvbmUiOiIwMDAwMDAwMDAwMCIsIm5pY2tuYW1lIjoiXHVhYzAwXHViY2Y0XHVjNzkwXHVhY2UwIn0.g0dN8h-FxNCsEw-zwXHGN-Df6R4zq7jy8t2rWHDs9Hk"
            // Authorization: localStorage.getItem('access_token'),
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
    // let token = localStorage.getItem("access")

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
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjg2ODc3Mjg5LCJpYXQiOjE2ODY3OTA4ODksImp0aSI6IjJmYzA3YjBjYjUzNzRkNWM5MWRlNWM1YTQyZGQ2ODAwIiwidXNlcl9pZCI6MSwiZW1haWwiOiJuYnYxNDQzQGdtYWlsLmNvbSIsImFjY291bnQiOiJuYnYxNDQzIiwicGhvbmUiOiIwMDAwMDAwMDAwMCIsIm5pY2tuYW1lIjoiXHVhYzAwXHViY2Y0XHVjNzkwXHVhY2UwIn0.g0dN8h-FxNCsEw-zwXHGN-Df6R4zq7jy8t2rWHDs9Hk"
            // Authorization: localStorage.getItem('access_token'),
        },
        body: formData
    })
        .then((response) => {
            response.json().then((data) => {
                let meeting_id = data.id

            }
            );
        });
    await location.replace(`${FRONTEND_BASE_URL}/meeting_detail.html?id=` + meeting_id)
}
//================================ 모임 게시글 수정 API 끝 ================================ 
