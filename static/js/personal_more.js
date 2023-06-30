const logined_token = localStorage.getItem("access");
const more_title = new URLSearchParams(window.location.search).get('id');
let account = JSON.parse(payload)["nickname"]
let div_more_title = document.querySelector(`#more-title`);
let div_more_content = document.querySelector('#more-content');
let foot = document.querySelector('#myFooter');
let count_per_page = 0; // 페이지당 데이터 건수
let show_page_cnt = 10; // 화면에 보일 페이지 번호 개수
let page_data = 0;
let func_selected = '';


if (more_title) {
    MoreData(more_title);
}

function MoreData(data) {
    if (data == '1') {
        count_per_page = 10;
        func_selected = bookMoreHotPlace;
        bookMoreHotPlace();
    } else if (data == '2') {
        count_per_page = 12;
        func_selected = bookMoreMeeting;
        bookMoreMeeting()
    } else if (data == '3') {
        count_per_page = 15;
        func_selected = MoreUserDetailCounsel;
        MoreUserDetailCounsel();
    } else if (data == '4') {
        count_per_page = 12;
        func_selected = MoreUserDetailMeeting;
        MoreUserDetailMeeting();
    }
}

// 페이지네이션 시작
$(function () {

    $(document).on('click', 'div.paging>div.pages>span', function () {
        if (!$(this).hasClass('active')) {
            $(this).parent().find('span.active').removeClass('active');
            $(this).addClass('active');
            let page_num = Number($(this).text())

            func_selected(page_num);
        }
    });

    $(document).on('click', 'div.paging>i', function () {
        let totalPage = Math.floor(page_data / count_per_page) + (page_data % count_per_page == 0 ? 0 : 1);
        const id = $(this).attr('id')
        let page_num = Number($(this).text())
        let first_page_id = document.querySelector('#first_page')
        let prev_page_id = document.querySelector('#prev_page')

        first_page_id.style.display = "";
        prev_page_id.style.display = "";


        if (id == 'first_page') {
            func_selected(1);
        } else if (id == 'prev_page') {
            // 페이지 번호를 저장
            let arrPages = [];
            $('div.paging>div.pages>span').each(function (idx, item) {
                arrPages.push(Number($(this).text()));
            });

            const prevPage = Math.min(...arrPages) - show_page_cnt;
            func_selected(prevPage);
        } else if (id == 'next_page') {
            // 페이지 번호를 저장
            let arrPages = [];
            $('div.paging>div.pages>span').each(function (idx, item) {
                arrPages.push(Number($(this).text()));
            });

            const nextPage = Math.max(...arrPages) + 1;
            func_selected(nextPage);
        } else if (id == 'last_page') {
            const lastPage = Math.floor(page_data / count_per_page) + (page_data % count_per_page == 0 ? 0 : 1);;

            func_selected(lastPage);
        }
    });
})

function setPaging(pageNum) {
    const currentPage = pageNum;
    const totalPage = Math.floor(page_data / count_per_page) + (page_data % count_per_page == 0 ? 0 : 1);

    showAllIcon();

    if (currentPage <= show_page_cnt) {
        $('#first_page').hide();
        $('#prev_page').hide();
    }
    if (
        totalPage <= show_page_cnt ||
        Math.floor((currentPage - 1) / show_page_cnt) * show_page_cnt + show_page_cnt + 1 > totalPage
    ) {
        $('#next_page').hide();
        $('#last_page').hide();
    }

    let start = Math.floor((currentPage - 1) / show_page_cnt) * show_page_cnt + 1;
    let sPagesHtml = '';
    for (const end = start + show_page_cnt; start < end && start <= totalPage; start++) {
        sPagesHtml += '<span class="' + (start == currentPage ? 'active' : '') + '">' + start + '</span>';
    }
    $('div.paging>div.pages').html(sPagesHtml);
}

function showAllIcon() {
    $('#first_page').show();
    $('#prev_page').show();
    $('#next_page').show();
    $('#last_page').show();
}
// 페이지네이션 끝

// 장소 북마크
async function placeBook(place_id) {
    const book = document.querySelector(`#book${place_id}`)

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
    }
}

