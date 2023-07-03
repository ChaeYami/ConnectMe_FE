const logined_token = localStorage.getItem("access");
const counsel_id = new URLSearchParams(window.location.search).get('counsel_id');

window.onload = () => {
    counselDetail(counsel_id)
    counselComments(counsel_id)
}

// 글상세
async function counselDetail(counsel_id) {
    $.ajax({
        url: `${BACKEND_BASE_URL}/counsel/${counsel_id}`,
        type: "GET",
        dataType: "json",
        success: function (response) {
            let counsel_id = response.counsel['id']
            let is_anonymous = response.counsel['is_anonymous']
            let counsel_title = response.counsel['title']
            let counsel_content = response.counsel['content']
            let counsel_author = ''
            if (is_anonymous) {
                counsel_author = '익명'
            } else {
                counsel_author = response.counsel['user']['nickname']
            }
            let counsel_author_id = response.counsel['user']['pk']
            let author_html = `<a onclick = "go_profile(${counsel_author_id})">${counsel_author}</a>`
            let counsel_created_at = response.counsel['created_at']
            let likes_count = response.counsel['like'].length
            let like = response.counsel['like']
            let buttons = document.querySelector('#buttons')
            let like_button = document.querySelector('#like-button')


            $('#title').append(counsel_title)
            $('#author').append(author_html)
            $('#content').append(counsel_content)
            $('#likes_count').append(likes_count)
            $('#counsel-created').append(counsel_created_at)

            if (JSON.parse(payload)['user_id'] == counsel_author_id) {
                buttons.innerHTML += `
                <a>
                    <img src="static/image/edit.png" style="width:20px" onclick="go_counselEdit()">
                </a>
                <a>
                    <img src="static/image/delete.png" style="width:20px" onclick="counselDelete()">
                </a>`

            }

            if (like.includes(logined_user_id)) {
                like_button.innerHTML += `
                <a>
                    <img id="like${counsel_id}" src="static/image/heart (1).png" style="width: 20px;" alt="좋아요" onclick="CounselLike(${counsel_id})">
                </a>`
            } else {
                like_button.innerHTML += `
                <a>
                    <img id="like${counsel_id}" src="static/image/heart.png" style="width: 20px;" alt="좋아요" onclick="CounselLike(${counsel_id})">
                </a>`
            }
        },
        error: function () {
            alert(response.status);
        }
    })

}

// 좋아요
async function CounselLike(counsel_id) {
    const like = document.querySelector(`#like${counsel_id}`)

    const response = await fetch(`${BACKEND_BASE_URL}/counsel/${counsel_id}/like/`, {
        headers: {
            Authorization: "Bearer " + logined_token,
        },
        method: "POST",
    });

    const response_json = await response.json();

    if (response_json["message"] == "좋아요") {
        like['src'] = "static/image/heart (1).png"
        alert(response_json["message"]);
    } else {
        like['src'] = "static/image/heart.png"
        alert(response_json["message"]);
    }

    const likeCountElements = document.querySelector(`#likes_count`);
    const like_count = response_json["counsel_like"]
    likeCountElements.innerText = `${like_count}`;
}


// 댓글

