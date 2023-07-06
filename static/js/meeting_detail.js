let meeting_id = new URLSearchParams(window.location.search).get('id');
let update_btn = $("#update_btn")
if (payload) { update_btn.show() }
else { update_btn.hide() }
let delete_btn = $("#delete_btn")
if (payload) { delete_btn.show() }
else { delete_btn.hide() }

// ================================ 모임 게시글 상세보기 API 시작 ================================

fetch(`${BACKEND_BASE_URL}/meeting/${meeting_id}`).then(res => res.json()).then(data => {
    let payloadObj = JSON.parse(payload)
    let user_id = payloadObj.user_id
    let payload_nickname = payloadObj.nickname
    id = data['id']
    user = data['user']['nickname']
    title = data['title']
    created_at = data['created_at']
    updated_at = data['updated_at']
    content = data['content']
    bookmark = data['bookmark']
    meeting_at = data['meeting_at']
    meeting_city = data['meeting_city']
    meeting_status = data['meeting_status']
    num_person_meeting = data['num_person_meeting']
    join_meeting = data['join_meeting']
    join_meeting_count = data['join_meeting_count']
    place_title = data['place_title']
    place_address = data['place_address']
    join_meeting_user = data['join_meeting_user']
    join_meeting_user.forEach(join_user => {
        let join_user_nickname = join_user.nickname
        let meeting_join_user_list = `
                                <ul>
                                    <li>${join_user_nickname}</li>
                                </ul>
                                `
        $('#popup-user-list').append(meeting_join_user_list)
    })
    let meeting_book = ``
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
    let check_join_meeting = ``
    if (join_meeting.includes(user_id)) {
        check_join_meeting = `
        <button onclick="handleJoinmeeting(${id})" style="margin-left:10px; border:none; cursor: pointer; display:flex;align-items: center; background-color:transparent;"><a>
                        <img id="join_meeting${id}" src="static/image/join (1).png" style="margin-top:5px; width: 30px;" alt="모임참가" >
                        </a><p style="margin-left:5px;">참가취소</p></button>
        `
    } else {
        check_join_meeting = `
        <button onclick="handleJoinmeeting(${id})" style="margin-left:10px; border:none; cursor: pointer; display:flex;align-items: center; background-color:transparent;"><a>
                        <img id="join_meeting${id}" src="static/image/join.png" style="margin-top:5px; width: 30px;" alt="모임참가" >
                        </a><p style="margin-left:5px;">참가하기</p></button>
        `
    }
    let meeting_btn = ``
    if (payload_nickname == user) {
        meeting_btn = `
        <a> <img src="static/image/edit.png" style="margin-top:10px; width: 30px;" onclick="meetingPreEdit(${meeting_id})"> </a>
        <a> <img src="static/image/delete.png" style="margin-top:10px; width: 30px;" onclick="meetingDelete()"> </a>
        `
    }
    let temp_html =
        ` 
<div>
    <div style="position:relative;">
    <div style="position:absolute; left:56vw;"><a>${meeting_book}</a></div>
    <div>
    <p><small>${meeting_city} </p>
    <h1  >${title}</h1>
    <hr>
        <div style = "display:flex;">
            <div style="width:250px; border-right:solid 0.6px">
                <p>생성일 : ${created_at}</p>
                <p>수정일 : ${updated_at}</p>
                <p>작성자 : ${user}</p>
            </div>
        <div style="width:250px; margin-left:10px;">
                <p>약속일 : ${meeting_at}</p>
                <p>모임 상태 : ${meeting_status} 
                <p>모임 인원 : ${join_meeting_count}/${num_person_meeting}
                    </div>
                    </div>
                    <div>
                    <hr>
                    <div style="display:flex; flex-direction: row;">
                        <div>
                        ${meeting_btn}
                        </div>
                        <div style="display:flex; margin-left: auto;">
                        <button onclick="join_user_list()" style="display:flex;align-items: center; border:none; background-color:transparent; cursor: pointer;"><img id="who_join_meeting${id}" src="static/image/metting_join_list.png" style="width: 30px; margin-right:5px;" alt="참가유저목록"><p>참가 목록</p></button>
                        ${check_join_meeting}
                        </div>
                    </div>
                    <hr>
                    <p class=meeting_detail_content>${content}</p>
                    </div>
                    <div id=image_box class=image_box_class>
                    </div>
                    `
    $('#meeting_detail_card').append(temp_html)

    data.meeting_image.forEach((each_image => {
        image = each_image['image']
        if (image.includes('http')) {
            if (image.includes('www')) {
                image = each_image['image'].slice(16);
                let decodedURL = decodeURIComponent(image);
                temp_html = `
                <img class="detail_image" src="http://${decodedURL}" alt="">`
                $('#image_box').append(temp_html)
            } else {
                image = each_image['image'].slice(15);
                let decodedURL = decodeURIComponent(image);
                temp_html = `
                <img class="detail_image" src="http://${decodedURL}" alt="">`
                $('#image_box').append(temp_html)
            }
        } else {
            temp_html = `
            <img class="detail_image" src="${BACKEND_BASE_URL}${image}" alt="">`
            $('#image_box').append(temp_html)
        }

    }))


    let token = localStorage.getItem("access")
    fetch(`${BACKEND_BASE_URL}/meeting/${meeting_id}`, {

        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        }
    },).then(res => res.json()).then(data => {
        let name = data['place_title']
        let address = data['place_address']
        let place_title = name

        if (data['place'] !== null) {
            place_title = `<a onclick="go_placeDetailView(${data['place']})">${name}</a>`
        }

        hot_place_container.innerHTML += `<div class="place-detail-content">
    <div class="place-detail-content-grid">
        <div>
            <div class="place-detail-font-gray" style="margin-top:23px">이름</div>
            <div class="place-detail-font-gray" style="margin-top:20px">주소</div>
        </div>
        <div>
            <div><h3>${place_title}</h3></div>
            <div>${address}</div>
        </div>
        <div class="place-detail-map" id="map">
        </div>
    </div>
</div>`
        placeShowMap(name, address)
    }
    )

})

