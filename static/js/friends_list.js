const logined_token = localStorage.getItem("access");
window.onload = () => {
    friendsList()
}

// 친구목록 user/friend/list/
async function friendsList() {
    $('.list-section').empty()

    $.ajax({
        url: `${BACKEND_BASE_URL}/user/friend/list/`,
        type: "GET",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + logined_token
        },
        success: function (response) {

            const rows = response;
            for (let i = 0; i < rows.length; i++) {
                let friend_nickname = ''
                let friend_account = ''
                let friend_id = ''
                if (logined_user_id == rows[i]['from_user']) {
                    friend_id = rows[i]['to_user']
                    friend_nickname = rows[i]['to_nickname']
                    friend_account = rows[i]['to_account']
                } else {
                    friend_id = rows[i]['from_user']
                    friend_nickname = rows[i]['from_nickname']
                    friend_account = rows[i]['from_account']
                }
                let request_id = rows[i]['id']

                let temp_html = `
                <div class="friend-box">
                    <div class="info-box">
                        <a onclick="go_profile(${friend_id})">
                            <div class="nickname">${friend_nickname}</div>
                            <div class="account">${friend_account}</div>
                        </a>
                    </div>
                    <div class = "buttons">
                        <button onclick="deleteFriendButton(${request_id})">친구끊기</button>
                    </div>
                </div>
                `

                $('.list-section').append(temp_html)

            }
        }
    })
}

// 친구삭제 user/friend/id/delete/
function deleteFriendButton(request_id) {

    swal({
        title: "친구관계를 끊으시겠습니까?",
        text: "",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                deleteFriend(request_id);
            }
        });
}
async function deleteFriend(request_id) {
    $.ajax({
        url: `${BACKEND_BASE_URL}/user/friend/${request_id}/delete/`,
        type: "DELETE",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + logined_token
        },
        success: function (response) {
            swal(`${response['message']}`, '', 'success')
                .then((value) => {
                    location.reload()
                });
        },
        error: function (response) {
            swal(`${response['responseJSON']['message']}`, '')
        }
    })

}