async function counselComments(counsel_id) {
    $('#comment_card').empty()

    $.ajax({
        url: `${BACKEND_BASE_URL}/counsel/${counsel_id}/comment/`,
        type: "GET",
        dataType: "json",
        success: function (response) {
            const rows = response
            for (let i = 0; i < rows.length; i++) {
                id = rows[i]['id']

                content = rows[i]['content']
                updated_at = rows[i]['updated_at']

                is_anonymous = rows[i]['is_anonymous']
                if (is_anonymous) {
                    user = '익명'
                } else {
                    user = rows[i]['user']['nickname']
                }

                comment_likes_count = rows[i]['comment_like_count']
                like = rows[i]['like']
                user_id = rows[i]['user'].pk
                let temp_html = ``
                let like_html = ``
                let comment_edit = ``

                if (like.includes(logined_user_id)) {
                    like_html = `
                    <a>
                        <img id="comment-like-img${id}"src="static/image/heart (1).png" style="margin-left:10px; width:15px;" alt="좋아요" onclick="clickCommentLike(${id})">
                    </a>`
                } else {
                    like_html = `
                    <a>
                        <img id="comment-like-img${id}"src="static/image/heart.png" style="margin-left:10px; width:15px;" alt="좋아요" onclick="clickCommentLike(${id})">
                    </a>`
                }

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
                            <p id="now_comment${id}" style="display:block;">[${user}] ${content} ${comment_edit}</p>
                            <p id="p_comment_update_input${id}" style="display:none;"/>
                                
                                <input class="reply-input" id="comment_update_input${id}" type="text"/> 
                                <input type="checkbox" id="anonymous-checkbox">
                    <label for="anonymous-checkbox">익명</label>
                                <button class="button-blue" onclick="commentUpdateConfrim(${id})">수정하기</button>
                                <button type="button" class="button-white" onclick="commentCancel(${counsel_id},${id})">취소하기</button>
                                
                            </p>
                            <p> <small>${updated_at}</small></p>
                            
                            <p id="p_reply_create_input${id}" style="margin-right:5px; display:none;"/>
                                <input class="reply-input" id="reply_create_input${id}" type="text"/> 
                                <button class="button-blue" style="margin-right:5px" onclick="replyCreateConfrim(${id})">완료</button>
                                <button type="button" class="button-white" onclick="replyCancel(${counsel_id}, ${id})">취소하기</button>
                            </p>
                            <div class=comment_btns>
                                <button class="commentbtn" onclick="reply_create_handle(${id})">답글 작성하기</button>
                                ${like_html}<p id="comment_count${id}" style="margin: 0px 20px 0px 5px;">${comment_likes_count}</p>
                            </div>
                            <div id="reply_card${id}">
                            <hr>
                            `

                    $('#comment_card').append(temp_html)
                }

                $(`#comment_update_input${id}`).val(content)
                rows[i].reply.forEach((each_reply => {
                    comment = each_reply['comment']
                    reply_id = each_reply['id']
                    content = each_reply['content']
                    is_anonymous = each_reply['is_anonymous']
                    if (is_anonymous) {
                        user = '익명'
                    } else {
                        user = rows[i]['user']['nickname']
                    }
                    updated_at = each_reply['updated_at']
                    reply_likes_count = each_reply['reply_like_count']
                    like = each_reply['like']
                    reply_user_id = each_reply['user']['pk']

                    let like_html = ``
                    let reply_edit = ``

                    if (like.includes(logined_user_id)) {
                        like_html = `
                        <a>
                            <img id="reply-like-img${reply_id}" src="static/image/heart (1).png" style="margin-left:10px; width:15px;" alt="좋아요" onclick="clickReplyLike(${reply_id})">
                        </a>`
                    } else {
                        like_html = `
                        <a>
                            <img id="reply-like-img${reply_id}" src="static/image/heart.png" style="margin-left:10px; width:15px;" alt="좋아요" onclick="clickReplyLike(${reply_id})">
                        </a>`
                    }


                    if (JSON.parse(payload)['user_id'] == reply_user_id) {
                        reply_edit = `
                        <a> <img src="static/image/comment_edit.png" class="auth_btn" style="margin-left: 10px;" onclick="reply_update_handle(${reply_id})"> </a>
                        <a> <img id="delete-reply-image${reply_id}" src="static/image/comment_delete.png" class="auth_btn" onclick="replyDelete(${reply_id})" onmouseover="changeReplyDeleteImage(${reply_id})" onmouseout="restoreReplyDeleteImage(${reply_id})"> </a>
                        `
                    }

                    let temp_html = `
                        <div style="margin-left: 50px;">
                            <p id="now_reply_comment${reply_id}" style="display:block;">[${user}] ${content} ${reply_edit}</p>
                            <p id="p_reply_update_input${reply_id}" style="display:none;"/>
                                <input class="reply-input" id="reply_update_input${reply_id}" value="${content}" type="text"/> 
                                <button class="button-blue" style="margin-right:5px" onclick="replyUpdateConfrim(${reply_id})">수정하기</button>
                                <button type="button" class="button-white" onclick="replyCancel(${counsel_id}, ${reply_id})">취소하기</button>
                            </p>
                            <div class=replybtns>
                                <p> <small>${updated_at}${like_html}<p id="reply_count${reply_id}" style="margin: 0px 20px 0px 5px;">${comment_likes_count}</p></small></p>  
                            </div>
                        </div>
                        <hr>
                        `
                    $(`#reply_card${comment}`).append(temp_html)
                    $(`#reply_update_input${id}`).val(content)
                }))
            }
        }
    })
}

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

// 글 삭제
async function counselDelete() {
    let result = confirm("삭제하시겠습니까?")
    if (result) {
        const response = await fetch(`${BACKEND_BASE_URL}/counsel/${counsel_id}/`, {
            headers: {
                "Authorization": "Bearer " + logined_token,
                'content-type': 'application/json',
            },
            method: 'DELETE',
        })
        if (response.status === 200) {
            alert("삭제 완료!")
            location.replace('counsel_list.html')
        } else {
            alert("권한이 없습니다.")
        }
    }
}

// 수정페이지로 이동
function go_counselEdit() {
    location.href = `counsel_edit.html?counsel_id=${counsel_id}`
}