// 지도 보여주기
async function placeShowMap(name, address) {
    let mapContainer = document.getElementById('map'), // 지도를 표시할 div 
        mapOption = {
            center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
            level: 5 // 지도의 확대 레벨
        };

    // 지도를 생성합니다    
    let map = new kakao.maps.Map(mapContainer, mapOption);

    // 주소-좌표 변환 객체를 생성합니다
    let geocoder = new kakao.maps.services.Geocoder();

    // 주소로 좌표를 검색합니다
    geocoder.addressSearch(address, function (result, status) {

        // 정상적으로 검색이 완료됐으면 
        if (status === kakao.maps.services.Status.OK) {

            let coords = new kakao.maps.LatLng(result[0].y, result[0].x);

            // 결과값으로 받은 위치를 마커로 표시합니다
            let marker = new kakao.maps.Marker({
                map: map,
                position: coords
            });

            // 인포윈도우로 장소에 대한 설명을 표시합니다
            let infowindow = new kakao.maps.InfoWindow({
                content: `<div style="width:150px;text-align:center;padding:6px 0;">${name}</div>`
            });
            infowindow.open(map, marker);

            // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
            map.setCenter(coords);
        }
    });
}

// ================================ 모임 게시글 수정하기 페이지로 이동 시작 ================================
function meetingUpdateMove() {
    fetch(`${BACKEND_BASE_URL}/meeting/${meeting_id}`).then(res => res.json()).then(data => {
        let payloadObj = JSON.parse(payload)
        let nickname = payloadObj.nickname
        if (nickname == data.user.nickname) { location.replace(`${FRONTEND_BASE_URL}/meeting_update.html?id=` + meeting_id) }
        else { swal("권한이 없습니다.", '', 'error') }
    })
}
// ================================ 모임 게시글 수정하기 페이지로 이동 끝 ================================

// ================================ 모임 게시글 상세보기 API 끝 ================================

// ================================ 모임 게시글 댓글 목록 API 시작 ================================
// 댓글 삭제 버튼 src 변경
function changeDeleteImage(id) {
    document.querySelector(`#delete-image${id}`).src = 'static/image/comment_delete (1).png'

}

// 댓글 삭제 버튼 src 변경
function restoreDeleteImage(id) {
    document.querySelector(`#delete-image${id}`).src = 'static/image/comment_delete.png'
}

// 댓글 삭제 버튼 src 변경
function changeReplyDeleteImage(id) {
    document.querySelector(`#delete-reply-image${id}`).src = 'static/image/comment_delete (1).png'

}

// 댓글 삭제 버튼 src 변경
function restoreReplyDeleteImage(id) {
    document.querySelector(`#delete-reply-image${id}`).src = 'static/image/comment_delete.png'
}

// 댓글 취소
function commentCancel(counsel_id, id) {
    let comment = document.querySelector(`#now_comment${id}`)
    let input = document.querySelector(`#p_comment_update_input${id}`)

    comment.style.display = '';
    input.style.display = 'none';
}

// 대댓글 취소
function replyCancel(counsel_id, id) {
    let comment = document.querySelector(`#now_reply_comment${id}`)
    let input = document.querySelector(`#p_reply_update_input${id}`)

    comment.style.display = '';
    input.style.display = 'none';
}

