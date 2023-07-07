const logined_token = localStorage.getItem("access");
const user_id = JSON.parse(payload)['user_id']

window.onload = () => {
    placeBookList(user_id)
    Profile(user_id)
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

    let card_page = response_json["place"].length

    if (card_page > 4) {
        card_page = 4
    } else if (card_page == 0) {
        let temp_html = `<div class="none-text-align"><h2>북마크한 게시글이 없습니다.<h2></div>`
        $('#hotplace-book-cards').removeClass('hotplace-book-cards');
        $('#hotplace-book-cards').append(temp_html);
    }

    for (let i = 0; i < card_page; i++) {
        let e = response_json["place"][i];
        let place_id = e.id;
        let address = e.address;
        let category = e.category;
        let sort = e.sort;
        let image = e.image;
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

        // 이미지 시작
        if (image) {
            image = `
                <a href="place_view.html?id=${place_id}">
                    <img class="place-container-img" src="${image['url']}" onclick="go_placeDetailView(${place_id})">
                </a>`
        } else {
            image = `
                <a href="place_view.html?id=${place_id}">
                    <img class="place-container-img" src="static/image/ConnectME - 하늘고래.png" style="object-fit: contain; filter: grayscale(60%);
                    opacity: 0.7;" onclick="go_placeDetailView(${place_id})">
                </a>`
        }
        // 이미지 끝

        cards.innerHTML += `
        <div class="hotplace-card">
            <div class="hotplace-image">
                ${image}
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
                <div class="hotplace-address">
                    ${address}
                </div>
                <div>
                    ${category}${sort_html}
                </div>
            </div>
        </div>
        `
    };
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
    if (logined_token) {
        $('#meeting_card').empty()
        fetch(`${BACKEND_BASE_URL}/meeting/1/bookmark/`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${logined_token}`,
            },
        })
            .then(res => res.json()).then(meetings => {
                let payloadObj = JSON.parse(payload)
                let user_id = payloadObj.user_id
                let payload_nickname = payloadObj.nickname
                let count = 0;

                if (meetings['meeting'].length == 0) {
                    let temp_html = `<div></div><div class="none-text-align"><h2>북마크한 게시글이 없습니다.<h2></div>`
                    $('#meeting-book-cards').append(temp_html);
                }

                meetings['meeting'].forEach((meeting) => {
                    if (count >= 3) {
                        return;
                    }

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
                        if (meeting_status == '모집중') {
                            status_and_title =
                                `<h3><span style="color:rgb(0, 201, 0);"><${meeting_status}></span> ${title}</h3>`
                        }
                        else if (meeting_status == '자리없음') {
                            status_and_title =
                                `<h3><span style="color:orange;"><${meeting_status}></span> ${title}</h3>`
                        }
                        else if (meeting_status == '모임종료') {
                            status_and_title =
                                `<h3><span style="color:red;"><${meeting_status}></span> ${title}</h3>`
                        }

                        if(user == payload_nickname){meeting_book = ``}else{
                            if (bookmark.includes(user_id)) {
                                meeting_book = `
                                <a>
                                    <img id="book${id}" src="static/image/bookmark (1).png" style="margin-top:10px; width: 30px;" alt="북마크" onclick="handleBookmark(${id})">
                                </a>`
                            } else {
                                meeting_book = `
                                <a>
                                    <img id="book${id}" src="static/image/bookmark.png" style="margin-top:10px; width: 30px;" alt="북마크" onclick="handleBookmark(${id})">
                                </a>`
                            }
                        }

                        if (meeting_image.includes('http')) {
                            if (meeting_image.includes('www')) {
                                image = meeting_image.slice(16);
                                let decodedURL = decodeURIComponent(image);
                                img_urls = `http://${decodedURL}`
                            } else {
                                image = meeting_image.slice(15);
                                let decodedURL = decodeURIComponent(image);
                                img_urls = `http://${decodedURL}`
                            }
                        } else {
                            img_urls = `${BACKEND_BASE_URL}${meeting_image}`
                        }


                        let temp_html = `
                            <div id="meeting_card_${id}" class="meeting_card">
                                <div onclick="location.href ='${FRONTEND_BASE_URL}/meeting_detail.html?id='+${id}" style="cursor:pointer;">
                                    <p style="height:1px"><small>${meeting_city}</small></p>
                                    <div class="status_and_title">
                                    ${status_and_title}
                                    </div>
                                    <hr>
                                    <img class="meeting_list_image" src="${img_urls}" alt="">
                                </div>
                                <hr>
                                <div id="bookmark_btn" class="bookmark_btn">
                                    <p class=info_line id="info_line"><small> ${user} <span style="color:red;font-weight:bold">[${comment_count}]</span> ${created_at} ${meeting_book}</small></p>
                                    <p><small>모임일 ${meeting_at}</small></p>
                                    <p><small>모집인원 ${join_meeting_count} / ${num_person_meeting}</small></p>
                                </div>
                            </div>
                                `;
                        $('#meeting-book-cards').append(temp_html);
                    } else {
                        let payloadObj = JSON.parse(payload);
                        let user_id = payloadObj.user_id;
                        let payload_nickname = payloadObj.nickname
                        let id = meeting['id'];
                        let title = meeting['title'];
                        let user = meeting['user'];
                        let created_at = meeting['created_at'];
                        let comment_count = meeting['comment_count'];
                        let content = meeting['content'];
                        let bookmark = meeting['bookmark'];
                        let meeting_at = meeting['meeting_at'];
                        let meeting_city = meeting['meeting_city'];
                        let num_person_meeting = meeting['num_person_meeting'];
                        let meeting_status = meeting['meeting_status'];
                        let join_meeting_count = meeting['join_meeting_count'];
                        let meeting_book = '';
                        let status_and_title = '';

                        if (meeting_status == '모집중') {
                            status_and_title =
                                `<h3><span style="color:rgb(0, 201, 0);"><${meeting_status}></span> ${title}</h3>`
                        }
                        else if (meeting_status == '자리없음') {
                            status_and_title =
                                `<h3><span style="color:orange;"><${meeting_status}></span> ${title}</h3>`
                        }
                        else if (meeting_status == '모임종료') {
                            status_and_title =
                                `<h3><span style="color:red;"><${meeting_status}></span> ${title}</h3>`
                        }

                        if(user == payload_nickname){meeting_book = ``}else{
                            if (bookmark.includes(user_id)) {
                                meeting_book = `
                                <a>
                                    <img id="book${id}" src="static/image/bookmark (1).png" style="margin-top:10px; width: 30px;" alt="북마크" onclick="handleBookmark(${id})">
                                </a>`
                            } else {
                                meeting_book = `
                                <a>
                                    <img id="book${id}" src="static/image/bookmark.png" style="margin-top:10px; width: 30px;" alt="북마크" onclick="handleBookmark(${id})">
                                </a>`
                            }
                        }

                        let temp_html = `
                            <div class="meeting_card">
                                <div onclick="location.href ='${FRONTEND_BASE_URL}/meeting_detail.html?id='+${id}" style="cursor:pointer;">
                                    <p style="height:1px"><small>${meeting_city}</small></p>
                                    <div class="status_and_title">
                                    ${status_and_title}
                                    </div>
                                    <hr>
                                    <img class="meeting_list_image" src="static/image/—Pngtree—two little kittens_852610.png" alt="" style = "opacity:0.7; filter : grayscale(30%)">
                                </div>
                                <hr>
                                <div id="bookmark_btn" class="bookmark_btn">
                                    <p class=info_line id="info_line"><small> ${user} <span style="color:red;font-weight:bold">[${comment_count}]</span> ${created_at} ${meeting_book}</small></p>
                                    <p><small>모임일 ${meeting_at}</small></p>
                                    <p><small>모집인원 ${join_meeting_count} / ${num_person_meeting}</small></p>
                                </div>
                            </div>
                        `;
                        $('#meeting-book-cards').append(temp_html);
                    }
                    count++;
                })
            })
    } else { alert("로그인 해주세요") }
}
// 북마크 한 글 목록에서 모임 북마크 하기 API