// 댓글작성
async function counselCommentCreate() {
    let comment = document.getElementById("inputComment").value
    let checked = $('#anonymous-checkbox').is(':checked');
    if (checked) {
        is_anonymous = 'True';

    } else {
        is_anonymous = 'False';
    }
    console.log(is_anonymous)
    if (logined_token) {

        const response = await fetch(`${BACKEND_BASE_URL}/counsel/${counsel_id}/comment/`, {
            method: 'POST',
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + logined_token,
            },
            body: JSON.stringify({
                content: comment,
                is_anonymous: is_anonymous
            })
        })
        if (response.status == 201) {
            alert("댓글 작성 완료.")
            location.reload();
        } else {
            console.log(response.json)
            const errorData = await response.json();
            const errorArray = Object.entries(errorData);
            alert(errorArray[0][1]);
        }
    } else {
        alert("로그인해주세요")
    }
}

// 글 수정
async function CounselEdit() {
    let title = document.querySelector('#title')
    let content = document.querySelector('#content')
    let checked = $('#anonymous-checkbox').is(':checked');
    let is_anonymous = ''
    if (checked) {
        is_anonymous = 'True';

    }else{
        is_anonymous = 'False';
    }

    const response = await fetch(`${BACKEND_BASE_URL}/counsel/${counsel_id}/`, {
        headers: {
            Authorization: "Bearer " + logined_token,
            "content-type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
            title: title.value,
            content: content.value,
            is_anonymous : is_anonymous
        })
    })

    const response_json = await response.json();

    if (response.status == 200) {
        alert("고민 상담이 수정되었습니다.");
        location.href = `counsel_detail.html?counsel_id=${counsel_id}`
    } else if (response.status == 400) {
        for (let key in response_json) {
            alert(`${response_json[key]}`);
            break
        }
    }


}

// 글 작성
// async function CreateCounsel() {
//     let title = document.querySelector('#title');
//     let content = document.querySelector('#content');

//     const formdata = new FormData();
//     formdata.append("title", title.value);
//     formdata.append("content", content.value);

//     const response = await fetch(`${BACKEND_BASE_URL}/counsel/`, {
//         headers: {
//             Authorization: "Bearer " + logined_token,
//         },
//         method: "POST",
//         body: formdata,
//     });

//     const response_json = await response.json();

//     if (response.status == 200) {
//         alert("고민 상담이 등록되었습니다.");
//         window.location.replace(`${FRONTEND_BASE_URL}/counsel_list.html`);
//     } else if (response.status == 400) {
//         for (let key in response_json) {
//             alert(`${response_json[key]}`);
//             break
//         }
//     }
// }

// ================================ 상담 게시글 상세보기 대댓글 작성 버튼 숨기고 보이기 시작 ================================
function reply_create_handle(id) {
    let token = localStorage.getItem("access")
    if (token) {
        let p_reply_create_input = document.getElementById(`p_reply_create_input${id}`)
        if (p_reply_create_input.style.display == 'none') {
            p_reply_create_input.style.display = 'block'
        } else {
            p_reply_create_input.style.display = 'none';
        }
    } else { alert("로그인 해주세요") }
}
// ================================ 상담 게시글 상세보기 대댓글 작성 버튼 숨기고 보이기 끝 ================================

