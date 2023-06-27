const logined_token = localStorage.getItem("access");
const user_id = new URLSearchParams(window.location.search).get('id');

window.onload = () => {
    placeBookList(user_id)
}

// 장소 북마크 가져오기
async function placeBookList(user_id) {
    const response = await fetch(`${BACKEND_BASE_URL}/place/`, {
        headers: {
            Authorization: "Bearer " + logined_token,
        },
        method: "GET",
    });

    const response_json = await response.json();

    response_json.forEach((e, i) => {

        let place_id = e.id;
        let address = e.address;
        let category = e.category;
        let sort = e.sort;
        let image = e.image.url;
        let title = e.title;
        let score = e.score;
        let cards = document.querySelector('#hotplace-book-cards');


        let sort_html = ``
        if (sort) {
            if (sort.includes('카페/주점')) {
                if (sort.includes('-주점')) {
                    sort_html = '/주점';
                } else { }
            } else {
                sort_html = `/${sort}`;
            }
        }

        cards.innerHTML += `
        <div class="hotplace-card">
            <div class="hotplace-image">
                <a>
                    <img src="${image}" onclick="go_placeDetailView(${place_id})">
                </a>
                <a>
                    <img id="hotplace-img${place_id}" src="static/image/bookmark (1).png" onclick="placeBook(${place_id})">
                </a>
            </div>
            <div class="hotplace-content">
                <div class="hotplace-title">
                    <h2>${title}</h2>
                </div>
                <div class="hotplace-score">
                    <h2>${score}</h2>
                </div>
                <div>
                    ${address}
                </div>
                <div>
                    ${category}${sort_html}
                </div>
            </div>
        </div>
        `
    });
}


// 장소 북마크
async function placeBook(place_id) {
    const book = document.querySelector(`#hotplace-img${place_id}`)

    const response = await fetch(`${BACKEND_BASE_URL}/place/${place_id}`, {
        headers: {
            Authorization: "Bearer " + logined_token,
        },
        method: "POST",
    });

    const response_json = await response.json();

    if (response_json["message"] == "북마크") {
        book['src'] = "static/image/bookmark (1).png"
        alert("북마크가 추가되었습니다.");
    } else {
        book['src'] = "static/image/bookmark.png"
        alert("북마크가 취소되었습니다.");
        go_placeBook();
    }
}

// 모임 북마크 한 글 가져오기
{
    let token = localStorage.getItem("access")
    if (token) {
        $('#meeting_card').empty()
        fetch(`${BACKEND_BASE_URL}/meeting/bookmark_list`, {
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
                        $('#meeting-book-cards').append(temp_html)
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
                        $('#meeting-book-cards').append(temp_html)
                    }
                })
            })
    } else { alert("로그인 해주세요") }
}
//================================ 북마크 한 글 목록에서 모임 북마크 하기 API 시작 ================================ 
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
//================================ 북마크 한 글 목록에서 모임 북마크 하기 API 끝 ================================
