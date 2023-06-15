const logined_token = localStorage.getItem("access");
window.onload = () => {
    friendsList()
}


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
                    </div>
                `

                $('.list-section').append(temp_html)

            }
        }
    })

}