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
            let counsel_title = response.counsel['title']
            let counsel_content = response.counsel['content']
            let counsel_author = response.counsel['user']['nickname']
            let counsel_author_id = response.counsel['user']['pk']
            let author_html = `<a onclick = "go_profile(${counsel_author_id})">${counsel_author}</a>`
            let counsel_created_at = response.counsel['created_at']
            let likes_count = response.counsel['like'].length

            $('#title').append(counsel_title)
            $('#author').append(author_html)
            $('#content').append(counsel_content)
            $('#likes_count').append(likes_count)

        },
        error: function () {
            alert(response.status);
        }
    })

}

// 좋아요
async function clickLike() {
    const response = await fetch(`${BACKEND_BASE_URL}/counsel/${counsel_id}/like/`, {
        headers: {
            "Authorization": "Bearer " + logined_token,
            'content-type': 'application/json',
        },
        method: 'POST',
    }).then((res) => res.json()).then((data) => {
        alert(data)
        location.reload();
    });
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
                user = rows[i]['user']
                let temp_html =
                    `
                    <p id="now_comment${id}" style="display:block;">${content}</p>
                    <p id="p_comment_update_input${id}" style="display:none;"/><input id="comment_update_input${id}" type="text"/> <button  onclick="commentUpdateConfrim(${id})">완료</button></p>
                    <a>${user}</a>
                    <p>${updated_at}</p>
                    <p id="p_reply_create_input${id}" style="display:none;"/><input id="reply_create_input${id}" type="text"/> <button  onclick="replyCreateConfrim(${id})">완료</button></p>
                    <button onclick="reply_create_handle(${id})">대댓글 작성하기</button>
                    <button onclick="comment_update_handle(${id})">수정하기</button>
                    <button onclick="commentDelete(${id})">삭제하기</button>
                    <div id="reply_card">
                    `
                $('#comment_card').append(temp_html)
                rows[i].reply.forEach((each_reply => {
                    id = each_reply['id']
                    content = each_reply['content']
                    user = each_reply['user']['nickname']
                    updated_at = each_reply['updated_at']

                    let temp_html = `
                        <div style="color:red;">
                        <p id="now_reply${id}" style="display:block;">${content}</p>
                        <p id="p_reply_update_input${id}" style="display:none;"/><input id="reply_update_input${id}" type="text"/> <button  onclick="replyUpdateConfrim(${id})">완료</button></p>
                        <a>${user}</a>
                        <p>${updated_at}</p>
                        <button onclick="reply_update_handle(${id})">대댓글 수정하기</button>
                        <button onclick="replyDelete(${id})">대댓글 삭제하기</button>
                        </div>
                        `
                    $('#reply_card').append(temp_html)
                    $(`#reply_update_input${id}`).val(content)
                }))
            }
        }
    })
}


// 글 삭제
async function counselDelete() {
    if (confirm("삭제하시겠습니까?")) {
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
    location.href(`counsel_edit.html?counsel_id=${counsel_id}`)
}

// 댓글작성
async function counselCommentCreate() {
    let comment = document.getElementById("inputComment").value

    if (logined_token) {

        
        const response = await fetch(`${BACKEND_BASE_URL}/counsel/${counsel_id}/comment/`, {
            method: 'POST',
            headers: {
                "content-type": "application/json",
                "Authorization": "Bearer " + logined_token,
            },
            body: JSON.stringify({
                "content": comment,
    
            })
        })
        if (response.status == 201) {
            alert("댓글 작성 완료.")
            location.reload();
        } else  {
            const errorData = await response.json();
            const errorArray = Object.entries(errorData);
            alert(errorArray[0][1]);
        }
    } else { 
        alert("로그인해주세요") 
    }
}