fetch(`${BACKEND_BASE_URL}/meeting/${meeting_id}/`).then(res => res.json()).then(data => {
    $('#comment_card').empty()
    data.comment.forEach((each_comment => {
        id = each_comment['id']
        content = each_comment['content']
        updated_at = each_comment['updated_at']
        user = each_comment['user']['nickname']
        user_id = each_comment['user']['pk']

        let comment_edit = ``



        if (JSON.parse(payload)['user_id'] == user_id) {
            comment_edit = `
            <a> <img src="static/image/comment_edit.png" class="auth_btn" style="margin-left: 10px;" onclick="comment_update_handle(${id})"> </a>
            <a> <img id="delete-image${id}" src="static/image/comment_delete.png" class="auth_btn" onclick="commentDelete(${id})" onmouseover="changeDeleteImage(${id})" onmouseout="restoreDeleteImage(${id})"> </a>
            `
        }

        if (content == '삭제된 댓글 입니다.') {
            let temp_html = `
            <p id="now_comment${id}" style="display:block;">[사용자] ${content}</p>
            <div id="reply_card${id}">
            <hr>
            `
            $('#comment_card').append(temp_html)
        }
        else {
            let temp_html =
                `   
                    <div class ="comment-text">
                    <p id="now_comment${id}" style="display:block;">[${user}] ${content} ${comment_edit}</p>
                    </div>
                    <p id="p_comment_update_input${id}" style="display:none;"/><input class="reply-input" id="comment_update_input${id}" type="text"/> <button class="button-blue" onclick="commentUpdateConfrim(${id})">완료</button> <button class="button-white" onclick="comment_update_handle(${id})">취소하기</button></p>
                    <p> <small> ${updated_at}</small></p>
                    
                    <p id="p_reply_create_input${id}" style="display:none;"/><input class="reply-input" id="reply_create_input${id}" type="text"/> <button class="button-blue" onclick="replyCreateConfrim(${id})">완료</button> <button class="button-white" onclick="reply_create_handle(${id})">취소하기</button></p>
                    <div class=comment_btns>
                    <button id="reply_create_btn${id}" class="commentbtn" onclick="reply_create_handle(${id})">답글 작성하기</button>
                    </div>
                    <div id="reply_card${id}">
                    <hr>
                    `

            $('#comment_card').append(temp_html)
        }
        $(`#comment_update_input${id}`).val(content)
        each_comment.reply.forEach((each_reply => {

            comment = each_reply['comment']
            id = each_reply['id']
            content = each_reply['content']
            user = each_reply['user']['nickname']
            reply_user_id = each_reply['user']['pk']
            updated_at = each_reply['updated_at']
            meeting_id = each_reply['meeting']

            let reply_edit = ``

            if (JSON.parse(payload)['user_id'] == reply_user_id) {
                reply_edit = `
                <a> <img src="static/image/comment_edit.png" class="auth_btn" style="margin-left: 10px;" onclick="reply_update_handle(${id})"> </a>
                <a> <img id="delete-reply-image${id}" src="static/image/comment_delete.png" class="auth_btn" onclick="replyDelete(${id})" onmouseover="changeReplyDeleteImage(${id})" onmouseout="restoreReplyDeleteImage(${id})"> </a>
                `
            }

            let temp_html = `
            <div style="margin-left: 50px;">
            <div class ="comment-text">
            <p id="now_reply_comment${id}" style="display:block;">[${user}] ${content} ${reply_edit}</p>
            <p id="p_reply_update_input${id}" style="display:none;"/>
                <input class="reply-input" id="reply_update_input${id}" value="${content}" type="text"/> 
                <button class="button-blue" style="margin-right:5px" onclick="replyUpdateConfrim(${id})">수정하기</button>
                <button type="button" class="button-white" onclick="replyCancel(${meeting_id}, ${id})">취소하기</button>
            </div>
            <div class=replybtns>
                <p> <small>${updated_at}</small></p>
            </div>
            </div>
            <hr>
            `
            $(`#reply_card${comment}`).append(temp_html)
            $(`#reply_update_input${id}`).val(content)
        }))
    }))
})
// ================================ 모임 게시글 댓글 목록 API 끝 ================================