async function meetingBookmark(id) {
    const book = document.querySelector(`#book${id}`)
    let response = await fetch(`${BACKEND_BASE_URL}/meeting/${id}/bookmark/`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${logined_token}`,
        },
    })
    if (logined_token) {
        if (response.status == "200") {
            book['src'] = "static/image/bookmark.png"
            go_placeBook();
        } else {
            book['src'] = "static/image/bookmark (1).png"

        }
    } else {
        alert("로그인 해주세요")
    }
}

// 유저 가져오기 API

async function Profile(user_id) {
    const response = await fetch(`${BACKEND_BASE_URL}/user/profile/${user_id}/`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${logined_token}`,
        },
    })

    response_json = await response.json()

    const nickname = response_json.nickname
    const profile_img_url = `${BACKEND_BASE_URL}${response_json.profile_img}`;
    let my_posts = document.querySelector('#my-posts-container')
    if (response_json.profile_img === null) {
        my_posts.innerHTML = `<div><a onclick="go_myProfile()"><img src="static/image/user.png"></a></div>`

    } else {
        my_posts.innerHTML = `<div><a onclick="go_myProfile()"><img src="${profile_img_url}"></a></div>`
    }

    my_posts.innerHTML += `<div><a onclick="go_myProfile()">${nickname}</a></div> 님의 북마크 목록입니다.`
}