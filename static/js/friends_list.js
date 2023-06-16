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
            console.log(rows)

            console.log(rows)
            console.log(rows[0]['from_nickname'])
            console.log(rows[0]['from_account'])
            console.log(rows[0]['from_user'])
            console.log(rows[0]['id'])
            for (let i = 0; i < rows.length; i++) {
                let user_nickname = rows[i]['from_nickname']
                let user_account = rows[i]['from_account']
                let user_id = rows[i]['from_user']
                let request_id = rows[i]['id']

                let temp_html = `
                <div class="info-box">
                    <a onclick="go_profile(${user_id})">
                        <div class="nickname">${user_nickname}</div>
                        <div class="account">${user_account}</div>
                    </a>
                    <button onclick="deleteFriendButton(${request_id})">친구끊기</button>
                </div>
                `

                $('.list-section').append(temp_html)

            }
        }
    })
}

// 친구삭제 user/friend/id/delete/
function deleteFriendButton(request_id) {
    if (confirm("친구를 끊으시겠습니까?")) {
        deleteFriend(request_id);
    }
}
async function deleteFriend(request_id) {
    $.ajax({
        url: `${BACKEND_BASE_URL}/user/friend/${request_id}/delete/`,
        type: "DELETE",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + logined_token
        },
        success: function(response){
            alert(response['message'])
            location.reload()
        },
        error : function(response){
            alert(response['responseJSON']['message'])
        }
    })

}