// ================================ 모임 게시글 삭제 API 시작 ================================
async function meetingDelete() {
    if (confirm("삭제하시겠습니까?")) {
        let token = localStorage.getItem("access")
        let response = await fetch(`${BACKEND_BASE_URL}/meeting/${meeting_id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        if (response.status == 204) {
            swal("삭제 완료", '', 'success')
            await location.replace(`${FRONTEND_BASE_URL}/meeting_list.html`)
        }
        else {
            swal("권한이 없습니다.", '', 'error')
        }
    }
}
// ================================ 모임 게시글 삭제 API 끝 ================================

// ================================ 모임 게시글 상세보기 북마크 시작 ================================
async function handleBookmark() {
    let token = localStorage.getItem("access")
    if (token) {
        let meeting_id = new URLSearchParams(window.location.search).get('id');
        let response = await fetch(`${BACKEND_BASE_URL}/meeting/${meeting_id}/bookmark/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        if (response.status === 200) {
            swal("북마크 취소", '')
                .then((value) => {
                    location.reload()
                });
        } else {
            swal("북마크", '')
                .then((value) => {
                    location.reload()
                });
        }
    } else { swal("로그인 해주세요", "", "warning") }
}
// ================================ 모임 게시글 상세보기 북마크 끝 ================================

// ================================ 모임 게시글 상세보기 댓글 작성 시작 ================================
async function meetingCommentCreate() {
    let comment = document.getElementById("textareaComment").value
    let token = localStorage.getItem("access")
    if (token) {
        let formData = new FormData();
        formData.append("content", comment);

        let meeting_id = new URLSearchParams(window.location.search).get('id');
        let response = await fetch(`${BACKEND_BASE_URL}/meeting/${meeting_id}/comment/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData
        })
        if (response.status == 200) {
            swal("댓글 작성 완료", '', 'success')
                .then((value) => {
                    window.location.reload()
                });
        }
        else {
            alert("입력 해주세요")
        }

    } else {
        alert("로그인 해주세요")
    }
}
// ================================ 모임 게시글 상세보기 댓글 작성 끝 ================================

// ================================ 모임 게시글 상세보기 댓글 삭제 시작 ================================
async function commentDelete(comment_id) {
    if (confirm("삭제하시겠습니까?")) {
        let token = localStorage.getItem("access")
        let meeting_id = new URLSearchParams(window.location.search).get('id');
        if (token) {
            let response = await fetch(`${BACKEND_BASE_URL}/meeting/${meeting_id}/comment/${comment_id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (response.status == 204) { alert("삭제 완료"), window.location.reload() }
            else (alert("권한이 없습니다."))
        } else { alert("로그인 해주세요") }
    }
}
// ================================ 모임 게시글 상세보기 댓글 삭제 끝 ================================

// ================================ 모임 게시글 상세보기 댓글 수정 버튼 보이고 숨기기 시작 ================================

async function comment_update_handle(id) {
    let token = localStorage.getItem("access")
    if (token) {
        let comment_update_input = document.getElementById(`p_comment_update_input${id}`)
        let now_comment = document.getElementById(`now_comment${id}`);
        let comment_edit_icon = document.getElementById(`comment_edit_icon${id}`);
        let comment_delete_icon = document.getElementById(`comment_delete_icon${id}`);
        if (comment_update_input.style.display == 'none') {
            comment_update_input.style.display = 'block'
            now_comment.style.display = 'none';
            comment_edit_icon.style.display = 'none';
            comment_delete_icon.style.display = 'none';
        } else {
            comment_update_input.style.display = 'none';
            now_comment.style.display = 'block';
            comment_edit_icon.style.display = 'block';
            comment_delete_icon.style.display = 'block';
        }
    } else { alert("로그인 해주세요") }
}
// ================================ 모임 게시글 상세보기 댓글 수정 버튼 보이고 숨기기 끝 ================================

// ================================ 모임 게시글 상세보기 댓글 수정 시작 ================================
async function commentUpdateConfrim(id) {
    let comment = document.getElementById(`comment_update_input${id}`).value
    let token = localStorage.getItem("access")
    if (token) {
        let formData = new FormData();
        formData.append("content", comment);

        let meeting_id = new URLSearchParams(window.location.search).get('id');
        let response = await fetch(`${BACKEND_BASE_URL}/meeting/${meeting_id}/comment/${id}/`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData
        })
        if (response.status == 200) { alert("수정 완료"), window.location.reload() }
        else if (response.status == 400) { alert("입력 해주세요") }
        else (alert("권한이 없습니다."))
    } else { alert("로그인 해주세요") }
}
// ================================ 모임 게시글 상세보기 댓글 수정 끝 ================================

// ================================ 모임 게시글 상세보기 대댓글 수정 버튼 보이고 숨기기 시작 ================================
async function reply_update_handle(id) {
    let token = localStorage.getItem("access")
    if (token) {
        let reply_update_input = document.getElementById(`p_reply_update_input${id}`)
        let now_reply = document.getElementById(`now_reply_comment${id}`);
        // let reply_edit_icon = document.getElementById(`reply_edit_icon${id}`)
        // let reply_delete_icon = document.getElementById(`reply_delete_icon${id}`)

        if (reply_update_input.style.display == 'none') {
            reply_update_input.style.display = 'block'
            now_reply.style.display = 'none';
            // reply_edit_icon.style.display = 'none';
            // reply_delete_icon.style.display = 'none';
        } else {
            reply_update_input.style.display = 'none';
            now_reply.style.display = 'block';
            // reply_edit_icon.style.display = 'block';
            // reply_delete_icon.style.display = 'block';
        }
    } else { alert("로그인 해주세요") }
}
// ================================ 모임 게시글 상세보기 대댓글 수정 버튼 보이고 숨기기 끝 ================================

// ================================ 모임 게시글 상세보기 대댓글 수정 시작 ================================
async function replyUpdateConfrim(reply_id) {
    let reply = document.getElementById(`reply_update_input${reply_id}`).value
    let token = localStorage.getItem("access")
    if (token) {
        let formData = new FormData();
        formData.append("content", reply);

        let meeting_id = new URLSearchParams(window.location.search).get('id');
        let response = await fetch(`${BACKEND_BASE_URL}/meeting/${meeting_id}/comment/reply/${reply_id}/`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData
        })
        if (response.status == 200) { alert("수정 완료"), window.location.reload() }
        else if (response.status == 400) { alert("입력해주세요") }
        else { swal("권한이 없습니다.", '', 'error') }

    } else { alert("로그인 해주세요") }
}
// ================================ 모임 게시글 상세보기 대댓글 수정 끝 ================================

