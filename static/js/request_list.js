const me = new URLSearchParams(window.location.search).get('me');
const logined_token = localStorage.getItem("access");
const logined_account = payload_parse.account
window.onload = () => {
    requestList(me)
}

function go_requestList(me) {
    location.href = `request_list.html?me=${me}`
}

async function requestList(me) {
    $('.list-section').empty()

    $.ajax({
        url: `${BACKEND_BASE_URL}/user/friend/request-list/`,
        type: "GET",
        dataType: "json",
        headers: {
            "Authorization": "Bearer " + logined_token
        },
        success: function (response) {

            if (me === 'to') {
                let filteredResults = response.filter(item => item.to_account === logined_account);
                const rows = filteredResults;

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
                    </div>
                    <div class="buttons">
                        <button onclick="acceptRequest(${request_id})">수락</button>
                        <button onclick="rejectRequest(${request_id})">거절</button>
                    </div>
                `

                $('.list-section').append(temp_html)

                }

            } else if (me === 'from') {
                let filteredResults = response.filter(item => item.from_account === logined_account);
                const rows = filteredResults;
                console.log(rows)
                console.log(rows[0]['to_nickname'])

                for (let i = 0; i < rows.length; i++) {
                    let user_nickname = rows[i]['to_nickname']
                    let user_account = rows[i]['to_account']
                    let user_id = rows[i]['to_user']
                    let request_id = rows[i]['id']

                    let temp_html = `
                    <div class="info-box">
                        <a onclick="go_profile(${user_id})">
                            <div class="nickname">${user_nickname}</div>
                            <div class="account">${user_account}</div>
                        </a>
                    </div>
                    
                `

                $('.list-section').append(temp_html)

                }
            }
        }
    })

}

// 수락 user/friend/<int:friend_request_id>/accept/
function acceptRequest(request_id) {

    $.ajax({
        url : `${BACKEND_BASE_URL}/user/friend/${request_id}/accept/`, 
        type : "POST",
        dataType:"json",
        headers:{
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


// 거절 user/friend/<int:friend_request_id>/reject/
async function rejectRequest(request_id) {

    $.ajax({
        url : `${BACKEND_BASE_URL}/user/friend/${request_id}/reject/`, 
        type : "POST",
        dataType:"json",
        headers:{
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