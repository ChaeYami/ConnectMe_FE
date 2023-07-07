const logined_token = localStorage.getItem("access");
let div_more_title = document.querySelector(`#more-title`);
let div_more_content = document.querySelector('#more-content');
let foot = document.querySelector('#myFooter');
let count_per_page = 0; // 페이지당 데이터 건수
let show_page_cnt = 10; // 화면에 보일 페이지 번호 개수
let page_data = 0;
let user_id = JSON.parse(payload)['user_id']

$(document).ready(function () {
    Profile(user_id)
})

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

    my_posts.innerHTML += `<div><a onclick="go_myProfile()">${nickname}</a></div> 님의 참여 모임 목록입니다.`
}

count_per_page = 12;
func_selected = MoreUserDetailMeeting;
MoreUserDetailMeeting();

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

// 유저가 작성한 미팅
async function MoreUserDetailMeeting(pages = 1) {
    div_more_content.classList.add("meeting_card_class");

    if (logined_token) {

        $('#more-content').empty()

        fetch(`${BACKEND_BASE_URL}/meeting/my_join_meeting_list/?page=${pages}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${logined_token}`,
            },
        })
            .then(res => res.json()).then(meetings => {
                console.log(meetings)
                if (meetings.meeting.length == 0) {
                    let temp_html = `<H2>참여하는 모임이 없습니다.</H2>`
                    $("#none_text_align").append(temp_html)
                }
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

                        if (bookmark.includes(user_id)) {
                            meeting_book = `
                    <a>
                      <img id="book${id}" src="static/image/bookmark (1).png" style="width: 30px;" alt="북마크" onclick="meetingBookmark(${id})">
                    </a>`;
                        } else {
                            meeting_book = `
                    <a>
                      <img id="book${id}" src="static/image/bookmark.png" style="width: 30px;" alt="북마크" onclick="meetingBookmark(${id})">
                    </a>`;
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
                        $('#more-content').append(temp_html);
                    } else {
                        let payloadObj = JSON.parse(payload);
                        let user_id = payloadObj.user_id;
                        let id = meeting['id'];
                        let title = meeting['title'];
                        let user = meeting['user'];
                        let created_at = meeting['created_at'];
                        let comment_count = meeting['comment_count'];
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

                        if (bookmark.includes(user_id)) {
                            meeting_book = `
                    <a>
                      <img id="book${id}" src="static/image/bookmark (1).png" style="margin-top:10px; width: 30px;" alt="북마크" onclick="meetingBookmark(${id})">
                    </a>`;
                        } else {
                            meeting_book = `
                    <a>
                      <img id="book${id}" src="static/image/bookmark.png" style="margin-top:10px; width: 30px;" alt="북마크" onclick="meetingBookmark(${id})">
                    </a>`;
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
                        $('#more-content').append(temp_html);
                    }
                })
                setPaging(pages)
            })
    } else { alert("로그인 해주세요") }
}