// ================================ 모임 게시글 상세보기 대댓글 삭제 시작 ================================
async function replyDelete(reply_id) {
    if (confirm("삭제하시겠습니까?")) {
        let token = localStorage.getItem("access")
        let meeting_id = new URLSearchParams(window.location.search).get('id');
        if (token) {
            let response = await fetch(`${BACKEND_BASE_URL}/meeting/${meeting_id}/comment/reply/${reply_id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (response.status == 204) { alert("삭제 완료"), window.location.reload() }
            else { swal("권한이 없습니다.", '', 'error') }

        } else { alert("로그인 해주세요") }
    }
}
// ================================ 모임 게시글 상세보기 대댓글 삭제 끝 ================================

// ================================ 모임 게시글 상세보기 대댓글 작성 시작 ================================

async function replyCreateConfrim(reply_id) {
    let reply = document.getElementById(`reply_create_input${reply_id}`).value
    let token = localStorage.getItem("access")
    if (token) {
        let formData = new FormData();
        formData.append("content", reply);

        let meeting_id = new URLSearchParams(window.location.search).get('id');
        let response = await fetch(`${BACKEND_BASE_URL}/meeting/${meeting_id}/comment/${reply_id}/reply/`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData
        })
        if (response.status == 400) { alert("입력해주세요") }
        else {
            alert("작성 완료")
            window.location.reload()
        }
    } else { "로그인 해주세요" }
}
// ================================ 모임 게시글 상세보기 대댓글 작성 끝 ================================

// ================================ 모임 게시글 상세보기 대댓글 작성 버튼 숨기고 보이기 시작 ================================
async function reply_create_handle(id) {
    let token = localStorage.getItem("access")
    if (token) {
        let p_reply_create_input = document.getElementById(`p_reply_create_input${id}`)
        let reply_create_btn = document.getElementById(`reply_create_btn${id}`)
        if (p_reply_create_input.style.display == 'none') {
            p_reply_create_input.style.display = 'block'
            reply_create_btn.style.display = 'none'

        } else {
            p_reply_create_input.style.display = 'none';
            reply_create_btn.style.display = 'block'
        }
    } else { alert("로그인 해주세요") }
}
// ================================ 모임 게시글 상세보기 대댓글 작성 버튼 숨기고 보이기 끝 ================================

// ================================ 모임 게시글 상세보기 모임참가 시작 ================================
async function handleJoinmeeting() {
    let token = localStorage.getItem("access")
    if (token) {
        if (meeting_status == "모집종료") {
            alert("모집종료 된 모임입니다.")
        } else {
            let meeting_id = new URLSearchParams(window.location.search).get('id');
            let response = await fetch(`${BACKEND_BASE_URL}/meeting/${meeting_id}/join_meeting/`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            if (response.status === 200) {
                alert("참가취소")
                location.reload()
            } else if (num_person_meeting == join_meeting_count) {
                alert("자리가 없습니다.")
                location.reload()
            } else {
                alert("참가하기")
                location.reload()
            }
        }
    }
    else { alert("로그인 해주세요") }
}
// ================================ 모임 게시글 상세보기 모임참가 끝 ================================

// 참가유저목록 열기
function closePopup() {
    $('html, body').css({
        'overflow': 'auto'
    });
    $("#popup").fadeOut(200);
}

// 참가유저목록 열기
function join_user_list() {
    // const share = document.querySelector('#modal_opne_btn')
    // const place_modal = document.querySelector('#place_modal')
    // const link_id = document.querySelector('#link_id')

    // link_id.value = document.location.href;
    $('#popup').fadeIn(200);
    $('.popup').scrollTop(0);
}

function meetingEditBasic() {

}

//================================ 모임 게시글 수정 할 데이터 불러오기 API 시작 ================================ 

async function meetingPreEdit(meeting_id) {
    let token = localStorage.getItem("access");
    try {
        const response = await fetch(`${BACKEND_BASE_URL}/meeting/${meeting_id}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token,
            },
        });

        const data = await response.json();

        $('#meeting-detail').hide();
        let title = data['title'];
        let content = data['content'];
        let sido = data['meeting_city'].split(" ")[0];
        let gugun = data['meeting_city'].split(" ")[1];
        let meeting_status = data['meeting_status'];
        let num_person_meeting = data['num_person_meeting'];
        let place_title = data['place_title'];
        let place_address = data['place_address'];
        let meeting_at = data['meeting_at'];


        let img_html = '';

        let images = data['meeting_image'];
        images.forEach((each_image) => {
            let image = each_image['image'];
            let id = each_image['id'];

            let img_urls = '';
            if (image.includes('http')) {
                if (image.includes('www')) {
                    image = image.slice(16);
                    let decodedURL = decodeURIComponent(image);
                    img_urls = `http://${decodedURL}`;
                } else {
                    image = image.slice(15);
                    let decodedURL = decodeURIComponent(image);
                    img_urls = `http://${decodedURL}`;
                }
            } else {
                img_urls = `${BACKEND_BASE_URL}${image}`;
            }

            img_html += `
            <div id="update_image_box${id}" class="update_image_box">
                <img class="update_image" src="${img_urls}" alt="">
                <a class="image_delete_btn">
                    <img id="delete-image${id}" src="static/image/comment_delete.png" style="width: 30px;" onmouseover="changeDeleteImage(${id})" onmouseout="restoreDeleteImage(${id})" onclick="deleteImage(${id})">
                </a>
            </div>`;
        });

        if (meeting_status == '모집중') {
            meeting_status = `
            <option value="모집중" selected>모집중</option>
            <option value="모집종료">모집종료</option>
            `
        } else if (meeting_status == '모집종료') {
            meeting_status = `
            <option value="모집중">모집중</option>
            <option value="모집종료" selected>모집종료</option>
            `
        }

        const foot_html = `
        <div class="wrapper">
            <h1 class="create_h1">Meeting Update</h1>
            <h5 class="create_h5">모임 약속 글을 수정해주세요.</h5>
            <form class="create_form">
                <div class="group">
                    <select name="sido1" id="sido1"></select>
                    <select name="gugun1" id="gugun1"></select>
                    <select name="meeting_status" id="meeting_status">
                    ${meeting_status}
                    </select>
                </div>
                <div class="group" id="date_time_input">
                <input id="datetimeinput" name="date" type="text" placeholder="모임 날짜와 시간" value="${meeting_at}" readonly>
                <input id="num_person_meeting" type="number" placeholder="모집 인원수" min="1" value="${num_person_meeting}">
                </div>
                <div class="group">
                    <input id="place_title" class="create_input" type="text" required="required" value="${place_title}"/><span
                        class="highlight"></span><span class="bar"></span>
                    <label class="create_label">모임장소 이름</label>
                </div>
                <div class="group">
                    <input id="place_address" class="create_input" type="text" required="required" value="${place_address}"/><span
                        class="highlight"></span><span class="bar"></span>
                    <label class="create_label">모임장소 주소</label>
                </div>
                <div class="group">
                    <input id="meeting_title" class="create_input" type="text" required="required" value="${title}"/><span
                        class="highlight"></span><span class="bar"></span>
                    <label class="create_label">제목</label>
                </div>
                <div class="group">
                    <textarea id="meeting_content" class="create_input" type="textarea" rows="10"
                        required="required">${content}</textarea><span class="highlight"></span><span class="bar"></span>
                    <label class="create_label">내용</label>
                </div>
                <div class="file_class">
                    <input id="meeting_image" type="file" class="file_input" onchange="setThumbnail(event);"
                        multiple /><span class="highlight"></span><span class="bar_input"></span>
                </div>
            </form>
        </div>
        <div id="update_image_container" class="update_image_container_class">
        ${img_html}
        </div>
        <hr>
        <div class="row">
            <div id="image_container" class="image_container">
            </div>
        </div>
        <div class="btn-box">
            <button class="btn btn-submit" type="button" onclick="updateMeeting()">submit</button>
            <button class="btn btn-cancel" type="button" onclick="go_meetingList()">cancel</button>
        </div>
        <script>
        $('#datetimeinput').appendDtpicker({
            "locale": "ko",
            "futureOnly": true,
            "minuteInterval": 10,
            "dateFormat": "YYYY-MM-DD hh:mm",
            "autodateOnStart": false
        });   
        </script>`
            ;
        $('#meeting-edit-footer').html(foot_html);
        meetingEditBasic();
        meetingPreEditWrapper(sido, gugun);
    } catch (error) {
        console.log(error);
    }
}
//================================ 모임 게시글 수정 할 데이터 불러오기 API 끝 ================================ 


