//================================ 모임 글 목록 API 시작 ================================
fetch(`${BACKEND_BASE_URL}/meeting/`).then(res => res.json()).then(meetings => {
    let payloadObj = JSON.parse(payload)
    let user_id = payloadObj.user_id
    meetings.forEach((meeting) => {

        if (meeting.meeting_image[0]) {
            let id = meeting['id']
            let title = meeting['title']
            let user = meeting['user']
            let created_at = meeting['created_at']
            let comment_count = meeting['comment_count']
            let bookmark = meeting['bookmark']
            let meeting_image = meeting['meeting_image'][0]['image']
            let meeting_book = ``
            let meeting_at = meeting['meeting_at']
            let meeting_city = meeting['meeting_city']
            let num_person_meeting = meeting['num_person_meeting']
            let meeting_status = meeting['meeting_status']
            let join_meeting_count = meeting['join_meeting_count']
            let status_and_title = ``
            if (meeting_status == '모임중') {
                status_and_title =
                    `<h2><span style="color:blue;"><${meeting_status}></span> ${title}</h2>`
            }
            else if (meeting_status == '모집중') {
                status_and_title =
                    `<h2><span style="color:green;"><${meeting_status}></span> ${title}</h2>`
            }
            else if (meeting_status == '모집완료') {
                status_and_title =
                    `<h2><span style="color:chartreuse;"><${meeting_status}></span> ${title}</h2>`
            }
            else if (meeting_status == '자리없음') {
                status_and_title =
                    `<h2><span style="color:orange;"><${meeting_status}></span> ${title}</h2>`
            }
            else if (meeting_status == '모임종료') {
                status_and_title =
                    `<h2><span style="color:red;"><${meeting_status}></span> ${title}</h2>`
            }
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
                        <div id="meeting_card_${id}" class="meeting_card">
                        <div onclick="location.href ='${FRONTEND_BASE_URL}/meeting_detail.html?id='+${id}" style="cursor:pointer;" >
                                    <p><small>${meeting_city}</p>
                                    ${status_and_title}
                                    <hr>
                                    <img class=meeting_list_image src="${BACKEND_BASE_URL}${meeting_image}" alt="">
                                    </div>
                                    <div id=bookmark_btn>
                                    <hr>
                                    <p id=info_line><small> ${user} <span style="color:red;font-weight:bold">[${comment_count}]</span> ${created_at} ${meeting_book}</small></p>
                                    <p><small>모임일 ${meeting_at} 모집인원 ${join_meeting_count} / ${num_person_meeting}</p>
                                    </div>
                                    </div>
                                    `
            $('#meeting_card').append(temp_html)
        } else {
            let payloadObj = JSON.parse(payload)
            let user_id = payloadObj.user_id
            let id = meeting['id']
            let title = meeting['title']
            let user = meeting['user']
            let created_at = meeting['created_at']
            let comment_count = meeting['comment_count']
            let content = meeting['content']
            let bookmark = meeting['bookmark']
            let meeting_at = meeting['meeting_at']
            let meeting_city = meeting['meeting_city']
            let num_person_meeting = meeting['num_person_meeting']
            let meeting_status = meeting['meeting_status']
            let join_meeting_count = meeting['join_meeting_count']
            let meeting_book = ``
            let status_and_title = ``
            if (meeting_status == '모임중') {
                status_and_title =
                    `<h2><span style="color:blue;"><${meeting_status}></span> ${title}</h2>`
            }
            else if (meeting_status == '모집중') {
                status_and_title =
                    `<h2><span style="color:green;"><${meeting_status}></span> ${title}</h2>`
            }
            else if (meeting_status == '모집완료') {
                status_and_title =
                    `<h2><span style="color:chartreuse;"><${meeting_status}></span> ${title}</h2>`
            }
            else if (meeting_status == '자리없음') {
                status_and_title =
                    `<h2><span style="color:orange;"><${meeting_status}></span> ${title}</h2>`
            }
            else if (meeting_status == '모임종료') {
                status_and_title =
                    `<h2><span style="color:red;"><${meeting_status}></span> ${title}</h2>`
            }
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
                        <p><small>${meeting_city}</p>
                        ${status_and_title}
                        <hr>
                        <h4 class=meeting_list_content>${content}</h4>
                        </div>
                        <div id=bookmark_btn>
                        <hr>
                        <p id=info_line><small> ${user} <span style="color:red;font-weight:bold">[${comment_count}]</span> ${created_at} ${meeting_book}</small></p>
                        <p><small>모임일 ${meeting_at} 모집인원 ${join_meeting_count} / ${num_person_meeting}</p>
                        </div>
                        </div>
                        `
            $('#meeting_card').append(temp_html)
        }
    })
}
)
//================================ 모임 글 목록 API 끝 ================================

