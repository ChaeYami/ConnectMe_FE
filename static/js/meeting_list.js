const count_per_page = 12; // 페이지당 데이터 건수
const show_page_cnt = 10; // 화면에 보일 페이지 번호 개수
let page_data = 0;
let foot = document.querySelector('#myFooter')



$(document).ready(function () {
    meetingShowList()
})

// 페이지네이션 시작
$(function () {

    $(document).on('click', 'div.paging>div.pages>span', function () {
        if (!$(this).hasClass('active')) {
            $(this).parent().find('span.active').removeClass('active');
            $(this).addClass('active');
            let page_num = Number($(this).text())

            meetingShowList(page_num);
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
            meetingShowList(1);
        } else if (id == 'prev_page') {
            // 페이지 번호를 저장
            let arrPages = [];
            $('div.paging>div.pages>span').each(function (idx, item) {
                arrPages.push(Number($(this).text()));
            });

            const prevPage = Math.min(...arrPages) - show_page_cnt;
            meetingShowList(prevPage);
        } else if (id == 'next_page') {
            // 페이지 번호를 저장
            let arrPages = [];
            $('div.paging>div.pages>span').each(function (idx, item) {
                arrPages.push(Number($(this).text()));
            });

            const nextPage = Math.max(...arrPages) + 1;
            meetingShowList(nextPage);
        } else if (id == 'last_page') {
            const lastPage = Math.floor(page_data / count_per_page) + (page_data % count_per_page == 0 ? 0 : 1);

            meetingShowList(lastPage);
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



//================================ 모임 글 목록 API 시작 ================================

async function meetingShowList(pages = 1) {

    $('#meeting_card').empty()

    let counsel_page = `?page=${pages}`


    $.ajax({
        url: `${BACKEND_BASE_URL}/meeting/${counsel_page}`,
        method: 'GET',
        dataType: 'json',
        headers: {
            Authorization: `Bearer ${logined_token}`,
        },
        success: function (response) {
            let payloadObj = JSON.parse(payload);
            let user_id = payloadObj.user_id;
            let payload_nickname = payloadObj.nickname
            page_data = response["total-page"];

            foot.style.display = ''

            response['meeting'].forEach(function (meeting) {
                if (meeting.meeting_image[0]) {
                    let id = meeting['id'];
                    let title = meeting['title'];
                    let user = meeting['user'];
                    let created_at = meeting['created_at'];
                    let comment_count = meeting['comment_count'];
                    let bookmark = meeting['bookmark'];
                    let meeting_image = meeting['meeting_image'][0]['image'];
                    let meeting_book = '';
                    let meeting_at = meeting['meeting_at'];
                    let meeting_city = meeting['meeting_city'];
                    let num_person_meeting = meeting['num_person_meeting'];
                    let meeting_status = meeting['meeting_status'];
                    let join_meeting_count = meeting['join_meeting_count'];
                    let status_and_title = '';


                    if (meeting_status == '모집중') {
                        status_and_title =
                            `<h3><span style="color:rgb(0, 201, 0);"><${meeting_status}></span> ${title}</h3>`
                    }
                    else if (meeting_status == '자리없음') {
                        status_and_title =
                            `<h3><span style="color:orange;"><${meeting_status}></span> ${title}</h3>`
                    }
                    else if (meeting_status == '모집종료') {
                        status_and_title =
                            `<h3><span style="color:red;"><${meeting_status}></span> ${title}</h3>`
                    }

                    if (user == payload_nickname) { meeting_book = `` } else {
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
                    $('#meeting_card').append(temp_html);
                } else {
                    let payloadObj = JSON.parse(payload);
                    let user_id = payloadObj.user_id;
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
                    else if (meeting_status == '모집종료') {
                        status_and_title =
                            `<h3><span style="color:red;"><${meeting_status}></span> ${title}</h3>`
                    }

                    if (user == payload_nickname) { meeting_book = `` } else {
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
                    $('#meeting_card').append(temp_html);
                }
            });
            setPaging(pages)
        }, error: function () {
            alert(response.status);
        }
    })
}

//================================ 모임 글 목록 API 끝 ================================

//================================ 모임 글 검색 API 시작 ================================ 
function meetingSearch() {
    let payloadObj = JSON.parse(payload)
    let user_id = payloadObj.user_id
    let payload_nickname = payloadObj.nickname
    let search_field = $("input:radio[name=Ben]:checked").val()
    let search_key = $('#meeting_search').val()

    foot.style.display = 'none';

    $('#meeting_card').empty()
    fetch(`${BACKEND_BASE_URL}/meeting/search_${search_field}/?search=${search_key}`, {
        headers: {
            Authorization: `Bearer ${logined_token}`,
        }
    })
        .then(res => res.json())
        .then(meetings => {
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
                    if (meeting_status == '모집중') {
                        status_and_title =
                            `<h3><span style="color:rgb(0, 201, 0);"><${meeting_status}></span> ${title}</h3>`
                    }
                    else if (meeting_status == '자리없음') {
                        status_and_title =
                            `<h3><span style="color:orange;"><${meeting_status}></span> ${title}</h3>`
                    }
                    else if (meeting_status == '모집종료') {
                        status_and_title =
                            `<h3><span style="color:red;"><${meeting_status}></span> ${title}</h3>`
                    }
                    if (user == payload_nickname) { meeting_book = `` } else {
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

                    if (meeting_image.includes('%3A')) {
                        if (meeting_image.includes('www')) {
                            image = meeting_image.slice(41);
                            let decodedURL = decodeURIComponent(image);
                            img_urls = `http://${decodedURL}`
                        } else {
                            image = meeting_image.slice(40);
                            let decodedURL = decodeURIComponent(image);
                            img_urls = `http://${decodedURL}`
                        }
                    }
                    else {
                        img_urls = `${meeting_image}`
                    }

                    let temp_html = `
                        <div id="meeting_card_${id}" class="meeting_card">
                            <div onclick="location.href ='${FRONTEND_BASE_URL}/meeting_detail.html?id='+${id}" style="cursor:pointer;" >
                                <p style="height:1px"><small>${meeting_city}</small></p>
                                <div class="status_and_title">
                                ${status_and_title}
                                </div>
                                <hr>
                                <img class=meeting_list_image src="${img_urls}" alt="">
                            </div>
                            <hr>
                            <div id="bookmark_btn" class="bookmark_btn">
                                <p class=info_line id="info_line"><small> ${user} <span style="color:red;font-weight:bold">[${comment_count}]</span> ${created_at} ${meeting_book}</small></p>
                                <p><small>모임일 ${meeting_at}</small></p>
                                <p><small>모집인원 ${join_meeting_count} / ${num_person_meeting}</small></p>
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
                    if (meeting_status == '모집중') {
                        status_and_title =
                            `<h3><span style="color:rgb(0, 201, 0);"><${meeting_status}></span> ${title}</h3>`
                    }
                    else if (meeting_status == '자리없음') {
                        status_and_title =
                            `<h3><span style="color:orange;"><${meeting_status}></span> ${title}</h3>`
                    }
                    else if (meeting_status == '모집종료') {
                        status_and_title =
                            `<h3><span style="color:red;"><${meeting_status}></span> ${title}</h3>`
                    }
                    if (user == payload_nickname) { meeting_book = `` } else {
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
                    <div onclick="location.href ='${FRONTEND_BASE_URL}/meeting_detail.html?id='+${id}" style="cursor:pointer;" >
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
                `
                    $('#meeting_card').append(temp_html)
                }
            })
        })
}
//================================ 모임 글 검색 API 끝 ================================ 
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("meeting_search").addEventListener("keyup", function (event) {
        if (event.key === "Enter") {
            meetingSearch();
        }
    });
});
//================================ 모임 글 목록에서 북마크 하기 API 시작 ================================ 
async function meetingBookmark(id) {
    const book = document.querySelector(`#book${id}`)
    let response = await fetch(`${BACKEND_BASE_URL}/meeting/${id}/bookmark/`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${logined_token}`,
        },
    })
    if (response.status == "200") {
        book['src'] = "static/image/bookmark.png"
    } else if (response.status == "202") {
        book['src'] = "static/image/bookmark (1).png"
    } else {
        const errorData = await response.json();
        const errorArray = Object.entries(errorData);
        swal(`${errorArray[0][1]}`, '', 'warning');
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