//================================ 모임 게시글 수정 시 이미지 삭제 API 시작 ================================ 
function deleteImage(id) {
    let token = localStorage.getItem("access")
    fetch(`${BACKEND_BASE_URL}/meeting/${meeting_id}/meeting_image/${id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })
    $(`#update_image_box${id}`).hide()
}

//================================ 모임 게시글 수정 시 이미지 삭제 API 끝 ================================ 

//================================ 모임 게시글 수정 API 시작 ================================ 
async function updateMeeting() {
    let meeting_title = document.getElementById("meeting_title").value
    let meeting_content = document.getElementById("meeting_content").value
    let sido1 = document.getElementById("sido1").value
    let gugun1 = document.getElementById("gugun1").value
    let meeting_city = `${sido1} ${gugun1}`
    let meeting_status = document.getElementById("meeting_status").value
    let meeting_at = document.getElementById("datetimeinput").value
    let num_person_meeting = document.getElementById("num_person_meeting").value
    let place_title = document.getElementById("place_title").value
    let place_address = document.getElementById("place_address").value

    let meeting_image = document.getElementById("meeting_image").files


    let token = localStorage.getItem("access")

    let formData = new FormData();
    formData.append("title", meeting_title);
    formData.append("content", meeting_content);
    formData.append("meeting_city", meeting_city);
    formData.append("meeting_status", meeting_status);
    formData.append("meeting_at", meeting_at);
    formData.append("num_person_meeting", num_person_meeting);
    formData.append("place_address", place_address);
    formData.append("place_title", place_title);



    for (let i = 0; i < meeting_image.length; i++) {
        let image = meeting_image[i]
        formData.append("image", image);
    }
    const response = await fetch(`${BACKEND_BASE_URL}/meeting/${meeting_id}/`, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData
    })
        .then((response) => response.json())
        .then((data) => {
            if (data['non_field_errors']) { alert(data['non_field_errors']) } else {

                alert('수정 되었습니다.')
                location.replace(`${FRONTEND_BASE_URL}/meeting_detail.html?id=` + meeting_id)
            }
        });





    let response_json = await response.json();

    if (response.status == 200) {
        alert('수정되었습니다.')
        location.replace(`${FRONTEND_BASE_URL}/meeting_detail.html?id=` + meeting_id)
    } else {
        if (response_json.meeting_city) {
            alert("모임 지역을 선택해주세요")
        }
        else if (response_json.num_person_meeting) {
            alert("모집 인원수를 본인 포함 두 명 이상으로 입력 해주세요.")
        }
        else if (response_json.place_title) {
            alert("모임 장소 이름을 입력해주세요")
        }
        else if (response_json.place_address) {
            alert("모임 주소를 입력해주세요")
        }
        else if (response_json.title) {
            alert("제목을 입력해주세요")
        }
        else if (response_json.content) {
            alert("내용을 입력해주세요")
        }
        else if (response_json.non_field_errors) {
            alert(response_json.non_field_errors)
            document.querySelector('#image_container').innerHTML = ''
            const fileInput = document.getElementById('meeting_image');
            fileInput.value = '';
        }
    }


}
//================================ 모임 게시글 수정 API 끝 ================================ 
function setThumbnail(event) {
    var container = document.querySelector("#image_container");
    container.innerHTML = '';

    for (var image of event.target.files) {
        var reader = new FileReader();

        reader.onload = function (event) {
            var img = document.createElement("img");
            img.className = 'show_img';
            img.setAttribute("src", event.target.result);
            document.querySelector("div#image_container").appendChild(img);
        };
        reader.readAsDataURL(image);
    }
}

