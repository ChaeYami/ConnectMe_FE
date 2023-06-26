//================================ 유저가 작성한 모임 글 목록 시작 ================================ 
{
    let token = localStorage.getItem("access")
    if (token) {
        $('#meeting_card').empty()
        fetch(`${BACKEND_BASE_URL}/meeting/my_create_meeting/`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,

            },
        })

            .then(res => res.json()).then(meetings => {
                let payloadObj = JSON.parse(payload)
                let user_id = payloadObj.user_id
                meetings.forEach((meeting) => {
                    if (meeting.meeting_image[0]) {
                        let id = meeting['id']
                        let title = meeting['title']
                        let user = meeting['user']
                        let created_at = meeting['created_at']
                        let comment_count = meeting['comment_count']
                        let meeting_image = meeting['meeting_image'][0]['image']
                        let bookmark = meeting['bookmark']
                        let meeting_book = ``
                        if (bookmark.includes(user_id)) {
                            meeting_book = `
                    <a>
                        <img id="book${id}" src="static/image/bookmark (1).png" style="margin-top:10px; width: 30px;" alt="북마크" onclick="meetingBookmark(${id})">
                    </a>`
                        } else {
                            meeting_book = `
                    <a>
                        <img id="book${id}" src="static/image/bookmark.png" style="margin-top:10px; width: 30px;" alt="북마크" onclick="meetingBookmark(${id})">
                    </a>`
                        }
                        let temp_html = `
                         <div class="meeting_card">
                        <div OnClick="location.href ='${FRONTEND_BASE_URL}/meeting_detail.html?id='+${id}" style="cursor:pointer;" >
                        <h2>${title}</h2>
                        <hr>
                        <img class=meeting_list_image src="${BACKEND_BASE_URL}${meeting_image}" alt="">
                        </div>
                        <div id=bookmark_btn>
                        <hr>
                        <p><small>${user} <span style="color:red;font-weight:bold">[${comment_count}]</span> ${created_at} ${meeting_book}</small></p>
                        </div>
                        </div>
                        `
                        $('#meeting_user_create_cards').append(temp_html)
                    } else {
                        let id = meeting['id']
                        let title = meeting['title']
                        let user = meeting['user']
                        let created_at = meeting['created_at']
                        let comment_count = meeting['comment_count']
                        let content = meeting['content']
                        let bookmark = meeting['bookmark']
                        let meeting_book = ``
                        if (bookmark.includes(user_id)) {
                            meeting_book = `
                    <a>
                        <img id="book${id}" src="static/image/bookmark (1).png" style="margin-top:10px; width: 30px;" alt="북마크" onclick="meetingBookmark(${id})">
                    </a>`
                        } else {
                            meeting_book = `
                    <a>
                        <img id="book${id}" src="static/image/bookmark.png" style="margin-top:10px; width: 30px;" alt="북마크" onclick="meetingBookmark(${id})">
                    </a>`
                        }
                        let temp_html = `
                        <div class="meeting_card">
                        <div onclick="location.href ='${FRONTEND_BASE_URL}/meeting_detail.html?id='+${id}" style="cursor:pointer;" >
                        <h2>${title}</h2>
                        <hr>
                        <h4 class=meeting_list_content>${content}</h4>
                        </div>
                        <div id=bookmark_btn>
                        <hr>
                        <p><small>${user} <span style="color:red;font-weight:bold">[${comment_count}]</span> ${created_at} ${meeting_book}</small></p>
                        </div>
                        </div>
                        `
                        $('#meeting_user_create_cards').append(temp_html)
                    }
                })
            })
    } else { alert("로그인 해주세요") }
}
//================================ 유저가 작성한 모임 글 목록 끝 ================================

//================================ 유저가 작성한 상담 글 목록 시작 ================================
const logined_token = localStorage.getItem("access");


$(document).ready(function () {
    getCounsels()
})
// 게시글 목록 가져오기
async function getCounsels() {
    let token = localStorage.getItem("access")
    $('#list-section').empty()


    $.ajax({
        url: `${BACKEND_BASE_URL}/counsel/user/`,
        type: "GET",
        dataType: "json",
        headers: {'Authorization': `Bearer ${token}`},
        success: function (response) {
            const rows = response;
            for (let i = 0; i < rows.length; i++) {
                let counsel_id = rows[i]['id']
                let counsel_title = rows[i]['title']
                let counsel_author = rows[i]['user']
                let counsel_created_at = rows[i]['created_at']
                let likes_count = rows[i]['like'].length

                let temp_html = `
                <a onclick="go_counselDetail(${counsel_id})">
                    <div class="list-box">
                        <div id="counsel-title">${counsel_title}</div>
                        <div id="counsel-author">${counsel_author}</div>
                        <div id="counsel-created-at">${counsel_created_at}</div>
                        <div id="counsel-likes">${likes_count}</div>
                    </div>
                </a>
                <hr>
                `
                $('#counsel_user_create_id').append(temp_html)
            }
        },
        error: function () {
            alert(response.status);
        }

    })
}

//================================ 유저가 작성한 상담 글 목록 끝 ================================
