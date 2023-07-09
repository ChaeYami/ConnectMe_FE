const counsel_id = new URLSearchParams(window.location.search).get('counsel_id');

window.onload = () => {
    counselDetail(counsel_id)
    counselComments(counsel_id)
    bestComment()
}

// 글상세
async function counselDetail(counsel_id) {
    $.ajax({
        url: `${BACKEND_BASE_URL}/counsel/${counsel_id}`,
        type: "GET",
        dataType: "json",
        headers: {
            Authorization: "Bearer " + logined_token,
        },
        success: function (response) {
            let counsel_id = response.counsel['id']
            let is_anonymous = response.counsel['is_anonymous']
            let counsel_title = response.counsel['title']
            let counsel_content = response.counsel['content']
            let counsel_author = ''
            let author_html = ``
            let counsel_author_id = response.counsel['user']['pk']
            // let tags = response.counsel['tags']
            // let tag = String(tags).split(",")
            if (is_anonymous) {
                counsel_author = '익명'
                author_html = `<span style = "color: rgb(158, 158, 158);">${counsel_author}</span>`
            } else {
                counsel_author = response.counsel['user']['nickname']
                author_html = `<a onclick = "go_profile(${counsel_author_id})">${counsel_author}</a>`
            }
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

            // for(let i = 0; i < tag.length; i++){
            //     let tag_html = `<a class="tag" href="counsel_list.html?tag=${tag[i]}"><${tag[i]}></a>`
            //     $('#tags_container').append(tag_html)
            // }

            if (JSON.parse(payload)['user_id'] == counsel_author_id) {
                buttons.innerHTML += `
                <a>
                    <img src="static/image/edit.png" style="width:20px" onclick="counselPreUpdate(${counsel_id})">
                </a>
                <a>
                    <img src="static/image/delete.png" style="width:20px" onclick="counselDelete()">
                </a>`

            }

            if (like.includes(logined_user_id)) {
                like_button.innerHTML += `
                <a>
                    <img id="like${counsel_id}" src="static/image/heart (1).png" style="filter:invert(100%); width: 20px;" alt="좋아요" onclick="CounselLike(${counsel_id})">
                </a>`
            } else {
                like_button.innerHTML += `
                <a>
                    <img id="like${counsel_id}" src="static/image/heart.png" style="filter:invert(0%); width: 20px;" alt="좋아요" onclick="CounselLike(${counsel_id})">
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
        like.style.filter = "invert(100%)";
        swal(`${response_json["message"]} 완료`, '');
    } else {
        like['src'] = "static/image/heart.png"
        like.style.filter = "invert(0%)";
        swal(`${response_json["message"]}`, '');
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
        headers: {
            Authorization: `Bearer ${logined_token}`,
        },
        success: function (response) {
            const rows = response
            for (let i = 0; i < rows.length; i++) {
                id = rows[i]['id']

                content = rows[i]['content']
                updated_at = rows[i]['updated_at']
                anonymous_html = ``

                is_anonymous = rows[i]['is_anonymous']

                if (is_anonymous) {
                    user = '익명'
                    anonymous_html = `<input type="checkbox" id="anonymous-checkbox${id}" checked>`
                } else {
                    user = rows[i]['user']['nickname']
                    anonymous_html = `<input type="checkbox" id="anonymous-checkbox${id}">`
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
                        <img id="comment-like-img${id}"src="static/image/heart (1).png" style="filter: invert(0%); margin-left:10px; width:15px;" alt="좋아요" onclick="clickCommentLike(${id})">
                    </a>`
                } else {
                    like_html = `
                    <a>
                        <img id="comment-like-img${id}"src="static/image/heart.png" style="margin-left:10px; width:15px;" alt="좋아요" onclick="clickCommentLike(${id})">
                    </a>`
                }

                if (JSON.parse(payload)['user_id'] == user_id) {
                    comment_edit = `
                    <span style="margin-top:10px;">
                    <a> <img src="static/image/comment_edit.png" class="auth_btn"  onclick="comment_update_handle(${id})"> </a>
                    <a> <img id="delete-image${id}" src="static/image/comment_delete.png" class="auth_btn" onclick="commentDelete(${id})" onmouseover="changeDeleteImage(${id})" onmouseout="restoreDeleteImage(${id})"> </a>
                    </span>
                    `
                }

                if (content == '삭제된 댓글 입니다.') {
                    let temp_html = `
                    <p id="now_comment${id}" style="display:block;">[사용자] ${content}</p>
                    <div id="reply_card${id}"></div>
                    <hr>
                    `
                    $('#comment_card').append(temp_html)
                }
                else {
                    let temp_html =
                        `   
                        <div class="comment">
                            <div class="author"><img src="static/image/ConnectME - 회색고래 icon.png" alt="">${user}</div>
                            <p id="now_comment${id}" class="now-comment" style="display:grid;">${content} ${comment_edit}</p>
                            <p id="p_comment_update_input${id}" style="display:none;" >

                                <input class="reply-input" id="comment_update_input${id}" type="text" />
                                ${anonymous_html}
                                <label for="anonymous-checkbox">익명</label>
                                <button class="button-blue" onclick="commentUpdateConfrim(${id})">수정하기</button>
                                <button type="button" class="button-white" onclick="commentCancel(${counsel_id},${id})">취소하기</button>

                            </p>
                            <p> <small>${updated_at}</small></p>

                            <p id="p_reply_create_input${id}" style="margin-right:5px; display:none;">
                                <input class="reply-input" id="reply_create_input${id}" type="text" />
                                <input type="checkbox" id="anonymous-reply-checkbox${id}">
                                <label for="anonymous-reply-checkbox">익명</label>
                                <button class="button-blue" style="margin-right:5px" onclick="replyCreateConfrim(${id})">완료</button>
                                <button type="button" class="button-white" onclick="replyCancel(${counsel_id}, ${id})">취소하기</button>
                            </p>
                            <div class=comment_btns>
                                <button class="commentbtn" onclick="reply_create_handle(${id})">답글작성</button>
                                ${like_html}
                                <p id="comment_count${id}" style="margin: 0px 20px 0px 5px;">${comment_likes_count}</p>
                            </div>
                        </div>
                        
                            <div class ="reply-card" id="reply_card${id}"></div>
                   
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

                    anonymous_html = ``

                    if (is_anonymous) {
                        user = '익명'
                        anonymous_html = `<input type="checkbox" id="anonymous-checkbox-reply_id${reply_id}" checked><label for="anonymous-checkbox-reply_id">익명</label>`
                    } else {
                        user = each_reply['user']['nickname']
                        anonymous_html = `<input type="checkbox" id="anonymous-checkbox-reply_id${reply_id}"><label for="anonymous-checkbox-reply_id">익명</label>`
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
                            <img id="reply-like-img${reply_id}" src="static/image/heart (1).png" style="filter: invert(0%); margin-left:10px; width:15px;" alt="좋아요" onclick="clickReplyLike(${reply_id})">
                        </a>`
                    } else {
                        like_html = `
                        <a>
                            <img id="reply-like-img${reply_id}" src="static/image/heart.png" style="margin-left:10px; width:15px;" alt="좋아요" onclick="clickReplyLike(${reply_id})">
                        </a>`
                    }


                    if (JSON.parse(payload)['user_id'] == reply_user_id) {
                        reply_edit = `
                        <span style="margin-top:10px;">
                        <a> <img src="static/image/comment_edit.png" class="auth_btn" onclick="reply_update_handle(${reply_id})"> </a>
                        <a> <img id="delete-reply-image${reply_id}" src="static/image/comment_delete.png" class="auth_btn" onclick="replyDelete(${reply_id})" onmouseover="changeReplyDeleteImage(${reply_id})" onmouseout="restoreReplyDeleteImage(${reply_id})"> </a>
                        <span>
                        `
                    }

                    let temp_html = `
                        <div class = "reply-content">
                            <div class = "reply-head">┗</div>
                            <div>
                                <div class = "reply-author">
                                <img src="static/image/ConnectME - 회색고래 icon.png" alt="" style = "width:25px; margin-right: 5px;">${user}
                                </div>
                                <p id="now_reply_comment${reply_id}" style="display:grid;"> ${content} ${reply_edit}</p>
                                <p id="p_reply_update_input${reply_id}" style="display:none;">
                                    <input class="reply-input" id="reply_update_input${reply_id}" value="${content}" style="width:450px"  type="text"/> 
                                    ${anonymous_html}
                                    <button class="button-blue" style="margin-right:5px" onclick="replyUpdateConfrim(${reply_id})">수정하기</button>
                                    <button type="button" class="button-white" onclick="replyUpdateCancel(${counsel_id}, ${reply_id})">취소하기</button>
                                </p>
                                <div class=replybtns>
                                    <p style="margin-top:0px;"> ${updated_at}${like_html}<p id="reply_count${reply_id}" style="margin: 0px 20px 0px 5px;">${reply_likes_count}</p></p>  
                                </div>
                            </div>
                        </div>
                        <hr>
                        `
                    $(`#reply_card${comment}`).append(temp_html)

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

    comment.style.display = 'grid';
    input.style.display = 'none';
}

// 대댓글 취소
function replyCancel(counsel_id, id) {
    let comment = document.querySelector(`#now_reply_comment${id}`)
    let input = document.querySelector(`#p_reply_create_input${id}`)

    comment.style.display = '';
    input.style.display = 'none';
}

// 대댓글 수정 취소
function replyUpdateCancel(counsel_id, id) {
    let comment = document.querySelector(`#now_reply_comment${id}`)
    let input = document.querySelector(`#p_reply_update_input${id}`)

    comment.style.display = 'grid';
    input.style.display = 'none';
}

// 글 삭제
async function counselDelete() {

    swal({
        title: "삭제하시겠습니까?",
        text: "삭제한 게시글은 되돌릴 수 없습니다.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then(async (willDelete) => {
            if (willDelete) {
                const response = await fetch(`${BACKEND_BASE_URL}/counsel/${counsel_id}/`, {
                    headers: {
                        "Authorization": "Bearer " + logined_token,
                        'content-type': 'application/json',
                    },
                    method: 'DELETE',
                })
                if (response.status == 200) {
                    swal("삭제 완료", '', 'success')
                        .then((value) => {
                            go_counsel()
                        });
                } else {
                    swal("권한이 없습니다.", '', 'error')
                }
            }
        });
}


async function counselPreUpdate(counsel_id) {
    const response = await fetch(`${BACKEND_BASE_URL}/counsel/${counsel_id}/`, {
        headers: {
            Authorization: "Bearer " + logined_token,
        },
        method: "GET",
    })
    const response_json = await response.json();
    if (response_json['counsel'].is_anonymous) {
        anonymous = `
        <div style="width: 70%; margin: 0 auto;"><input type="checkbox" id="counsel-edit-anonymous-checkbox" checked>
            <label for="counsel-edit-anonymous-checkbox">익명</label>
        </div>`
    } else {
        anonymous = `
        <div style="width: 70%; margin: 0 auto;"><input type="checkbox" id="counsel-edit-anonymous-checkbox">
            <label for="counsel-edit-anonymous-checkbox">익명</label>
        </div>`
    }


    $('#counsel-detail-main').hide();

    temp_html = `
    <div class="wrapper">
        <h1 class="create_h1">Counsel Edit</h1>
        <h5 class="create_h5">고민글을 수정합니다.</h5>
        <form class="create_form">
            ${anonymous}
            <div class="group">
                <textarea id="counsel-edit-title" class="create_input" type="textarea" rows="1" required="required"
                    maxlength="50">${response_json['counsel'].title}</textarea><span class="highlight"></span><span class="bar"></span>
                <label class="create_label">제목</label>
            </div>
            
            
            <div class="group">
                <textarea id="counsel-edit-content" class="create_input" type="textarea" rows="10"
                    required="required">${response_json['counsel'].content}</textarea><span class="highlight"></span><span class="bar"></span>
                <label class="create_label">내용</label>
            </div>
            <div class="btn-box">
                <button class="btn btn-submit" type="button" onclick="CounselEdit()">submit</button>
                <button class="btn btn-cancel" type="button" onclick="go_counselDetail(${counsel_id})">cancel</button>
            </div>
        </form>
    </div>
    `


    $('#counsel-detail-footer').html(temp_html);


}

// 댓글작성
async function counselCommentCreate(id) {
    let comment = document.getElementById("inputComment").value
    let checked = $(`#anonymous-checkbox`).is(':checked');


    const response = await fetch(`${BACKEND_BASE_URL}/counsel/${counsel_id}/comment/`, {
        method: 'POST',
        headers: {
            "content-type": "application/json",
            "Authorization": "Bearer " + logined_token,
        },
        body: JSON.stringify({
            content: comment,
            is_anonymous: checked
        })
    })
    if (response.status == 201) {
        swal("댓글 작성 완료", '', 'success')
            .then((value) => {
                window.location.reload()
            });
    } else {
        const errorData = await response.json();
        const errorArray = Object.entries(errorData);
        swal(`${errorArray[0][1]}`, '', 'warning');
    }
}

// 글 수정
async function CounselEdit() {
    let title = document.querySelector('#counsel-edit-title').value
    let content = document.querySelector('#counsel-edit-content').value
    let checked = $('#counsel-edit-anonymous-checkbox').is(':checked');
    let is_anonymous = ''
    if (checked) {
        is_anonymous = 'True';

    } else {
        is_anonymous = 'False';
    }

    const response = await fetch(`${BACKEND_BASE_URL}/counsel/${counsel_id}/`, {
        headers: {
            Authorization: "Bearer " + logined_token,
            "content-type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
            title: title,
            content: content,
            is_anonymous: is_anonymous,
        })
    })

    if (response.status == 200) {
        swal("수정되었습니다.", '', 'success')
            .then((value) => {
                location.href = `counsel_detail.html?counsel_id=${counsel_id}`
            });

    } else {
        const errorData = await response.json();
        const errorArray = Object.entries(errorData);
        swal(`${errorArray[0][1]}`, '', 'warning');
    }
}

// ================================ 상담 게시글 상세보기 대댓글 작성 버튼 숨기고 보이기 시작 ================================
function reply_create_handle(id) {
    let p_reply_create_input = document.getElementById(`p_reply_create_input${id}`)
    if (p_reply_create_input.style.display == 'none') {
        p_reply_create_input.style.display = 'block'
    } else {
        p_reply_create_input.style.display = 'none';
    }
}
// ================================ 상담 게시글 상세보기 대댓글 작성 버튼 숨기고 보이기 끝 ================================

async function replyCreateConfrim(reply_id) {
    let reply = document.getElementById(`reply_create_input${reply_id}`).value
    let checked = $(`#anonymous-reply-checkbox${reply_id}`).is(':checked');

    if (checked) {
        is_anonymous = 'True';

    } else {
        is_anonymous = 'False';
    }


    let response = await fetch(`${BACKEND_BASE_URL}/counsel/${counsel_id}/comment/${reply_id}/reply/`, {
        method: 'POST',
        headers: {
            "content-type": "application/json",
            Authorization: "Bearer " + logined_token,
        },
        body: JSON.stringify({
            content: reply,
            is_anonymous: is_anonymous
        })
    })
    if (response.status == 200) {
        swal("댓글 작성 완료", '', 'success')
            .then((value) => {
                window.location.reload()
            });
    }
    else {
        const errorData = await response.json();
        const errorArray = Object.entries(errorData);
        swal(`${errorArray[0][1]}`, '', 'warning');
    }
}

// ================================ 상담 게시글 상세보기 댓글 수정 버튼 보이고 숨기기 시작 ================================

async function comment_update_handle(id) {
    let comment_update_input = document.getElementById(`p_comment_update_input${id}`)
    let now_comment = document.getElementById(`now_comment${id}`);
    if (comment_update_input.style.display == 'none') {
        comment_update_input.style.display = 'block'
        now_comment.style.display = 'none';
    } else {
        comment_update_input.style.display = 'none';
        now_comment.style.display = 'grid';
    }
}
// ================================ 상담 게시글 상세보기 댓글 수정 버튼 보이고 숨기기 끝 ================================

// ================================ 상담 게시글 상세보기 댓글 수정 시작 ================================
async function commentUpdateConfrim(id) {
    let comment = document.getElementById(`comment_update_input${id}`).value
    let checked = $(`#anonymous-checkbox${id}`).is(':checked');

    let formData = new FormData();
    formData.append("content", comment);
    if (checked) {
        formData.append("is_anonymous", 'True');

    } else {
        formData.append("is_anonymous", 'False');

    }
    let response = await fetch(`${BACKEND_BASE_URL}/counsel/${counsel_id}/comment/${id}/`, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${logined_token}`,
        },
        body: formData
    })
    if (response.status == 200) {
        swal("수정 완료", '', 'success')
            .then((value) => {
                window.location.reload()
            });
    }

    else {
        const errorData = await response.json();
        const errorArray = Object.entries(errorData);
        swal(`${errorArray[0][1]}`, '', 'warning');
    }

}
// ================================ 상담 게시글 상세보기 댓글 수정 끝 ================================

// ================================ 상담 게시글 상세보기 댓글 삭제 시작 ================================
async function commentDelete(comment_id) {

    swal({
        title: "삭제하시겠습니까?",
        text: "삭제한 댓글은 되돌릴 수 없습니다.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then(async (willDelete) => {
            if (willDelete) {
                let response = await fetch(`${BACKEND_BASE_URL}/counsel/${counsel_id}/comment/${comment_id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${logined_token}`,
                    },
                })
                if (response.status == 204 || response.status == 200) {
                    swal("삭제 완료", '', 'success')
                        .then((value) => {
                            window.location.reload()
                        });
                }
                else {
                    swal("권한이 없습니다.", '', 'error')
                }

            }
        });

}
// ================================ 상담 게시글 상세보기 댓글 삭제 끝 ================================

// ================================ 상담 게시글 상세보기 대댓글 수정 버튼 보이고 숨기기 시작 ================================
async function reply_update_handle(id) {
    let reply_update_input = document.getElementById(`p_reply_update_input${id}`)
    let now_reply = document.getElementById(`now_reply_comment${id}`);
    if (reply_update_input.style.display == 'none') {
        reply_update_input.style.display = 'block'
        now_reply.style.display = 'none';
    } else {
        reply_update_input.style.display = 'none';
        now_reply.style.display = 'grid';
    }
}
// ================================ 상담 게시글 상세보기 대댓글 수정 버튼 보이고 숨기기 끝 ================================

// ================================ 상담 게시글 상세보기 대댓글 수정 시작 ================================
async function replyUpdateConfrim(reply_id) {
    let reply = document.getElementById(`reply_update_input${reply_id}`).value
    let checked = $(`#anonymous-checkbox-reply_id${reply_id}`).is(':checked');
    if (checked) {
        is_anonymous = 'True';

    } else {
        is_anonymous = 'False';
    }

    let response = await fetch(`${BACKEND_BASE_URL}/counsel/${counsel_id}/comment/reply/${reply_id}/`, {
        method: 'PUT',
        headers: {
            "content-type": "application/json",
            "Authorization": `Bearer ${logined_token}`,
        },
        body: JSON.stringify({
            content: reply,
            is_anonymous: is_anonymous
        })
    })

    if (response.status == 200) {
        swal("수정 완료", '', 'success')
            .then((value) => {
                window.location.reload()
            });
    } else {
        const errorData = await response.json();
        const errorArray = Object.entries(errorData);
        swal(`${errorArray[0][1]}`, '', 'warning');
    }
}
// ================================ 고민 게시글 상세보기 대댓글 수정 끝 ================================

// ================================ 고민 게시글 상세보기 대댓글 삭제 시작 ================================
async function replyDelete(reply_id) {

    swal({
        title: "삭제하시겠습니까?",
        text: "삭제한 댓글은 되돌릴 수 없습니다.",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then(async (willDelete) => {
            if (willDelete) {
                let token = localStorage.getItem("access")
                let response = await fetch(`${BACKEND_BASE_URL}/counsel/${counsel_id}/comment/reply/${reply_id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${logined_token}`,
                    },
                })
                if (response.status == 200) {
                    swal("삭제 완료", '', 'success')
                        .then((value) => {
                            window.location.reload()
                        });
                }
                else {
                    swal("권한이 없습니다.", '', 'error')
                }

            }
        });




}
// ================================ 고민 게시글 상세보기 대댓글 삭제 끝 ================================

// ================================ 댓글 좋아요 ================================

async function clickCommentLike(comment_id) {
    const like = document.querySelector(`#comment-like-img${comment_id}`)
    const best = document.querySelector(`#best-comment-like-img${comment_id}`)

    let response = await fetch(`${BACKEND_BASE_URL}/counsel/${counsel_id}/comment/${comment_id}/like/`, {
        headers: {
            Authorization: "Bearer " + logined_token,
        },
        method: "POST",
    });

    const response_json = await response.json();

    if (best) {
        if (response.status == 200) {
            best['src'] = "static/image/heart.png"
            best.style.filter = "invert(100%)";
            swal("좋아요 취소", '');
        }
        else {
            best['src'] = "static/image/heart (1).png"
            best.style.filter = "invert(0%)";
            swal("좋아요 완료", '')
        }

        let likeCountElements = document.querySelector(`#best_comment_count${comment_id}`);
        let like_count = response_json["comment_like"]
        likeCountElements.innerText = `${like_count}`;
    }

    if (response.status == 200) {
        like['src'] = "static/image/heart.png"
        like.style.filter = "invert(100%)";
        swal("좋아요 취소", '');
    }
    else {
        like['src'] = "static/image/heart (1).png"
        like.style.filter = "invert(0%)";
        swal("좋아요 완료", '')
    }

    let likeCountElements = document.querySelector(`#comment_count${comment_id}`);
    let like_count = response_json["comment_like"]
    likeCountElements.innerText = `${like_count}`;
}
// ================================ 댓글 좋아요 끝 ================================

// ================================ 대댓글 좋아요 ================================
async function clickReplyLike(reply_id) {
    const like = document.querySelector(`#reply-like-img${reply_id}`)
    const best = document.querySelector(`#best-reply-like-img${reply_id}`)



    let response = await fetch(`${BACKEND_BASE_URL}/counsel/${counsel_id}/comment/reply/${reply_id}/like/`, {
        headers: {
            Authorization: "Bearer " + logined_token,
        },
        method: "POST",
    });

    const response_json = await response.json();

    if (best) {
        if (response.status == 200) {
            best['src'] = "static/image/heart.png"
            best.style.filter = "invert(100%)";
            swal("좋아요 취소", '');
        }
        else {
            best['src'] = "static/image/heart (1).png"
            best.style.filter = "invert(0%)";
            swal("좋아요 완료", '')
        }

        let likeCountElements = document.querySelector(`#best_reply_count${reply_id}`);
        let like_count = response_json["reply_like"]
        likeCountElements.innerText = `${like_count}`;
    }

    if (response.status == 200) {
        like['src'] = "static/image/heart.png"
        like.style.filter = "invert(100%)";
        swal("좋아요 취소", '');
    }
    else {
        like['src'] = "static/image/heart (1).png"
        like.style.filter = "invert(0%)";
        swal("좋아요 완료", '')
    }

    let likeCountElements = document.querySelector(`#reply_count${reply_id}`);
    let like_count = response_json["reply_like"]
    likeCountElements.innerText = `${like_count}`;
}

// ================================ 대댓글 좋아요 끝 ================================


// 베스트댓글

async function bestComment() {
    $('#best-comment').empty()

    $.ajax({
        url: `${BACKEND_BASE_URL}/counsel/${counsel_id}/top-comments/`,
        type: "GET",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + logined_token
        },
        success: function (response) {
            const rows = response.combined_data;
            for (let i = 0; i < rows.length; i++) {
                let id = rows[i]['id']
                let rank = i + 1
                let comment = rows[i]['content']
                let is_anonymous = rows[i]['is_anonymous']
                let comment_author = ''
                if (is_anonymous) {
                    comment_author = '익명'
                } else {
                    comment_author = rows[i]['user']['nickname']
                }
                let like_count = rows[i]['like'].length

                let is_comment = rows[i].hasOwnProperty('reply')
                let comment_or_reply_U = ''
                let comment_or_reply_L = ''
                if (is_comment) {
                    comment_or_reply_U = 'Comment'
                    comment_or_reply_L = 'comment'
                } else {
                    comment_or_reply_U = 'Reply'
                    comment_or_reply_L = 'reply'
                }
                let like = rows[i]['like']
                let create_at = rows[i]['created_at']
                if (like.includes(logined_user_id)) {
                    like_html = `
                    <a>
                        <img id="best-${comment_or_reply_L}-like-img${id}"src="static/image/heart (1).png" style="filter: invert(0%); margin-left:10px; width:15px;" alt="좋아요" onclick="click${comment_or_reply_U}Like(${id})">
                    </a>`
                } else {
                    like_html = `
                    <a>
                        <img id="best-${comment_or_reply_L}-like-img${id}"src="static/image/heart.png" style="margin-left:10px; width:15px;" alt="좋아요" onclick="click${comment_or_reply_U}Like(${id})">
                    </a>`
                }

                let temp_html = `
                    <div class = "comment-section">
                        <div class="author">                        
                            <img src="static/image/${rank}_medal.png" alt="${rank}_best_comment" style="width:30px">
                            <div class="comment-author">${comment_author}</div>
                        </div>
                        <div class="comment">${comment}</div>
                        
                        <div class = "ect">
                            <div class = "created_at">
                                ${create_at}
                            </div>
                            <div class="like-button" >
                            ${like_html} 
                            </div>
                            <div id="best_${comment_or_reply_L}_count${id}" style = "color:white;">${like_count}</div>
                        </div>
                    </div>
                `

                $('#best-comment').append(temp_html)

            }
        }
    })
}