function meetingPreEditWrapper(sido, gugun) {

    $(document).ready(function () {
        var area0 = ["시/도", "서울", "인천", "대전", "광주", "대구", "울산", "부산", "경기", "강원", "충북", "충남", "전북", "전남", "경북", "경남", "제주"];
        var area1 = ["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"];
        var area2 = ["계양구", "남구", "남동구", "동구", "부평구", "서구", "연수구", "중구", "강화군", "옹진군"];
        var area3 = ["대덕구", "동구", "서구", "유성구", "중구"];
        var area4 = ["광산구", "남구", "동구", "북구", "서구"];
        var area5 = ["남구", "달서구", "동구", "북구", "서구", "수성구", "중구", "달성군"];
        var area6 = ["남구", "동구", "북구", "중구", "울주군"];
        var area7 = ["강서구", "금정구", "남구", "동구", "동래구", "부산진구", "북구", "사상구", "사하구", "서구", "수영구", "연제구", "영도구", "중구", "해운대구", "기장군"];
        var area8 = ["고양시", "과천시", "광명시", "광주시", "구리시", "군포시", "김포시", "남양주시", "동두천시", "부천시", "성남시", "수원시", "시흥시", "안산시", "안성시", "안양시", "양주시", "오산시", "용인시", "의왕시", "의정부시", "이천시", "파주시", "평택시", "포천시", "하남시", "화성시", "가평군", "양평군", "여주군", "연천군"];
        var area9 = ["강릉시", "동해시", "삼척시", "속초시", "원주시", "춘천시", "태백시", "고성군", "양구군", "양양군", "영월군", "인제군", "정선군", "철원군", "평창군", "홍천군", "화천군", "횡성군"];
        var area10 = ["제천시", "청주시", "충주시", "괴산군", "단양군", "보은군", "영동군", "옥천군", "음성군", "증평군", "진천군", "청원군"];
        var area11 = ["계룡시", "공주시", "논산시", "보령시", "서산시", "아산시", "천안시", "금산군", "당진군", "부여군", "서천군", "연기군", "예산군", "청양군", "태안군", "홍성군"];
        var area12 = ["군산시", "김제시", "남원시", "익산시", "전주시", "정읍시", "고창군", "무주군", "부안군", "순창군", "완주군", "임실군", "장수군", "진안군"];
        var area13 = ["광양시", "나주시", "목포시", "순천시", "여수시", "강진군", "고흥군", "곡성군", "구례군", "담양군", "무안군", "보성군", "신안군", "영광군", "영암군", "완도군", "장성군", "장흥군", "진도군", "함평군", "해남군", "화순군"];
        var area14 = ["경산시", "경주시", "구미시", "김천시", "문경시", "상주시", "안동시", "영주시", "영천시", "포항시", "고령군", "군위군", "봉화군", "성주군", "영덕군", "영양군", "예천군", "울릉군", "울진군", "의성군", "청도군", "청송군", "칠곡군"];
        var area15 = ["거제시", "김해시", "마산시", "밀양시", "사천시", "양산시", "진주시", "진해시", "창원시", "통영시", "거창군", "고성군", "남해군", "산청군", "의령군", "창녕군", "하동군", "함안군", "함양군", "합천군"];
        var area16 = ["서귀포시", "제주시", "남제주군", "북제주군"];



        // 시/도 선택 박스 초기화

        $("select[name^=sido]").each(function () {
            $selsido = $(this);
            $.each(eval(area0), function () {
                $selsido.append("<option value='" + this + "'>" + this + "</option>");
            });
            $selsido.next().append("<option value=''>구/군 선택</option>");
        });



        // 시/도 선택시 구/군 설정

        $("select[name^=sido]").change(function () {
            var area = "area" + $("option", $(this)).index($("option:selected", $(this))); // 선택지역의 구군 Array
            var $gugun = $(this).next(); // 선택영역 군구 객체
            $("option", $gugun).remove(); // 구군 초기화

            if (area == "area0")
                $gugun.append("<option value=''>구/군 선택</option>");
            else {
                $.each(eval(area), function () {
                    $gugun.append("<option value='" + this + "'>" + this + "</option>");
                });
            }
        });

        const sidoDropdown = document.getElementById('sido1');
        const gugunDropdown = document.getElementById('gugun1');

        for (let i = 0; i < sidoDropdown.options.length; i++) {
            if (sidoDropdown.options[i].value === sido) {
                sidoDropdown.selectedIndex = i;
                break;
            }
        }

        // sidoDropdown에서 change 이벤트를 트리거하여 gugunDropdown의 옵션을 업데이트하기
        sidoDropdown.dispatchEvent(new Event('change'));

        // gugunDropdown에서 gugun_selected 값을 선택된 값으로 설정하기
        for (let i = 0; i < gugunDropdown.options.length; i++) {
            if (gugunDropdown.options[i].value === gugun) {
                gugunDropdown.selectedIndex = i;
                break;
            }
        }
    });
}