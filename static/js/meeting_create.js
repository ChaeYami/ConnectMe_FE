// ================================ 모임 게시글 작성 시작 ================================
async function createMeeting() {
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
    await fetch(`${BACKEND_BASE_URL}/meeting/`, {
        method: 'POST',
        headers: {
            Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjg2ODc3Mjg5LCJpYXQiOjE2ODY3OTA4ODksImp0aSI6IjJmYzA3YjBjYjUzNzRkNWM5MWRlNWM1YTQyZGQ2ODAwIiwidXNlcl9pZCI6MSwiZW1haWwiOiJuYnYxNDQzQGdtYWlsLmNvbSIsImFjY291bnQiOiJuYnYxNDQzIiwicGhvbmUiOiIwMDAwMDAwMDAwMCIsIm5pY2tuYW1lIjoiXHVhYzAwXHViY2Y0XHVjNzkwXHVhY2UwIn0.g0dN8h-FxNCsEw-zwXHGN-Df6R4zq7jy8t2rWHDs9Hk"
            // Authorization: localStorage.getItem('access_token'),
        },
        body: formData
    })
        .then((response) => {
            response.json().then((data) => {
                let meeting_id = data.id
                location.replace(`${FRONTEND_BASE_URL}/meeting_detail.html?id=` + meeting_id)
            }
            );
        });
}
// ================================ 모임 게시글 작성 끝 ================================