//================================ 모임 글 검색 API 시작 ================================ 
function meetingSearch() {
    let payloadObj = JSON.parse(payload)
    let user_id = payloadObj.user_id
    let search_field = $("input:radio[name=Ben]:checked").val()
    let search_key = $('#meeting_search').val()
    $('#meeting_card').empty()
    fetch(`${BACKEND_BASE_URL}/meeting/search_${search_field}/?search=${search_key}`).then(res => res.json()).then(meetings => {
        meetings.forEach((meeting) => {
            if (meeting.meeting_image[0]) {
                let id = meeting['id']
                let title = meeting['title']
                let user = meeting['user']
                let created_at = meeting['created_at']
                let comment_count = meeting['comment_count']
                let meeting_image = meeting['meeting_image'][0]['image']
                let bookmark = meeting['bookmark']
                let meeting_at = meeting['meeting_at']
                let meeting_city = meeting['meeting_city']
                let num_person_meeting = meeting['num_person_meeting']
                let meeting_status = meeting['meeting_status']
                let join_meeting_count = meeting['join_meeting_count']
                let meeting_book = ``
                let status_and_title = ``
                if (meeting_status == '모임중') {
                    status_and_title =
                        `<h2><span style="color:blue;"><${meeting_status}></span> ${title}</h2>`
                }
                else if (meeting_status == '모집중') {
                    status_and_title =
                        `<h2><span style="color:green;"><${meeting_status}></span> ${title}</h2>`
                }
                else if (meeting_status == '모집완료') {
                    status_and_title =
                        `<h2><span style="color:chartreuse;"><${meeting_status}></span> ${title}</h2>`
                }
                else if (meeting_status == '자리없음') {
                    status_and_title =
                        `<h2><span style="color:orange;"><${meeting_status}></span> ${title}</h2>`
                }
                else if (meeting_status == '모임종료') {
                    status_and_title =
                        `<h2><span style="color:red;"><${meeting_status}></span> ${title}</h2>`
                }
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
                        <div id="meeting_card_${id}" class="meeting_card">
                        <div onclick="location.href ='${FRONTEND_BASE_URL}/meeting_detail.html?id='+${id}" style="cursor:pointer;" >
                                    <p><small>${meeting_city}</p>
                                    ${status_and_title}
                                    <hr>
                                    <img class=meeting_list_image src="${meeting_image}" alt="">
                                    </div>
                                    <div id=bookmark_btn>
                                    <hr>
                                    <p id=info_line><small> ${user} <span style="color:red;font-weight:bold">[${comment_count}]</span> ${created_at} ${meeting_book}</small></p>
                                    <p><small>모임일 ${meeting_at} 모집인원 ${join_meeting_count} / ${num_person_meeting}</p>
                                    </div>
                                    </div>
                                    `
                $('#meeting_card').append(temp_html)
            } else {
                let id = meeting['id']
                let title = meeting['title']
                let user = meeting['user']
                let created_at = meeting['created_at']
                let comment_count = meeting['comment_count']
                let content = meeting['content']
                let bookmark = meeting['bookmark']
                let meeting_at = meeting['meeting_at']
                let meeting_city = meeting['meeting_city']
                let num_person_meeting = meeting['num_person_meeting']
                let meeting_status = meeting['meeting_status']
                let join_meeting_count = meeting['join_meeting_count']
                let meeting_book = ``
                let status_and_title = ``
                if (meeting_status == '모임중') {
                    status_and_title =
                        `<h2><span style="color:blue;"><${meeting_status}></span> ${title}</h2>`
                }
                else if (meeting_status == '모집중') {
                    status_and_title =
                        `<h2><span style="color:green;"><${meeting_status}></span> ${title}</h2>`
                }
                else if (meeting_status == '모집완료') {
                    status_and_title =
                        `<h2><span style="color:chartreuse;"><${meeting_status}></span> ${title}</h2>`
                }
                else if (meeting_status == '자리없음') {
                    status_and_title =
                        `<h2><span style="color:orange;"><${meeting_status}></span> ${title}</h2>`
                }
                else if (meeting_status == '모임종료') {
                    status_and_title =
                        `<h2><span style="color:red;"><${meeting_status}></span> ${title}</h2>`
                }
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
                <p><small>${meeting_city}</p>
                ${status_and_title}
                <hr>
                <h4 class=meeting_list_content>${content}</h4>
                </div>
                <div id=bookmark_btn>
                <hr>
                <p id=info_line><small> ${user} <span style="color:red;font-weight:bold">[${comment_count}]</span> ${created_at} ${meeting_book}</small></p>
                <p><small>모임일 ${meeting_at} 모집인원 ${join_meeting_count} / ${num_person_meeting}</p>
                </div>
                </div>
                `
                $('#meeting_card').append(temp_html)
            }
        })
    })
}
//================================ 모임 글 검색 API 끝 ================================ 

//================================ 모임 글 목록에서 북마크 하기 API 시작 ================================ 
async function meetingBookmark(id) {
    const book = document.querySelector(`#book${id}`)
    let token = localStorage.getItem("access")
    let response = await fetch(`${BACKEND_BASE_URL}/meeting/${id}/bookmark/`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    if (token) {
        if (response.status == "200") {
            book['src'] = "static/image/bookmark.png"
        } else {
            book['src'] = "static/image/bookmark (1).png"
        }
    } else {
        alert("로그인 해주세요")
    }

}
//================================ 모임 글 목록에서 북마크 하기 API 끝 ================================ 

//================================ 로그인 상태 확인 시작 ================================ 

function go_meetingCreate() {
    let token = localStorage.getItem("access")

    if
        (token) { window.location.href = "/meeting_create.html" }
    else { alert("로그인 해주세요.") }
}

//================================ 로그인 상태 확인 끝 ================================ 