async function replyCreateConfrim(reply_id) {
    let reply = document.getElementById(`reply_create_input${reply_id}`).value
    let token = localStorage.getItem("access")
    if (token) {
        let formData = new FormData();
        formData.append("content", reply);
        let response = await fetch(`${BACKEND_BASE_URL}/counsel/${counsel_id}/comment/${reply_id}/reply/`, {
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

// ================================ 상담 게시글 상세보기 댓글 수정 버튼 보이고 숨기기 시작 ================================

async function comment_update_handle(id) {
    let token = localStorage.getItem("access")
    if (token) {
        let comment_update_input = document.getElementById(`p_comment_update_input${id}`)
        let now_comment = document.getElementById(`now_comment${id}`);
        if (comment_update_input.style.display == 'none') {
            comment_update_input.style.display = 'block'
            now_comment.style.display = 'none';
        } else {
            comment_update_input.style.display = 'none';
            now_comment.style.display = 'block';
        }
    } else { alert("로그인 해주세요") }
}
// ================================ 상담 게시글 상세보기 댓글 수정 버튼 보이고 숨기기 끝 ================================

// ================================ 상담 게시글 상세보기 댓글 수정 시작 ================================
async function commentUpdateConfrim(id) {
    let comment = document.getElementById(`comment_update_input${id}`).value
    let checked = $('#anonymous-checkbox').is(':checked');

    let token = localStorage.getItem("access")
    if (token) {
        let formData = new FormData();
        formData.append("content", comment);
        if (checked) {
            formData.append("is_anonymous", 'True');
    
        }else{
            formData.append("is_anonymous", 'False');
    
        }
        let response = await fetch(`${BACKEND_BASE_URL}/counsel/${counsel_id}/comment/${id}/`, {
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
// ================================ 상담 게시글 상세보기 댓글 수정 끝 ================================

// ================================ 상담 게시글 상세보기 댓글 삭제 시작 ================================
async function commentDelete(comment_id) {
    let token = localStorage.getItem("access")
    let result = confirm('댓글을 삭제하시겠습니까?')
    if (token && result) {
        let response = await fetch(`${BACKEND_BASE_URL}/counsel/${counsel_id}/comment/${comment_id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        if (response.status == 204 || response.status == 200) { alert("삭제 완료"), window.location.reload() }
        else (alert("권한이 없습니다."))
    }
}
// ================================ 상담 게시글 상세보기 댓글 삭제 끝 ================================

// ================================ 상담 게시글 상세보기 대댓글 수정 버튼 보이고 숨기기 시작 ================================
async function reply_update_handle(id) {
    let token = localStorage.getItem("access")
    if (token) {
        let reply_update_input = document.getElementById(`p_reply_update_input${id}`)
        let now_reply = document.getElementById(`now_reply_comment${id}`);
        if (reply_update_input.style.display == 'none') {
            reply_update_input.style.display = 'block'
            now_reply.style.display = 'none';
        } else {
            reply_update_input.style.display = 'none';
            now_reply.style.display = 'block';
        }
    } else { alert("로그인 해주세요") }
}
// ================================ 상담 게시글 상세보기 대댓글 수정 버튼 보이고 숨기기 끝 ================================

// ================================ 상담 게시글 상세보기 대댓글 수정 시작 ================================
async function replyUpdateConfrim(reply_id) {
    let reply = document.getElementById(`reply_update_input${reply_id}`).value
    let token = localStorage.getItem("access")
    if (token) {
        let formData = new FormData();
        formData.append("content", reply);
        let response = await fetch(`${BACKEND_BASE_URL}/counsel/${counsel_id}/comment/reply/${reply_id}/`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData
        })

        if (response.status == 200) { alert("수정 완료"), window.location.reload() }
        else if (response.status == 400) { alert("입력해주세요") }
        else { alert("권한이 없습니다.") }

    } else { alert("로그인 해주세요") }
}
// ================================ 고민 게시글 상세보기 대댓글 수정 끝 ================================

// ================================ 고민 게시글 상세보기 대댓글 삭제 시작 ================================
async function replyDelete(reply_id) {
    let token = localStorage.getItem("access")
    let result = confirm('답글을 삭제하시겠습니까?')
    if (token && result) {
        let response = await fetch(`${BACKEND_BASE_URL}/counsel/${counsel_id}/comment/reply/${reply_id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        if (response.status == 200) { window.location.reload() }
        else { alert("권한이 없습니다.") }
    }
}
// ================================ 고민 게시글 상세보기 대댓글 삭제 끝 ================================

// ================================ 댓글 좋아요 ================================

async function clickCommentLike(comment_id) {
    const like = document.querySelector(`#comment-like-img${comment_id}`)

    let response = await fetch(`${BACKEND_BASE_URL}/counsel/${counsel_id}/comment/${comment_id}/like/`, {
        headers: {
            Authorization: "Bearer " + logined_token,
        },
        method: "POST",
    });

    const response_json = await response.json();

    if (response.status == 200) {
        like['src'] = "static/image/heart.png"
        alert("좋아요 취소");
    }
    else {
        like['src'] = "static/image/heart (1).png"
        alert("좋아요")
    }

    const likeCountElements = document.querySelector(`#comment_count${comment_id}`);
    const like_count = response_json["comment_like"]
    likeCountElements.innerText = `${like_count}`;
}
// ================================ 댓글 좋아요 끝 ================================

// ================================ 대댓글 좋아요 ================================
async function clickReplyLike(reply_id) {
    const like = document.querySelector(`#reply-like-img${reply_id}`)

    let response = await fetch(`${BACKEND_BASE_URL}/counsel/${counsel_id}/comment/reply/${reply_id}/like/`, {
        headers: {
            Authorization: "Bearer " + logined_token,
        },
        method: "POST",
    });

    const response_json = await response.json();

    if (response.status == 200) {
        like['src'] = "static/image/heart.png"
        alert("좋아요 취소");
    }
    else {
        like['src'] = "static/image/heart (1).png"
        alert("좋아요")
    }


    const likeCountElements = document.querySelector(`#reply_count${reply_id}`);
    const like_count = response_json["reply_like"]
    likeCountElements.innerText = `${like_count}`;
}

// ================================ 대댓글 좋아요 끝 ================================