// 장소 북마크 모음
async function bookMoreHotPlace(pages = 1) {
    div_more_title.innerText = `${account}님의 핫플레이스 북마크 목록입니다`;
    foot.style.display = '';
    div_more_content.innerHTML = '';


    const response = await fetch(`${BACKEND_BASE_URL}/place/?page=${pages}`, {
        headers: {
            Authorization: "Bearer " + logined_token,
        },
        method: "GET",
    });

    let response_json = await response.json();
    page_data = response_json["total-page"];

    response_json['place'].forEach((e, i) => {
        let place_id = e.id
        let name = e.title
        let category = e.category
        let content = e.content
        let address = e.address
        let image = e.image
        let score = e.score
        let bookmark = e.bookmark
        let book_count = e.bookmark_count
        let comment_count = e.comment_count
        let like_count = e.like_count

        div_more_content.innerHTML += `<div id="book_place${place_id}" class="place-container"></div>`

        let place = document.querySelector(`#book_place${place_id}`)

        // 이미지 시작
        if (image) {
            place.innerHTML += `
            <div>
                <a href="place_view.html?id=${place_id}">
                    <img class="place-container-img" src="${image['url']}" onclick="placePreUpdateView()">
                </a>
            </div>
            `
        } else {
            place.innerHTML += `
            <div style="width:230px; height:230px;">
            </div>`
        }
        // 이미지 끝
        // 북마크 시작
        let place_book = `
            <a>
                <img id="book${place_id}" src="static/image/bookmark (1).png" style="margin-top:10px; width: 40px;" alt="북마크" onclick="placeBook(${place_id})">
            </a>
            `
        // 북마크 끝
        // edit 버튼 시작
        let place_edit = ``

        if (JSON.parse(payload)['is_staff']) {
            place_edit = `
            <a>
                <img src="static/image/edit.png" style="margin-top:10px; width:20px;"
                    onclick="placePreUpdateView(${place_id})">
            </a>
            `
        }
        // edit 버튼 끝
        // container html 시작
        place.innerHTML += `
        <div class="place-container-text">
            <div class="place-container-main">
                <div class="place-container-title">
                    <div class="place-container-title0">
                        <h2>${((pages - 1) * count_per_page) + i + 1}.</h2>
                    </div>
                    <div class="place-container-title1">
                        <h2><a class="place-container-title-a" href="place_view.html?id=${place_id}">${name}</a></h2>
                    </div>
                    <div class="place-container-title2">
                        <div class="place-container-score">
                            <h2>${score}</h2>
                        </div>
                    </div>
                    <div id="place_edit">
                    ${place_edit}
                    </div>
                </div>
                <div class="place-container-book" id="place-container-book">
                ${place_book}
                </div>
            </div>
            <div class="place-container-address">${address}</div>
            <div class="place-container-content">${content}</div>
            <div class="place-container-count">
                <div class="place-container-count-img">
                    <img src="static/image/chat.png">
                    ${comment_count}
                </div>
                <div class="place-container-count-img">
                    <img src="static/image/heart (2).png">
                    ${like_count}
                </div>
                <div class="place-container-count-img">
                    <img src="static/image/bookmark (2).png">
                    ${book_count}
                </div>
            </div>
            <div id="map"></div>
            
        </div>
        <div class="place-container-hr">
            <hr>
        </div>
        `
        // container html 끝
    })
    setPaging(pages);

}

// 미팅 북마크
async function meetingBookmark(id) {
    const book = document.querySelector(`#book${id}`)
    foot.style.display = '';

    let response = await fetch(`${BACKEND_BASE_URL}/meeting/${id}/bookmark/`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${logined_token}`,
        },
    })
    if (logined_token) {
        if (response.status == "200") {
            book['src'] = "static/image/bookmark.png"
        } else {
            book['src'] = "static/image/bookmark (1).png"
        }
    } else {
        alert("로그인 해주세요")
    }
}

// 미팅 북마크 모음
async function bookMoreMeeting(pages = 1) {
    div_more_title.innerText = `${account}님의 만남의장소 북마크 목록입니다`;
    div_more_content.classList.add("meeting_card_class");


    if (logined_token) {
        $('#more-content').empty()

        fetch(`${BACKEND_BASE_URL}/meeting/1/bookmark/?page=${pages}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${logined_token}`,
            },
        })
            .then(res => res.json()).then(meetings => {
                let payloadObj = JSON.parse(payload)
                let user_id = payloadObj.user_id
                page_data = meetings["total-page"];

                foot.style.display = ''

                meetings['meeting'].forEach((meeting) => {
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
                        $('#more-content').append(temp_html)
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
                        $('#more-content').append(temp_html)
                    }
                })
                setPaging(pages);
            })
    } else { alert("로그인 해주세요") }

}

// 유저가 작성한 고민상담
async function MoreUserDetailCounsel(pages = 1) {
    div_more_title.innerText = `${account}님이 작성한 고민상담 목록입니다`;

    $('#more-content').empty()

    $.ajax({
        url: `${BACKEND_BASE_URL}/counsel/user/?page=${pages}`,
        type: "GET",
        dataType: "json",
        headers: { 'Authorization': `Bearer ${logined_token}` },
        success: function (response) {
            const rows = response['counsel'];
            page_data = response["total-page"];

            foot.style.display = ''

            rows.forEach((e, i) => {
                let counsel_id = e.id
                let counsel_title = e.title
                let counsel_author = e.user
                let counsel_created_at = e.created_at
                let likes_count = e.like.length

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
                $('#more-content').append(temp_html)
            })
            setPaging(pages)
        },
        error: function () {
            alert(response.status);
        }

    })
    setPaging(pages);
}

// 유저가 작성한 미팅
async function MoreUserDetailMeeting(pages = 1) {
    div_more_title.innerText = `${account}님이 작성한 만남의광장 목록입니다`;
    div_more_content.classList.add("meeting_card_class");

    if (logined_token) {

        $('#more-content').empty()

        fetch(`${BACKEND_BASE_URL}/meeting/my_create_meeting/?page=${pages}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${logined_token}`,
            },
        })
            .then(res => res.json()).then(meetings => {
                let payloadObj = JSON.parse(payload)
                let user_id = payloadObj.user_id
                page_data = meetings["total-page"];
                foot.style.display = '';


                meetings['meeting'].forEach((meeting) => {
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
                        $('#more-content').append(temp_html)
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
                        $('#more-content').append(temp_html)
                    }
                })
                setPaging(pages)
            })
    } else { alert("로그인 해주세요") }
}